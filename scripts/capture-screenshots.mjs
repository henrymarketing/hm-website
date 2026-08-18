import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../public/images/work');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const sites = [
  {
    slug: 'schlafzahnmedizin',
    url: 'https://schlafzahnmedizin.ch',
    scrollY: 0,
  },
  {
    slug: 'wicki',
    url: 'https://www.wickizug.ch',
    scrollY: 0,
  },
  {
    slug: 'pietrobon',
    url: 'https://www.pietrobonundmichel.ch',
    scrollY: 0,
  },
  {
    slug: 'obrenovic',
    url: 'https://www.drobrenovic.ch',
    scrollY: 0,
  },
  {
    slug: 'neumann',
    url: 'https://zahnarzt-neumann.ch',
    scrollY: 800, // skip hero, show first content section
  },
  {
    slug: 'greenair',
    url: 'https://greenair.ch',
    scrollY: 0,
  },
];

const browser = await chromium.launch();

for (const site of sites) {
  console.log(`Capturing ${site.slug} from ${site.url}…`);
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1280, height: 800 });

  try {
    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    // fall back to domcontentloaded if networkidle times out
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
  }

  // dismiss any cookie banners
  for (const sel of [
    '[id*="accept"]', '[class*="accept"]',
    '[id*="cookie"] button', '[class*="cookie"] button',
    'button:has-text("Akzeptieren")', 'button:has-text("Accept")',
    'button:has-text("OK")', 'button:has-text("Verstanden")',
  ]) {
    try {
      await page.locator(sel).first().click({ timeout: 500 });
      await page.waitForTimeout(300);
      break;
    } catch {
      // no banner with this selector
    }
  }

  if (site.scrollY > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), site.scrollY);
    await page.waitForTimeout(600);
  }

  const outPath = join(outDir, `${site.slug}.webp`);
  // screenshot the visible viewport (no clip) — scrollY positions the view
  await page.screenshot({
    path: outPath,
    type: 'webp',
  });

  console.log(`  → saved ${outPath}`);
  await page.close();
}

await browser.close();
console.log('\nAll screenshots captured.');

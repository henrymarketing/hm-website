import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { CtaLink } from '@/components/ui/cta-link';
import JsonLd from '@/components/JsonLd';

type Props = { params: { locale: string } };

const CASE_ORDER = [
  'schlafzahnmedizin',
  'pietrobon',
  'obrenovic',
  'neumann',
  'wicki',
  'greenair',
] as const;

const GROUP_ORDER = ['healthcare', 'publicTrust', 'trades'] as const;

type PageSpeedData = {
  perf: number;
  a11y: number;
  bp: number;
  seo: number;
  href: string;
};

type CaseData = {
  h3: string;
  lead: string;
  body: string[];
  meta: string;
  url: string;
  group: string;
  assetTodo: string;
  crossLink?: string;
  crossLinkLabel?: string;
  pagespeed?: PageSpeedData;
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  const title = isDE
    ? 'Ausgewählte Arbeiten — henry.marketing'
    : 'Selected work — henry.marketing';
  const description = isDE
    ? 'Case Studies: Arztpraxen, politische Kampagnen, technische Betriebe. Jede Website über 90 Punkte im Google-Performance-Test.'
    : 'Case studies: medical practices, political campaigns, technical businesses. Every site scores 90+ on Google\'s performance test.';

  return {
    title,
    description,
    alternates: {
      canonical: isDE ? '/de/work' : '/en/work',
      languages: {
        de: '/de/work',
        en: '/en/work',
        'x-default': '/de/work',
      },
    },
    openGraph: {
      title,
      description,
      locale: isDE ? 'de_CH' : 'en_US',
      type: 'website',
      images: [{ url: '/og/default.png', width: 1200, height: 630, alt: title }],
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function WorkPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('work');

  const cases = Object.fromEntries(
    CASE_ORDER.map((slug) => [slug, t.raw(`cases.${slug}`) as CaseData])
  ) as Record<(typeof CASE_ORDER)[number], CaseData>;

  const creativeWorks = CASE_ORDER.map((slug) => {
    const c = cases[slug];
    return {
      '@type': 'CreativeWork',
      name: c.h3,
      description: c.lead,
      url: c.url,
      creator: {
        '@type': 'Person',
        name: 'Henry Barrows',
        url: 'https://henry.marketing',
      },
    };
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': creativeWorks,
        }}
      />

      <section className="py-24 md:py-36 px-6 max-w-6xl mx-auto">
        <AnimateOnScroll>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.05] mb-8">
            {t('h1')}
          </h1>
          <p className="text-lg text-neutral-400 max-w-3xl leading-relaxed mb-6">{t('intro1')}</p>
          <p className="text-lg text-neutral-400 max-w-3xl leading-relaxed">{t('intro2')}</p>
        </AnimateOnScroll>
      </section>

      {GROUP_ORDER.map((groupKey) => {
        const groupCases = CASE_ORDER.filter((slug) => cases[slug].group === groupKey);
        if (!groupCases.length) return null;

        return (
          <section
            key={groupKey}
            className="border-t border-neutral-900 py-20 md:py-28"
            aria-labelledby={`group-${groupKey}`}
          >
            <div className="max-w-6xl mx-auto px-6">
              <AnimateOnScroll>
                <h2
                  id={`group-${groupKey}`}
                  className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-12"
                >
                  {t(`groups.${groupKey}`)}
                </h2>
              </AnimateOnScroll>

              <div className="space-y-24">
                {groupCases.map((slug, i) => {
                  const c = cases[slug];
                  return (
                    <article
                      key={slug}
                      id={slug}
                      className="grid md:grid-cols-2 gap-10 md:gap-16 items-start scroll-mt-24"
                    >
                      <AnimateOnScroll delay={i % 2 === 0 ? 0 : 80}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block overflow-hidden rounded-sm"
                        >
                          <Image
                            src={`/images/work/${slug}.webp`}
                            alt={c.h3}
                            width={1280}
                            height={800}
                            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </a>
                      </AnimateOnScroll>
                      <AnimateOnScroll delay={40}>
                        <h3 className="text-2xl md:text-3xl font-light text-white mb-3">
                          {c.h3}
                        </h3>
                        <p className="text-orange-500/90 font-medium mb-6">{c.lead}</p>
                        {c.body.map((para, pi) => (
                          <p key={pi} className="text-neutral-400 leading-relaxed mb-4">
                            {para}
                          </p>
                        ))}
                        <p className="text-neutral-600 text-sm italic mt-6">{c.meta}</p>
                        {c.pagespeed && (
                          <a
                            href={c.pagespeed.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-end gap-5 group/ps"
                            aria-label="Google PageSpeed Insights desktop report"
                          >
                            {(
                              [
                                ['Perf.', c.pagespeed.perf],
                                ['Access.', c.pagespeed.a11y],
                                ['Best Pr.', c.pagespeed.bp],
                                ['SEO', c.pagespeed.seo],
                              ] as [string, number][]
                            ).map(([label, val]) => (
                              <div key={label} className="text-center">
                                <div className={`text-lg font-light tabular-nums leading-none ${val >= 90 ? 'text-green-400' : 'text-orange-400'}`}>
                                  {val}
                                </div>
                                <div className="text-[9px] uppercase tracking-widest text-neutral-600 mt-1">
                                  {label}
                                </div>
                              </div>
                            ))}
                            <div className="text-[10px] text-neutral-700 group-hover/ps:text-orange-500 transition-colors mb-0.5 ml-1">
                              PageSpeed ↗
                            </div>
                          </a>
                        )}
                        {c.crossLink && c.crossLinkLabel && (
                          <p className="mt-4">
                            <a
                              href={`#${c.crossLink}`}
                              className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
                            >
                              {c.crossLinkLabel} →
                            </a>
                          </p>
                        )}
                        <p className="mt-4">
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-neutral-400 hover:text-white transition-colors"
                          >
                            {c.url.replace(/^https?:\/\//, '')} ↗
                          </a>
                        </p>
                      </AnimateOnScroll>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-t border-neutral-900 py-24 md:py-32 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">{t('cta.h2')}</h2>
            <p className="text-lg text-neutral-400 max-w-2xl mb-10">{t('cta.p')}</p>
            <CtaLink href="/contact">{t('cta.button')}</CtaLink>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}

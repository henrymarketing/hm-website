import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FooterLocaleSwitch } from '@/components/ui/footer-locale-switch';

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <footer className="border-t border-neutral-900 py-16 mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-2" aria-label="henry.marketing">
              <Image
                src="/logo/henry-logo-2026-transparent.png"
                alt="henry.marketing"
                width={160}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-neutral-500 text-sm">{t('footer.tagline')}</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8 text-sm">
            <Link
              href="/services"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              {t('nav.work')}
            </Link>
            <Link
              href="/about"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              {t('nav.about')}
            </Link>
            <Link
              href="/contact"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              {t('nav.contact')}
            </Link>
            <FooterLocaleSwitch locale={locale} />
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-neutral-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <p className="text-neutral-700">
              © {new Date().getFullYear()} henry.marketing
            </p>
            <Link
              href="/impressum"
              className="text-neutral-600 hover:text-orange-500 transition-colors"
            >
              Impressum
            </Link>
            <Link
              href="/faq"
              className="text-neutral-600 hover:text-orange-500 transition-colors"
            >
              FAQ
            </Link>
          </div>
          <a
            href="mailto:henry@henry.marketing"
            className="text-neutral-600 hover:text-orange-500 transition-colors text-xs"
          >
            henry@henry.marketing
          </a>
        </div>
      </div>
    </footer>
  );
}

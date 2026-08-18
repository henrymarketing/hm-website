import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FooterLocaleSwitch } from '@/components/ui/footer-locale-switch';

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <footer className="border-t border-neutral-900 py-16 mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <p className="text-white font-semibold tracking-[0.15em] text-sm mb-2">
              HENRY.MARKETING
            </p>
            <p className="text-neutral-400 text-sm">{t('footer.tagline')}</p>
          </div>

          <nav className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8 text-sm" aria-label="Footer">
            <Link href="/work" className="text-neutral-400 hover:text-white transition-colors">
              {t('nav.work')}
            </Link>
            <Link href="/services" className="text-neutral-400 hover:text-white transition-colors">
              {t('nav.services')}
            </Link>
            <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
              {t('nav.contact')}
            </Link>
            <FooterLocaleSwitch locale={locale} />
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-neutral-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-neutral-700 text-xs">
            © {new Date().getFullYear()} henry.marketing
          </p>
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

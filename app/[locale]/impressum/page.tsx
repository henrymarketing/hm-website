import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AnimateOnScroll from '@/components/AnimateOnScroll';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  return {
    title: isDE
      ? 'Impressum — henry.marketing'
      : 'Impressum — henry.marketing',
    description: isDE
      ? 'Impressum und Haftungsausschluss. Henry Barrows, henry.marketing, Zug, Schweiz.'
      : 'Impressum and disclaimer. Henry Barrows, henry.marketing, Zug, Switzerland.',
    alternates: {
      canonical: isDE ? '/de/impressum' : '/en/impressum',
      languages: {
        de: '/de/impressum',
        en: '/en/impressum',
        'x-default': '/de/impressum',
      },
    },
    openGraph: {
      title: isDE ? 'Impressum — henry.marketing' : 'Impressum — henry.marketing',
      locale: isDE ? 'de_DE' : 'en_US',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function ImpressumPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('impressum');

  return (
    <>
      <section className="py-24 md:py-36 px-6 max-w-6xl mx-auto">
        <AnimateOnScroll>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-8">
            henry.marketing
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.05] mb-16">
            {t('title')}
          </h1>
        </AnimateOnScroll>

        <div className="space-y-12 max-w-2xl">
          <AnimateOnScroll delay={100}>
            <div>
              <h2 className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-4">
                {t('publisher')}
              </h2>
              <p className="text-white font-medium">{t('name')}</p>
              <p className="text-neutral-400">{t('business')}</p>
              <p className="text-neutral-400 mt-2">{t('address')}</p>
              <a
                href="mailto:henry@henry.marketing"
                className="text-neutral-300 hover:text-orange-500 transition-colors block mt-2"
              >
                {t('email')}
              </a>
              <a
                href="tel:+41791752020"
                className="text-neutral-300 hover:text-orange-500 transition-colors block"
              >
                {t('phone')}
              </a>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150}>
            <div>
              <h2 className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-4">
                {t('handelsregisterTitle')}
              </h2>
              <dl className="space-y-2 text-neutral-400 text-sm">
                <div><dt className="text-neutral-500 text-xs uppercase tracking-wider">{t('entryDateLabel')}</dt><dd>{t('entryDate')}</dd></div>
                <div><dt className="text-neutral-500 text-xs uppercase tracking-wider">{t('legalFormLabel')}</dt><dd>{t('legalForm')}</dd></div>
                <div><dt className="text-neutral-500 text-xs uppercase tracking-wider">{t('seatLabel')}</dt><dd>{t('seat')}</dd></div>
                <div><dt className="text-neutral-500 text-xs uppercase tracking-wider">{t('registerOfficeLabel')}</dt><dd>{t('registerOffice')}</dd></div>
                <div><dt className="text-neutral-500 text-xs uppercase tracking-wider">{t('registerNumberLabel')}</dt><dd>{t('registerNumber')}</dd></div>
                <div><dt className="text-neutral-500 text-xs uppercase tracking-wider">{t('uidLabel')}</dt><dd>{t('uid')}</dd></div>
                <div><dt className="text-neutral-500 text-xs uppercase tracking-wider">{t('branchLabel')}</dt><dd>{t('branch')}</dd></div>
                <div><dt className="text-neutral-500 text-xs uppercase tracking-wider">{t('purposeLabel')}</dt><dd className="leading-relaxed">{t('purpose')}</dd></div>
              </dl>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div>
              <h2 className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-4">
                {t('disclaimerTitle')}
              </h2>
              <p className="text-neutral-400 leading-relaxed">{t('disclaimer')}</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}

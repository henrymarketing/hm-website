import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AnimateOnScroll from '@/components/AnimateOnScroll';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  return {
    title: isDE
      ? 'Kontakt — henry.marketing'
      : 'Contact — henry.marketing',
    description: isDE
      ? 'Schreiben Sie Henry Barrows. Zug, Schweiz. henry@henry.marketing · 079 175 20 20'
      : 'Get in touch with Henry Barrows. Based in Zug, Switzerland. henry@henry.marketing · 079 175 20 20',
    alternates: {
      canonical: isDE ? '/de/kontakt' : '/en/contact',
      languages: {
        de: '/de/kontakt',
        en: '/en/contact',
        'x-default': '/de/kontakt',
      },
    },
    openGraph: {
      title: isDE ? 'Kontakt — henry.marketing' : 'Contact — henry.marketing',
      locale: isDE ? 'de_DE' : 'en_US',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function ContactPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('contact');

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="min-h-[70vh] flex flex-col justify-center py-24 md:py-36 px-6 max-w-6xl mx-auto">
        <AnimateOnScroll>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-8">
            henry.marketing
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05] mb-8">
            {t('hero.h1')}
          </h1>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200}>
          <p className="text-xl text-neutral-400 max-w-xl leading-relaxed mb-10">
            {t('intro')}
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={300}>
          <p className="text-sm text-neutral-600 mb-10">
            {locale === 'de'
              ? 'Antwort innerhalb von 24 Stunden. Kein Verkaufsgespräch.'
              : 'Response within 24 hours. No sales call, no pressure.'}
          </p>
        </AnimateOnScroll>

        {/* Contact info */}
        <div className="space-y-6">
          <AnimateOnScroll delay={400}>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-neutral-600 mb-2">
                Email
              </p>
              <a
                href="mailto:henry@henry.marketing"
                className="text-2xl md:text-3xl text-white hover:text-orange-500 transition-colors font-light"
              >
                henry@henry.marketing
              </a>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={500}>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-neutral-600 mb-2">
                {locale === 'de' ? 'Telefon' : 'Phone'}
              </p>
              <a
                href="tel:+41791752020"
                className="text-2xl md:text-3xl text-white hover:text-orange-500 transition-colors font-light"
              >
                079 175 20 20
              </a>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={600}>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-neutral-600 mb-2">
                {locale === 'de' ? 'Standort' : 'Location'}
              </p>
              <p className="text-lg text-neutral-400">{t('location')}</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── CTA BLOCK ─── */}
      <section className="border-t border-neutral-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <a
              href="mailto:henry@henry.marketing"
              className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm tracking-wide px-10 py-5 transition-colors text-base"
            >
              {t('cta')} →
            </a>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}

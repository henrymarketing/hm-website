import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AnimateOnScroll from '@/components/AnimateOnScroll';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  return {
    title: isDE
      ? 'Über Henry Barrows — henry.marketing'
      : 'About Henry Barrows — henry.marketing',
    description: isDE
      ? 'Henry Barrows. Schweizer und international. Marketer, Designer, Technologist. Zug, Schweiz.'
      : 'Henry Barrows. Swiss and international. Marketer, designer, technologist. Based in Zug.',
    alternates: {
      canonical: isDE ? '/de/ueber' : '/en/about',
      languages: {
        de: '/de/ueber',
        en: '/en/about',
        'x-default': '/de/ueber',
      },
    },
    openGraph: {
      title: isDE ? 'Über Henry Barrows — henry.marketing' : 'About Henry Barrows — henry.marketing',
      locale: isDE ? 'de_DE' : 'en_US',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('about');

  const bioTagline = t('bio.tagline');
  const bioLines = t.raw('bio.lines') as string[];
  const philosophyItems = t.raw('philosophy.items') as string[];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="py-24 md:py-36 px-6 max-w-6xl mx-auto">
        <AnimateOnScroll>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-8">
            henry.marketing
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.05]">
            {t('hero.h1')}
          </h1>
        </AnimateOnScroll>
      </section>

      {/* ─── BIO + PHOTO ─── */}
      <section className="border-t border-neutral-900 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-16 items-start">
            {/* Profile photo */}
            <AnimateOnScroll className="md:col-span-2">
              <div className="relative w-full aspect-[4/5] border border-neutral-800" style={{ maxWidth: '400px' }}>
                <Image
                  src="/assets/henry-2026-crop.jpg"
                  alt="Henry Barrows"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                <div className="absolute -bottom-3 -right-3 h-16 w-16 border-b-2 border-r-2 border-orange-500/30 pointer-events-none" />
              </div>
            </AnimateOnScroll>

            {/* Bio text */}
            <div className="md:col-span-3 space-y-5">
              <AnimateOnScroll delay={0}>
                <p className="text-sm tracking-wide text-orange-500/90 font-medium">{bioTagline}</p>
              </AnimateOnScroll>
              {bioLines.map((line, i) => (
                <AnimateOnScroll key={i} delay={i * 80}>
                  <p
                    className={`leading-relaxed ${
                      i === 0
                        ? 'text-2xl md:text-3xl text-white font-light'
                        : i === bioLines.length - 1
                        ? 'text-xl text-orange-500 font-medium'
                        : 'text-lg text-neutral-400'
                    }`}
                  >
                    {line}
                  </p>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHILOSOPHY ─── */}
      <section className="border-t border-neutral-900 py-24 md:py-32 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-6">
              {locale === 'de' ? 'Arbeitsweise' : 'Approach'}
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-16">
              {t('philosophy.title')}
            </h2>
          </AnimateOnScroll>
          <div className="space-y-6 max-w-2xl">
            {philosophyItems.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 100}>
                <div className="flex items-start gap-4">
                  <span className="text-orange-500 mt-1 flex-shrink-0">—</span>
                  <p className="text-neutral-300 leading-relaxed">{item}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-neutral-900 py-24 md:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6">
              {t('cta.h2')}
            </h2>
            <p className="text-neutral-400 text-lg mb-12">{t('cta.p')}</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a
                href="mailto:henry@henry.marketing"
                className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm tracking-wide px-8 py-4 transition-colors"
              >
                {t('cta.cta')} →
              </a>
              <a
                href="tel:+41791752020"
                className="inline-block border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white text-sm tracking-wide px-8 py-4 transition-colors"
              >
                079 175 20 20
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}

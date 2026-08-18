import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { CtaLink } from '@/components/ui/cta-link';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  const title = isDE
    ? 'Über Henry Barrows — henry.marketing'
    : 'About Henry Barrows — henry.marketing';
  const description = isDE
    ? 'Henry Barrows. Schweizer mit internationalem Background. Marketer, Designer, Technologist. Zehn Jahre Dentalbranche. Basiert in Zug.'
    : 'Henry Barrows. Swiss with an international background. Marketer, designer, technologist. Ten years in dental. Based in Zug.';

  return {
    title,
    description,
    alternates: {
      canonical: isDE ? '/de/ueber' : '/en/about',
      languages: {
        de: '/de/ueber',
        en: '/en/about',
        'x-default': '/de/ueber',
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

export default function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('about');

  const bioLines = t.raw('bio.lines') as string[];
  const philosophyItems = t.raw('philosophy.items') as string[];

  return (
    <>
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

      <section className="border-t border-neutral-900 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-16 items-start">
            <AnimateOnScroll className="md:col-span-2">
              <div className="relative max-w-[400px] aspect-square">
                <Image
                  src="/images/henry/portrait.webp"
                  alt={
                    locale === 'de'
                      ? 'Henry Barrows — Portrait'
                      : 'Henry Barrows — portrait'
                  }
                  width={800}
                  height={800}
                  className="w-full h-full object-cover object-top"
                  sizes="(max-width: 768px) 90vw, 400px"
                />
              </div>
            </AnimateOnScroll>

            <div className="md:col-span-3 space-y-5">
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

      {/* Work strip */}
      <section className="border-t border-neutral-900 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-lg text-white hover:text-orange-500 transition-colors"
          >
            {t('workStrip')} →
          </Link>
        </div>
      </section>

      <section className="border-t border-neutral-900 py-24 md:py-40">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6">
              {t('cta.h2')}
            </h2>
            <p className="text-neutral-400 text-lg mb-12">{t('cta.p')}</p>
            <CtaLink href="/contact">{t('cta.cta')}</CtaLink>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}

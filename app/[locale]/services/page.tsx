import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AnimateOnScroll from '@/components/AnimateOnScroll';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  return {
    title: isDE
      ? 'Leistungen — henry.marketing'
      : 'Services — henry.marketing',
    description: isDE
      ? 'Marketing, Technology, Media. Alles was Sie brauchen, um digital zu wachsen. Ein Ansprechpartner.'
      : 'Marketing, Technology, Media. Everything you need to grow digitally. One point of contact.',
    alternates: {
      canonical: isDE ? '/de/services' : '/en/services',
      languages: {
        de: '/de/services',
        en: '/en/services',
        'x-default': '/de/services',
      },
    },
    openGraph: {
      title: isDE ? 'Leistungen — henry.marketing' : 'Services — henry.marketing',
      locale: isDE ? 'de_DE' : 'en_US',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function ServicesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('services');

  type ServiceItem = { name: string; desc: string };
  const marketingItems = t.raw('marketing.items') as ServiceItem[];
  const technologyItems = t.raw('technology.items') as ServiceItem[];
  const mediaItems = t.raw('media.items') as ServiceItem[];
  const introParts = t.raw('introParts') as string[];
  const introTerms = t.raw('introTerms') as { marketing: string; technology: string; content: string };
  const pricingCards = t.raw('pricing.cards') as Array<{
    name: string;
    price: string;
    desc: string;
  }>;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="py-24 md:py-36 px-6 max-w-6xl mx-auto">
        <AnimateOnScroll>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-8">
            henry.marketing
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05] mb-8">
            {t('hero.h1')}
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed mb-10">
            {t('hero.p')}
          </p>
          {/* In-page navigation */}
          <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
            <a
              href="#marketing"
              className="hover:text-orange-500 transition-colors border-b border-transparent hover:border-orange-500 pb-0.5"
            >
              Marketing
            </a>
            <span className="text-neutral-800">·</span>
            <a
              href="#technology"
              className="hover:text-orange-500 transition-colors border-b border-transparent hover:border-orange-500 pb-0.5"
            >
              Technology
            </a>
            <span className="text-neutral-800">·</span>
            <a
              href="#media"
              className="hover:text-orange-500 transition-colors border-b border-transparent hover:border-orange-500 pb-0.5"
            >
              Media
            </a>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── INTRO ─── */}
      <section className="border-t border-neutral-900 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <p className="text-xl md:text-2xl text-neutral-400 font-light leading-relaxed max-w-3xl">
              {introParts[0]}
              <a href="#marketing" className="font-semibold text-white hover:text-orange-500 transition-colors">{introTerms.marketing}</a>
              {introParts[1]}
              <a href="#technology" className="font-semibold text-white hover:text-orange-500 transition-colors">{introTerms.technology}</a>
              {introParts[2]}
              <a href="#media" className="font-semibold text-white hover:text-orange-500 transition-colors">{introTerms.content}</a>
              {introParts[3]}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── MARKETING ─── */}
      <section id="marketing" className="border-t border-neutral-900 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-6">01</p>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-16">
              {t('marketing.title')}
            </h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-px bg-neutral-900 border border-neutral-900">
            {marketingItems.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 80}>
                <div className="bg-[#0a0a0a] p-8 hover:bg-[#0f0f0f] transition-colors">
                  <h3 className="text-white font-medium mb-3">{item.name}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <p className="text-neutral-600 text-sm mt-8 italic">{t('marketing.for')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── TECHNOLOGY ─── */}
      <section id="technology" className="border-t border-neutral-900 py-24 md:py-32 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-6">02</p>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-16">
              {t('technology.title')}
            </h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-px bg-neutral-900 border border-neutral-900">
            {technologyItems.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 80}>
                <div className="bg-[#0d0d0d] p-8 hover:bg-[#111] transition-colors">
                  <h3 className="text-white font-medium mb-3">{item.name}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <p className="text-neutral-600 text-sm mt-8 italic">{t('technology.for')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── MEDIA ─── */}
      <section id="media" className="border-t border-neutral-900 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-6">03</p>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-16">
              {t('media.title')}
            </h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-px bg-neutral-900 border border-neutral-900">
            {mediaItems.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 80}>
                <div className="bg-[#0a0a0a] p-8 hover:bg-[#0f0f0f] transition-colors">
                  <h3 className="text-white font-medium mb-3">{item.name}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <p className="text-neutral-600 text-sm mt-8 italic">{t('media.for')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="border-t border-neutral-900 py-24 md:py-32 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-12">
              {t('pricing.label')}
            </p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {pricingCards.map((card, i) => (
              <AnimateOnScroll key={i} delay={i * 100}>
                <div className="border border-neutral-800 p-8 hover:border-orange-500/30 transition-colors">
                  <p className="text-neutral-500 text-xs tracking-widest uppercase mb-4">
                    {card.name}
                  </p>
                  <p className="text-3xl font-light text-white mb-4">{card.price}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <p className="text-neutral-500 text-sm">{t('pricing.note')}</p>
          </AnimateOnScroll>
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

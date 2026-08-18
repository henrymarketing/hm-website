import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { CtaLink } from '@/components/ui/cta-link';

type Props = { params: { locale: string } };

type ServiceItem = {
  name: string;
  aphorism: string;
  body: string;
  typical: string;
  for?: string;
  ref?: string;
  refHref?: string;
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  const title = isDE ? 'Leistungen — henry.marketing' : 'Services — henry.marketing';
  const description = isDE
    ? 'Strategie, Design, Code, Launch — aus einer Hand. Marketing, Technik und Media für Schweizer Unternehmen.'
    : 'Strategy, design, code, launch — from one hand. Marketing, technology, and media for Swiss businesses.';

  return {
    title,
    description,
    alternates: {
      canonical: isDE ? '/de/services' : '/en/services',
      languages: {
        de: '/de/services',
        en: '/en/services',
        'x-default': '/de/services',
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

function ServiceItemBlock({ item }: { item: ServiceItem }) {
  return (
    <div className="border-t border-neutral-900 pt-8">
      <h3 className="text-xl text-white font-medium mb-2">{item.name}</h3>
      <p className="text-white font-semibold mb-3">{item.aphorism}</p>
      <p className="text-neutral-400 leading-relaxed mb-4">{item.body}</p>
      <p className="text-neutral-400 text-sm italic mb-2">{item.typical}</p>
      {item.for && <p className="text-neutral-400 text-sm italic">{item.for}</p>}
      {item.ref && item.refHref && (
        <p className="text-sm italic">
          <Link
            href={item.refHref as '/work'}
            className="text-orange-500/90 hover:text-orange-400 transition-colors"
          >
            {item.ref} →
          </Link>
        </p>
      )}
    </div>
  );
}

export default function ServicesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('services');

  const pillars = [
    { key: 'marketing' as const, id: 'marketing' },
    { key: 'technik' as const, id: 'technik' },
    { key: 'media' as const, id: 'media' },
  ];

  return (
    <>
      <section className="py-24 md:py-36 px-6 max-w-6xl mx-auto">
        <AnimateOnScroll>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.05] mb-8">
            {t('h1')}
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">{t('intro')}</p>
        </AnimateOnScroll>
      </section>

      {pillars.map(({ key, id }) => {
        const items = t.raw(`pillars.${key}.items`) as ServiceItem[];
        return (
          <section
            key={key}
            id={id}
            className="border-t border-neutral-900 py-20 md:py-28 scroll-mt-24"
          >
            <div className="max-w-6xl mx-auto px-6">
              <AnimateOnScroll>
                <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
                  {t(`pillars.${key}.title`)}
                </h2>
                <p className="text-orange-500 font-medium mb-12">
                  {t(`pillars.${key}.tagline`)}
                </p>
              </AnimateOnScroll>
              <div className="max-w-3xl space-y-10">
                {items.map((item, i) => (
                  <AnimateOnScroll key={i} delay={i * 60}>
                    <ServiceItemBlock item={item} />
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Betreuung */}
      <section id="betreuung" className="border-t border-neutral-900 py-20 md:py-28 bg-[#0d0d0d] scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
              {t('retainer.title')}
            </h2>
            <p className="text-orange-500 font-medium mb-8">{t('retainer.tagline')}</p>
            <p className="text-neutral-300 leading-relaxed mb-6">{t('retainer.body')}</p>
            <p className="text-neutral-400 text-sm italic mb-2">{t('retainer.typical')}</p>
            <p className="text-neutral-400 text-sm italic">{t('retainer.for')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Investment */}
      <section className="border-t border-neutral-900 py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-8">
              {t('investment.h2')}
            </h2>
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">{t('investment.p1')}</p>
            <p className="text-lg text-neutral-400 leading-relaxed mb-6">{t('investment.p2')}</p>
            <p className="text-lg text-neutral-400 leading-relaxed">{t('investment.p3')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
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

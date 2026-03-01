import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import JsonLd from '@/components/JsonLd';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  return {
    title: isDE
      ? 'FAQ — henry.marketing'
      : 'FAQ — henry.marketing',
    description: isDE
      ? 'Häufige Fragen zu henry.marketing: Für wen, Preise, Ablauf, Standort, Remote.'
      : 'Frequently asked questions about henry.marketing: who it\'s for, pricing, process, location, remote work.',
    alternates: {
      canonical: isDE ? '/de/faq' : '/en/faq',
      languages: {
        de: '/de/faq',
        en: '/en/faq',
        'x-default': '/de/faq',
      },
    },
    openGraph: {
      title: isDE ? 'FAQ — henry.marketing' : 'FAQ — henry.marketing',
      locale: isDE ? 'de_DE' : 'en_US',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function FaqPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('faq');
  const questions = t.raw('questions') as Array<{ q: string; a: string }>;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <section className="py-24 md:py-36 px-6 max-w-6xl mx-auto">
        <AnimateOnScroll>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-8">
            henry.marketing
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.05] mb-16">
            {t('title')}
          </h1>
        </AnimateOnScroll>

        <div className="space-y-10 max-w-2xl">
          {questions.map((item, i) => (
            <AnimateOnScroll key={i} delay={i * 80}>
              <div className="border-b border-neutral-800 pb-8 last:border-0">
                <h2 className="text-lg font-medium text-white mb-3">
                  {item.q}
                </h2>
                <p className="text-neutral-400 leading-relaxed">{item.a}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}

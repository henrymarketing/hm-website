import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { HeroSection } from '@/components/sections/hero-section';
import { ProblemSection } from '@/components/sections/problem-section';
import { HenryMoment } from '@/components/sections/henry-moment';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { ClosingCta } from '@/components/sections/closing-cta';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  return {
    title: isDE
      ? 'henry.marketing — Ein Partner. Alles digitale.'
      : 'henry.marketing — One partner. Everything digital.',
    description: isDE
      ? 'Ich baue digitale Infrastruktur für Schweizer und internationale Unternehmen. Website, Marketing, Design, AI, Media — was Sie brauchen, um zu wachsen.'
      : 'I build digital infrastructure for Swiss and international companies. Website, marketing, design, AI, media — whatever you need to grow.',
    alternates: {
      canonical: isDE ? '/de' : '/en',
      languages: {
        de: '/de',
        en: '/en',
        'x-default': '/de',
      },
    },
    openGraph: {
      title: isDE ? 'henry.marketing — Ein Partner. Alles digitale.' : 'henry.marketing — One partner. Everything digital.',
      description: isDE
        ? 'Digitale Infrastruktur für Schweizer und internationale Unternehmen. Website, Marketing, Design, AI, Media.'
        : 'Digital infrastructure for Swiss and international companies. Website, marketing, design, AI, media.',
      locale: isDE ? 'de_DE' : 'en_US',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations();

  const problemLines = t.raw('home.problem.lines') as string[];
  const solutionLines = t.raw('home.solution.lines') as string[];
  const forItems = t.raw('home.for.items') as string[];
  const steps = t.raw('home.howItWorks.steps') as Array<{ title: string; desc: string }>;
  const pricingCards = t.raw('home.pricing.cards') as Array<{ name: string; price: string; desc: string }>;

  return (
    <>
      {/* ─── HERO ─── */}
      <HeroSection
        headline={t('home.hero.h1')}
        subline={t('home.hero.p')}
        ctaLabel={t('home.hero.cta')}
        ctaHref="mailto:henry@henry.marketing"
      />

      {/* ─── YOUR NEEDS ─── */}
      <ProblemSection
        eyebrow={locale === 'de' ? 'Was Sie brauchen' : 'Your needs'}
        intro={t('home.problem.intro')}
        lines={problemLines}
      />

      {/* ─── HENRY MOMENT (Solution) ─── */}
      <HenryMoment lines={solutionLines} />

      {/* ─── CAPABILITIES ─── */}
      <section className="py-24 md:py-32 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-12">
              {t('home.capabilities.label')}
            </p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {(['1', '2', '3'] as const).map((key, i) => {
              const cap = t.raw(`home.capabilities.${key}`) as {
                title: string;
                desc: string;
                anchor: string;
              };
              return (
                <AnimateOnScroll key={key} delay={i * 100}>
                  <Link
                    href={{ pathname: '/services', hash: `#${cap.anchor}` }}
                    className="group block border border-neutral-800 hover:border-orange-500/40 p-8 transition-colors"
                  >
                    <p className="text-xs tracking-[0.2em] uppercase text-orange-500 mb-4">
                      0{key}
                    </p>
                    <h3 className="text-xl font-medium text-white mb-3 group-hover:text-orange-500 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      {cap.desc}
                    </p>
                    <p className="text-orange-500/60 text-xs mt-6 group-hover:text-orange-500 transition-colors">
                      {locale === 'de' ? 'Mehr erfahren' : 'Learn more'} →
                    </p>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
          <AnimateOnScroll>
            <p className="text-neutral-500 text-sm italic">{t('home.capabilities.note')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="py-24 md:py-32 border-t border-neutral-900 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-12">
              {t('home.for.label')}
            </p>
          </AnimateOnScroll>
          <ul className="space-y-4 max-w-2xl">
            {forItems.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 80}>
                <li className="flex items-start gap-4">
                  <span className="text-orange-500 mt-1 flex-shrink-0">—</span>
                  <span
                    className={`leading-relaxed ${
                      i === forItems.length - 1
                        ? 'text-white font-medium text-lg'
                        : 'text-neutral-300'
                    }`}
                  >
                    {item}
                  </span>
                </li>
              </AnimateOnScroll>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <HowItWorksSection
        eyebrow={t('home.howItWorks.label')}
        steps={steps}
      />

      {/* ─── PRICING ─── */}
      <section className="py-24 md:py-32 border-t border-neutral-900 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-12">
              {t('home.pricing.label')}
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
            <p className="text-neutral-500 text-sm">{t('home.pricing.note')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <ClosingCta
        headline={t('home.cta.h2')}
        subline={t('home.cta.p')}
        ctaLabel={t('home.cta.cta')}
        ctaHref="mailto:henry@henry.marketing"
        secondaryLabel="079 175 20 20"
        secondaryHref="tel:+41791752020"
      />
    </>
  );
}

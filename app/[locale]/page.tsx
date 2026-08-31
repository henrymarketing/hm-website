import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { CtaLink } from '@/components/ui/cta-link';
import { SplitText } from '@/components/ui/split-text';
import { AnimateIn } from '@/components/ui/animate-in';
import { AccentLine } from '@/components/ui/accent-line';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  const title = isDE
    ? 'henry.marketing — Websites und digitales Marketing'
    : 'henry.marketing — Websites and digital marketing';
  const description = isDE
    ? 'Ein Partner für Strategie, Design, Code und Launch. Websites und Marketing für Schweizer KMU und Praxen — ohne Agentur-Overhead.'
    : 'One partner for strategy, design, code, and launch. Websites and marketing for Swiss SMEs and practices — without agency overhead.';

  return {
    title,
    description,
    alternates: {
      canonical: isDE ? '/de' : '/en',
      languages: { de: '/de', en: '/en', 'x-default': '/de' },
    },
    openGraph: {
      title,
      description,
      locale: isDE ? 'de_CH' : 'en_US',
      type: 'website',
      images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'henry.marketing' }],
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations();
  const contactId = locale === 'de' ? 'kontakt' : 'contact';

  const forItems = t.raw('home.for.items') as string[];
  const steps = t.raw('home.process.steps') as Array<{ title: string; desc: string }>;
  const featured = t.raw('home.featured.cards') as Array<{
    title: string;
    desc: string;
    slug: string;
  }>;
  const serviceItems = t.raw('home.servicesTeaser.items') as Array<{
    title: string;
    desc: string;
  }>;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
        {/* Orange gradient accent — right side */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[75%] h-full bg-[radial-gradient(ellipse_at_85%_30%,rgba(249,115,22,0.30)_0%,rgba(249,115,22,0.10)_40%,transparent_70%)]" />
          <div className="absolute bottom-0 right-0 w-[50%] h-[55%] bg-[radial-gradient(ellipse_at_100%_100%,rgba(249,115,22,0.14)_0%,transparent_60%)]" />
        </div>

        {/* Copy sits on top — overlaps the left of the portrait */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 min-h-[calc(100svh-4rem)] flex items-center">
          <div className="max-w-[34rem] lg:max-w-[40rem]">
            <AnimateIn delay={0} duration={600} y={0}>
              <AccentLine className="mb-8" />
            </AnimateIn>
            <SplitText
              tag="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.06] mb-8 drop-shadow-[0_2px_24px_rgba(10,10,10,0.85)]"
              baseDelay={200}
              staggerMs={60}
            >
              {t('home.hero.h1')}
            </SplitText>
            <AnimateIn delay={600} duration={700} y={16}>
              <p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-10 max-w-xl drop-shadow-[0_2px_18px_rgba(10,10,10,0.9)]">
                {t('home.hero.p')}
              </p>
            </AnimateIn>
            <AnimateIn delay={800} duration={700} y={16}>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <CtaLink href="/work" variant="primary">
                  {t('home.hero.ctaPrimary')}
                </CtaLink>
                <CtaLink href={`#${contactId}`} variant="secondary">
                  {t('home.hero.ctaSecondary')}
                </CtaLink>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-t border-b border-neutral-900 py-8 bg-[#0d0d0d]" aria-label={t('home.trust.label')}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-3">
            {t('home.trust.label')}
          </p>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
            {t('home.trust.items')}
          </p>
        </div>
      </section>

      {/* POSITIONING */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-8">
              {t('home.positioning.h2')}
            </h2>
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              {t('home.positioning.p1')}
            </p>
            <p className="text-lg text-neutral-400 leading-relaxed">
              {t('home.positioning.p2')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="py-24 md:py-32 border-t border-neutral-900 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-12">
              {t('home.featured.h2')}
            </h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featured.map((card, i) => (
              <AnimateOnScroll key={card.slug} delay={i * 100}>
                <Link
                  href="/work"
                  className="group block"
                >
                  <div className="overflow-hidden rounded-sm mb-5">
                    <Image
                      src={`/images/work/${card.slug}.webp`}
                      alt={card.title}
                      width={1280}
                      height={800}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="text-white font-medium mb-2 group-hover:text-orange-500 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{card.desc}</p>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <Link
              href="/work"
              className="text-orange-500 hover:text-orange-400 text-sm tracking-wide transition-colors"
            >
              {t('home.featured.link')} →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24 md:py-32 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-12 max-w-3xl">
              {t('home.for.h2')}
            </h2>
          </AnimateOnScroll>
          <ul className="space-y-4 max-w-2xl mb-10">
            {forItems.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 80} as="li" className="flex items-start gap-4">
                <span className="text-orange-500 mt-1 flex-shrink-0">—</span>
                <span className="text-neutral-300 leading-relaxed">{item}</span>
              </AnimateOnScroll>
            ))}
          </ul>
          <AnimateOnScroll>
            <p className="text-white font-medium text-lg">{t('home.for.closer')}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="py-24 md:py-32 border-t border-neutral-900 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-12">
              {t('home.servicesTeaser.h2')}
            </h2>
          </AnimateOnScroll>
          <ul className="space-y-8 max-w-3xl mb-12">
            {serviceItems.map((item, i) => (
              <AnimateOnScroll key={i} delay={i * 80} as="li">
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{item.desc}</p>
              </AnimateOnScroll>
            ))}
          </ul>
          <AnimateOnScroll>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl mb-10">
              {t('home.servicesTeaser.stat')}
            </p>
            <Link
              href="/services"
              className="text-orange-500 hover:text-orange-400 text-sm tracking-wide transition-colors"
            >
              {t('home.servicesTeaser.link')} →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* PROCESS — once */}
      <HowItWorksSection eyebrow={t('home.process.h2')} steps={steps} />

      {/* INVESTMENT */}
      <section className="py-24 md:py-32 border-t border-neutral-900 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-8">
              {t('home.investment.h2')}
            </h2>
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              {t('home.investment.p1')}
            </p>
            <p className="text-lg text-neutral-400 leading-relaxed">
              {t('home.investment.p2')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id={contactId}
        className="py-24 md:py-32 border-t border-neutral-900"
        aria-labelledby="contact-heading"
      >
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll>
            <h2 id="contact-heading" className="text-3xl md:text-4xl font-light text-white mb-6">
              {t('home.contact.h2')}
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed mb-12 max-w-2xl">
              {t('home.contact.p')}
            </p>
          </AnimateOnScroll>
          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href="mailto:henry@henry.marketing"
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm tracking-wide px-8 py-4 transition-colors"
            >
              henry@henry.marketing
            </a>
            <a
              href="tel:+41791752020"
              className="inline-flex items-center gap-3 border border-neutral-700 hover:border-orange-500/60 text-white text-sm tracking-wide px-8 py-4 transition-colors"
            >
              079 175 20 20
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

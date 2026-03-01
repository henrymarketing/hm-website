'use client';

import { AccentLine } from '@/components/ui/accent-line';
import { SplitText } from '@/components/ui/split-text';
import { AnimateIn } from '@/components/ui/animate-in';
import { ArrowCta } from '@/components/ui/arrow-cta';

interface HeroSectionProps {
  headline: string;
  subline: string;
  ctaLabel: string;
  ctaHref: string;
}

export function HeroSection({ headline, subline, ctaLabel, ctaHref }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/henry-marketing1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div className="relative min-h-[90vh] flex flex-col justify-center px-6 py-24 md:py-32 max-w-6xl mx-auto w-full">
      <AnimateIn delay={0} duration={600} y={0}>
        <AccentLine className="mb-8" />
      </AnimateIn>
      <SplitText
        tag="h1"
        className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05] mb-8 max-w-4xl"
        baseDelay={200}
        staggerMs={80}
      >
        {headline}
      </SplitText>
      <AnimateIn delay={600} duration={700} y={16}>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed mb-12">
          {subline}
        </p>
      </AnimateIn>
      <AnimateIn delay={800} duration={700} y={16}>
        <ArrowCta href={ctaHref} variant="primary">
          {ctaLabel}
        </ArrowCta>
      </AnimateIn>
      </div>
    </section>
  );
}

'use client';

import { SplitText } from '@/components/ui/split-text';
import { AnimateIn } from '@/components/ui/animate-in';
import { ArrowCta } from '@/components/ui/arrow-cta';

interface ClosingCtaProps {
  headline: string;
  subline: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function ClosingCta({
  headline,
  subline,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: ClosingCtaProps) {
  return (
    <section
      className="relative py-24 md:py-40 border-t border-neutral-900 bg-cover bg-center cta-glow"
      style={{ backgroundImage: "url('/assets/henry-marketing3.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-6">
        <SplitText
          tag="h2"
          className="text-[clamp(2.5rem,7vw,8rem)] font-thin tracking-tight text-white leading-[1.05] mb-6"
          baseDelay={0}
          staggerMs={80}
        >
          {headline}
        </SplitText>
        <AnimateIn delay={400} duration={700} y={16}>
          <p className="text-neutral-400 text-lg mb-12 max-w-xl">{subline}</p>
        </AnimateIn>
        <AnimateIn delay={600} duration={700} y={16}>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <ArrowCta href={ctaHref} variant="primary">
              {ctaLabel}
            </ArrowCta>
            {secondaryLabel && secondaryHref && (
              <ArrowCta href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </ArrowCta>
            )}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

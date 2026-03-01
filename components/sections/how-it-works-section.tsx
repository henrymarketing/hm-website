'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import { AnimateIn } from '@/components/ui/animate-in';

interface Step {
  title: string;
  desc: string;
}

interface HowItWorksSectionProps {
  eyebrow: string;
  steps: Step[];
}

export function HowItWorksSection({ eyebrow, steps }: HowItWorksSectionProps) {
  const [connectorRef, connectorInView] = useInView<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto px-6">
        <AnimateIn delay={0} duration={600}>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-12">
            {eyebrow}
          </p>
        </AnimateIn>

        {/* Desktop layout */}
        <div className="hidden md:block" ref={connectorRef}>
          {/* Number row with connecting lines */}
          <div
            className="grid mb-6"
            style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
          >
            {steps.map((_, i) => (
              <div key={i} className="flex items-center">
                <AnimateIn delay={i * 120} duration={500} y={0}>
                  <div className="w-10 h-10 rounded-full border border-orange-500/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-orange-500/70 font-light">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </AnimateIn>
                {i < steps.length - 1 && (
                  <div className="flex-1 mx-3 h-px overflow-hidden">
                    <div
                      style={{
                        height: '1px',
                        backgroundColor: 'rgba(249,115,22,0.2)',
                        transformOrigin: 'left',
                        transform: connectorInView ? 'scaleX(1)' : 'scaleX(0)',
                        transition: `transform 600ms cubic-bezier(0.16,1,0.3,1) ${300 + i * 120}ms`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Content row */}
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
          >
            {steps.map((step, i) => (
              <AnimateIn key={i} delay={200 + i * 120} duration={600} y={16}>
                <h3 className="text-white font-medium mb-2 text-sm">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
              </AnimateIn>
            ))}
          </div>
        </div>

        {/* Mobile layout — vertical timeline */}
        <div className="md:hidden space-y-8">
          {steps.map((step, i) => (
            <AnimateIn key={i} delay={i * 120} duration={600} y={16}>
              <div className="relative border-l border-orange-500/20 pl-6">
                <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                <p className="text-4xl font-light text-neutral-800 mb-3">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-white font-medium mb-2">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}

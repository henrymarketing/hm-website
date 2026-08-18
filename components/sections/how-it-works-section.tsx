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
  asH2?: boolean;
}

/** Single DOM tree — responsive via CSS only (no desktop/mobile duplicate markup). */
export function HowItWorksSection({
  eyebrow,
  steps,
  asH2 = true,
}: HowItWorksSectionProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const Heading = asH2 ? 'h2' : 'p';

  return (
    <section className="py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto px-6">
        <AnimateIn delay={0} duration={600}>
          <Heading className="text-3xl md:text-4xl font-light text-white mb-12 tracking-tight">
            {eyebrow}
          </Heading>
        </AnimateIn>

        <div ref={ref} className="relative">
          {/* Mobile: vertical timeline | Desktop: horizontal grid — one list */}
          <ol className="flex flex-col md:flex-row md:gap-4 gap-0">
            {steps.map((step, i) => (
              <li
                key={i}
                className="relative flex md:flex-col gap-4 md:gap-0 border-l border-orange-500/20 md:border-l-0 pl-6 md:pl-0 pb-8 md:pb-0 md:flex-1"
              >
                {/* Dot (mobile) / number circle (all) */}
                <div className="absolute -left-[5px] top-1 md:static md:mb-4 flex items-center md:w-full">
                  <div className="md:hidden h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <div className="hidden md:flex items-center w-full">
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
                            transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                            transition: `transform 600ms cubic-bezier(0.16,1,0.3,1) ${300 + i * 120}ms`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <AnimateIn delay={200 + i * 120} duration={600} y={16}>
                  <p className="md:hidden text-4xl font-light text-neutral-800 mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-white font-medium mb-2 text-sm md:text-sm">
                    {step.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
                </AnimateIn>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

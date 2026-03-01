'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import { AnimateIn } from '@/components/ui/animate-in';

interface ProblemSectionProps {
  eyebrow: string;
  intro: string;
  lines: string[];
}

export function ProblemSection({ eyebrow, intro, lines }: ProblemSectionProps) {
  const [ruleRef, ruleInView] = useInView<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto px-6">
        <AnimateIn delay={0} duration={600}>
          <p className="text-xs tracking-[0.25em] uppercase text-orange-500 mb-12">
            {eyebrow}
          </p>
        </AnimateIn>
        <AnimateIn delay={100} duration={700} y={20}>
          <p className="text-2xl md:text-3xl text-neutral-300 font-light leading-relaxed mb-8 max-w-3xl">
            {intro}
          </p>
        </AnimateIn>
        <div className="space-y-6 max-w-3xl">
          {lines.map((line, i) => (
            <AnimateIn key={i} delay={200 + i * 200} duration={700} y={16}>
              <p
                className={`text-lg leading-relaxed ${
                  i === lines.length - 1
                    ? 'text-2xl md:text-3xl text-white font-light'
                    : 'text-neutral-400'
                }`}
              >
                {line}
              </p>
            </AnimateIn>
          ))}
        </div>
        <div ref={ruleRef} className="mt-12">
          <div
            style={{
              height: '2px',
              width: ruleInView ? '40px' : '0px',
              backgroundColor: '#f97316',
              transition: 'width 600ms cubic-bezier(0.16,1,0.3,1) 200ms',
            }}
          />
        </div>
      </div>
    </section>
  );
}

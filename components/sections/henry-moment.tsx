'use client';

import { AnimateIn } from '@/components/ui/animate-in';
import { AccentLine } from '@/components/ui/accent-line';

interface HenryMomentProps {
  lines: string[];
}

export function HenryMoment({ lines }: HenryMomentProps) {
  return (
    <section
      className="relative min-h-[85vh] flex flex-col justify-center border-t border-neutral-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/henry-marketing2.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div className="relative min-h-[85vh] flex flex-col justify-center px-6 py-24 max-w-6xl mx-auto w-full">
        <AnimateIn delay={0} duration={600} y={0}>
          <AccentLine className="mb-12" />
        </AnimateIn>
        <div className="space-y-5 max-w-3xl">
          <AnimateIn delay={400} duration={900} y={32}>
            <p className="text-5xl md:text-7xl font-thin text-white leading-[1.05]">
              {lines[0]}
            </p>
          </AnimateIn>
          {lines.slice(1, lines.length - 1).map((line, i) => (
            <AnimateIn key={i} delay={700 + i * 300} duration={700} y={20}>
              <p className="text-xl text-neutral-400 font-light leading-relaxed">
                {line}
              </p>
            </AnimateIn>
          ))}
          <AnimateIn delay={700 + (lines.length - 2) * 300} duration={700} y={20}>
            <p className="text-xl text-orange-500 font-medium leading-relaxed">
              {lines[lines.length - 1]}
            </p>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}

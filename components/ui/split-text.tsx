'use client';

import { useInView } from '@/lib/hooks/use-in-view';

type Tag = 'h1' | 'h2' | 'h3' | 'p';

interface SplitTextProps {
  children: string;
  tag?: Tag;
  className?: string;
  baseDelay?: number;
  staggerMs?: number;
  duration?: number;
}

export function SplitText({
  children,
  tag: Tag = 'p',
  className = '',
  baseDelay = 0,
  staggerMs = 80,
  duration = 700,
}: SplitTextProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const words = children.split(' ');

  return (
    <div ref={ref}>
      <Tag className={`flex flex-wrap gap-y-1 ${className}`}>
        {words.map((word, i) => (
          <span
            key={i}
            className="mr-[0.32em] last:mr-0 inline-block"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(20px)',
              transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${baseDelay + i * staggerMs}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${baseDelay + i * staggerMs}ms`,
            }}
          >
            {word}
          </span>
        ))}
      </Tag>
    </div>
  );
}

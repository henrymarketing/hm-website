'use client';

import { useEffect, useRef, ReactNode, ElementType } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Use `li` when wrapping list items so lists stay valid for a11y. */
  as?: 'div' | 'li';
}

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.setAttribute('data-visible', 'true');
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref}
      data-visible="false"
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 ${className}`}
    >
      {children}
    </Tag>
  );
}

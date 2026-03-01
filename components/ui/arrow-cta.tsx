interface ArrowCtaProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function ArrowCta({ href, children, variant = 'primary', className = '' }: ArrowCtaProps) {
  const base = 'group inline-flex items-center gap-2 font-semibold text-sm tracking-wide px-8 py-4 transition-colors';
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-400 text-black',
    secondary: 'border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white',
  };

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
    </a>
  );
}

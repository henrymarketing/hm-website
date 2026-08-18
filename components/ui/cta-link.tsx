import { Link } from '@/i18n/navigation';

type Pathname = '/' | '/work' | '/services' | '/about' | '/contact';

interface CtaLinkProps {
  href: Pathname | string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function CtaLink({ href, children, variant = 'primary', className = '' }: CtaLinkProps) {
  const base =
    'group inline-flex items-center gap-2 font-semibold text-sm tracking-wide px-8 py-4 transition-colors';
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-400 text-black',
    secondary:
      'border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white',
  };
  const cls = `${base} ${variants[variant]} ${className}`;

  const isInternal =
    href === '/' ||
    href === '/work' ||
    href === '/services' ||
    href === '/about' ||
    href === '/contact';

  if (isInternal) {
    return (
      <Link href={href as Pathname} className={cls}>
        {children}
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </Link>
    );
  }

  return (
    <a href={href} className={cls}>
      {children}
      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

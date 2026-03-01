'use client';

import { usePathname, Link } from '@/i18n/navigation';

export function FooterLocaleSwitch({ locale }: { locale: string }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href={pathname}
        locale="de"
        className={`transition-colors ${
          locale === 'de' ? 'text-orange-500' : 'text-neutral-600 hover:text-neutral-400'
        }`}
      >
        DE
      </Link>
      <span className="text-neutral-700">|</span>
      <Link
        href={pathname}
        locale="en"
        className={`transition-colors ${
          locale === 'en' ? 'text-orange-500' : 'text-neutral-600 hover:text-neutral-400'
        }`}
      >
        EN
      </Link>
    </div>
  );
}

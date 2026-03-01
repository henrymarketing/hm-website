'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center h-10 hover:opacity-80 transition-opacity"
          aria-label="henry.marketing"
        >
          <Image
            src="/logo/henry-logo-2026-transparent.png"
            alt="henry.marketing"
            width={160}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/services"
            className={`text-sm tracking-wide transition-colors ${
              isActive('/services')
                ? 'text-white border-b border-orange-500/50 pb-0.5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t('work')}
          </Link>
          <Link
            href="/about"
            className={`text-sm tracking-wide transition-colors ${
              isActive('/about')
                ? 'text-white border-b border-orange-500/50 pb-0.5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t('about')}
          </Link>
          <Link
            href="/contact"
            className={`text-sm tracking-wide transition-colors ${
              isActive('/contact')
                ? 'text-white border-b border-orange-500/50 pb-0.5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t('contact')}
          </Link>

          {/* Language switcher */}
          <div className="flex items-center gap-2 text-sm border border-neutral-800 rounded-sm px-3 py-1">
            <Link
              href={pathname}
              locale="de"
              className={`transition-colors ${
                locale === 'de'
                  ? 'text-orange-500'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              DE
            </Link>
            <span className="text-neutral-700">|</span>
            <Link
              href={pathname}
              locale="en"
              className={`transition-colors ${
                locale === 'en'
                  ? 'text-orange-500'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              EN
            </Link>
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-neutral-400 hover:text-white transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-900 bg-[#0a0a0a]">
          <nav className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
            <Link
              href="/services"
              onClick={() => setMenuOpen(false)}
              className="text-neutral-200 hover:text-white text-xl tracking-wide transition-colors"
            >
              {t('work')}
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-neutral-200 hover:text-white text-xl tracking-wide transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="text-neutral-200 hover:text-white text-xl tracking-wide transition-colors"
            >
              {t('contact')}
            </Link>
            <div className="flex items-center gap-4 text-sm pt-4 border-t border-neutral-900">
              <Link
                href={pathname}
                locale="de"
                className={`transition-colors ${
                  locale === 'de' ? 'text-orange-500' : 'text-neutral-500'
                }`}
              >
                Deutsch
              </Link>
              <span className="text-neutral-700">·</span>
              <Link
                href={pathname}
                locale="en"
                className={`transition-colors ${
                  locale === 'en' ? 'text-orange-500' : 'text-neutral-500'
                }`}
              >
                English
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

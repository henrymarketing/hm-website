'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'cookieConsent';

export default function CookieBanner() {
  const t = useTranslations('cookie');
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(true); // default true so we don't flash the banner before hydration

  useEffect(() => {
    setMounted(true);
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      setAccepted(stored === 'accepted');
    } catch {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      setAccepted(true);
    } catch {
      setAccepted(true);
    }
  };

  if (!mounted || accepted) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 border-t border-neutral-800 bg-[#0a0a0a]/98 backdrop-blur-sm"
      role="dialog"
      aria-label="Cookie notice"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-neutral-300 leading-relaxed pr-4">
          {t('message')}
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="flex-shrink-0 bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm tracking-wide px-6 py-2.5 transition-colors"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}

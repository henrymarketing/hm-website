'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'hm-cookie-dismissed';

export default function CookieNotice() {
  const t = useTranslations('cookie');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-neutral-800 bg-[#0d0d0d]/95 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
          {t('message')}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-sm tracking-wide border border-neutral-700 hover:border-orange-500/50 text-neutral-200 hover:text-white px-5 py-2 transition-colors"
        >
          {t('dismiss')}
        </button>
      </div>
    </div>
  );
}

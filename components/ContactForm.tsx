'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('form');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorDetail('');

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill this; humans don't see it
    if (String(data.get('company') || '').trim()) {
      setStatus('success');
      form.reset();
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') || '').trim(),
          email: String(data.get('email') || '').trim(),
          message: String(data.get('message') || '').trim(),
        }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        setStatus('error');
        setErrorDetail(json.error || `HTTP ${res.status}`);
        return;
      }

      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorDetail(err instanceof Error ? err.message : 'network_error');
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-6 max-w-xl" noValidate>
        {/* Honeypot */}
        <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor="name" className="block text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            {t('name')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full bg-transparent border border-neutral-800 focus:border-orange-500/60 text-white px-4 py-3 outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full bg-transparent border border-neutral-800 focus:border-orange-500/60 text-white px-4 py-3 outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            {t('message')}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full bg-transparent border border-neutral-800 focus:border-orange-500/60 text-white px-4 py-3 outline-none transition-colors resize-y min-h-[120px]"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-black font-semibold text-sm tracking-wide px-8 py-4 transition-colors"
        >
          {status === 'sending' ? t('sending') : t('submit')}
        </button>

        {status === 'success' && (
          <p className="text-sm text-orange-500" role="status">
            {t('success')}
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400" role="alert">
            {t('error')}
            {errorDetail ? (
              <span className="block text-neutral-600 mt-1 text-xs">[{errorDetail}]</span>
            ) : null}
          </p>
        )}
      </form>

      <p className="mt-10 text-sm text-neutral-400">
        {t('secondary')}{' '}
        <a href="mailto:henry@henry.marketing" className="text-neutral-300 hover:text-orange-500 transition-colors">
          henry@henry.marketing
        </a>
        {' · '}
        <a href="tel:+41791752020" className="text-neutral-300 hover:text-orange-500 transition-colors">
          {t('phone')}
        </a>
      </p>
    </div>
  );
}

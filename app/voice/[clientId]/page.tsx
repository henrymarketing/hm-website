'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type ClientConfig = {
  company_name: string;
  from_name: string;
  from_email: string;
  accent_color: string;
  default_language: string;
  signature: string;
  has_smtp: boolean;
  is_general: boolean;
};

type Phase =
  | 'loading'
  | 'error'
  | 'idle'
  | 'recording'
  | 'refining'
  | 'preview'
  | 'sending'
  | 'sent';

export default function VoiceMailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;

  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  // Dictation state
  const [rawText, setRawText] = useState('');
  const [interimText, setInterimText] = useState('');

  // Email state
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // Copy button feedback
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);

  // Load client config
  useEffect(() => {
    fetch(`/api/voice/config?clientId=${clientId}`)
      .then((res) => {
        if (!res.ok) throw new Error('not_found');
        return res.json();
      })
      .then((data: ClientConfig) => {
        setConfig(data);
        setPhase('idle');
      })
      .catch(() => {
        setErrorMsg(
          'Dieser Link ist ungültig. Bitte kontaktieren Sie henry@henry.marketing.'
        );
        setPhase('error');
      });
  }, [clientId]);

  // Init speech recognition once config is loaded
  useEffect(() => {
    if (!config) return;

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setErrorMsg(
        'Ihr Browser unterstützt keine Spracherkennung. Bitte Chrome oder Edge verwenden.'
      );
      setPhase('error');
      return;
    }

    const rec = new SR();
    rec.lang = config.default_language;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let finalChunk = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += t;
        } else {
          interim += t;
        }
      }
      if (finalChunk) {
        setRawText((prev) => (prev ? prev + ' ' + finalChunk : finalChunk));
      }
      setInterimText(interim);
    };

    rec.onerror = (event: any) => {
      if (event.error === 'no-speech') return;
      if (event.error === 'not-allowed') {
        setErrorMsg(
          'Mikrofon-Zugriff verweigert. Bitte erlauben Sie den Zugriff in den Browser-Einstellungen.'
        );
        setPhase('error');
        isRecordingRef.current = false;
      }
    };

    // Chrome stops after ~60s — auto-restart if still recording
    rec.onend = () => {
      if (isRecordingRef.current) {
        try {
          rec.start();
        } catch {
          // already started
        }
      } else {
        setInterimText('');
      }
    };

    recognitionRef.current = rec;
  }, [config]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    isRecordingRef.current = true;
    setRawText('');
    setInterimText('');
    try {
      recognitionRef.current.start();
    } catch {
      // already running
    }
    setPhase('recording');
  }, []);

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    recognitionRef.current?.stop();
    setPhase('idle');
  }, []);

  const refine = useCallback(async () => {
    if (!rawText.trim()) return;
    setPhase('refining');
    try {
      const res = await fetch('/api/voice/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, rawText: rawText.trim(), recipient, subject }),
      });
      if (!res.ok) throw new Error('refine_failed');
      const data = await res.json();
      setBody(data.body ?? '');
      if (data.subject) setSubject(data.subject);
      setPhase('preview');
    } catch {
      setErrorMsg('Verarbeitung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      setPhase('idle');
    }
  }, [clientId, rawText, recipient, subject]);

  const send = useCallback(async () => {
    setPhase('sending');
    try {
      const res = await fetch('/api/voice/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, recipient, subject, body }),
      });
      if (!res.ok) throw new Error('send_failed');
      setPhase('sent');
      setTimeout(reset, 3000);
    } catch {
      setErrorMsg('Senden fehlgeschlagen. Prüfen Sie die Empfängeradresse.');
      setPhase('preview');
    }
  }, [clientId, recipient, subject, body]);

  const copyToClipboard = useCallback(async () => {
    const fullText = config?.is_general || !config?.signature
      ? body
      : `${body}\n\n${config.signature}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [body, config]);

  const reset = useCallback(() => {
    isRecordingRef.current = false;
    recognitionRef.current?.stop();
    setPhase('idle');
    setRawText('');
    setInterimText('');
    setRecipient('');
    setSubject('');
    setBody('');
    setErrorMsg('');
  }, []);

  const accent = config?.accent_color ?? '#1a3a5c';

  // ── Loading ──────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div
          className="w-8 h-8 rounded-full border-2 border-gray-200 animate-spin"
          style={{ borderTopColor: accent }}
        />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-sm text-center">
          <p className="text-gray-500 text-sm">{errorMsg}</p>
        </div>
      </div>
    );
  }

  // ── App shell ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span className="font-medium text-gray-900 text-sm">
            {config?.company_name}
          </span>
          <span className="text-xs text-gray-400 tracking-wide uppercase">
            Voice Mail
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-10">

        {/* ── Idle / Recording ── */}
        {(phase === 'idle' || phase === 'recording') && (
          <div className="flex flex-col items-center gap-8">
            {/* Mic button */}
            <button
              onClick={phase === 'recording' ? stopRecording : startRecording}
              className="w-32 h-32 rounded-full flex items-center justify-center transition-transform active:scale-95 focus:outline-none"
              style={{
                backgroundColor: phase === 'recording' ? '#ef4444' : accent,
                animation: phase === 'recording' ? 'pulse 1.5s infinite' : 'none',
              }}
              aria-label={phase === 'recording' ? 'Aufnahme stoppen' : 'Aufnahme starten'}
            >
              {phase === 'recording' ? (
                // Stop icon
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                // Mic icon
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 18.93V22h2v-2.07A8.001 8.001 0 0 0 20 12h-2a6 6 0 0 1-12 0H4a8.001 8.001 0 0 0 7 7.93z" />
                </svg>
              )}
            </button>

            <p className="text-gray-500 text-center text-sm leading-relaxed">
              {phase === 'recording'
                ? (config?.is_general ? 'Listening…' : 'Sprechen Sie jetzt…')
                : (config?.is_general ? 'Tap the mic and speak.' : 'Tippen Sie auf das Mikrofon und diktieren Sie Ihre E-Mail.')}
            </p>

            {/* Live transcript */}
            {(rawText || interimText) && (
              <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-5 min-h-[120px]">
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {rawText}
                  <span className="text-gray-400">{interimText ? ' ' + interimText : ''}</span>
                </p>
              </div>
            )}

            {errorMsg && phase === 'idle' && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            {/* Action buttons — shown when there's text and not recording */}
            {rawText && phase === 'idle' && (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={refine}
                  className="flex-1 py-3 px-6 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  {config?.is_general ? 'Ask AI' : 'E-Mail formulieren'}
                </button>
                <button
                  onClick={reset}
                  className="py-3 px-6 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
                >
                  Neu starten
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Refining ── */}
        {phase === 'refining' && (
          <div className="flex flex-col items-center gap-6 py-20">
            <div
              className="w-10 h-10 rounded-full border-2 border-gray-200 animate-spin"
              style={{ borderTopColor: accent }}
            />
            <p className="text-gray-500 text-sm">Ihre E-Mail wird formuliert…</p>
          </div>
        )}

        {/* ── Preview ── */}
        {phase === 'preview' && config?.is_general ? (
          // General mode: just show the response, no email framing
          <div className="space-y-5">
            {errorMsg && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:border-transparent resize-none"
              style={{ '--tw-ring-color': accent } as any}
            />
            <div className="flex gap-3 pt-1">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-3 px-6 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
              <button
                onClick={() => { setErrorMsg(''); setPhase('idle'); }}
                className="py-3 px-6 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        ) : phase === 'preview' && (
          // Email mode: full email fields
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Ihre E-Mail</h2>
              <p className="text-xs text-gray-400">Prüfen und bearbeiten Sie vor dem Senden.</p>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                An
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
                placeholder="empfaenger@beispiel.ch"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Betreff
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
                placeholder="Betreff"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Inhalt
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:border-transparent font-mono resize-none"
                style={{ '--tw-ring-color': accent } as any}
              />
              {config?.signature && (
                <p className="mt-2 text-xs text-gray-400 whitespace-pre-wrap px-1">
                  {config.signature}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {config?.has_smtp && (
                <button
                  onClick={send}
                  disabled={!recipient.trim()}
                  className="flex-1 py-3 px-6 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: accent }}
                >
                  Senden
                </button>
              )}
              <button
                onClick={copyToClipboard}
                className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 min-w-[100px]"
              >
                {copied ? 'Kopiert ✓' : 'Kopieren'}
              </button>
              <button
                onClick={() => { setErrorMsg(''); setPhase('idle'); }}
                className="py-3 px-6 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50"
              >
                Zurück
              </button>
            </div>
          </div>
        )}

        {/* ── Sending ── */}
        {phase === 'sending' && (
          <div className="flex flex-col items-center gap-6 py-20">
            <div
              className="w-10 h-10 rounded-full border-2 border-gray-200 animate-spin"
              style={{ borderTopColor: accent }}
            />
            <p className="text-gray-500 text-sm">E-Mail wird gesendet…</p>
          </div>
        )}

        {/* ── Sent ── */}
        {phase === 'sent' && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium">E-Mail gesendet.</p>
          </div>
        )}

      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
      `}</style>
    </div>
  );
}

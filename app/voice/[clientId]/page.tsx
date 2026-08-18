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

  const [rawText, setRawText] = useState('');
  const [interimText, setInterimText] = useState('');

  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const hasSR = useRef(false);

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
        setErrorMsg('Invalid link. Contact henry@henry.marketing.');
        setPhase('error');
      });
  }, [clientId]);

  useEffect(() => {
    if (!config) return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;
    hasSR.current = true;

    const rec = new SR();
    rec.lang = config.default_language;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let finalChunk = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += t;
        else interim += t;
      }
      if (finalChunk) {
        setRawText((prev) => (prev ? prev + ' ' + finalChunk : finalChunk));
      }
      setInterimText(interim);
    };

    rec.onerror = (event: any) => {
      if (event.error === 'no-speech') return;
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access denied. Allow it in browser settings.');
        isRecordingRef.current = false;
        setPhase('idle');
      }
    };

    rec.onend = () => {
      if (isRecordingRef.current) {
        try { rec.start(); } catch {}
      } else {
        setInterimText('');
      }
    };

    recognitionRef.current = rec;
  }, [config]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    isRecordingRef.current = true;
    setInterimText('');
    try { recognitionRef.current.start(); } catch {}
    setPhase('recording');
  }, []);

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    recognitionRef.current?.stop();
    setPhase('idle');
  }, []);

  const submit = useCallback(async () => {
    // Capture interim text if recording
    let text = rawText;
    if (phase === 'recording') {
      isRecordingRef.current = false;
      recognitionRef.current?.stop();
      if (interimText) {
        text = rawText ? rawText + ' ' + interimText : interimText;
        setRawText(text);
        setInterimText('');
      }
    }
    if (!text.trim()) return;
    setPhase('refining');
    try {
      const res = await fetch('/api/voice/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, rawText: text.trim(), recipient, subject }),
      });
      if (!res.ok) throw new Error('refine_failed');
      const data = await res.json();
      setBody(data.body ?? '');
      if (data.subject) setSubject(data.subject);
      setPhase('preview');
    } catch {
      setErrorMsg('Processing failed. Please try again.');
      setPhase('idle');
    }
  }, [clientId, rawText, interimText, recipient, subject, phase]);

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
      setErrorMsg('Send failed. Check the recipient address.');
      setPhase('preview');
    }
  }, [clientId, recipient, subject, body]);

  const copyToClipboard = useCallback(async () => {
    const fullText =
      config?.is_general || !config?.signature
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
    setCopied(false);
  }, []);

  const accent = config?.accent_color ?? '#1a3a5c';
  const isGeneral = config?.is_general ?? false;

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div
          className="w-5 h-5 rounded-full border-2 border-gray-100 animate-spin"
          style={{ borderTopColor: accent }}
        />
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <p className="text-gray-400 text-sm text-center max-w-xs">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4 shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            {config?.company_name}
          </span>
          <span className="text-[11px] tracking-widest text-gray-300 uppercase">
            Voice
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 flex flex-col py-8 gap-5">

        {/* ── Spinners ── */}
        {(phase === 'refining' || phase === 'sending') && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div
              className="w-7 h-7 rounded-full border-2 border-gray-100 animate-spin"
              style={{ borderTopColor: accent }}
            />
            <p className="text-gray-400 text-sm">
              {phase === 'sending'
                ? 'Sending…'
                : isGeneral
                ? 'Thinking…'
                : 'Wird formuliert…'}
            </p>
          </div>
        )}

        {/* ── Sent ── */}
        {phase === 'sent' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Sent.</p>
          </div>
        )}

        {/* ── General preview (response card) ── */}
        {phase === 'preview' && isGeneral && (
          <>
            <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 p-5 flex flex-col">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex-1 w-full bg-transparent text-gray-800 text-sm leading-relaxed resize-none focus:outline-none min-h-[200px]"
              />
            </div>
            {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
            <div className="flex gap-2.5 shrink-0">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2.5 px-5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
              <button
                onClick={reset}
                className="py-2.5 px-5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50"
              >
                New
              </button>
            </div>
          </>
        )}

        {/* ── Email preview ── */}
        {phase === 'preview' && !isGeneral && (
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h2 className="text-base font-medium text-gray-900">Ihre E-Mail</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Prüfen und bearbeiten Sie vor dem Senden.
              </p>
            </div>
            {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                An
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
                placeholder="empfaenger@beispiel.ch"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                Betreff
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
                placeholder="Betreff"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                Inhalt
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:border-transparent font-mono resize-none min-h-[180px]"
                style={{ '--tw-ring-color': accent } as any}
              />
              {config?.signature && (
                <p className="mt-2 text-xs text-gray-400 whitespace-pre-wrap px-1">
                  {config.signature}
                </p>
              )}
            </div>
            <div className="flex gap-2.5 shrink-0">
              {config?.has_smtp && (
                <button
                  onClick={send}
                  disabled={!recipient.trim()}
                  className="flex-1 py-2.5 px-5 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ backgroundColor: accent }}
                >
                  Senden
                </button>
              )}
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2.5 px-5 rounded-xl border border-gray-200 text-gray-700 text-sm hover:bg-gray-50"
              >
                {copied ? 'Kopiert ✓' : 'Kopieren'}
              </button>
              <button
                onClick={() => { setErrorMsg(''); setPhase('idle'); }}
                className="py-2.5 px-5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50"
              >
                Zurück
              </button>
            </div>
          </div>
        )}

        {/* ── Input area (idle + recording) ── */}
        {(phase === 'idle' || phase === 'recording') && (
          <div className="flex-1 flex flex-col justify-end gap-3">
            {errorMsg && (
              <p className="text-red-400 text-xs text-center">{errorMsg}</p>
            )}

            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Textarea */}
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={7}
                placeholder={
                  isGeneral
                    ? 'Type or speak…'
                    : 'Tippen oder diktieren Sie Ihre E-Mail…'
                }
                className="w-full px-5 pt-4 pb-2 text-sm leading-relaxed text-gray-800 placeholder-gray-300 focus:outline-none resize-none"
              />

              {/* Interim text from mic */}
              {interimText && (
                <p className="px-5 pb-2 text-sm text-gray-300 italic leading-relaxed">
                  {interimText}
                </p>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/60">
                {/* Mic button */}
                <button
                  onClick={phase === 'recording' ? stopRecording : startRecording}
                  className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                    phase === 'recording'
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label={phase === 'recording' ? 'Stop recording' : 'Start recording'}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      phase === 'recording'
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-gray-300'
                    }`}
                  />
                  {phase === 'recording'
                    ? isGeneral ? 'Stop' : 'Stopp'
                    : isGeneral ? 'Dictate' : 'Diktieren'}
                </button>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                  {rawText && (
                    <button
                      onClick={reset}
                      className="text-xs text-gray-300 hover:text-gray-500 py-1.5 px-2 transition-colors"
                    >
                      {isGeneral ? 'Clear' : 'Leeren'}
                    </button>
                  )}
                  <button
                    onClick={submit}
                    disabled={!rawText.trim() && !interimText.trim()}
                    className="py-1.5 px-4 rounded-lg text-white text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-25 disabled:cursor-not-allowed"
                    style={{ backgroundColor: accent }}
                  >
                    {isGeneral ? 'Ask AI' : 'Formulieren →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

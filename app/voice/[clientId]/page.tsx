'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

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

type Message = { role: 'user' | 'assistant'; content: string };
type EmailDraft = { subject: string; body: string };
type Phase =
  | 'loading'
  | 'error'
  | 'idle'
  | 'recording'
  | 'thinking'
  | 'email-preview'
  | 'sending'
  | 'sent';

const mdComponents: Components = {
  p:          ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
  strong:     ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  em:         ({ children }) => <em className="italic">{children}</em>,
  ul:         ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
  ol:         ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
  li:         ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1:         ({ children }) => <h1 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-slate-900">{children}</h1>,
  h2:         ({ children }) => <h2 className="text-[15px] font-semibold mb-2 mt-3 first:mt-0 text-slate-900">{children}</h2>,
  h3:         ({ children }) => <h3 className="text-[15px] font-medium mb-1.5 mt-2 first:mt-0 text-slate-900">{children}</h3>,
  code:       ({ children }) => <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[13px] font-mono">{children}</code>,
  blockquote: ({ children }) => <blockquote className="border-l-2 border-slate-200 pl-3 text-slate-500 italic my-2">{children}</blockquote>,
  hr:         () => <hr className="border-slate-100 my-4" />,
};

function WaveBars({ active, color }: { active: boolean; color: string }) {
  const bars = [
    { delay: '0ms',   scaleIdle: 0.25, scalePeak: 1 },
    { delay: '120ms', scaleIdle: 0.5,  scalePeak: 0.7 },
    { delay: '60ms',  scaleIdle: 0.35, scalePeak: 0.9 },
    { delay: '180ms', scaleIdle: 0.2,  scalePeak: 0.6 },
  ];
  return (
    <span className="flex items-end gap-[2px] h-4">
      {bars.map((b, i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full transition-colors duration-300"
          style={{
            height: '16px',
            backgroundColor: active ? color : '#cbd5e1',
            transformOrigin: 'bottom',
            transform: `scaleY(${b.scaleIdle})`,
            animation: active
              ? `waveBar 0.8s ease-in-out ${b.delay} infinite alternate`
              : 'none',
          }}
        />
      ))}
    </span>
  );
}

export default function VoiceMailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;

  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [interimText, setInterimText] = useState('');

  const [draft, setDraft] = useState<EmailDraft>({ subject: '', body: '' });
  const [recipient, setRecipient] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/voice/config?clientId=${clientId}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: ClientConfig) => { setConfig(d); setPhase('idle'); })
      .catch(() => { setErrorMsg('Invalid link.'); setPhase('error'); });
  }, [clientId]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase]);

  useEffect(() => {
    if (!config) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = config.default_language;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) setInput((p) => p ? p + ' ' + final : final);
      setInterimText(interim);
    };

    rec.onerror = (e: any) => {
      if (e.error === 'no-speech') return;
      if (e.error === 'not-allowed') {
        setErrorMsg('Microphone access denied.');
        isRecordingRef.current = false;
        setPhase('idle');
      }
    };

    rec.onend = () => {
      if (isRecordingRef.current) { try { rec.start(); } catch {} }
      else setInterimText('');
    };

    recognitionRef.current = rec;
  }, [config]);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, []);

  useEffect(() => { resizeTextarea(); }, [input, interimText, resizeTextarea]);

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
    let text = input;
    if (phase === 'recording') {
      isRecordingRef.current = false;
      recognitionRef.current?.stop();
      if (interimText) text = input ? input + ' ' + interimText : interimText;
      setInterimText('');
    }
    text = text.trim();
    if (!text) return;

    const userMsg: Message = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setPhase('thinking');
    setErrorMsg('');

    try {
      const res = await fetch('/api/voice/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, rawText: text, recipient, history: messages }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || 'failed');
      }
      const data = await res.json();
      const assistantContent = data.assistantContent ?? data.body ?? '';
      setMessages([...nextMessages, { role: 'assistant', content: assistantContent }]);

      if (!config?.is_general) {
        setDraft({ subject: data.subject ?? '', body: data.body ?? '' });
        setPhase('email-preview');
      } else {
        setPhase('idle');
      }
    } catch {
      setMessages(nextMessages.slice(0, -1));
      setErrorMsg('Something went wrong. Try again.');
      setPhase('idle');
    }
  }, [clientId, input, interimText, messages, recipient, phase, config]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  }, [submit]);

  const copyText = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const send = useCallback(async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/voice/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, recipient, subject: draft.subject, body: draft.body }),
      });
      if (!res.ok) throw new Error();
      setIsSending(false);
      setPhase('sent');
      setTimeout(() => setPhase('idle'), 2500);
    } catch {
      setIsSending(false);
      setErrorMsg('Send failed. Check the recipient address.');
    }
  }, [clientId, recipient, draft]);

  const clearAll = useCallback(() => {
    setMessages([]);
    setInput('');
    setDraft({ subject: '', body: '' });
    setErrorMsg('');
    setPhase('idle');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, []);

  const accent = config?.accent_color ?? '#1a3a5c';
  const isGeneral = config?.is_general ?? false;
  const inputActive = phase === 'idle' || phase === 'recording';

  if (phase === 'loading') {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-white">
        <div className="w-4 h-4 rounded-full border border-slate-200 animate-spin" style={{ borderTopColor: accent }} />
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-white px-6">
        <p className="text-slate-400 text-sm text-center">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden">

      {/* Accent top line */}
      <div className="h-[2px] shrink-0" style={{ backgroundColor: accent }} />

      {/* Header */}
      <header className="shrink-0 px-5 py-3.5 border-b border-slate-100 bg-white">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span className="text-[15px] font-medium text-slate-900 tracking-tight">
            {config?.company_name}
          </span>
          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                New
              </button>
            )}
            <span
              className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border"
              style={{ color: accent, borderColor: accent + '33' }}
            >
              Voice
            </span>
          </div>
        </div>
      </header>

      {/* Thread */}
      <div ref={threadRef} className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-7">

          {/* Empty state */}
          {messages.length === 0 && inputActive && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 select-none">
              <p className="text-[42px] font-light text-slate-100 tracking-tight text-center leading-none">
                {config?.company_name}
              </p>
              <p className="text-[13px] text-slate-300">
                {isGeneral ? 'Type or speak anything.' : 'Diktieren oder tippen Sie Ihre E-Mail.'}
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col gap-1.5 msg-in ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-300 px-0.5">
                {msg.role === 'user' ? 'You' : (config?.company_name?.split(' ')[0] ?? 'AI')}
              </span>
              {msg.role === 'user' ? (
                <div className="max-w-[82%] bg-slate-100 rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-[15px] text-slate-800 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <div className="w-full">
                  <div className="text-[15px] text-slate-800">
                    <ReactMarkdown components={mdComponents}>{msg.content}</ReactMarkdown>
                  </div>
                  <button
                    onClick={() => copyText(msg.content, String(i))}
                    className="mt-1.5 text-[11px] text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {copied === String(i) ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Thinking */}
          {phase === 'thinking' && (
            <div className="flex flex-col items-start gap-1.5 msg-in">
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-300 px-0.5">
                {config?.company_name?.split(' ')[0] ?? 'AI'}
              </span>
              <div className="flex items-center gap-1.5 py-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ backgroundColor: accent, opacity: 0.45, animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Email draft card */}
          {phase === 'email-preview' && !isGeneral && (
            <div className="border border-slate-100 rounded-2xl overflow-hidden msg-in">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-medium">Draft</span>
                <button
                  onClick={() => { setPhase('idle'); setErrorMsg(''); }}
                  className="text-slate-300 hover:text-slate-500 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1.5">To</label>
                  <input
                    type="email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:border-transparent transition-shadow"
                    style={{ '--tw-ring-color': accent } as any}
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={draft.subject}
                    onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[15px] focus:outline-none focus:ring-1 focus:border-transparent transition-shadow"
                    style={{ '--tw-ring-color': accent } as any}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1.5">Body</label>
                  <textarea
                    value={draft.body}
                    onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                    rows={8}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-[15px] leading-relaxed focus:outline-none focus:ring-1 focus:border-transparent font-mono resize-none transition-shadow"
                    style={{ '--tw-ring-color': accent } as any}
                  />
                  {config?.signature && (
                    <p className="mt-2 text-xs text-slate-400 whitespace-pre-wrap px-0.5 leading-relaxed">
                      {config.signature}
                    </p>
                  )}
                </div>
                {errorMsg && <p className="text-red-400 text-[13px]">{errorMsg}</p>}
              </div>
              <div className="px-5 py-4 border-t border-slate-100 flex gap-2.5">
                {config?.has_smtp && (
                  <button
                    onClick={send}
                    disabled={!recipient.trim() || isSending}
                    className="flex-1 min-h-[44px] rounded-xl text-white text-[14px] font-medium transition-opacity hover:opacity-90 disabled:opacity-30"
                    style={{ backgroundColor: accent }}
                  >
                    {isSending ? 'Sending…' : 'Send'}
                  </button>
                )}
                <button
                  onClick={() => copyText(`${draft.body}\n\n${config?.signature ?? ''}`, 'draft')}
                  className="flex-1 min-h-[44px] rounded-xl border border-slate-200 text-slate-600 text-[14px] hover:bg-slate-50 transition-colors"
                >
                  {copied === 'draft' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Sent confirmation */}
          {phase === 'sent' && (
            <div className="flex items-center gap-2.5 msg-in">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[14px] text-slate-400">Sent.</p>
            </div>
          )}

        </div>
      </div>

      {/* Input */}
      {inputActive && (
        <div
          className="shrink-0 px-4 pt-3 bg-white border-t border-slate-100"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-xl mx-auto">
            {errorMsg && inputActive && (
              <p className="text-red-400 text-[12px] mb-2 px-1">{errorMsg}</p>
            )}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:shadow-md focus-within:border-slate-300 transition-all bg-white">
              <textarea
                ref={textareaRef}
                value={input + (interimText ? (input ? ' ' : '') + interimText : '')}
                onChange={(e) => {
                  const withoutInterim = interimText
                    ? e.target.value.replace(
                        new RegExp('\\s?' + interimText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'),
                        ''
                      )
                    : e.target.value;
                  setInput(withoutInterim);
                }}
                onInput={resizeTextarea}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={isGeneral ? 'Type or speak… (Enter to send)' : 'Tippen oder diktieren… (Enter zum Senden)'}
                className="w-full px-5 pt-4 pb-2 text-[16px] leading-relaxed text-slate-800 placeholder-slate-300 focus:outline-none resize-none overflow-y-auto bg-transparent"
                style={{ maxHeight: '160px' }}
              />
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/60 border-t border-slate-100">
                {/* Waveform mic button */}
                <button
                  onClick={phase === 'recording' ? stopRecording : startRecording}
                  className={`flex items-center gap-2.5 py-2 px-3 rounded-xl text-[13px] font-medium transition-colors min-h-[44px] ${
                    phase === 'recording'
                      ? 'text-red-500 bg-red-50/80'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <WaveBars active={phase === 'recording'} color={phase === 'recording' ? '#ef4444' : accent} />
                  <span className="text-[12px]">
                    {phase === 'recording'
                      ? (isGeneral ? 'Stop' : 'Stopp')
                      : (isGeneral ? 'Dictate' : 'Diktieren')}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {input && (
                    <button
                      onClick={() => { setInput(''); setInterimText(''); if (textareaRef.current) textareaRef.current.style.height = 'auto'; }}
                      className="text-[12px] text-slate-300 hover:text-slate-500 transition-colors py-2 px-2 min-h-[44px]"
                    >
                      {isGeneral ? 'Clear' : 'Leeren'}
                    </button>
                  )}
                  <button
                    onClick={submit}
                    disabled={!input.trim() && !interimText.trim()}
                    className="min-h-[44px] py-2 px-5 rounded-xl text-white text-[13px] font-medium transition-opacity hover:opacity-90 disabled:opacity-25 disabled:cursor-not-allowed"
                    style={{ backgroundColor: accent }}
                  >
                    {isGeneral ? 'Send' : 'Senden →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes waveBar {
          0%   { transform: scaleY(0.2); }
          100% { transform: scaleY(1); }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msg-in {
          animation: msgIn 0.22s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

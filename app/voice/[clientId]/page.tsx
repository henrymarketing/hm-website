'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

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

export default function VoiceMailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;

  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  // Chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [interimText, setInterimText] = useState('');

  // Email draft (non-general mode)
  const [draft, setDraft] = useState<EmailDraft>({ subject: '', body: '' });
  const [recipient, setRecipient] = useState('');
  const [copied, setCopied] = useState<string | null>(null); // message index or 'draft'

  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/voice/config?clientId=${clientId}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: ClientConfig) => { setConfig(d); setPhase('idle'); })
      .catch(() => { setErrorMsg('Invalid link.'); setPhase('error'); });
  }, [clientId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase]);

  // Speech recognition
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
      if (interimText) { text = input ? input + ' ' + interimText : interimText; }
      setInterimText('');
    }
    text = text.trim();
    if (!text) return;

    const userMsg: Message = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setPhase('thinking');
    setErrorMsg('');

    try {
      const res = await fetch('/api/voice/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          rawText: text,
          recipient,
          history: messages, // send prior turns
        }),
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
    } catch (e: any) {
      setMessages(nextMessages.slice(0, -1)); // remove optimistic user msg
      setErrorMsg('Something went wrong. Try again.');
      setPhase('idle');
    }
  }, [clientId, input, interimText, messages, recipient, phase, config]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }, [submit]);

  const copyText = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const send = useCallback(async () => {
    setPhase('sending');
    try {
      const res = await fetch('/api/voice/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, recipient, subject: draft.subject, body: draft.body }),
      });
      if (!res.ok) throw new Error();
      setPhase('sent');
      setTimeout(() => setPhase('idle'), 2500);
    } catch {
      setErrorMsg('Send failed. Check the recipient address.');
      setPhase('email-preview');
    }
  }, [clientId, recipient, draft]);

  const accent = config?.accent_color ?? '#1a3a5c';
  const isGeneral = config?.is_general ?? false;

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-4 h-4 rounded-full border border-gray-200 animate-spin" style={{ borderTopColor: accent }} />
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <p className="text-gray-400 text-sm text-center">{errorMsg}</p>
      </div>
    );
  }

  const inputActive = phase === 'idle' || phase === 'recording';

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <header className="shrink-0 px-6 py-4 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 tracking-tight">
            {config?.company_name}
          </span>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={() => { setMessages([]); setInput(''); setDraft({ subject: '', body: '' }); setErrorMsg(''); setPhase('idle'); }}
                className="text-[11px] text-gray-300 hover:text-gray-500 transition-colors"
              >
                Clear
              </button>
            )}
            <span className="text-[11px] tracking-widest text-gray-300 uppercase">Voice</span>
          </div>
        </div>
      </header>

      {/* Thread */}
      <div
        ref={threadRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-8">

          {/* Empty state */}
          {messages.length === 0 && inputActive && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-gray-200 text-sm">
                {isGeneral ? 'Type or speak anything.' : 'Diktieren oder tippen Sie Ihre E-Mail.'}
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] uppercase tracking-widest text-gray-300 px-1">
                {msg.role === 'user' ? 'You' : (config?.company_name?.split(' ')[0] ?? 'AI')}
              </span>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] bg-gray-50 border border-gray-100 rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <div className="w-full group">
                  <div className="prose prose-sm prose-gray max-w-none text-gray-800 leading-relaxed
                    prose-p:my-2 prose-headings:font-medium prose-headings:text-gray-900
                    prose-strong:font-semibold prose-strong:text-gray-900
                    prose-ul:my-2 prose-li:my-0.5 prose-code:text-gray-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  <button
                    onClick={() => copyText(msg.content, String(i))}
                    className="mt-2 text-[11px] text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {copied === String(i) ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {phase === 'thinking' && (
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-300 px-1">
                {config?.company_name?.split(' ')[0] ?? 'AI'}
              </span>
              <div className="flex items-center gap-1.5 py-2 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Email preview (non-general) */}
          {phase === 'email-preview' && !isGeneral && (
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Draft</p>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-semibold">To</label>
                  <input
                    type="email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-transparent"
                    style={{ '--tw-ring-color': accent } as any}
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-semibold">Subject</label>
                  <input
                    type="text"
                    value={draft.subject}
                    onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-transparent"
                    style={{ '--tw-ring-color': accent } as any}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-semibold">Body</label>
                  <textarea
                    value={draft.body}
                    onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-1 focus:border-transparent font-mono resize-none"
                    style={{ '--tw-ring-color': accent } as any}
                  />
                  {config?.signature && (
                    <p className="mt-2 text-xs text-gray-400 whitespace-pre-wrap px-0.5">{config.signature}</p>
                  )}
                </div>
                {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
              </div>
              <div className="px-5 py-4 border-t border-gray-100 flex gap-2.5">
                {config?.has_smtp && (
                  <button
                    onClick={send}
                    disabled={!recipient.trim()}
                    className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-30"
                    style={{ backgroundColor: accent }}
                  >
                    Send
                  </button>
                )}
                <button
                  onClick={() => copyText(`${draft.body}\n\n${config?.signature ?? ''}`, 'draft')}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                >
                  {copied === 'draft' ? 'Copied ✓' : 'Copy'}
                </button>
                <button
                  onClick={() => { setPhase('idle'); setErrorMsg(''); }}
                  className="py-2.5 px-4 rounded-lg border border-gray-200 text-gray-400 text-sm hover:bg-gray-50 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Sent */}
          {phase === 'sent' && (
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">Sent.</p>
            </div>
          )}

        </div>
      </div>

      {/* Input */}
      {inputActive && (
        <div className="shrink-0 px-6 pb-6 pt-2 border-t border-gray-100 bg-white">
          <div className="max-w-2xl mx-auto">
            {errorMsg && (
              <p className="text-red-400 text-xs mb-2 px-1">{errorMsg}</p>
            )}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-gray-300 transition-colors">
              <textarea
                value={input + (interimText ? (input ? ' ' : '') + interimText : '')}
                onChange={(e) => {
                  // strip interim from end for clean editing
                  const withoutInterim = interimText
                    ? e.target.value.replace(new RegExp('\\s?' + interimText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), '')
                    : e.target.value;
                  setInput(withoutInterim);
                }}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder={isGeneral ? 'Type or speak… (Enter to send)' : 'Tippen oder diktieren… (Enter zum Senden)'}
                className="w-full px-5 pt-4 pb-2 text-sm leading-relaxed text-gray-800 placeholder-gray-300 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/60 border-t border-gray-100">
                <button
                  onClick={phase === 'recording' ? stopRecording : startRecording}
                  className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                    phase === 'recording'
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    phase === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
                  }`} />
                  {phase === 'recording'
                    ? (isGeneral ? 'Stop' : 'Stopp')
                    : (isGeneral ? 'Dictate' : 'Diktieren')}
                </button>
                <div className="flex items-center gap-2">
                  {input && (
                    <button onClick={() => { setInput(''); setInterimText(''); }} className="text-xs text-gray-300 hover:text-gray-500 py-1.5 px-2 transition-colors">
                      {isGeneral ? 'Clear' : 'Leeren'}
                    </button>
                  )}
                  <button
                    onClick={submit}
                    disabled={!input.trim() && !interimText.trim()}
                    className="py-1.5 px-4 rounded-lg text-white text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-25 disabled:cursor-not-allowed"
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

    </div>
  );
}

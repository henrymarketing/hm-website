export type VoiceClientConfig = {
  company_name: string;
  contact_name: string;
  from_email: string;
  from_name: string;
  // SMTP fields are optional — omit to disable sending (draft + copy only)
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password_env?: string;
  business_type: string;
  services: string;
  tone_description: string;
  signature: string;
  accent_color: string;
  // Web Speech API lang — empty string = browser default (good for multilingual use)
  default_language: string;
  voice_examples?: string;
  // Replaces the entire AI system prompt when set — use for non-business / general use
  system_prompt_override?: string;
  // Open-ended AI assistant mode — no email framing, just speak and get a response
  general?: boolean;
};

export const voiceClients: Record<string, VoiceClientConfig> = {
  dimitria: {
    company_name: 'Dimitria Barrows',
    contact_name: 'Dimitria Barrows',
    from_email: '',
    from_name: 'Dimitria Barrows',
    business_type: 'Privat',
    services: '',
    tone_description: '',
    signature: 'Dimitria',
    accent_color: '#7c3aed',
    default_language: '', // browser default — works for any language
    general: true,
    system_prompt_override: `You are a helpful AI assistant. The user will speak in any language — always respond in the same language they use. Help with whatever they need: writing, editing, answering questions, translating, summarising, brainstorming, or anything else. Keep your response clear and natural. Do not add email subject lines or email formatting unless the user explicitly asks for an email.`,
  },
  pietrobon: {
    company_name: 'Pietrobon & Michel',
    contact_name: 'Pietrobon & Michel',
    from_email: 'labor@pietrobonundmichel.ch',
    from_name: 'Pietrobon & Michel',
    // No SMTP — client uses Plesk, configure later
    business_type: 'Dentallabor',
    services: 'Zahntechnische Laborarbeiten, Zahnersatz, Kronen, Brücken, Implantate, Ästhetik',
    tone_description:
      'Professionell, präzise, diskret. Schweizer Hochdeutsch. Sie-Form. Dem Standort Bahnhofstrasse Zürich entsprechend: höchster Anspruch, zurückhaltend präsentiert.',
    signature:
      'Mit freundlichen Grüssen\nPietrobon & Michel\nDentallabor\nBahnhofstrasse, 8001 Zürich',
    accent_color: '#1e2d4a',
    default_language: 'de-CH',
  },
};

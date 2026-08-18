import { NextResponse } from 'next/server';
import { voiceClients } from '@/lib/voiceClients';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });
  }

  const client = voiceClients[clientId];
  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  // Return only what the frontend needs — no SMTP credentials
  return NextResponse.json({
    company_name: client.company_name,
    from_name: client.from_name,
    from_email: client.from_email,
    accent_color: client.accent_color,
    default_language: client.default_language,
    signature: client.signature,
    has_smtp: Boolean(client.smtp_host && client.smtp_password_env),
    is_general: Boolean(client.general),
  });
}

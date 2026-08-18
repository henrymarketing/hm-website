import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const TO = 'henry@henry.marketing';
const FROM = process.env.RESEND_FROM || 'henry.marketing <onboarding@resend.dev>';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const message = String(body?.message || '').trim();

    if (!name || name.length > 200) {
      return NextResponse.json(
        { ok: false, error: 'invalid_name' },
        { status: 400 }
      );
    }
    if (!email || !isValidEmail(email) || email.length > 320) {
      return NextResponse.json(
        { ok: false, error: 'invalid_email' },
        { status: 400 }
      );
    }
    if (!message || message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: 'invalid_message' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[contact] RESEND_API_KEY is not set');
      return NextResponse.json(
        { ok: false, error: 'missing_api_key' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `Projektanfrage von ${name}`,
      text: [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        '',
        'Nachricht:',
        message,
      ].join('\n'),
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json(
        { ok: false, error: error.message || 'resend_error' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'unexpected_error',
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { voiceClients } from '@/lib/voiceClients';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const { clientId, recipient, subject, body } = await request.json();

    const client = voiceClients[clientId];
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (!recipient || !isValidEmail(recipient)) {
      return NextResponse.json(
        { error: 'Invalid recipient email' },
        { status: 400 }
      );
    }
    if (!body || body.trim().length < 5) {
      return NextResponse.json({ error: 'Body too short' }, { status: 400 });
    }

    if (!client.smtp_host || !client.smtp_password_env) {
      return NextResponse.json(
        { error: 'SMTP not configured for this client' },
        { status: 501 }
      );
    }

    const smtpPassword = process.env[client.smtp_password_env];
    if (!smtpPassword) {
      console.error(
        `[voice/send] Missing env var: ${client.smtp_password_env}`
      );
      return NextResponse.json(
        { error: 'SMTP not configured' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: client.smtp_host,
      port: client.smtp_port ?? 587,
      secure: client.smtp_port === 465,
      auth: {
        user: client.smtp_username,
        pass: smtpPassword,
      },
    });

    const fullBody = `${body.trim()}\n\n${client.signature}`;

    await transporter.sendMail({
      from: `"${client.from_name}" <${client.from_email}>`,
      to: recipient,
      subject: subject || '(Kein Betreff)',
      text: fullBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[voice/send] Error:', err);
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}

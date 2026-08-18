import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.VENICE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'No VENICE_API_KEY' }, { status: 500 });
  }

  const res = await fetch('https://api.venice.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}

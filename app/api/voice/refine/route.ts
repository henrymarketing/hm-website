import { NextResponse } from 'next/server';
import { voiceClients } from '@/lib/voiceClients';

function buildPrompt(
  client: (typeof voiceClients)[string],
  recipient: string,
  subject: string
): string {
  const examplesBlock = client.voice_examples
    ? `## BISHERIGE E-MAIL-BEISPIELE (zur Orientierung am Stil)\n${client.voice_examples}\n\n`
    : '';

  const recipientHint = recipient
    ? `\nEmpfänger (falls im Diktat erwähnt): ${recipient}`
    : '';
  const subjectHint = subject
    ? `\nBetreff (falls bereits bekannt): ${subject}`
    : '';

  return `Du bist der E-Mail-Assistent von ${client.company_name}.

## UNTERNEHMEN
Branche: ${client.business_type}
Dienstleistungen: ${client.services}

## STIMME & TON
${client.tone_description}

## STILREGELN — STRIKT EINZUHALTEN
1. Schweizer Hochdeutsch. Kein ß — immer ss. "Gruss" nicht "Gruß". "Strasse" nicht "Straße".
2. Immer Sie-Form. Niemals du.
3. Beträge in CHF mit Apostroph als Tausendertrennzeichen: CHF 1'200.
4. Klar und konkret. Keine leeren Höflichkeitsfloskeln.
5. Nur formulieren, was im Diktat enthalten ist. Nichts erfinden, nichts hinzufügen.
6. Keine Versprechen, Rabatte oder Zusagen, die nicht explizit diktiert wurden.
7. Signatur NICHT einfügen — sie wird automatisch angehängt.

${examplesBlock}## AUFGABE
Der Benutzer hat eine E-Mail diktiert. Das Diktat kann auf Schweizerdeutsch sein, fragmentiert oder umgangssprachlich. Formuliere daraus eine professionelle E-Mail in Schweizer Hochdeutsch. Behalte alle Inhalte bei, füge nichts hinzu.

Extrahiere den Betreff aus dem Diktat, falls vorhanden.${recipientHint}${subjectHint}

## ANTWORTFORMAT — GENAU SO:
BETREFF: [Betreff]
---
[E-Mail-Text ohne Signatur]`;
}

function parseResponse(
  content: string,
  existingSubject: string
): { subject: string; body: string } {
  // Accept both SUBJECT: (English prompt) and BETREFF: (German prompt)
  const subjectMatch = content.match(/^(?:SUBJECT|BETREFF):\s*(.+)$/m);
  const subject = subjectMatch ? subjectMatch[1].trim() : existingSubject;
  const body = content
    .replace(/^(?:SUBJECT|BETREFF):\s*.+\n?-{3,}\n?/m, '')
    .trim();
  return { subject, body };
}

export async function POST(request: Request) {
  try {
    const { clientId, rawText, recipient = '', subject = '' } =
      await request.json();

    const client = voiceClients[clientId];
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (!rawText || rawText.trim().length < 5) {
      return NextResponse.json({ error: 'Dictation too short' }, { status: 400 });
    }

    const apiKey = process.env.VENICE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Venice API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = client.system_prompt_override ?? buildPrompt(client, recipient, subject);

    const veniceRes = await fetch(
      'https://api.venice.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'glm-5.2',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: rawText.trim() },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      }
    );

    if (!veniceRes.ok) {
      const err = await veniceRes.text();
      console.error('[voice/refine] Venice error:', err);
      return NextResponse.json(
        { error: 'AI refinement failed' },
        { status: 502 }
      );
    }

    const veniceData = await veniceRes.json();
    const content: string =
      veniceData.choices?.[0]?.message?.content ?? '';

    const parsed = parseResponse(content, subject);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[voice/refine] Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

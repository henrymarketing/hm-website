import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Voice tool routes bypass i18n entirely
  if (pathname.startsWith('/voice')) {
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';

  // Domain alias redirects — must be configured as custom domains on Vercel
  if (host === 'henry.media' || host === 'www.henry.media') {
    return NextResponse.redirect('https://henry.marketing/de/services#media', {
      status: 301,
    });
  }

  if (host === 'henry.technology' || host === 'www.henry.technology') {
    return NextResponse.redirect(
      'https://henry.marketing/de/services#technology',
      { status: 301 }
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieNotice from '@/components/CookieNotice';
import JsonLd from '@/components/JsonLd';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'henry.marketing',
  url: 'https://henry.marketing',
  telephone: '+41791752020',
  email: 'henry@henry.marketing',
  founder: { '@type': 'Person', name: 'Henry Barrows' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Zug',
    addressRegion: 'ZG',
    addressCountry: 'CH',
  },
  areaServed: { '@type': 'Country', name: 'Switzerland' },
  availableLanguage: ['de', 'en'],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://henry.marketing'),
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  other: {
    'geo.position': '47.1661;8.5158',
    'geo.region': 'CH-ZG',
    'geo.placename': 'Zug, Switzerland',
    ICBM: '47.1661, 8.5158',
  },
};

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  if (!routing.locales.includes(locale as 'de' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-[#0a0a0a] text-white font-sans antialiased">
        <JsonLd data={jsonLd} />
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="pt-16">{children}</main>
          <Footer locale={locale} />
          <CookieNotice />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

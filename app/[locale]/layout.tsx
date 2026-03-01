import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import JsonLd from '@/components/JsonLd';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const BASE_URL = 'https://henry.marketing';

const jsonLdProfessionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#organization`,
  name: 'henry.marketing',
  url: BASE_URL,
  telephone: '+41791752020',
  email: 'henry@henry.marketing',
  image: `${BASE_URL}/logo/henry-logo-2026-gray-og-dark.png`,
  founder: { '@type': 'Person', name: 'Henry Barrows' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Zug',
    addressRegion: 'ZG',
    addressCountry: 'CH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 47.1661,
    longitude: 8.5158,
  },
  areaServed: { '@type': 'Country', name: 'Switzerland' },
  availableLanguage: ['de', 'en'],
  priceRange: 'CHF 1500+',
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'henry.marketing',
  url: BASE_URL,
  publisher: { '@id': `${BASE_URL}/#organization` },
};

const jsonLdPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Henry Barrows',
  jobTitle: 'Marketer, Designer, Technologist',
  url: `${BASE_URL}/en/about`,
  worksFor: {
    '@type': 'ProfessionalService',
    name: 'henry.marketing',
    url: BASE_URL,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://henry.marketing'),
  icons: { icon: '/logo/favicon.ico' },
  openGraph: {
    images: [{ url: '/logo/henry-logo-2026-gray-og-dark.png', width: 1200, height: 630, alt: 'henry.marketing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'henry.marketing',
    description: 'One partner. Everything digital. Website, marketing, design, AI, media.',
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
        <JsonLd data={jsonLdProfessionalService} />
        <JsonLd data={jsonLdWebSite} />
        <JsonLd data={jsonLdPerson} />
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="pt-16">{children}</main>
          <Footer locale={locale} />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

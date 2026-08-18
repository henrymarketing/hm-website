import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import ContactForm from '@/components/ContactForm';

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isDE = locale === 'de';
  const title = isDE ? 'Kontakt — henry.marketing' : 'Contact — henry.marketing';
  const description = isDE
    ? 'Erzählen Sie mir von Ihrem Projekt. Antwort innerhalb eines Werktags. henry@henry.marketing · 079 175 20 20'
    : 'Tell me about your project. Reply within one business day. henry@henry.marketing · 079 175 20 20';

  return {
    title,
    description,
    alternates: {
      canonical: isDE ? '/de/kontakt' : '/en/contact',
      languages: {
        de: '/de/kontakt',
        en: '/en/contact',
        'x-default': '/de/kontakt',
      },
    },
    openGraph: {
      title,
      description,
      locale: isDE ? 'de_CH' : 'en_US',
      type: 'website',
      images: [{ url: '/og/default.png', width: 1200, height: 630, alt: title }],
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default function ContactPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = useTranslations('contact');

  return (
    <section className="py-24 md:py-36 px-6 max-w-6xl mx-auto">
      <AnimateOnScroll>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.05] mb-8">
          {t('h2')}
        </h1>
        <p className="text-xl text-neutral-400 max-w-xl leading-relaxed mb-14">{t('p')}</p>
      </AnimateOnScroll>
      <ContactForm />
    </section>
  );
}

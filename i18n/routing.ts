import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  pathnames: {
    '/': '/',
    '/services': '/services',
    '/about': {
      de: '/ueber',
      en: '/about',
    },
    '/contact': {
      de: '/kontakt',
      en: '/contact',
    },
    '/impressum': '/impressum',
    '/faq': '/faq',
  },
});

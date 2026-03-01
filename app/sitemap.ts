import { MetadataRoute } from 'next';

const BASE = 'https://henry.marketing';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Homepages
    {
      url: `${BASE}/de`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          de: `${BASE}/de`,
          en: `${BASE}/en`,
          'x-default': `${BASE}/de`,
        },
      },
    },
    // Services
    {
      url: `${BASE}/de/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          de: `${BASE}/de/services`,
          en: `${BASE}/en/services`,
          'x-default': `${BASE}/de/services`,
        },
      },
    },
    // About
    {
      url: `${BASE}/de/ueber`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          de: `${BASE}/de/ueber`,
          en: `${BASE}/en/about`,
          'x-default': `${BASE}/de/ueber`,
        },
      },
    },
    // Contact
    {
      url: `${BASE}/de/kontakt`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
      alternates: {
        languages: {
          de: `${BASE}/de/kontakt`,
          en: `${BASE}/en/contact`,
          'x-default': `${BASE}/de/kontakt`,
        },
      },
    },
    // Impressum
    {
      url: `${BASE}/de/impressum`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE}/de/impressum`,
          en: `${BASE}/en/impressum`,
          'x-default': `${BASE}/de/impressum`,
        },
      },
    },
    // FAQ
    {
      url: `${BASE}/de/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          de: `${BASE}/de/faq`,
          en: `${BASE}/en/faq`,
          'x-default': `${BASE}/de/faq`,
        },
      },
    },
  ];
}

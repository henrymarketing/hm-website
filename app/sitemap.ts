import { MetadataRoute } from 'next';

const BASE = 'https://henry.marketing';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
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
    {
      url: `${BASE}/de/work`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          de: `${BASE}/de/work`,
          en: `${BASE}/en/work`,
          'x-default': `${BASE}/de/work`,
        },
      },
    },
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
  ];
}

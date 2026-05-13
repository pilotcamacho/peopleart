import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.peopleart.co';
const LOCALES = ['en', 'es'];

const PUBLIC_PAGES = [
  '',
  '/methodology',
  '/about',
  '/team',
  '/rd',
  '/ecosystem',
  '/investors',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of PUBLIC_PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8,
      });
    }
  }

  return entries;
}

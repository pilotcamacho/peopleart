import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
      '/en/investors/data-room',
      '/es/investors/data-room',
      '/en/auth/',
      '/es/auth/',
    ],
    },
    sitemap: 'https://www.peopleart.co/sitemap.xml',
  };
}

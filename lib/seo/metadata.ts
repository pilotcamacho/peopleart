import type { Metadata } from 'next';

const BASE = 'https://www.peopleart.co';

export function buildPageMetadata(
  locale: string,
  path: string,
  overrides: Partial<Metadata> = {},
): Metadata {
  const canonical = `${BASE}/${locale}${path}`;
  return {
    alternates: {
      canonical,
      languages: {
        'x-default': `${BASE}/en${path}`,
        en: `${BASE}/en${path}`,
        es: `${BASE}/es${path}`,
      },
    },
    ...overrides,
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_AU',
      url: canonical,
      ...(overrides.openGraph ?? {}),
    },
  };
}

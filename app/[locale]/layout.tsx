import { resolveLocale } from '@/lib/i18n/getTranslations';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  resolveLocale(locale);
  return <>{children}</>;
}

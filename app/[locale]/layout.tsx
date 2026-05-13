import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
  const resolvedLocale = resolveLocale(locale);
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={resolvedLocale} />
      <div className="flex-1">{children}</div>
      <Footer locale={resolvedLocale} />
    </div>
  );
}

import { Geist, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { resolveLocale } from '@/lib/i18n/getTranslations';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

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
    <html
      lang={resolvedLocale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Header locale={resolvedLocale} />
          <div className="flex-1">{children}</div>
          <Footer locale={resolvedLocale} />
        </div>
      </body>
    </html>
  );
}

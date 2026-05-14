import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, resolveLocale } from '@/lib/i18n/getTranslations';
import { ContactForm, type ContactStrings } from '@/components/contact/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(resolveLocale(locale), 'contact');
  const meta = t.meta as { title: string; description: string };
  return { title: meta.title, description: meta.description };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const raw = await getTranslations(resolvedLocale, 'contact');

  // Cast to typed shape — we own these JSON files so the cast is safe
  const strings = raw as unknown as ContactStrings & {
    title: string;
    subtitle: string;
    meta: { title: string; description: string };
  };

  return (
    <main>
      {/* Page header */}
      <section className="bg-brand-ink px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-5xl font-bold text-brand-cream sm:text-6xl">
            {strings.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-300">{strings.subtitle}</p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <Suspense>
          <ContactForm strings={strings} locale={resolvedLocale} />
        </Suspense>
      </section>
    </main>
  );
}

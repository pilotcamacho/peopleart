import type { Metadata } from 'next';
import { getTranslations, resolveLocale } from '@/lib/i18n/getTranslations';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'privacy');
  const meta = t.meta as { title: string; description: string };
  return buildPageMetadata(resolvedLocale, '/privacy', {
    title: meta.title,
    description: meta.description,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'privacy');

  type Section = { heading: string; body: string };

  const title = t.title as string;
  const lastUpdated = t.lastUpdated as string;
  const intro = t.intro as string;
  const sections = t.sections as Section[];

  return (
    <main>
      {/* Page header */}
      <section className="bg-brand-ink px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Peopleart Pty Ltd
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-brand-cream sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-gray-400">{lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-brand-cream px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="mb-12 text-lg leading-relaxed text-brand-slate">{intro}</p>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-serif text-xl font-bold text-brand-ink">{section.heading}</h2>
                <p className="mt-3 leading-relaxed text-brand-slate">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/getTranslations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = resolveLocale(locale) === 'es';
  return {
    title: isEs ? 'PeopleArt — Vive la Belleza' : 'PeopleArt — Live Beauty',
    description: isEs
      ? 'PeopleArt transforma cómo operan las empresas, tratando la interacción humana como una disciplina artística.'
      : 'PeopleArt transforms how enterprises operate by treating human interaction as an artistic discipline.',
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 py-24 text-center">
      <h1 className="font-serif text-5xl font-bold tracking-tight text-brand-ink">
        People<span className="text-brand-gold">Art</span>
      </h1>
      <p className="mt-4 text-xl text-brand-slate">
        {resolvedLocale === 'es' ? 'Vive la Belleza' : 'Live Beauty'}
      </p>
      <p className="mt-8 max-w-md text-brand-slate">
        {resolvedLocale === 'es'
          ? 'Portal en construcción — Fase 0 completada.'
          : 'Portal under construction — Phase 0 complete.'}
      </p>
    </main>
  );
}

import type { Metadata } from 'next';
import { getTranslations, resolveLocale } from '@/lib/i18n/getTranslations';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetricCard } from '@/components/ui/MetricCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(resolveLocale(locale), 'investors');
  const meta = t.meta as { title: string; description: string };
  return { title: meta.title, description: meta.description };
}

export default async function InvestorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'investors');

  type Hero = { preTitle: string; title: string; subtitle: string };
  type Pillar = { title: string; body: string };
  type Pillars = { title: string; items: Pillar[] };
  type MetricItem = { value: string; label: string };
  type Metrics = { title: string; items: MetricItem[] };
  type DataRoom = { title: string; subtitle: string; cta: string; note: string };
  type Contact = { title: string; body: string; cta: string };

  const hero = t.hero as Hero;
  const thesis = t.thesis as { title: string; body: string };
  const pillars = t.pillars as Pillars;
  const metrics = t.metrics as Metrics;
  const dataRoom = t.dataRoom as DataRoom;
  const contact = t.contact as Contact;

  const pillarIcons = [
    /* enterprise */ (
      <svg key="e" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    /* saas */ (
      <svg key="s" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    /* ip */ (
      <svg key="i" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  ];

  return (
    <main>
      {/* Hero */}
      <section className="bg-brand-ink px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {hero.preTitle}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-brand-cream sm:text-6xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Investment thesis */}
      <section className="bg-brand-cream px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title={thesis.title} center />
          <p className="mt-6 text-lg leading-relaxed text-brand-slate">{thesis.body}</p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHeader title={pillars.title} center className="mb-12" />
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.items.map((pillar, i) => (
              <div key={pillar.title} className="rounded-xl border border-brand-warm bg-white p-7">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                  {pillarIcons[i]}
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-ink">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-brand-slate">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader title={metrics.title} center className="mb-10" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.items.map((item) => (
              <MetricCard key={item.label} value={item.value} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Data Room CTA */}
      <section className="bg-brand-ink px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/20">
            <svg className="h-7 w-7 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl font-bold text-brand-cream sm:text-4xl">
            {dataRoom.title}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-gray-300">
            {dataRoom.subtitle}
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              href={`/${resolvedLocale}/investors/data-room`}
            >
              {dataRoom.cta}
            </Button>
          </div>
          <p className="mt-5 text-sm text-gray-400">{dataRoom.note}</p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeader title={contact.title} center />
          <p className="mt-5 text-lg leading-relaxed text-brand-slate">{contact.body}</p>
          <div className="mt-8">
            <Button
              href={`/${resolvedLocale}/contact?type=investor`}
              variant="secondary"
            >
              {contact.cta}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

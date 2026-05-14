import type { Metadata } from 'next';
import { getTranslations, resolveLocale } from '@/lib/i18n/getTranslations';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArchetypeCard } from '@/components/methodology/ArchetypeCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { ARCHETYPE_KEYS, ARCHETYPE_VISUALS } from '@/lib/data/archetypes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'home');
  const meta = t.meta as { title?: string; description?: string } | undefined;
  const hero = t.hero as { title: string; subtitle: string };
  const isEs = resolvedLocale === 'es';
  return {
    title: meta?.title ?? hero.title,
    description: meta?.description ?? hero.subtitle,
    alternates: {
      canonical: `https://www.peopleart.co/${resolvedLocale}`,
      languages: {
        en: 'https://www.peopleart.co/en',
        es: 'https://www.peopleart.co/es',
      },
    },
    openGraph: {
      title: isEs ? 'PeopleArt — ¡Vive la Belleza!' : 'PeopleArt — Live Beauty',
      description: meta?.description ?? hero.subtitle,
      type: 'website',
      locale: isEs ? 'es_ES' : 'en_AU',
      url: `https://www.peopleart.co/${resolvedLocale}`,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'home');
  const mt = await getTranslations(resolvedLocale, 'methodology');

  type Hero = { preTitle: string; title: string; subtitle: string; cta1: string; cta2: string };
  type Concept = { title: string; body: string };
  type ArchetypeSection = { title: string; subtitle: string; cta: string };
  type Science = { title: string; body: string; cta: string };
  type MetricItem = { value: string; label: string };
  type Metrics = { items: MetricItem[] };
  type FinalCta = { title: string; enterprise: string; investor: string };

  const hero = t.hero as Hero;
  const concept = t.concept as Concept;
  const archetypes = t.archetypes as ArchetypeSection;
  const science = t.science as Science;
  const metrics = t.metrics as Metrics;
  const finalCta = t.finalCta as FinalCta;

  type ArchetypeT = {
    name: string;
    artForm: string;
    domain: string;
    caption: string;
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-ink px-6 py-28 sm:py-36 lg:py-44">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {hero.preTitle}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-brand-cream sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            {hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" href={`/${resolvedLocale}/methodology`}>
              {hero.cta1}
            </Button>
            <Button size="lg" variant="secondary" href={`/${resolvedLocale}/contact?type=investor`}
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"
            >
              {hero.cta2}
            </Button>
          </div>
        </div>
        {/* Subtle decorative rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold/20" />
      </section>

      {/* The Concept */}
      <section className="bg-brand-cream px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeader title={concept.title} center />
          <p className="mt-6 text-lg leading-relaxed text-brand-slate">{concept.body}</p>
        </div>
      </section>

      {/* Six Archetypes teaser */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title={archetypes.title}
            subtitle={archetypes.subtitle}
            center
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ARCHETYPE_KEYS.map((key) => {
              const visual = ARCHETYPE_VISUALS.find((v) => v.key === key)!;
              const at = mt[key] as ArchetypeT;
              return (
                <ArchetypeCard
                  key={key}
                  name={at.name}
                  artForm={at.artForm}
                  domain={at.domain}
                  caption={at.caption}
                  gradient={visual.gradient}
                  href={`/${resolvedLocale}/methodology`}
                  size="compact"
                />
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button href={`/${resolvedLocale}/methodology`}>{archetypes.cta}</Button>
          </div>
        </div>
      </section>

      {/* Science bridge */}
      <section className="bg-brand-ink px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-cream sm:text-4xl">
            {science.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">{science.body}</p>
          <div className="mt-8">
            <Button
              href={`/${resolvedLocale}/ecosystem`}
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"
              variant="secondary"
            >
              {science.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.items.map((item) => (
              <MetricCard key={item.label} value={item.value} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-ink sm:text-4xl">
            {finalCta.title}
          </h2>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" href={`/${resolvedLocale}/contact?type=enterprise`}>
              {finalCta.enterprise}
            </Button>
            <Button size="lg" variant="secondary" href={`/${resolvedLocale}/investors`}>
              {finalCta.investor}
            </Button>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://www.peopleart.co/#organization',
            name: 'Peopleart Pty Ltd',
            alternateName: 'PeopleArt',
            url: 'https://www.peopleart.co',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.peopleart.co/images/logo.png',
              width: 200,
              height: 200,
            },
            description:
              'PeopleArt transforms how enterprises operate by treating human interaction as an artistic discipline — the brand and IP holding company behind the Propiología framework.',
            foundingDate: '2024',
            foundingLocation: {
              '@type': 'Place',
              addressCountry: 'AU',
              addressLocality: 'Sydney',
            },
            email: 'f.camacho@peopleart.co',
            knowsAbout: [
              'Enterprise Training',
              'Behavioral Science',
              'Leadership Development',
              'Organizational Psychology',
            ],
            sameAs: [
              'https://propiology.org',
              'https://propiology.com',
            ],
          }),
        }}
      />
    </main>
  );
}

import type { Metadata } from 'next';
import { getTranslations, resolveLocale } from '@/lib/i18n/getTranslations';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArchetypeCard } from '@/components/methodology/ArchetypeCard';
import { ARCHETYPE_KEYS, ARCHETYPE_VISUALS } from '@/lib/data/archetypes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(resolveLocale(locale), 'methodology');
  const meta = t.meta as { title: string; description: string };
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, type: 'website' },
  };
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'methodology');

  type ArchetypeT = {
    name: string;
    artForm: string;
    domain: string;
    caption: string;
    themes: string[];
    description: string;
  };
  type Philosophy = { title: string; subtitle: string; body: string };
  type ArchetypesSection = { title: string; subtitle: string };
  type HowItWorksItem = { title: string; description: string };
  type HowItWorks = { title: string; subtitle: string; items: HowItWorksItem[] };
  type Science = { title: string; body: string };
  type Offer = { title: string; subtitle: string; items: string[] };
  type Cta = { title: string; label: string };

  const philosophy = t.philosophy as Philosophy;
  const archetypesSection = t.archetypes as ArchetypesSection;
  const howItWorks = t.howItWorks as HowItWorks;
  const science = t.science as Science;
  const offer = t.offer as Offer;
  const cta = t.cta as Cta;

  const isEs = resolvedLocale === 'es';

  return (
    <main>
      {/* Page header */}
      <section className="bg-brand-ink px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {isEs ? 'La Metodología' : 'The Methodology'}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-brand-cream sm:text-6xl">
            {philosophy.title}
          </h1>
          <p className="mt-5 text-xl italic text-brand-gold">{philosophy.subtitle}</p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-brand-slate">{philosophy.body}</p>
        </div>
      </section>

      {/* Six Archetypes — full */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title={archetypesSection.title}
            subtitle={archetypesSection.subtitle}
            center
            className="mb-14"
          />
          <div className="flex flex-col gap-8">
            {ARCHETYPE_KEYS.map((key) => {
              const visual = ARCHETYPE_VISUALS.find((v) => v.key === key)!;
              const at = t[key] as ArchetypeT;
              return (
                <ArchetypeCard
                  key={key}
                  name={at.name}
                  artForm={at.artForm}
                  domain={at.domain}
                  caption={at.caption}
                  gradient={visual.gradient}
                  keyThemes={at.themes}
                  description={at.description}
                  size="full"
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-brand-cream px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            title={howItWorks.title}
            subtitle={howItWorks.subtitle}
            center
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {howItWorks.items.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-brand-warm bg-white p-7"
              >
                <h3 className="font-serif text-xl font-bold text-brand-ink">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-brand-slate">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science */}
      <section className="bg-brand-ink px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-cream sm:text-4xl">
            {science.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">{science.body}</p>
          <div className="mt-8">
            <Button
              href={`/${resolvedLocale}/ecosystem`}
              variant="secondary"
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"
            >
              {isEs ? 'Descubrir el Ecosistema' : 'Discover the Ecosystem'}
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Offer */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            title={offer.title}
            subtitle={offer.subtitle}
            center
            className="mb-10"
          />
          <ul className="mx-auto max-w-2xl space-y-3">
            {offer.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-slate">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-2xl font-bold text-brand-ink sm:text-3xl">{cta.title}</h2>
          <div className="mt-6">
            <Button size="lg" href={`/${resolvedLocale}/contact?type=enterprise`}>
              {cta.label}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

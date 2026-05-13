import type { Metadata } from 'next';
import { getTranslations, resolveLocale } from '@/lib/i18n/getTranslations';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils/cn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(resolveLocale(locale), 'rd');
  const meta = t.meta as { title: string; description: string };
  return { title: meta.title, description: meta.description };
}

const STATUS_STYLES: Record<string, string> = {
  concept:   'bg-slate-100 text-slate-600',
  prototype: 'bg-amber-100 text-amber-700',
  validated: 'bg-green-100 text-green-700',
};

export default async function RdPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'rd');

  type Overview = { title: string; body: string };
  type AlgorithmItem = { name: string; description: string; status: string; ip: string };
  type AlgorithmsSection = { title: string; subtitle: string; items: AlgorithmItem[] };
  type Hardware = { title: string; body: string; status: string };
  type SoftwareItem = { name: string; description: string; platform: string };
  type SoftwareSection = { title: string; items: SoftwareItem[] };
  type Ip = { title: string; body: string; statusLabel: string };
  type Publications = { title: string; subtitle: string; items: string[] };
  type Timeline = {
    title: string;
    past: string;
    future: string;
    pastItems: string[];
    futureItems: string[];
  };
  type Statuses = { concept: string; prototype: string; validated: string };

  const overview = t.overview as Overview;
  const algorithms = t.algorithms as AlgorithmsSection;
  const hardware = t.hardware as Hardware;
  const software = t.software as SoftwareSection;
  const ip = t.ip as Ip;
  const publications = t.publications as Publications;
  const timeline = t.timeline as Timeline;
  const statuses = t.statuses as Statuses;
  const isEs = resolvedLocale === 'es';

  return (
    <main>
      {/* Page header */}
      <section className="bg-brand-ink px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {isEs ? 'Investigación y Desarrollo' : 'Research & Development'}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-brand-cream sm:text-6xl">
            {isEs ? 'Portafolio I+D' : 'R&D Portfolio'}
          </h1>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title={overview.title} className="mb-6" />
          <p className="leading-relaxed text-brand-slate">{overview.body}</p>
        </div>
      </section>

      {/* Algorithms */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            title={algorithms.title}
            subtitle={algorithms.subtitle}
            className="mb-10"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {algorithms.items.map((item) => (
              <div key={item.name} className="rounded-xl border border-brand-warm bg-white p-7">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg font-bold text-brand-ink">{item.name}</h3>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      STATUS_STYLES[item.status] ?? STATUS_STYLES.concept,
                    )}
                  >
                    {statuses[item.status as keyof typeof statuses] ?? item.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-brand-slate">{item.description}</p>
                <p className="mt-3 text-xs text-brand-gold">{item.ip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title={hardware.title} className="mb-6" />
          <p className="leading-relaxed text-brand-slate">{hardware.body}</p>
          <p className="mt-4 text-sm italic text-brand-gold">{hardware.status}</p>
        </div>
      </section>

      {/* Software */}
      <section className="bg-brand-ink px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            title={software.title}
            className="mb-10 [&_h2]:text-brand-cream"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {software.items.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-white/10 bg-white/5 p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                  {item.platform}
                </p>
                <h3 className="mt-2 font-serif text-xl font-bold text-brand-cream">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PeopleArt IP */}
      <section className="bg-brand-warm px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title={ip.title} className="mb-6" />
          <p className="leading-relaxed text-brand-slate">{ip.body}</p>
          <div className="mt-6 rounded-lg border border-brand-gold/30 bg-brand-cream px-5 py-3 text-sm font-medium text-brand-gold">
            {ip.statusLabel}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            title={publications.title}
            subtitle={publications.subtitle}
            className="mb-8"
          />
          <ul className="space-y-3">
            {publications.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-slate">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionHeader title={timeline.title} center className="mb-12" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 font-serif text-xl font-bold text-brand-ink">
                {timeline.past}
              </h3>
              <ul className="space-y-3">
                {timeline.pastItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-brand-slate">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-brand-gold bg-white" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-serif text-xl font-bold text-brand-ink">
                {timeline.future}
              </h3>
              <ul className="space-y-3">
                {timeline.futureItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-brand-slate">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-dashed border-brand-gold/50" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

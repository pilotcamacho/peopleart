import type { Metadata } from 'next';
import { getTranslations, resolveLocale } from '@/lib/i18n/getTranslations';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'about');
  const meta = t.meta as { title: string; description: string };
  return buildPageMetadata(resolvedLocale, '/about', {
    title: meta.title,
    description: meta.description,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'about');

  type Origin = { title: string; body: string };
  type Company = { title: string; legalName: string; country: string; acn: string; abn: string; registered: string };
  type Legal = { title: string; body: string };
  type Problem = { title: string; body: string };
  type Mission = { title: string; mission: string; vision: string };
  type Ip = { title: string; body: string; items: string[] };

  const origin = t.origin as Origin;
  const company = t.company as Company;
  const legal = t.legal as Legal;
  const problem = t.problem as Problem;
  const mission = t.mission as Mission;
  const ip = t.ip as Ip;
  const isEs = resolvedLocale === 'es';

  return (
    <main>
      {/* Page header */}
      <section className="bg-brand-ink px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {isEs ? 'La Empresa' : 'The Company'}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-brand-cream sm:text-6xl">
            {isEs ? 'Sobre Nosotros' : 'About'}
          </h1>
          <p className="mt-5 text-gray-300">{company.legalName} · {company.registered}</p>
        </div>
      </section>

      {/* Origin story */}
      <section className="bg-brand-cream px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title={origin.title} className="mb-8" />
          <p className="leading-relaxed text-brand-slate">{origin.body}</p>
        </div>
      </section>

      {/* Company identity + Legal callout */}
      <section className="bg-brand-warm px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Company identity */}
            <div className="rounded-xl border border-brand-warm bg-white p-8">
              <h2 className="font-serif text-2xl font-bold text-brand-ink">{company.title}</h2>
              <dl className="mt-6 space-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-slate">
                    {isEs ? 'Nombre Legal' : 'Legal Name'}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-ink">{company.legalName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-slate">
                    {isEs ? 'País' : 'Country'}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-ink">{company.country}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-slate">ACN</dt>
                  <dd className="mt-1 font-medium text-brand-ink">{company.acn}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-slate">ABN</dt>
                  <dd className="mt-1 font-medium text-brand-ink">{company.abn}</dd>
                </div>
              </dl>
            </div>

            {/* Legal status callout */}
            <div className="rounded-xl border-2 border-brand-gold bg-brand-ink p-8 text-brand-cream">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                {isEs ? 'Estatus Legal' : 'Legal Status'}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold">{legal.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">{legal.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-brand-cream px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title={problem.title} className="mb-8" />
          <p className="leading-relaxed text-brand-slate">{problem.body}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-brand-ink px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            title={mission.title}
            center
            className="mb-10 text-brand-cream [&_h2]:text-brand-cream"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                {isEs ? 'Misión' : 'Mission'}
              </p>
              <p className="mt-3 leading-relaxed text-gray-200">{mission.mission}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                {isEs ? 'Visión' : 'Vision'}
              </p>
              <p className="mt-3 leading-relaxed text-gray-200">{mission.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* IP overview */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title={ip.title} className="mb-6" />
          <p className="mb-6 leading-relaxed text-brand-slate">{ip.body}</p>
          <ul className="space-y-3">
            {ip.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-slate">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href={`/${resolvedLocale}/rd`} variant="secondary">
              {isEs ? 'Ver Portafolio I+D' : 'View R&D Portfolio'}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

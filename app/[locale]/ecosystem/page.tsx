import type { Metadata } from 'next';
import { getTranslations, resolveLocale } from '@/lib/i18n/getTranslations';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PortalCard } from '@/components/ui/PortalCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(resolveLocale(locale), 'ecosystem');
  const meta = t.meta as { title: string; description: string };
  return { title: meta.title, description: meta.description };
}

export default async function EcosystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'ecosystem');

  type Overview = { title: string; body: string };
  type Portal = { name: string; role: string; description: string; audience: string; url: string };
  type Portals = { title: string; peopleart: Portal; propiology_org: Portal; propiology_com: Portal };
  type Connection = { title: string; body: string };
  type MarketItem = { platform: string; market: string; model: string; note: string };
  type Market = { title: string; items: MarketItem[] };

  const overview = t.overview as Overview;
  const portals = t.portals as Portals;
  const connection = t.connection as Connection;
  const market = t.market as Market;

  return (
    <main>
      {/* Page header */}
      <section className="bg-brand-ink px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-5xl font-bold text-brand-cream sm:text-6xl">
            {overview.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">{overview.body}</p>
        </div>
      </section>

      {/* Three portals */}
      <section className="bg-brand-warm px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={portals.title} center className="mb-12" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <PortalCard
              name={portals.peopleart.name}
              role={portals.peopleart.role}
              description={portals.peopleart.description}
              audience={portals.peopleart.audience}
              url={portals.peopleart.url}
              isCurrent
            />
            <PortalCard
              name={portals.propiology_org.name}
              role={portals.propiology_org.role}
              description={portals.propiology_org.description}
              audience={portals.propiology_org.audience}
              url={portals.propiology_org.url}
            />
            <PortalCard
              name={portals.propiology_com.name}
              role={portals.propiology_com.role}
              description={portals.propiology_com.description}
              audience={portals.propiology_com.audience}
              url={portals.propiology_com.url}
            />
          </div>
        </div>
      </section>

      {/* How they connect */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title={connection.title} className="mb-6" />
          <p className="leading-relaxed text-brand-slate">{connection.body}</p>

          {/* Flow diagram (static, text-based) */}
          <div className="mt-10 flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:justify-center sm:gap-0">
            {[
              { label: 'propiology.org', note: 'Awareness & Education' },
              { label: 'peopleart.co', note: 'Conversion & Relationships' },
              { label: 'propiology.com', note: 'Revenue & Scale' },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-0 sm:flex-col">
                <div className="flex flex-col items-center">
                  <div className="rounded-lg border-2 border-brand-gold bg-brand-warm px-5 py-3 text-center">
                    <p className="font-mono text-sm font-bold text-brand-ink">{step.label}</p>
                    <p className="mt-0.5 text-xs text-brand-slate">{step.note}</p>
                  </div>
                </div>
                {i < 2 && (
                  <span className="px-3 text-brand-gold sm:mt-3 sm:rotate-90">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market table */}
      <section className="bg-brand-ink px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            title={market.title}
            center
            className="mb-10 [&_h2]:text-brand-cream"
          />
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-3 font-semibold uppercase tracking-wider text-brand-gold text-xs">Platform</th>
                  <th className="px-5 py-3 font-semibold uppercase tracking-wider text-brand-gold text-xs">Market</th>
                  <th className="px-5 py-3 font-semibold uppercase tracking-wider text-brand-gold text-xs">Model</th>
                  <th className="hidden px-5 py-3 font-semibold uppercase tracking-wider text-brand-gold text-xs md:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {market.items.map((item, i) => (
                  <tr
                    key={item.platform}
                    className={i < market.items.length - 1 ? 'border-b border-white/10' : ''}
                  >
                    <td className="px-5 py-4 font-mono text-brand-cream">{item.platform}</td>
                    <td className="px-5 py-4 text-gray-300">{item.market}</td>
                    <td className="px-5 py-4 text-gray-300">{item.model}</td>
                    <td className="hidden px-5 py-4 text-gray-400 md:table-cell">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
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
  const t = await getTranslations(resolvedLocale, 'team');
  const meta = t.meta as { title: string; description: string };
  return buildPageMetadata(resolvedLocale, '/team', {
    title: meta.title,
    description: meta.description,
  });
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const t = await getTranslations(resolvedLocale, 'team');

  type Founder = {
    title: string;
    name: string;
    role: string;
    credentials: string;
    tagline: string;
    bio: string;
  };
  type Advisors = { title: string; subtitle: string; tba: string };
  type Institutions = { title: string; subtitle: string; tba: string };

  const founder = t.founder as Founder;
  const advisors = t.advisors as Advisors;
  const institutions = t.institutions as Institutions;
  const isEs = resolvedLocale === 'es';

  const hasPhoto = fs.existsSync(
    path.join(process.cwd(), 'public', 'images', 'team', 'fernando-camacho.jpg'),
  );

  return (
    <main>
      {/* Page header */}
      <section className="bg-brand-ink px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {isEs ? 'Las Personas' : 'The People'}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold text-brand-cream sm:text-6xl">
            {isEs ? 'Equipo' : 'Team'}
          </h1>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-brand-cream px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
            {founder.title}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Founder photo */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-2xl bg-brand-warm ring-2 ring-brand-gold/20">
                {hasPhoto ? (
                  <Image
                    src="/images/team/fernando-camacho.jpg"
                    alt="Fernando Camacho Ospina — Founder & Chief Researcher, Peopleart Pty Ltd"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <span className="font-serif text-5xl font-bold text-brand-gold">FC</span>
                )}
              </div>
              <p className="mt-4 font-serif text-xl font-bold text-brand-ink">{founder.name}</p>
              <p className="mt-1 text-sm font-medium text-brand-gold">{founder.role}</p>
              <p className="mt-1 text-sm text-brand-slate">{founder.credentials}</p>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <p className="font-serif text-lg italic text-brand-slate">{founder.tagline}</p>
              <p className="mt-5 leading-relaxed text-brand-slate">{founder.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory board */}
      <section className="bg-brand-warm px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            title={advisors.title}
            subtitle={advisors.subtitle}
            className="mb-10"
          />
          <div className="rounded-xl border border-brand-warm bg-white/60 p-8 text-center text-brand-slate">
            <p className="italic">{advisors.tba}</p>
          </div>
        </div>
      </section>

      {/* Research collaborations */}
      <section className="bg-brand-cream px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            title={institutions.title}
            subtitle={institutions.subtitle}
            className="mb-10"
          />
          <div className="rounded-xl border border-brand-warm bg-brand-warm/50 p-8 text-center text-brand-slate">
            <p className="italic">{institutions.tba}</p>
          </div>
          <div className="mt-10">
            <Button href={`/${resolvedLocale}/contact`} variant="secondary">
              {isEs ? 'Colaborar con Nosotros' : 'Collaborate With Us'}
            </Button>
          </div>
        </div>
      </section>

      {/* JSON-LD Person schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': 'https://www.peopleart.co/#founder',
            name: 'Fernando Camacho Ospina',
            givenName: 'Fernando',
            familyName: 'Camacho Ospina',
            honorificSuffix: 'PhD',
            jobTitle: 'Founder & Chief Researcher',
            description:
              'Founder of Peopleart Pty Ltd and creator of the Propiología framework — a behavioral scientist, biomedical engineer, and applied statistician with 30 years of experience across academic research, medical technology, and enterprise consulting.',
            affiliation: {
              '@type': 'Organization',
              '@id': 'https://www.peopleart.co/#organization',
              name: 'Peopleart Pty Ltd',
              url: 'https://www.peopleart.co',
            },
            worksFor: {
              '@type': 'Organization',
              '@id': 'https://www.peopleart.co/#organization',
            },
            alumniOf: [
              {
                '@type': 'CollegeOrUniversity',
                name: 'University of New South Wales',
                url: 'https://www.unsw.edu.au',
              },
              {
                '@type': 'CollegeOrUniversity',
                name: 'Universidad de los Andes',
                url: 'https://uniandes.edu.co',
              },
            ],
            knowsAbout: [
              'Biomedical Engineering',
              'Applied Statistics',
              'Behavioral Science',
              'Artificial Intelligence',
              'Cardiovascular Physiology',
              'Education Analytics',
              'Enterprise Leadership Development',
              'Organizational Psychology',
            ],
            nationality: ['Colombian', 'Australian'],
            knowsLanguage: ['Spanish', 'English', 'German'],
            url: `https://www.peopleart.co/${resolvedLocale}/team`,
            email: 'f.camacho@peopleart.co',
          }),
        }}
      />
    </main>
  );
}

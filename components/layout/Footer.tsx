import Link from 'next/link';

const PORTAL_LINKS = [
  { href: 'https://propiology.org', label: 'propiology.org' },
  { href: 'https://propiology.com', label: 'propiology.com' },
];

const COMPANY_LINKS = {
  en: [
    { href: '/about',     label: 'About'     },
    { href: '/team',      label: 'Team'      },
    { href: '/rd',        label: 'R&D'       },
    { href: '/investors', label: 'Investors' },
    { href: '/contact',   label: 'Contact'   },
  ],
  es: [
    { href: '/about',     label: 'Sobre Nosotros' },
    { href: '/team',      label: 'Equipo'         },
    { href: '/rd',        label: 'I+D'            },
    { href: '/investors', label: 'Inversores'     },
    { href: '/contact',   label: 'Contacto'       },
  ],
};

const strings = {
  en: {
    tagline:     'Treating human interaction as an artistic discipline — for enterprises, investors, and partners.',
    ecosystem:   'The Ecosystem',
    company:     'Company',
    rights:      'All rights reserved.',
    privacy:     'Privacy Policy',
    legalName:   'Peopleart Pty Ltd',
    countryNote: 'Australian Company',
  },
  es: {
    tagline:     'Tratar la interacción humana como una disciplina artística — para empresas, inversores y socios.',
    ecosystem:   'El Ecosistema',
    company:     'Empresa',
    rights:      'Todos los derechos reservados.',
    privacy:     'Política de Privacidad',
    legalName:   'Peopleart Pty Ltd',
    countryNote: 'Empresa Australiana',
  },
};

export function Footer({ locale }: { locale: string }) {
  const t            = strings[locale as keyof typeof strings] ?? strings.en;
  const companyLinks = COMPANY_LINKS[locale as keyof typeof COMPANY_LINKS] ?? COMPANY_LINKS.en;

  return (
    <footer className="border-t border-brand-warm bg-brand-ink text-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">

          {/* Brand */}
          <div className="md:col-span-5">
            <Link href={`/${locale}`} className="inline-block">
              <span className="font-serif text-xl font-semibold">
                People<span className="text-brand-gold">Art</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">{t.tagline}</p>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {t.legalName}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{t.countryNote}</p>
            </div>
          </div>

          <div className="hidden md:block md:col-span-1" />

          {/* Ecosystem */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t.ecosystem}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PORTAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 transition-colors hover:text-brand-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t.company}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-gray-300 transition-colors hover:text-brand-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Peopleart Pty Ltd. {t.rights}
          </p>
          <Link
            href={`/${locale}/privacy`}
            className="text-xs text-gray-500 transition-colors hover:text-brand-gold"
          >
            {t.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}

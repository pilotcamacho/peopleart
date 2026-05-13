'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: '/methodology', en: 'Methodology', es: 'Metodología'    },
  { href: '/about',       en: 'About',        es: 'Sobre Nosotros' },
  { href: '/team',        en: 'Team',         es: 'Equipo'         },
  { href: '/rd',          en: 'R&D',          es: 'I+D'            },
  { href: '/ecosystem',   en: 'Ecosystem',    es: 'Ecosistema'     },
  { href: '/investors',   en: 'Investors',    es: 'Inversores'     },
  { href: '/contact',     en: 'Contact',      es: 'Contacto'       },
];

const strings = {
  en: {
    signOut:       'Sign Out',
    dataRoom:      'Data Room',
    investorLogin: 'Investor Login',
    openMenu:      'Open menu',
    closeMenu:     'Close menu',
    switchToEs:    'Switch to Spanish',
    switchToEn:    'Switch to English',
  },
  es: {
    signOut:       'Cerrar Sesión',
    dataRoom:      'Sala de Datos',
    investorLogin: 'Acceso Inversores',
    openMenu:      'Abrir menú',
    closeMenu:     'Cerrar menú',
    switchToEs:    'Cambiar a español',
    switchToEn:    'Cambiar a inglés',
  },
};

export function Header({ locale }: { locale: string }) {
  const router   = useRouter();
  const pathname = usePathname();
  const t        = strings[locale as keyof typeof strings] ?? strings.en;
  const label    = (en: string, es: string) => (locale === 'es' ? es : en);

  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const switchLanguage = () => {
    const next = locale === 'en' ? 'es' : 'en';
    router.push(pathname.replace(`/${locale}`, `/${next}`));
    setMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
  };

  useEffect(() => {
    const check = async () => {
      try {
        const session = await fetchAuthSession();
        setSignedIn(!!session.tokens?.accessToken);
      } catch {
        setSignedIn(false);
      }
    };
    check();
    const stop = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn')  check();
      if (payload.event === 'signedOut') setSignedIn(false);
    });
    return stop;
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-warm bg-brand-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5">
          <PaletteIcon className="h-7 w-7 text-brand-gold" />
          <span className="font-serif text-xl font-semibold text-brand-ink">
            People<span className="text-brand-gold">Art</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand-gold',
                pathname.startsWith(`/${locale}${link.href}`)
                  ? 'text-brand-gold'
                  : 'text-brand-slate',
              )}
            >
              {label(link.en, link.es)}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={switchLanguage}
            className="rounded-md border border-brand-warm px-3 py-1.5 text-xs font-medium text-brand-slate transition-colors hover:bg-brand-warm hover:text-brand-ink"
            aria-label={locale === 'en' ? t.switchToEs : t.switchToEn}
          >
            {locale === 'en' ? 'ES' : 'EN'}
          </button>

          {signedIn ? (
            <>
              <Button size="sm" href={`/${locale}/investors/data-room`}>
                {t.dataRoom}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                {t.signOut}
              </Button>
            </>
          ) : (
            <Button size="sm" variant="secondary" href={`/${locale}/auth/login`}>
              {t.investorLogin}
            </Button>
          )}
        </div>

        {/* Mobile: lang + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={switchLanguage}
            className="rounded-md border border-brand-warm px-2.5 py-1 text-xs font-medium text-brand-slate transition-colors hover:bg-brand-warm"
            aria-label={locale === 'en' ? t.switchToEs : t.switchToEn}
          >
            {locale === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            className="rounded-md p-2 text-brand-slate transition-colors hover:bg-brand-warm"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-brand-warm bg-brand-cream lg:hidden">
          <nav className="flex flex-col gap-0.5 px-4 py-3" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-warm hover:text-brand-gold',
                  pathname.startsWith(`/${locale}${link.href}`)
                    ? 'text-brand-gold'
                    : 'text-brand-slate',
                )}
              >
                {label(link.en, link.es)}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 border-t border-brand-warm px-4 py-3">
            {signedIn ? (
              <>
                <Button href={`/${locale}/investors/data-room`} className="w-full">
                  {t.dataRoom}
                </Button>
                <Button variant="ghost" onClick={handleSignOut} className="w-full">
                  {t.signOut}
                </Button>
              </>
            ) : (
              <Button variant="secondary" href={`/${locale}/auth/login`} className="w-full">
                {t.investorLogin}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 1.1 0 2-.9 2-2 0-.52-.2-1-.5-1.35-.3-.35-.49-.81-.49-1.28 0-1.1.9-2 2-2h2.36c3.08 0 5.63-2.55 5.63-5.63C22.99 6.04 18.08 2 12 2zm-5.5 10c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5S18.33 12 17.5 12z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

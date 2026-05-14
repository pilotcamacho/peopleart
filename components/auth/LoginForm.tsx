'use client';

import { useState } from 'react';
import { signIn, confirmSignIn } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const strings = {
  en: {
    title: 'Investor Sign In',
    subtitle: 'Access the PeopleArt Data Room',
    email: 'Email address',
    password: 'Password',
    newPassword: 'New password',
    newPasswordHint: 'Set your permanent password',
    submit: 'Sign In',
    submitting: 'Signing in…',
    confirm: 'Set password',
    confirming: 'Setting…',
    backToHome: '← Back to home',
    noAccess: 'Don\'t have access?',
    contactUs: 'Contact investor relations',
    errors: {
      generic: 'Sign in failed. Please check your credentials.',
      noAccess: 'Your account does not have Data Room access. Please contact us.',
    },
  },
  es: {
    title: 'Acceso Inversores',
    subtitle: 'Accede a la Sala de Datos de PeopleArt',
    email: 'Correo electrónico',
    password: 'Contraseña',
    newPassword: 'Nueva contraseña',
    newPasswordHint: 'Establece tu contraseña permanente',
    submit: 'Iniciar Sesión',
    submitting: 'Iniciando sesión…',
    confirm: 'Establecer contraseña',
    confirming: 'Estableciendo…',
    backToHome: '← Volver al inicio',
    noAccess: '¿Sin acceso?',
    contactUs: 'Contactar relaciones con inversores',
    errors: {
      generic: 'Inicio de sesión fallido. Verifica tus credenciales.',
      noAccess: 'Tu cuenta no tiene acceso a la Sala de Datos. Por favor contáctanos.',
    },
  },
};

const inputClass =
  'w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-brand-ink ' +
  'placeholder:text-gray-400 focus:border-brand-gold focus:outline-none focus:ring-1 ' +
  'focus:ring-brand-gold transition-colors text-sm';

interface Props {
  locale: string;
}

export function LoginForm({ locale }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? `/${locale}/investors/data-room`;

  const t = strings[locale as keyof typeof strings] ?? strings.en;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'sign_in' | 'new_password'>('sign_in');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn({ username: email, password });

      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setStep('new_password');
        setLoading(false);
        return;
      }

      if (result.isSignedIn) {
        router.push(next);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await confirmSignIn({ challengeResponse: newPassword });
      if (result.isSignedIn) {
        router.push(next);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-4 py-16">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <Link
            href={`/${locale}`}
            className="font-serif text-2xl font-bold text-brand-ink"
          >
            People<span className="text-brand-gold">Art</span>
          </Link>
          <h1 className="mt-6 font-serif text-3xl font-bold text-brand-ink">{t.title}</h1>
          <p className="mt-2 text-sm text-brand-slate">{t.subtitle}</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-brand-warm bg-white px-8 py-10 shadow-sm">
          {error && (
            <div className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {step === 'sign_in' ? (
            <form onSubmit={handleSignIn} className="space-y-5" noValidate>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-ink">
                  {t.email}
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-ink">
                  {t.password}
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? t.submitting : t.submit}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleNewPassword} className="space-y-5" noValidate>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-ink">
                  {t.newPassword}
                </label>
                <p className="mb-2 text-xs text-brand-slate">{t.newPasswordHint}</p>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={cn(inputClass, 'border-brand-gold')}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? t.confirming : t.confirm}
              </Button>
            </form>
          )}
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-brand-slate">
          <Link href={`/${locale}`} className="hover:text-brand-gold">
            {t.backToHome}
          </Link>
          <div className="mt-2">
            {t.noAccess}{' '}
            <Link
              href={`/${locale}/contact?type=investor`}
              className="font-medium text-brand-gold hover:text-brand-gold-dark"
            >
              {t.contactUs}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

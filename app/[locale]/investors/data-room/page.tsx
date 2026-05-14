import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/getSession';
import { resolveLocale } from '@/lib/i18n/getTranslations';
import { DocumentList, type DataRoomDoc } from '@/components/investors/DocumentList';
import { Button } from '@/components/ui/Button';
import outputs from '@/amplify_outputs.json';

export const metadata: Metadata = {
  title: 'Data Room — PeopleArt',
  robots: { index: false, follow: false },
};

type AccessStatus = 'no_auth' | 'no_group' | 'authorized';

async function fetchDocuments(jwt: string): Promise<DataRoomDoc[]> {
  const query = `
    query ListActive {
      listDataRoomDocuments(filter: { isActive: { eq: true } }) {
        items { id title description s3Key version }
      }
    }
  `;
  try {
    const res = await fetch(outputs.data.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { listDataRoomDocuments?: { items: DataRoomDoc[] } };
    };
    return json.data?.listDataRoomDocuments?.items ?? [];
  } catch {
    return [];
  }
}

const uiStrings = {
  en: {
    title: 'Investor Data Room',
    subtitle: 'Confidential documents for verified investors.',
    documentsHeading: 'Documents',
    noGroupTitle: 'Access Pending',
    noGroupBody:
      'Your account is authenticated but has not yet been granted Data Room access. Please contact investor relations to request access.',
    contactCta: 'Request Access',
    signOutHint: 'Sign in with a different account',
  },
  es: {
    title: 'Sala de Datos para Inversores',
    subtitle: 'Documentos confidenciales para inversores verificados.',
    documentsHeading: 'Documentos',
    noGroupTitle: 'Acceso Pendiente',
    noGroupBody:
      'Tu cuenta está autenticada pero aún no se le ha concedido acceso a la Sala de Datos. Por favor, contacta a relaciones con inversores para solicitar acceso.',
    contactCta: 'Solicitar Acceso',
    signOutHint: 'Iniciar sesión con otra cuenta',
  },
};

export default async function DataRoomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);

  const session = await getSession();

  if (!session) {
    redirect(`/${resolvedLocale}/auth/login?next=/${resolvedLocale}/investors/data-room`);
  }

  const groups =
    (session.tokens?.accessToken?.payload?.['cognito:groups'] as string[] | undefined) ?? [];
  const hasAccess = groups.includes('DataRoom') || groups.includes('Admin');

  const status: AccessStatus = hasAccess ? 'authorized' : 'no_group';
  const t = uiStrings[resolvedLocale as keyof typeof uiStrings] ?? uiStrings.en;

  let docs: DataRoomDoc[] = [];
  if (status === 'authorized') {
    const jwt = session.tokens?.accessToken?.toString() ?? '';
    docs = await fetchDocuments(jwt);
  }

  return (
    <main className="min-h-screen bg-brand-cream">
      {/* Header bar */}
      <section className="bg-brand-ink px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/20">
            <svg className="h-6 w-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-bold text-brand-cream sm:text-5xl">{t.title}</h1>
          <p className="mt-4 text-gray-300">{t.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-2xl">
          {status === 'no_group' ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-8 py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-ink">{t.noGroupTitle}</h2>
              <p className="mt-3 text-brand-slate">{t.noGroupBody}</p>
              <div className="mt-6">
                <Button href={`/${resolvedLocale}/contact?type=investor`}>
                  {t.contactCta}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-6 font-serif text-2xl font-bold text-brand-ink">
                {t.documentsHeading}
              </h2>
              <DocumentList docs={docs} locale={resolvedLocale} />
            </>
          )}
        </div>
      </section>
    </main>
  );
}

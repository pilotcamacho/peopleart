'use client';

import { useState } from 'react';

export interface DataRoomDoc {
  id: string;
  title: string;
  description?: string | null;
  s3Key: string;
  version?: string | null;
}

const strings = {
  en: {
    download: 'Download',
    downloading: 'Getting link…',
    error: 'Download failed. Please try again.',
    version: 'Version',
    noDocuments: 'No documents available at this time.',
  },
  es: {
    download: 'Descargar',
    downloading: 'Obteniendo enlace…',
    error: 'Descarga fallida. Por favor, inténtalo de nuevo.',
    version: 'Versión',
    noDocuments: 'No hay documentos disponibles en este momento.',
  },
};

interface Props {
  docs: DataRoomDoc[];
  locale: string;
}

export function DocumentList({ docs, locale }: Props) {
  const t = strings[locale as keyof typeof strings] ?? strings.en;

  if (docs.length === 0) {
    return (
      <p className="text-center text-brand-slate py-12">{t.noDocuments}</p>
    );
  }

  return (
    <div className="space-y-3">
      {docs.map((doc) => (
        <DocRow key={doc.id} doc={doc} t={t} />
      ))}
    </div>
  );
}

function DocRow({
  doc,
  t,
}: {
  doc: DataRoomDoc;
  t: (typeof strings)['en'];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id, s3Key: doc.s3Key, title: doc.title }),
      });
      if (!res.ok) throw new Error('Request failed');
      const { url } = (await res.json()) as { url: string };
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-brand-warm bg-white p-5 gap-4">
      <div className="flex items-start gap-4 min-w-0">
        {/* File icon */}
        <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/10">
          <svg className="h-5 w-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="font-medium text-brand-ink truncate">{doc.title}</p>
          {doc.description && (
            <p className="mt-0.5 text-sm text-brand-slate truncate">{doc.description}</p>
          )}
          {doc.version && (
            <p className="mt-0.5 text-xs text-brand-slate">
              {t.version} {doc.version}
            </p>
          )}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-md border border-brand-gold px-4 py-2 text-sm font-medium text-brand-gold transition-colors hover:bg-brand-gold hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
        {loading ? t.downloading : t.download}
      </button>
    </div>
  );
}

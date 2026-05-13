import { cn } from '@/lib/utils/cn';

interface PortalCardProps {
  name: string;
  role: string;
  description: string;
  audience: string;
  url: string;
  isCurrent?: boolean;
  className?: string;
}

export function PortalCard({
  name,
  role,
  description,
  audience,
  url,
  isCurrent = false,
  className,
}: PortalCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border p-7',
        isCurrent
          ? 'border-brand-gold bg-brand-ink text-brand-cream'
          : 'border-brand-warm bg-white text-brand-ink',
        className,
      )}
    >
      {isCurrent && (
        <span className="mb-3 inline-flex w-fit rounded-full bg-brand-gold px-3 py-0.5 text-xs font-semibold text-white">
          This Site
        </span>
      )}
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-wider',
          isCurrent ? 'text-brand-gold' : 'text-brand-gold',
        )}
      >
        {role}
      </p>
      <h3 className="mt-1.5 font-serif text-2xl font-bold">{name}</h3>
      <p className={cn('mt-4 text-sm leading-relaxed', isCurrent ? 'text-gray-300' : 'text-brand-slate')}>
        {description}
      </p>
      <div className="mt-6 border-t pt-5 text-xs" style={{ borderColor: isCurrent ? 'rgba(255,255,255,0.1)' : undefined }}>
        <p
          className={cn(
            'font-semibold uppercase tracking-wider',
            isCurrent ? 'text-gray-400' : 'text-brand-slate',
          )}
        >
          Audience
        </p>
        <p className={cn('mt-1', isCurrent ? 'text-gray-300' : 'text-brand-slate')}>{audience}</p>
      </div>
      {!isCurrent && (
        <a
          href={`https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 text-sm font-medium text-brand-gold transition-colors hover:text-brand-gold-dark"
        >
          Visit {url} →
        </a>
      )}
    </div>
  );
}

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface ArchetypeCardProps {
  name: string;
  artForm: string;
  domain: string;
  caption: string;
  gradient: string;
  keyThemes?: string[];
  description?: string;
  href?: string;
  size?: 'compact' | 'full';
}

export function ArchetypeCard({
  name,
  artForm,
  domain,
  caption,
  gradient,
  keyThemes,
  description,
  href,
  size = 'compact',
}: ArchetypeCardProps) {
  const isCompact = size === 'compact';

  const card = (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-brand-warm bg-white transition-shadow hover:shadow-lg',
        isCompact ? '' : 'md:flex-row',
      )}
    >
      {/* Image / gradient placeholder */}
      <div
        className={cn(
          `bg-gradient-to-br ${gradient} flex items-end p-5 text-white`,
          isCompact ? 'aspect-[4/3] w-full' : 'aspect-[4/3] w-full md:aspect-auto md:w-2/5 md:min-h-[280px]',
        )}
      >
        <div>
          <span className="inline-block rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
            {artForm}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={cn('flex flex-col justify-between p-5', isCompact ? '' : 'md:p-8')}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">{domain}</p>
          <h3
            className={cn(
              'mt-1 font-serif font-bold text-brand-ink',
              isCompact ? 'text-xl' : 'text-2xl md:text-3xl',
            )}
          >
            {name}
          </h3>
          <p className={cn('mt-2 italic text-brand-slate', isCompact ? 'text-sm' : 'text-base')}>
            &ldquo;{caption}&rdquo;
          </p>

          {description && !isCompact && (
            <p className="mt-4 leading-relaxed text-brand-slate">{description}</p>
          )}
        </div>

        {keyThemes && keyThemes.length > 0 && !isCompact && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-slate">
              Key Themes
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {keyThemes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-full bg-brand-warm px-3 py-1 text-xs text-brand-slate"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {href && isCompact && (
          <div className="mt-4">
            <span className="text-sm font-medium text-brand-gold transition-colors group-hover:text-brand-gold-dark">
              Learn more →
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}

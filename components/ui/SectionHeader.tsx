import { cn } from '@/lib/utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({ title, subtitle, center = false, className }: SectionHeaderProps) {
  return (
    <div className={cn(center && 'text-center', className)}>
      <h2 className="font-serif text-3xl font-bold text-brand-ink sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-brand-slate">{subtitle}</p>
      )}
    </div>
  );
}

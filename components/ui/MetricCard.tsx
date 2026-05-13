import { cn } from '@/lib/utils/cn';

interface MetricCardProps {
  value: string;
  label: string;
  className?: string;
}

export function MetricCard({ value, label, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border border-brand-warm bg-white px-6 py-8 text-center',
        className,
      )}
    >
      <span className="font-serif text-5xl font-bold text-brand-gold">{value}</span>
      <span className="mt-2 text-sm font-medium uppercase tracking-wider text-brand-slate">
        {label}
      </span>
    </div>
  );
}

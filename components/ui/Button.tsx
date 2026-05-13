import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gold text-white border border-brand-gold hover:bg-brand-gold-dark hover:border-brand-gold-dark',
  secondary:
    'bg-transparent text-brand-gold border border-brand-gold hover:bg-brand-warm',
  ghost:
    'bg-transparent text-brand-slate border border-transparent hover:bg-brand-warm hover:text-brand-ink',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-md gap-2',
  lg: 'px-7 py-3 text-base rounded-lg gap-2',
};

const base =
  'inline-flex items-center justify-center font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {loading && <Spinner />}
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled || loading} className={classes} {...props}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

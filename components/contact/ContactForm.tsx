'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactStrings {
  title: string;
  subtitle: string;
  labels: {
    fullName: string;
    organisation: string;
    email: string;
    inquiryType: string;
    message: string;
    preferredLanguage: string;
  };
  placeholders: {
    fullName: string;
    organisation: string;
    email: string;
    message: string;
  };
  optional: string;
  inquiryTypes: {
    placeholder: string;
    enterprise_training: string;
    investor: string;
    government: string;
    strategic_partner: string;
    media: string;
    other: string;
  };
  languages: {
    placeholder: string;
    en: string;
    es: string;
  };
  submit: string;
  submitting: string;
  success: { title: string; body: string };
  errors: {
    required: string;
    invalidEmail: string;
    generic: string;
    rateLimited: string;
  };
}

// URL ?type= param → inquiry type enum value
const TYPE_MAP: Record<string, string> = {
  enterprise: 'enterprise_training',
  investor: 'investor',
  government: 'government',
  partner: 'strategic_partner',
  media: 'media',
  other: 'other',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Input / Select primitives
// ---------------------------------------------------------------------------

const inputClass =
  'w-full rounded-md border border-brand-warm bg-white px-3.5 py-2.5 text-brand-ink ' +
  'placeholder:text-brand-slate/50 focus:border-brand-gold focus:outline-none focus:ring-1 ' +
  'focus:ring-brand-gold transition-colors';

const errorClass = 'mt-1.5 text-xs text-red-600';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  strings: ContactStrings;
  locale: string;
}

export function ContactForm({ strings: s, locale }: Props) {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    fullName: '',
    organisation: '',
    email: '',
    inquiryType: '',
    message: '',
    preferredLanguage: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'rate_limited'>('idle');
  const [apiError, setApiError] = useState('');

  // Pre-select inquiry type from URL param
  useEffect(() => {
    const typeParam = searchParams.get('type') ?? '';
    const mapped = TYPE_MAP[typeParam] ?? typeParam;
    if (mapped && mapped in s.inquiryTypes) {
      setForm((f) => ({ ...f, inquiryType: mapped, preferredLanguage: locale }));
    } else {
      setForm((f) => ({ ...f, preferredLanguage: locale }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  // Validation
  const errors = {
    fullName: touched.fullName && !form.fullName.trim() ? s.errors.required : '',
    email: touched.email
      ? !form.email.trim()
        ? s.errors.required
        : !EMAIL_RE.test(form.email)
          ? s.errors.invalidEmail
          : ''
      : '',
    inquiryType: touched.inquiryType && !form.inquiryType ? s.errors.required : '',
    message: touched.message && !form.message.trim() ? s.errors.required : '',
  };

  const isValid =
    form.fullName.trim() &&
    EMAIL_RE.test(form.email) &&
    form.inquiryType &&
    form.message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all required fields as touched
    setTouched({ fullName: true, email: true, inquiryType: true, message: true });
    if (!isValid) return;

    setStatus('submitting');
    setApiError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          inquiryType: form.inquiryType,
          message: form.message.trim(),
          organisation: form.organisation.trim() || undefined,
          preferredLanguage: form.preferredLanguage || undefined,
        }),
      });

      if (res.status === 429) {
        setStatus('rate_limited');
        setApiError(s.errors.rateLimited);
        return;
      }
      if (!res.ok) {
        setStatus('error');
        setApiError(s.errors.generic);
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setApiError(s.errors.generic);
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-green-200 bg-green-50 px-8 py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl font-bold text-brand-ink">{s.success.title}</h3>
        <p className="mt-3 text-brand-slate">{s.success.body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-lg space-y-6">
      {/* Full Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          {s.labels.fullName} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          autoComplete="name"
          value={form.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          onBlur={() => touch('fullName')}
          placeholder={s.placeholders.fullName}
          className={cn(inputClass, errors.fullName && 'border-red-400 focus:border-red-400 focus:ring-red-400')}
        />
        {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
      </div>

      {/* Organisation */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          {s.labels.organisation}{' '}
          <span className="text-xs font-normal text-brand-slate">({s.optional})</span>
        </label>
        <input
          type="text"
          autoComplete="organization"
          value={form.organisation}
          onChange={(e) => set('organisation', e.target.value)}
          placeholder={s.placeholders.organisation}
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          {s.labels.email} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          onBlur={() => touch('email')}
          placeholder={s.placeholders.email}
          className={cn(inputClass, errors.email && 'border-red-400 focus:border-red-400 focus:ring-red-400')}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      {/* Inquiry Type */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          {s.labels.inquiryType} <span className="text-red-500">*</span>
        </label>
        <select
          value={form.inquiryType}
          onChange={(e) => set('inquiryType', e.target.value)}
          onBlur={() => touch('inquiryType')}
          className={cn(
            inputClass,
            !form.inquiryType && 'text-brand-slate/50',
            errors.inquiryType && 'border-red-400 focus:border-red-400 focus:ring-red-400',
          )}
        >
          <option value="" disabled>{s.inquiryTypes.placeholder}</option>
          <option value="enterprise_training">{s.inquiryTypes.enterprise_training}</option>
          <option value="investor">{s.inquiryTypes.investor}</option>
          <option value="government">{s.inquiryTypes.government}</option>
          <option value="strategic_partner">{s.inquiryTypes.strategic_partner}</option>
          <option value="media">{s.inquiryTypes.media}</option>
          <option value="other">{s.inquiryTypes.other}</option>
        </select>
        {errors.inquiryType && <p className={errorClass}>{errors.inquiryType}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          {s.labels.message} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          onBlur={() => touch('message')}
          placeholder={s.placeholders.message}
          className={cn(
            inputClass,
            'resize-y',
            errors.message && 'border-red-400 focus:border-red-400 focus:ring-red-400',
          )}
        />
        {errors.message && <p className={errorClass}>{errors.message}</p>}
      </div>

      {/* Preferred Language */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          {s.labels.preferredLanguage}{' '}
          <span className="text-xs font-normal text-brand-slate">({s.optional})</span>
        </label>
        <select
          value={form.preferredLanguage}
          onChange={(e) => set('preferredLanguage', e.target.value)}
          className={cn(inputClass, !form.preferredLanguage && 'text-brand-slate/50')}
        >
          <option value="">{s.languages.placeholder}</option>
          <option value="en">{s.languages.en}</option>
          <option value="es">{s.languages.es}</option>
        </select>
      </div>

      {/* API error */}
      {apiError && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        loading={status === 'submitting'}
        disabled={status === 'submitting'}
        className="w-full"
      >
        {status === 'submitting' ? s.submitting : s.submit}
      </Button>
    </form>
  );
}

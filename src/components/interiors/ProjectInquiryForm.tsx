'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const SPACE_TYPES = ['Hotel', 'Restaurant', 'Office', 'Retail', 'Residential', 'Other'];

const inputCx =
  'bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200';

export function ProjectInquiryForm({ defaultSpace = '' }: { defaultSpace?: string }) {
  const initialSpace = SPACE_TYPES.includes(defaultSpace) ? defaultSpace : '';

  const [form, setForm] = useState({
    name: '',
    business: '',
    role: '',
    email: '',
    phone: '',
    spaceType: initialSpace,
    budget: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Submission failed.');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="border border-charcoal/10 p-10">
        <div className="w-8 h-px bg-gold mb-6" />
        <h3 className="font-display text-3xl font-light text-charcoal mb-3">
          Thank you. We’re in touch.
        </h3>
        <p className="font-body text-sm text-warm-gray leading-[1.9]">
          We review every project personally. You’ll hear from us within 1–2 business days — or book a
          consultation to speak with us sooner.
        </p>
      </div>
    );
  }

  const field = (id: keyof typeof form, label: string, required = false, type = 'text') => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`inq-${id}`} className="label-caps text-charcoal/60 text-[10px]">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      <input
        id={`inq-${id}`}
        type={type}
        required={required}
        value={form[id]}
        onChange={set(id)}
        className={inputCx}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {field('name', 'Full Name', true)}
        {field('email', 'Email Address', true, 'email')}
      </div>

      {field('business', 'Business / Firm Name', true)}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {field('role', 'Role')}
        {field('phone', 'Phone', false, 'tel')}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="inq-spaceType" className="label-caps text-charcoal/60 text-[10px]">
          Type of Space<span className="text-gold ml-1">*</span>
        </label>
        <select
          id="inq-spaceType"
          required
          value={form.spaceType}
          onChange={set('spaceType')}
          className={cn(inputCx, 'cursor-pointer')}
        >
          <option value="" disabled>
            Select…
          </option>
          {SPACE_TYPES.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {field('budget', 'Estimated Budget or Volume')}

      <div className="flex flex-col gap-2">
        <label htmlFor="inq-description" className="label-caps text-charcoal/60 text-[10px]">
          Project Description<span className="text-gold ml-1">*</span>
        </label>
        <textarea
          id="inq-description"
          required
          rows={4}
          value={form.description}
          onChange={set('description')}
          placeholder="The space, the intent, palette, scale, timeline…"
          className={cn(inputCx, 'resize-none placeholder:text-warm-gray/50')}
        />
      </div>

      {error && (
        <p role="alert" className="font-body text-xs text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className={cn(
          'h-12 label-caps transition-colors duration-300 mt-2',
          loading ? 'bg-charcoal/40 text-ivory cursor-not-allowed' : 'bg-charcoal text-ivory hover:bg-stone',
        )}
      >
        {loading ? 'Sending…' : 'Submit Inquiry'}
      </button>

      <p className="font-body text-xs text-warm-gray">
        Or reach us at{' '}
        <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal underline">
          hello@lesfleursdesign.com
        </a>
      </p>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export type InquiryVariant = 'business' | 'interiors';

interface InquiryFormProps {
  variant: InquiryVariant;
}

export function InquiryForm({ variant }: InquiryFormProps) {
  const isInteriors = variant === 'interiors';

  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
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
      <div className="border border-charcoal/10 p-8">
        <div className="w-8 h-px bg-gold mb-6" />
        <h3 className="font-display text-2xl font-light text-charcoal mb-3">
          Thank you. We&rsquo;re in touch.
        </h3>
        <p className="font-body text-sm text-warm-gray leading-[1.8]">
          We&rsquo;ll review your inquiry and reply within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {[
        { id: 'name', label: 'Full Name', required: true },
        { id: 'email', label: 'Email Address', required: true, type: 'email' },
        {
          id: 'company',
          label: isInteriors ? 'Firm / Studio Name' : 'Business Name',
          required: false,
        },
      ].map(({ id, label, required, type }) => (
        <div key={id} className="flex flex-col gap-2">
          <label htmlFor={`inquiry-${id}`} className="label-caps text-charcoal/60 text-[10px]">
            {label}{required && <span className="text-gold ml-1">*</span>}
          </label>
          <input
            id={`inquiry-${id}`}
            type={type ?? 'text'}
            required={required}
            value={form[id as keyof typeof form]}
            onChange={set(id as keyof typeof form)}
            className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200"
          />
        </div>
      ))}

      <div className="flex flex-col gap-2">
        <label htmlFor="inquiry-message" className="label-caps text-charcoal/60 text-[10px]">
          Tell Us More<span className="text-gold ml-1">*</span>
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={4}
          value={form.message}
          onChange={set('message')}
          placeholder={
            isInteriors
              ? 'Share your project — space, palette, scale, timeline…'
              : 'Describe your space, order volume, or goals…'
          }
          className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200 resize-none placeholder:text-warm-gray/50"
        />
      </div>

      {error && <p className="font-body text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          'h-12 label-caps transition-colors duration-300 mt-2',
          loading
            ? 'bg-charcoal/40 text-ivory cursor-not-allowed'
            : 'bg-charcoal text-ivory hover:bg-stone',
        )}
      >
        {loading ? 'Sending…' : 'Submit Inquiry'}
      </button>

      <p className="font-body text-xs text-warm-gray">
        Or reach us at{' '}
        <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal">
          hello@lesfleursdesign.com
        </a>
      </p>
    </form>
  );
}

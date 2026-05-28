'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export type CommissionVariant = 'business' | 'interiors';

interface CommissionFormProps {
  variant: CommissionVariant;
}

const BUSINESS_ROLES = ['Hotel / Resort', 'Restaurant / Bar', 'Office / Corporate', 'Events & Experiences', 'Retail', 'Other'];
const INTERIORS_TYPES = ['Private Residence', 'Hospitality Project', 'Commercial / Office', 'Mixed-Use Development', 'Other'];
const BUDGET_RANGES = ['$500 – $2,000', '$2,000 – $5,000', '$5,000 – $15,000', '$15,000+', 'To be determined'];
const TIMELINES = ['Under 4 weeks', '1 – 3 months', '3 – 6 months', 'Flexible / Ongoing'];

export function CommissionForm({ variant }: CommissionFormProps) {
  const isInteriors = variant === 'interiors';

  const [form, setForm] = useState({
    name: '',
    email: '',
    orgName: '',
    category: '',
    budget: BUDGET_RANGES[1],
    timeline: TIMELINES[1],
    notes: '',
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
      const res = await fetch('/api/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, variant }),
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
      <div className="border border-charcoal/10 p-10">
        <div className="w-8 h-px bg-gold mb-6" />
        <h3 className="font-display text-3xl font-light text-charcoal mb-3">
          Commission received.
        </h3>
        <p className="font-body text-sm text-warm-gray leading-[1.9]">
          We review every commission request personally. You&rsquo;ll hear from us within 2–3 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { id: 'name', label: 'Full Name', required: true },
          { id: 'email', label: 'Email Address', required: true, type: 'email' },
        ].map(({ id, label, required, type }) => (
          <div key={id} className="flex flex-col gap-2">
            <label htmlFor={`commission-${id}`} className="label-caps text-charcoal/60 text-[10px]">
              {label}{required && <span className="text-gold ml-1">*</span>}
            </label>
            <input
              id={`commission-${id}`}
              type={type ?? 'text'}
              required={required}
              value={form[id as keyof typeof form]}
              onChange={set(id as keyof typeof form)}
              className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200"
            />
          </div>
        ))}
      </div>

      {/* Org name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="commission-orgName" className="label-caps text-charcoal/60 text-[10px]">
          {isInteriors ? 'Firm Name' : 'Business Name'}
        </label>
        <input
          id="commission-orgName"
          type="text"
          value={form.orgName}
          onChange={set('orgName')}
          className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label htmlFor="commission-category" className="label-caps text-charcoal/60 text-[10px]">
          {isInteriors ? 'Project Type' : 'Venue Type'}
          <span className="text-gold ml-1">*</span>
        </label>
        <select
          id="commission-category"
          required
          value={form.category}
          onChange={set('category')}
          className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200 cursor-pointer"
        >
          <option value="" disabled>Select…</option>
          {(isInteriors ? INTERIORS_TYPES : BUSINESS_ROLES).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Budget + Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="commission-budget" className="label-caps text-charcoal/60 text-[10px]">
            Approximate Budget
          </label>
          <select
            id="commission-budget"
            value={form.budget}
            onChange={set('budget')}
            className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200 cursor-pointer"
          >
            {BUDGET_RANGES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="commission-timeline" className="label-caps text-charcoal/60 text-[10px]">
            Timeline
          </label>
          <select
            id="commission-timeline"
            value={form.timeline}
            onChange={set('timeline')}
            className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200 cursor-pointer"
          >
            {TIMELINES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <label htmlFor="commission-notes" className="label-caps text-charcoal/60 text-[10px]">
          {isInteriors
            ? 'Project Notes — palette, materials, scale, any reference images'
            : 'Project Notes — space, volume, special requirements'}
          <span className="text-gold ml-1">*</span>
        </label>
        <textarea
          id="commission-notes"
          required
          rows={4}
          value={form.notes}
          onChange={set('notes')}
          className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200 resize-none"
          placeholder={
            isInteriors
              ? 'Describe the project — room, palette, material references, scale…'
              : 'Describe the space, how many pieces, any specific requirements…'
          }
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
        {loading ? 'Sending…' : 'Start a Commission'}
      </button>
    </form>
  );
}

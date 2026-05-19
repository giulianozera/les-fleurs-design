'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const VERTICALS = [
  {
    title: 'Hotels & Hospitality',
    body: 'Lobby installations, suite amenities, and recurring décor programs for boutique hotels and resorts.',
  },
  {
    title: 'Retail & Florists',
    body: 'Wholesale supply for concept stores, gift retailers, and florists seeking a permanent luxury offering.',
  },
  {
    title: 'Offices & Interiors',
    body: 'Quarterly refresh programs and one-time installations for corporate spaces and interior designers.',
  },
];

export function WholesaleContent() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'https://cal.com';

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
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

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <section className="pt-[72px] bg-charcoal text-ivory">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-24 md:py-32">
          <p className="label-caps text-ivory/40 mb-6">Wholesale & B2B</p>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] font-light leading-[0.95] max-w-2xl">
            Built for Business.
          </h1>
          <p className="font-body text-sm text-ivory/60 leading-[1.8] mt-8 max-w-md">
            Partner programs for hotels, retailers, florists, and interior designers who demand permanence without compromise.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 border-b border-charcoal/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {VERTICALS.map((v) => (
            <div key={v.title}>
              <div className="w-8 h-px bg-gold mb-6" />
              <h3 className="font-display text-xl font-light text-charcoal mb-3">{v.title}</h3>
              <p className="font-body text-sm text-warm-gray leading-[1.8]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry + Cal.com */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20">

          {/* Left: inquiry form */}
          <div>
            <p className="label-caps text-warm-gray mb-4">Partner Inquiry</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-charcoal mb-10 leading-tight">
              Tell us about your project.
            </h2>

            {success ? (
              <div className="border border-charcoal/10 p-8">
                <div className="w-8 h-px bg-gold mb-6" />
                <h3 className="font-display text-2xl font-light text-charcoal mb-3">
                  Thank you. We're in touch.
                </h3>
                <p className="font-body text-sm text-warm-gray leading-[1.8] mb-6">
                  We'll review your inquiry and reply within 1–2 business days. Or book a call directly below.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {[
                  { id: 'name', label: 'Full Name', required: true },
                  { id: 'email', label: 'Email Address', required: true, type: 'email' },
                  { id: 'company', label: 'Company / Brand', required: false },
                ].map(({ id, label, required, type }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <label htmlFor={id} className="label-caps text-charcoal/60 text-[10px]">
                      {label}{required && <span className="text-gold ml-1">*</span>}
                    </label>
                    <input
                      id={id}
                      type={type ?? 'text'}
                      required={required}
                      value={form[id as keyof typeof form]}
                      onChange={set(id as keyof typeof form)}
                      className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200 placeholder:text-warm-gray/50"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="label-caps text-charcoal/60 text-[10px]">
                    Tell Us More<span className="text-gold ml-1">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Describe your space, order volume, or project goals…"
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
              </form>
            )}
          </div>

          {/* Right: Cal.com */}
          <div className="mt-16 lg:mt-0">
            <p className="label-caps text-warm-gray mb-4">Or Book a Call</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-charcoal mb-10 leading-tight">
              Speak with us directly.
            </h2>
            <div className="border border-charcoal/10 overflow-hidden">
              <iframe
                src={`${calLink}?embed=true&theme=light&layout=month_view`}
                className="w-full"
                style={{ height: '600px', border: 'none' }}
                title="Book a 30-minute consultation"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

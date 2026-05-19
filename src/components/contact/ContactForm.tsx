'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const SUBJECTS = [
  'General Inquiry',
  'Order Support',
  'Wholesale & B2B',
  'Press & Media',
  'Other',
];

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
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
    <div className="bg-ivory min-h-screen pt-[72px]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20">
        <div className="max-w-xl">
          <p className="label-caps text-warm-gray mb-4">Contact</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light text-charcoal leading-tight mb-12">
            Get in Touch.
          </h1>

          {success ? (
            <div className="border border-charcoal/10 p-10">
              <div className="w-8 h-px bg-gold mb-6" />
              <h2 className="font-display text-3xl font-light text-charcoal mb-3">
                Message sent.
              </h2>
              <p className="font-body text-sm text-warm-gray leading-[1.8]">
                We've received your message and will get back to you within 1–2 business days. You can also reach us directly at{' '}
                <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal underline underline-offset-4">
                  hello@lesfleursdesign.com
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                {[
                  { id: 'name', label: 'Full Name' },
                  { id: 'email', label: 'Email Address', type: 'email' },
                ].map(({ id, label, type }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <label htmlFor={id} className="label-caps text-charcoal/60 text-[10px]">
                      {label}<span className="text-gold ml-1">*</span>
                    </label>
                    <input
                      id={id}
                      type={type ?? 'text'}
                      required
                      value={form[id as keyof typeof form]}
                      onChange={set(id as keyof typeof form)}
                      className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="label-caps text-charcoal/60 text-[10px]">
                  Subject<span className="text-gold ml-1">*</span>
                </label>
                <select
                  id="subject"
                  value={form.subject}
                  onChange={set('subject')}
                  className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200 cursor-pointer"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="label-caps text-charcoal/60 text-[10px]">
                  Message<span className="text-gold ml-1">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  className="bg-transparent border-b border-charcoal/20 py-2 font-body text-sm text-charcoal outline-none focus:border-charcoal transition-colors duration-200 resize-none"
                />
              </div>

              {error && <p className="font-body text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'h-12 label-caps transition-colors duration-300',
                  loading
                    ? 'bg-charcoal/40 text-ivory cursor-not-allowed'
                    : 'bg-charcoal text-ivory hover:bg-stone',
                )}
              >
                {loading ? 'Sending…' : 'Send Message'}
              </button>

              <p className="font-body text-xs text-warm-gray">
                Or email us directly at{' '}
                <a href="mailto:hello@lesfleursdesign.com" className="text-charcoal">
                  hello@lesfleursdesign.com
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

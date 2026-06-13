'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HoneypotField } from '@/components/ui/HoneypotField';
import { HONEYPOT_FIELD } from '@/lib/honeypot';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, [HONEYPOT_FIELD]: hp }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 md:py-32 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
      <motion.div
        className="bg-ivory-dark px-8 py-16 md:px-20 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-10"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      >
        {/* Copy */}
        <div className="max-w-sm">
          <p className="label-caps text-charcoal/60 mb-3">The Inner Circle</p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light text-charcoal leading-tight">
            First to know. Always.
          </h2>
          <p className="font-body text-sm text-charcoal/70 mt-4 leading-relaxed">
            New arrivals, private previews, and the occasional essay on permanence, beauty, and the things worth keeping.
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 max-w-md">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-display text-2xl font-light text-charcoal">Thank you.</p>
              <p className="font-body text-sm text-charcoal/70 mt-2">You&rsquo;re on the list.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center border-b border-charcoal/20 pb-3 gap-4 group focus-within:border-charcoal transition-colors duration-300">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for newsletter
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-transparent font-body text-base text-charcoal placeholder:text-charcoal/50 outline-none"
              />
              <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />
              <button
                type="submit"
                disabled={loading}
                className="flex-shrink-0 inline-flex items-center gap-2 label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300 disabled:opacity-40 group/btn"
                aria-label="Subscribe to newsletter"
              >
                {loading ? 'Joining…' : (
                  <>
                    Join
                    <ArrowRight size={12} aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
          {error && (
            <p role="alert" className="font-body text-xs text-red-600 mt-3">
              Something went wrong. Please try again.
            </p>
          )}
          <p className="font-body text-xs text-charcoal/60 mt-3">
            By subscribing you agree to receive marketing emails. See our{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-charcoal transition-colors duration-300">
              Privacy Policy
            </Link>
            . Unsubscribe anytime.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

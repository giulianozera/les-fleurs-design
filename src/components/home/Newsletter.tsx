'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // TODO Phase 5: wire to /api/newsletter route → Supabase insert
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
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
          <p className="label-caps text-charcoal/40 mb-3">The Inner Circle</p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-light text-charcoal leading-tight">
            First to know. Always.
          </h2>
          <p className="font-body text-sm text-charcoal/50 mt-4 leading-relaxed">
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
              <p className="font-body text-sm text-charcoal/50 mt-2">You&rsquo;re on the list.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center border-b border-charcoal/20 pb-3 gap-4 group focus-within:border-charcoal transition-colors duration-300">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                aria-label="Email address for newsletter"
                className="flex-1 bg-transparent font-body text-base text-charcoal placeholder:text-charcoal/30 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex-shrink-0 inline-flex items-center gap-2 label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300 disabled:opacity-40 group/btn"
                aria-label="Subscribe to newsletter"
              >
                {loading ? 'Joining…' : (
                  <>
                    Join
                    <ArrowRight size={12} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
          <p className="font-body text-xs text-charcoal/30 mt-3">
            No noise. Unsubscribe at any time.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

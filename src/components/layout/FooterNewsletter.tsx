'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { HoneypotField } from '@/components/ui/HoneypotField';
import { HONEYPOT_FIELD } from '@/lib/honeypot';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === 'loading') return;
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, [HONEYPOT_FIELD]: hp }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return <p className="font-body text-sm text-ivory/60">You're on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="label-caps text-ivory/30 mb-3">Newsletter</p>
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email for newsletter
      </label>
      <div className="flex items-center gap-2 border-b border-ivory/20 pb-2 focus-within:border-ivory/60 transition-colors duration-300">
        <Mail size={14} strokeWidth={1.5} className="text-ivory/30 flex-shrink-0" aria-hidden="true" />
        <input
          id="footer-newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 bg-transparent font-body text-sm text-ivory placeholder:text-ivory/30 outline-none focus-visible:ring-1 focus-visible:ring-ivory/40"
        />
        <HoneypotField value={hp} onChange={(e) => setHp(e.target.value)} />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="label-caps text-ivory/50 hover:text-ivory transition-colors duration-300 disabled:opacity-40 outline-none focus-visible:ring-1 focus-visible:ring-ivory/60 focus-visible:rounded-sm"
          aria-label="Subscribe"
        >
          {state === 'loading' ? '…' : '→'}
        </button>
      </div>
      <p className="font-body text-xs text-ivory/30 mt-3">
        By subscribing you agree to receive marketing emails. See our{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-ivory/60 transition-colors duration-300">
          Privacy Policy
        </Link>
        . Unsubscribe anytime.
      </p>
      {state === 'error' && (
        <p role="alert" className="font-body text-xs text-red-400 mt-2">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

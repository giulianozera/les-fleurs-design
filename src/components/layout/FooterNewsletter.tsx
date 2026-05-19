'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === 'loading') return;
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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
      <div className="flex items-center gap-2 border-b border-ivory/20 pb-2">
        <Mail size={14} strokeWidth={1.5} className="text-ivory/30 flex-shrink-0" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 bg-transparent font-body text-sm text-ivory placeholder:text-ivory/30 outline-none"
          aria-label="Email for newsletter"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="label-caps text-ivory/50 hover:text-ivory transition-colors duration-300 disabled:opacity-40"
          aria-label="Subscribe"
        >
          {state === 'loading' ? '…' : '→'}
        </button>
      </div>
      {state === 'error' && (
        <p className="font-body text-xs text-red-400 mt-2">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

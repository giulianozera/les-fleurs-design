'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'done' | 'already' | 'error';

export function ShipConfirm({ orderId, token }: { orderId: string; token: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function confirm() {
    setStatus('loading');
    setMessage(null);
    try {
      const res = await fetch('/api/orders/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      setStatus(data.alreadyShipped ? 'already' : 'done');
    } catch (e) {
      setStatus('error');
      setMessage(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  if (status === 'done') {
    return (
      <p className="font-body text-sm text-charcoal">
        Order marked shipped — the customer has been emailed their tracking number.
      </p>
    );
  }
  if (status === 'already') {
    return (
      <p className="font-body text-sm text-warm-gray">
        This order was already marked shipped. No duplicate email was sent.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={confirm}
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
        className="w-full h-12 bg-charcoal text-ivory label-caps hover:bg-stone transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending…' : 'Mark Shipped & Notify Customer'}
      </button>
      {status === 'error' && message && (
        <p role="alert" className="font-body text-xs text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}

import { getSupabaseAdminClient } from '@/lib/supabase';
import { verifyOrderAction } from '@/lib/orderToken';
import { ShipConfirm } from './ShipConfirm';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ order?: string; token?: string }> };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md border border-charcoal/10 bg-ivory-dark/30 p-10">
        <p className="label-caps text-charcoal/60 mb-6">Les Fleurs Design · Fulfillment</p>
        {children}
      </div>
    </main>
  );
}

export default async function ShipPage({ searchParams }: Props) {
  const { order: orderId, token } = await searchParams;

  if (!orderId || !token || !verifyOrderAction(orderId, token)) {
    return (
      <Shell>
        <h1 className="font-display text-2xl font-light text-charcoal mb-2">Invalid link</h1>
        <p className="font-body text-sm text-warm-gray">
          This fulfillment link is missing or invalid. Open the latest order email and use the button there.
        </p>
      </Shell>
    );
  }

  const supabase = getSupabaseAdminClient();
  const { data: order } = supabase
    ? await supabase
        .from('orders')
        .select('id, customer_email, customer_name, tracking_code, carrier, status, total_cents')
        .eq('id', orderId)
        .maybeSingle()
    : { data: null };

  if (!order) {
    return (
      <Shell>
        <h1 className="font-display text-2xl font-light text-charcoal mb-2">Order not found</h1>
        <p className="font-body text-sm text-warm-gray">No order matches this link.</p>
      </Shell>
    );
  }

  const alreadyShipped = order.status === 'shipped';

  return (
    <Shell>
      <h1 className="font-display text-2xl font-light text-charcoal mb-1">
        {alreadyShipped ? 'Order already shipped' : 'Confirm shipment'}
      </h1>
      <p className="font-body text-sm text-warm-gray mb-6">
        {order.customer_name || '—'} · {order.customer_email}
      </p>

      <div className="flex flex-col gap-2 mb-8 font-body text-sm text-charcoal border-t border-charcoal/10 pt-4">
        <div className="flex justify-between">
          <span className="text-warm-gray">Total</span>
          <span>${(order.total_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-warm-gray">Carrier</span>
          <span>{order.carrier || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-warm-gray">Tracking</span>
          <span>{order.tracking_code || '— (no label on file)'}</span>
        </div>
      </div>

      {alreadyShipped ? (
        <p className="font-body text-sm text-warm-gray">
          The customer was already notified. Nothing further to do.
        </p>
      ) : (
        <ShipConfirm orderId={order.id} token={token} />
      )}
    </Shell>
  );
}

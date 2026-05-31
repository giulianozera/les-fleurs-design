import type { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { verifyOrderAction } from '@/lib/orderToken';
import { sendEmail } from '@/lib/resend';
import { orderShippedHtml } from '@/lib/emails';
import { trackingUrl } from '@/lib/shipping';

export const runtime = 'nodejs';

// Marks an order shipped and emails the customer their tracking number.
// Authenticated by a per-order HMAC token minted server-side (no login).
export async function POST(req: NextRequest) {
  let orderId = '';
  let token = '';
  try {
    const body = await req.json();
    orderId = String(body.orderId ?? '');
    token = String(body.token ?? '');
    if (!orderId || !token) throw new Error('missing');
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!verifyOrderAction(orderId, token)) {
    return Response.json({ error: 'Invalid or expired link' }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return Response.json({ error: 'Not configured' }, { status: 503 });
  }

  const { data: order } = await supabase
    .from('orders')
    .select('id, customer_email, customer_name, tracking_code, carrier, status, shipped_at')
    .eq('id', orderId)
    .maybeSingle();

  if (!order) {
    return Response.json({ error: 'Order not found' }, { status: 404 });
  }

  // Idempotent: a second click (or email prefetch) does not re-notify.
  if (order.status === 'shipped' || order.shipped_at) {
    return Response.json({ ok: true, alreadyShipped: true });
  }

  await supabase
    .from('orders')
    .update({ status: 'shipped', shipped_at: new Date().toISOString() })
    .eq('id', orderId);

  if (order.customer_email) {
    const track = order.tracking_code
      ? trackingUrl(order.carrier ?? '', order.tracking_code)
      : null;
    await sendEmail({
      to: order.customer_email,
      subject: 'Your Les Fleurs Design order is on its way',
      html: orderShippedHtml({
        customerName: order.customer_name ?? '',
        carrier: order.carrier ?? '',
        trackingCode: order.tracking_code ?? '',
        trackingUrl: track,
      }),
    });
  }

  return Response.json({ ok: true, notified: Boolean(order.customer_email) });
}

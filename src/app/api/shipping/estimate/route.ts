import type { NextRequest } from 'next/server';
import { getShippingRates } from '@/lib/shipping';

export async function POST(req: NextRequest) {
  let zip: string;
  let weightGrams: number;
  let orderSubtotal: number;

  try {
    const body = await req.json();
    zip = String(body.zip ?? '').trim();
    const w = Number(body.weightGrams);
    weightGrams = Number.isFinite(w) && w > 0 ? w : 500;
    const s = Number(body.orderSubtotal);
    orderSubtotal = Number.isFinite(s) && s >= 0 ? s : 0;
    if (!/^\d{5}$/.test(zip)) throw new Error('Invalid ZIP');
  } catch {
    return Response.json({ error: 'Provide a valid 5-digit ZIP code.' }, { status: 400 });
  }

  try {
    const rates = await getShippingRates(zip, weightGrams, orderSubtotal);
    return Response.json({ rates });
  } catch {
    return Response.json({ error: 'Shipping estimate is briefly unavailable. Please try again.' }, { status: 502 });
  }
}

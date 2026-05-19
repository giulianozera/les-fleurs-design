import type { NextRequest } from 'next/server';
import { getShippingRates } from '@/lib/shipping';

export async function POST(req: NextRequest) {
  let zip: string;
  let weightGrams: number;
  let orderSubtotal: number;

  try {
    const body = await req.json();
    zip = String(body.zip ?? '').trim();
    weightGrams = Number(body.weightGrams ?? 500);
    orderSubtotal = Number(body.orderSubtotal ?? 0);
    if (!/^\d{5}$/.test(zip)) throw new Error('Invalid ZIP');
  } catch {
    return Response.json({ error: 'Provide a valid 5-digit ZIP code.' }, { status: 400 });
  }

  const rates = await getShippingRates(zip, weightGrams, orderSubtotal);
  return Response.json({ rates });
}

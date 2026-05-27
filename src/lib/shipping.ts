// eslint-disable-next-line @typescript-eslint/no-require-imports
const EasyPost = require('@easypost/api') as new (key: string) => {
  Shipment: {
    create: (opts: object) => Promise<{ id: string; lowestRate: () => object; postage_label?: { label_url: string }; tracking_code?: string; selected_rate?: { carrier: string } }>;
    buy: (id: string, rate: object) => Promise<{ postage_label?: { label_url: string }; tracking_code?: string; selected_rate?: { carrier: string } }>;
  };
};

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  displayName: string;
  price: number; // USD
  deliveryDays: string;
}

export const FREE_SHIPPING_THRESHOLD = 0;

const STANDARD: ShippingRate = {
  id: 'ups_ground',
  carrier: 'UPS',
  service: 'Ground',
  displayName: 'Standard Shipping',
  price: 12,
  deliveryDays: '5–7 business days',
};

const EXPRESS: ShippingRate = {
  id: 'ups_2day',
  carrier: 'UPS',
  service: '2nd Day Air',
  displayName: 'Express Shipping',
  price: 25,
  deliveryDays: '2–3 business days',
};

const FREE: ShippingRate = {
  id: 'free_ground',
  carrier: 'UPS',
  service: 'Ground',
  displayName: 'Free Shipping',
  price: 0,
  deliveryDays: '5–7 business days',
};

export async function getShippingRates(
  _destinationZip: string,
  _weightGrams: number,
  orderSubtotal: number,
): Promise<ShippingRate[]> {
  return [{ ...FREE }];
}

export interface LabelResult {
  labelUrl: string;
  trackingCode: string;
  carrier: string;
}

export async function createShippingLabel(opts: {
  toName: string;
  toStreet1: string;
  toCity: string;
  toState: string;
  toZip: string;
  toCountry: string;
}): Promise<LabelResult | null> {
  const apiKey = process.env.EASYPOST_API_KEY;
  if (!apiKey) return null;

  const client = new EasyPost(apiKey);

  const shipment = await client.Shipment.create({
    to_address: {
      name: opts.toName,
      street1: opts.toStreet1,
      city: opts.toCity,
      state: opts.toState,
      zip: opts.toZip,
      country: opts.toCountry,
    },
    from_address: {
      name: process.env.SHIPPING_ORIGIN_NAME ?? 'Les Fleurs Design',
      street1: process.env.SHIPPING_ORIGIN_STREET1 ?? '1420 NE Miami Pl',
      city: process.env.SHIPPING_ORIGIN_CITY ?? 'Miami',
      state: process.env.SHIPPING_ORIGIN_STATE ?? 'FL',
      zip: process.env.SHIPPING_ORIGIN_ZIP ?? '33132',
      country: process.env.SHIPPING_ORIGIN_COUNTRY ?? 'US',
    },
    parcel: {
      length: 14,
      width: 10,
      height: 8,
      weight: 48, // oz (~3 lbs for a floral arrangement)
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bought = await (client.Shipment as any).buy(shipment.id, (shipment as any).lowestRate());

  return {
    labelUrl: bought.postage_label?.label_url ?? '',
    trackingCode: bought.tracking_code ?? '',
    carrier: bought.selected_rate?.carrier ?? '',
  };
}

// Stripe-formatted shipping options for checkout session creation
export function toStripeShippingOptions(rates: ShippingRate[]) {
  return rates.map((rate) => ({
    shipping_rate_data: {
      type: 'fixed_amount' as const,
      fixed_amount: { amount: Math.round(rate.price * 100), currency: 'usd' },
      display_name: `${rate.displayName} (${rate.deliveryDays})`,
      delivery_estimate: {
        minimum: { unit: 'business_day' as const, value: rate.id.includes('2day') ? 2 : 5 },
        maximum: { unit: 'business_day' as const, value: rate.id.includes('2day') ? 3 : 7 },
      },
    },
  }));
}

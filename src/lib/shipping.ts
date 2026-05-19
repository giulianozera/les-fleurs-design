export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  displayName: string;
  price: number; // USD
  deliveryDays: string;
}

export const FREE_SHIPPING_THRESHOLD = 200;

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
  // EasyPost live rates — uncomment when EASYPOST_API_KEY is set
  // if (process.env.EASYPOST_API_KEY) {
  //   return getEasyPostRates(_destinationZip, _weightGrams, orderSubtotal)
  // }

  if (orderSubtotal >= FREE_SHIPPING_THRESHOLD) {
    return [{ ...FREE }, EXPRESS];
  }
  return [STANDARD, EXPRESS];
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

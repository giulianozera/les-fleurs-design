// Client-safe shipping constants & types. NO Node/EasyPost imports here, so
// client components (cart, product options) can use these without dragging the
// EasyPost SDK (required at the top of lib/shipping.ts) into the browser bundle.

export const FREE_SHIPPING_THRESHOLD = 200;

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  displayName: string;
  price: number; // USD
  deliveryDays: string;
}

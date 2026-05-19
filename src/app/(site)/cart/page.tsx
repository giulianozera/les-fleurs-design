import type { Metadata } from 'next';
import { CartContents } from '@/components/cart/CartContents';

export const metadata: Metadata = { title: 'Cart — Les Fleurs Design' };

export default function CartPage() {
  return <CartContents />;
}

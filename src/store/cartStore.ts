import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // `${productId}_${colorId ?? ''}_${potId ?? ''}`
  productId: string;
  productSlug: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  colorId?: string;
  colorName?: string;
  colorHex?: string;
  potId?: string;
  potName?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const id = [newItem.productId, newItem.colorId ?? '', newItem.potId ?? ''].join('_');
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + newItem.quantity } : i,
            ),
          }));
        } else {
          set((s) => ({ items: [...s.items, { ...newItem, id }] }));
        }
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'les-fleurs-cart' },
  ),
);

export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

export const useCartSubtotal = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));

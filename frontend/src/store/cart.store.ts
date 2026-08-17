import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { Cart } from '../types';
import { cartApi } from '../services/api';
import toast from 'react-hot-toast';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;
  fetchCart: (sessionId?: string) => Promise<void>;
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        cart: null,
        isLoading: false,
        isOpen: false,

        fetchCart: async (sessionId) => {
          try {
            const { data } = await cartApi.get(sessionId);
            set({ cart: data.data });
          } catch {
            // Cart not found — empty state is fine
          }
        },

        addItem: async (productId, variantId, quantity = 1) => {
          set({ isLoading: true });
          try {
            let sessionId = localStorage.getItem('bjs_session_id');
            if (!sessionId) {
              sessionId = crypto.randomUUID();
              localStorage.setItem('bjs_session_id', sessionId);
            }
            const { data } = await cartApi.addItem({ productId, variantId, quantity, sessionId });
            set({ cart: data.data, isLoading: false, isOpen: true });
            toast.success('Added to cart');
          } catch (err: any) {
            set({ isLoading: false });
            toast.error(err.response?.data?.message || 'Failed to add to cart');
            throw err;
          }
        },

        updateItem: async (itemId, quantity) => {
          set({ isLoading: true });
          try {
            const { data } = await cartApi.updateItem(itemId, quantity);
            set({ cart: data.data, isLoading: false });
          } catch (err: any) {
            set({ isLoading: false });
            toast.error(err.response?.data?.message || 'Failed to update cart');
          }
        },

        removeItem: async (itemId) => {
          set({ isLoading: true });
          try {
            const { data } = await cartApi.removeItem(itemId);
            set({ cart: data.data, isLoading: false });
            toast.success('Item removed');
          } catch {
            set({ isLoading: false });
          }
        },

        applyCoupon: async (code) => {
          try {
            const { data } = await cartApi.applyCoupon(code);
            set({ cart: data.data });
            toast.success('Coupon applied successfully!');
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid coupon');
            throw err;
          }
        },

        removeCoupon: async () => {
          try {
            const { data } = await cartApi.removeCoupon();
            set({ cart: data.data });
            toast.success('Coupon removed');
          } catch { /* ignore */ }
        },

        clearCart: () => set({ cart: null }),
        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
        toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
        itemCount: () => get().cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) ?? 0,
      }),
      { name: 'bjs-cart', partialize: (state) => ({ cart: state.cart }) }
    )
  )
);

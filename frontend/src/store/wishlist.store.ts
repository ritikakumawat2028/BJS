import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userApi } from '../services/api';
import toast from 'react-hot-toast';

interface WishlistStore {
  items: string[]; // product IDs
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        try {
          const { data } = await userApi.getWishlist();
          const ids = data.data.map((item: any) => item.productId);
          set({ items: ids });
        } catch { /* not logged in, keep local */ }
      },

      addItem: async (productId) => {
        try {
          await userApi.addToWishlist(productId);
          set((s) => ({ items: [...s.items, productId] }));
          toast.success('Added to wishlist');
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to add to wishlist');
        }
      },

      removeItem: async (productId) => {
        try {
          await userApi.removeFromWishlist(productId);
          set((s) => ({ items: s.items.filter((id) => id !== productId) }));
          toast.success('Removed from wishlist');
        } catch { /* ignore */ }
      },

      isWishlisted: (productId) => get().items.includes(productId),

      toggle: async (productId) => {
        if (get().isWishlisted(productId)) {
          await get().removeItem(productId);
        } else {
          await get().addItem(productId);
        }
      },
    }),
    { name: 'bjs-wishlist' }
  )
);

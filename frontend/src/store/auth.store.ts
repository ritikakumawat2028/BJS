import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { User } from '../types';
import { authApi, cartApi } from '../services/api';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,

        login: async (email, password) => {
          set({ isLoading: true });
          try {
            const { data } = await authApi.login({ email, password });
            const { user, accessToken } = data.data;
            localStorage.setItem('bjs_access_token', accessToken);
            set({ user, accessToken, isAuthenticated: true, isLoading: false });
            
            // Merge guest cart if exists
            const sessionId = localStorage.getItem('bjs_session_id');
            if (sessionId) {
              try {
                const { data: cartData } = await cartApi.mergeCart(sessionId);
                localStorage.removeItem('bjs_session_id');
                // Since cart is in another store, we don't strictly need to set it here, 
                // but the next page load or fetchCart will get the merged cart.
              } catch (e) { /* ignore */ }
            }
          } catch (err) {
            set({ isLoading: false });
            throw err;
          }
        },

        register: async (data) => {
          set({ isLoading: true });
          try {
            const { data: res } = await authApi.register(data);
            const { user, accessToken } = res.data;
            localStorage.setItem('bjs_access_token', accessToken);
            set({ user, accessToken, isAuthenticated: true, isLoading: false });
            
            // Merge guest cart if exists
            const sessionId = localStorage.getItem('bjs_session_id');
            if (sessionId) {
              try {
                await cartApi.mergeCart(sessionId);
                localStorage.removeItem('bjs_session_id');
              } catch (e) { /* ignore */ }
            }
          } catch (err) {
            set({ isLoading: false });
            throw err;
          }
        },

        logout: async () => {
          try { await authApi.logout(); } catch { /* ignore */ }
          localStorage.removeItem('bjs_access_token');
          set({ user: null, accessToken: null, isAuthenticated: false });
        },

        setUser: (user) => set({ user, isAuthenticated: true }),
        updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),

        fetchMe: async () => {
          try {
            const { data } = await authApi.getMe();
            set({ user: data.data, isAuthenticated: true });
          } catch {
            set({ user: null, isAuthenticated: false, accessToken: null });
          }
        },
      }),
      { name: 'bjs-auth', partialize: (state) => ({ accessToken: state.accessToken, user: state.user, isAuthenticated: state.isAuthenticated }) }
    )
  )
);

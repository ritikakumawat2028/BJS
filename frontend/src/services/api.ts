import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

// In development, Vite proxies /api → http://localhost:5000/api (see vite.config.ts)
// In production, set VITE_API_URL to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bjs_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data.data.accessToken;
        localStorage.setItem('bjs_access_token', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('bjs_access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ===== AUTH =====
export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (email: string, otp: string) => api.post('/auth/verify-email', { email, otp }),
  resendOtp: (email: string) => api.post('/auth/resend-otp', { email }),
  getMe: () => api.get('/auth/me'),
  updateMe: (data: Partial<{ firstName: string; lastName: string; phone: string }>) => api.put('/auth/me', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.put('/auth/me/password', data),
};

// ===== PRODUCTS =====
export const productsApi = {
  getAll: (params?: Record<string, any>) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getBestsellers: () => api.get('/products/bestsellers'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  search: (q: string, limit?: number) => api.get('/products/search', { params: { q, limit } }),
  // Admin
  adminGetAll: (params?: Record<string, any>) => api.get('/products/admin/all', { params }),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  updateInventory: (id: string, data: { type: string; quantity: number; note?: string }) =>
    api.put(`/products/${id}/inventory`, data),
  uploadImages: (id: string, images: any[]) => api.post(`/products/${id}/images`, { images }),
};

// ===== CATEGORIES =====
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  createSub: (data: any) => api.post('/categories/subcategories', data),
};

// ===== CART =====
export const cartApi = {
  get: (sessionId?: string) => api.get('/cart', { params: sessionId ? { sessionId } : undefined }),
  addItem: (data: { productId: string; variantId?: string; quantity: number; sessionId?: string }) =>
    api.post('/cart/items', data),
  updateItem: (itemId: string, quantity: number) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  applyCoupon: (code: string, cartId?: string) => api.post('/cart/coupon', { code, cartId }),
  removeCoupon: (cartId?: string) => api.delete('/cart/coupon', { data: { cartId } }),
  mergeCart: (sessionId: string) => api.post('/cart/merge', { sessionId }),
};

export const promotionsApi = {
  getActive: () => api.get('/promotions'),
  applyCoupon: (code: string, cartTotal: number) => api.post('/promotions/apply', { code, cartTotal }),
};

export const bannersApi = {
  getActive: () => api.get('/banners'),
  getAllAdmin: () => api.get('/banners/admin'),
  create: (data: any) => api.post('/banners', data),
  update: (id: string, data: any) => api.put(`/banners/${id}`, data),
  delete: (id: string) => api.delete(`/banners/${id}`),
};

export const campaignsApi = {
  getActive: () => api.get('/campaigns'),
  getAllAdmin: () => api.get('/campaigns/admin'),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  create: (data: any) => api.post('/campaigns', data),
  update: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
};

// ===== ORDERS =====
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  createRazorpay: (data: { orderId: string }) => api.post('/payments/create', data),
  verifyPayment: (data: any) => api.post('/payments/verify', data),
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  adminGetAll: (params?: any) => api.get('/admin/orders', { params }),
  adminGetById: (id: string) => api.get(`/admin/orders/${id}`),
  adminUpdateStatus: (id: string, data: any) => api.put(`/admin/orders/${id}/status`, data),
};

// ===== USER =====
export const userApi = {
  getWishlist: () => api.get('/user/wishlist'),
  addToWishlist: (productId: string) => api.post('/user/wishlist', { productId }),
  removeFromWishlist: (productId: string) => api.delete(`/user/wishlist/${productId}`),
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (data: any) => api.post('/user/addresses', data),
  updateAddress: (id: string, data: any) => api.put(`/user/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/user/addresses/${id}`),
  // Reviews
  addReview: (data: any) => api.post('/user/reviews', data).then(res => res.data),
  updateReview: (id: string, data: any) => api.put(`/user/reviews/${id}`, data).then(res => res.data),
  deleteReview: (id: string) => api.delete(`/user/reviews/${id}`).then(res => res.data),

  // User Notifications
  getNotifications: () => api.get('/user/notifications').then(res => res.data),
  markNotificationRead: (id: string) => api.put(`/user/notifications/${id}/read`).then(res => res.data),
  markAllNotificationsRead: () => api.put('/user/notifications/read-all').then(res => res.data),
};

// ===== ADMIN =====
export const adminApi = {
  getDashboard: (params?: { filter?: string; startDate?: string; endDate?: string }) => api.get('/admin/dashboard', { params }),
  getPayments: (params?: Record<string, any>) => api.get('/admin/payments', { params }),
  
  // Delivery & Shipping Zones
  getShippingZones: () => api.get('/admin/shipping-zones'),
  createShippingZone: (data: any) => api.post('/admin/shipping-zones', data),
  updateShippingZone: (id: string, data: any) => api.put(`/admin/shipping-zones/${id}`, data),
  deleteShippingZone: (id: string) => api.delete(`/admin/shipping-zones/${id}`),
  // Customers
  getCustomers: (params?: Record<string, any>) => api.get('/admin/customers', { params }),
  toggleUserStatus: (id: string) => api.put(`/admin/customers/${id}/toggle-status`),
  // Banners
  getBanners: (placement?: string) => api.get('/admin/banners', { params: placement ? { placement } : undefined }),
  createBanner: (data: any) => api.post('/admin/banners', data),
  updateBanner: (id: string, data: any) => api.put(`/admin/banners/${id}`, data),
  deleteBanner: (id: string) => api.delete(`/admin/banners/${id}`),

  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data: any) => api.post('/admin/coupons', data),
  updateCoupon: (id: string, data: any) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`),
  // Reviews
  getReviews: () => api.get('/admin/reviews'),
  updateReviewStatus: (id: string, data: any) => api.put(`/admin/reviews/${id}/status`, data),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings: Record<string, string>) => api.put('/admin/settings', { settings }),
  // Support
  createTicket: (data: any) => api.post('/admin/support', data),
  getTickets: () => api.get('/admin/support'),
  // Audit Logs
  getAuditLogs: () => api.get('/admin/audit-logs'),
  // Inventory
  getInventoryStats: () => api.get('/admin/inventory/stats'),
  getInventoryList: (params?: Record<string, any>) => api.get('/admin/inventory/list', { params }),
  adjustStock: (data: { id: string; isVariant: boolean; type: string; quantity: number; note?: string }) => api.post('/admin/inventory/adjust', data),
  getStockHistory: (id: string, isVariant: boolean) => api.get('/admin/inventory/history', { params: { id, isVariant } }),
  // Promotions
  getPromotions: () => api.get('/admin/promotions'),
  createPromotion: (data: any) => api.post('/admin/promotions', data),
  updatePromotion: (id: string, data: any) => api.put(`/admin/promotions/${id}`, data),
  deletePromotion: (id: string) => api.delete(`/admin/promotions/${id}`),
  // Newsletter
  subscribeNewsletter: (email: string) => api.post('/newsletter/subscribe', { email }),
  // Upload
  uploadImage: (formData: FormData) => api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Stores
import { useAuthStore } from './store/auth.store';
import { useWishlistStore } from './store/wishlist.store';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages (lazy loaded)
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const AddressesPage = lazy(() => import('./pages/AddressesPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));

// Admin (lazy loaded)
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./admin/pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./admin/pages/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('./admin/pages/AdminCategoriesPage'));
const AdminOrdersPage = lazy(() => import('./admin/pages/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('./admin/pages/AdminOrderDetailPage'));
const AdminPaymentsPage = lazy(() => import('./admin/pages/AdminPaymentsPage'));
const AdminDeliveryPage = lazy(() => import('./admin/pages/AdminDeliveryPage'));
const AdminCustomersPage = lazy(() => import('./admin/pages/AdminCustomersPage'));
const AdminCouponsPage = lazy(() => import('./admin/pages/AdminCouponsPage'));
const AdminPromotionsPage = lazy(() => import('./admin/pages/AdminPromotionsPage'));
const AdminBannersPage = lazy(() => import('./admin/pages/AdminBannersPage'));
const AdminCampaignsPage = lazy(() => import('./admin/pages/AdminCampaignsPage'));
const AdminReviewsPage = lazy(() => import('./admin/pages/AdminReviewsPage'));
const AdminInventoryPage = lazy(() => import('./admin/pages/AdminInventoryPage'));
const AdminSettingsPage = lazy(() => import('./admin/pages/AdminSettingsPage'));
const AdminAuditLogsPage = lazy(() => import('./admin/pages/AdminAuditLogsPage'));
const AdminSupportPage = lazy(() => import('./admin/pages/AdminSupportPage'));
const AdminAnalyticsPage = lazy(() => import('./admin/pages/AdminAnalyticsPage'));

import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60 * 1000 },
  },
});

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin) {
    const roleName = typeof user?.role === 'string' ? user.role : (user?.role as any)?.name;
    if (roleName !== 'ADMIN' && roleName !== 'STAFF') return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, fetchMe } = useAuthStore();

  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMe();
      fetchWishlist();
    }
  }, [isAuthenticated]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1A1A1A', color: '#F8F5EE', border: '1px solid rgba(201,162,39,0.3)', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' },
              success: { iconTheme: { primary: '#C9A227', secondary: '#080808' } },
              error: { iconTheme: { primary: '#E53935', secondary: '#F8F5EE' } },
            }}
          />

          <Suspense fallback={<div className="loading-spinner"></div>}>
            <Routes>
              {/* Customer storefront */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="products/:slug" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                <Route path="account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="account/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
                <Route path="account/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="account/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="shipping-policy" element={<ShippingPolicyPage />} />
                <Route path="return-policy" element={<ReturnPolicyPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="track-order" element={<TrackOrderPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Auth pages (no main layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Admin panel */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="inventory" element={<AdminInventoryPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                <Route path="payments" element={<AdminPaymentsPage />} />
                <Route path="delivery" element={<AdminDeliveryPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="promotions" element={<AdminPromotionsPage />} />
                <Route path="banners" element={<AdminBannersPage />} />
                <Route path="campaigns" element={<AdminCampaignsPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="support" element={<AdminSupportPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="audit-logs" element={<AdminAuditLogsPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

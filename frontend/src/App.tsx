import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Stores
import { useAuthStore } from './store/auth.store';
import { useWishlistStore } from './store/wishlist.store';
import { useCartStore } from './store/cart.store';

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
const AdminNewsletterPage = lazy(() => import('./admin/pages/AdminNewsletterPage'));

const NewsletterVerifyPage = lazy(() => import('./pages/NewsletterVerifyPage'));
const NewsletterUnsubscribePage = lazy(() => import('./pages/NewsletterUnsubscribePage'));

import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60 * 1000 },
  },
});

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin) {
    const roleName = typeof user?.role === 'string' ? user.role : (user?.role as any)?.name;
    if (roleName !== 'ADMIN' && roleName !== 'STAFF') return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const fetchMe = useAuthStore(state => state.fetchMe);
  const fetchWishlist = useWishlistStore(state => state.fetchWishlist);
  const fetchCart = useCartStore(state => state.fetchCart);

  useEffect(() => {
    const sessionId = localStorage.getItem('bjs_session_id') || undefined;
    fetchCart(sessionId);
    
    if (isAuthenticated) {
      fetchMe();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart]);

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
                <Route path="newsletter/verify" element={<NewsletterVerifyPage />} />
                <Route path="newsletter/unsubscribe" element={<NewsletterUnsubscribePage />} />
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
                <Route path="newsletter" element={<AdminNewsletterPage />} />
                <Route path="support" element={<AdminSupportPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="audit-logs" element={<AdminAuditLogsPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>
            </Routes>
          </Suspense>
          <a
            href="https://wa.me/919274596622"
            target="_blank"
            rel="noopener noreferrer"
            className="floating-whatsapp"
            aria-label="Chat with us on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

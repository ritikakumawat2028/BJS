import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Stores
import { useAuthStore } from './store/auth.store';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages (lazy loaded)
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AccountPage from './pages/AccountPage';
import AddressesPage from './pages/AddressesPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminProductsPage from './admin/pages/AdminProductsPage';
import AdminCategoriesPage from './admin/pages/AdminCategoriesPage';
import AdminOrdersPage from './admin/pages/AdminOrdersPage';
import AdminOrderDetailPage from './admin/pages/AdminOrderDetailPage';
import AdminPaymentsPage from './admin/pages/AdminPaymentsPage';
import AdminDeliveryPage from './admin/pages/AdminDeliveryPage';
import AdminCustomersPage from './admin/pages/AdminCustomersPage';
import AdminCouponsPage from './admin/pages/AdminCouponsPage';
import AdminPromotionsPage from './admin/pages/AdminPromotionsPage';
import AdminBannersPage from './admin/pages/AdminBannersPage';
import AdminCampaignsPage from './admin/pages/AdminCampaignsPage';
import AdminReviewsPage from './admin/pages/AdminReviewsPage';
import AdminInventoryPage from './admin/pages/AdminInventoryPage';
import AdminSettingsPage from './admin/pages/AdminSettingsPage';
import AdminAuditLogsPage from './admin/pages/AdminAuditLogsPage';
import AdminSupportPage from './admin/pages/AdminSupportPage';

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
  if (requireAdmin && user?.role !== 'ADMIN' && user?.role !== 'STAFF') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, fetchMe } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) fetchMe();
  }, []);

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
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

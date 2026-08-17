// BJ'S Natural Care — TypeScript Types & Interfaces

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  addresses?: Address[];
  _count?: { orders: number };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  shortDescription?: string;
  ingredients?: string;
  benefits?: string;
  howToUse?: string;
  price: number;
  comparePrice?: number;
  taxPercent: number;
  weight?: string;
  gender?: string;
  fragrance?: string;
  tags: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDesc?: string;
  metaKeywords?: string;
  avgRating: number;
  reviewCount: number;
  totalSold: number;
  createdAt: string;
  images: ProductImage[];
  variants: ProductVariant[];
  inventory?: { quantity: number; lowStockThreshold: number };
  category: { name: string; slug: string };
  subcategory?: { name: string; slug: string };
  reviews?: Review[];
  related?: Product[];
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  weight?: string;
  image?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  subcategories: Subcategory[];
  _count?: { products: number };
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'comparePrice' | 'isActive' | 'images' | 'inventory'>;
  variant?: Pick<ProductVariant, 'id' | 'name' | 'price' | 'stock' | 'image'>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  coupon?: Coupon;
}

export interface Address {
  id: string;
  userId: string;
  label?: string;
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCharge: number;
  couponDiscount: number;
  couponCode?: string;
  total: number;
  trackingNumber?: string;
  deliveryPartner?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  payment?: Payment;
  timeline: OrderTimeline[];
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  image?: string;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  message?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  failureReason?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  isVerifiedBuyer: boolean;
  isApproved: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string; avatar?: string };
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate?: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  desktopImage: string;
  mobileImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  couponCode?: string;
  badgeText?: string;
  placement: string;
  priority: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  desktopBanner?: string;
  mobileBanner?: string;
  heading?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  discount?: number;
  couponCode?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface StoreSettings {
  store_name?: string;
  store_logo?: string;
  store_tagline?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  contact_hours?: string;
  default_shipping_charge?: string;
  free_shipping_threshold?: string;
  tax_rate?: string;
  cod_enabled?: string;
  razorpay_key_id?: string;
  razorpay_key_secret?: string;
  razorpay_webhook_secret?: string;
  email_host?: string;
  email_port?: string;
  email_user?: string;
  email_pass?: string;
  email_from?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  other_links?: string;
  meta_title?: string;
  meta_description?: string;
  sitemap_enabled?: string;
  hero_heading?: string;
  hero_subheading?: string;
  about_heading?: string;
  about_text?: string;
  footer_desc?: string;
  about_content?: string;
  contact_text?: string;
  faq_content?: string;
  privacy_policy?: string;
  terms_conditions?: string;
  shipping_policy?: string;
  return_policy?: string;
  announcement_text?: string;
  announcement_link?: string;
  announcement_active?: string;
  [key: string]: string | undefined;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
  inStock?: boolean;
  sort?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
}

// Enums
export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED'
  | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED' | 'REFUNDED';

export type PaymentStatus =
  | 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export type PaymentMethod =
  | 'RAZORPAY' | 'COD' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';

export type AdminDashboard = {
  summary: {
    totalRevenue: number;
    todayRevenue: number;
    monthRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockProducts: number;
  };
  charts: {
    revenue: { createdAt: string; _sum: { total: number } }[];
    topProducts: { productName: string; _sum: { quantity: number; total: number } }[];
    categoryStats: { categoryId: string; _count: { id: number } }[];
  };
};

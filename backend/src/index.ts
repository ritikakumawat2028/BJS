import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import paymentRoutes from './routes/payment.routes';
import promotionRoutes from './routes/promotion.routes';
import sitemapRoutes from './routes/sitemap.routes';
import uploadRoutes from './routes/upload.routes';
import bannerRoutes from './routes/banner.routes';
import campaignRoutes from './routes/campaign.routes';
import path from 'path';
import { errorHandler } from './middleware/error';
import prisma from './config/prisma';

const app = express();
const PORT = process.env.PORT || 5000;

// ===== SECURITY =====
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { success: false, message: 'Too many requests' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many authentication attempts' } });

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ===== BODY PARSING =====
// Raw body for Razorpay webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(hpp()); // Prevent HTTP Parameter Pollution

// ===== LOGGING =====
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ===== HEALTH =====
app.get('/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/admin', adminRoutes);

// Sitemap
app.use('/api/sitemap.xml', sitemapRoutes);
app.use('/api/payments', paymentRoutes);

// Static uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, message: 'Endpoint not found' }));

// Global error handler
app.use(errorHandler);

// ===== START =====
const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 BJ\'S Natural Care API running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  }
};

start();

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

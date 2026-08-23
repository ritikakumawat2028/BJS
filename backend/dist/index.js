"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const hpp_1 = __importDefault(require("hpp"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const promotion_routes_1 = __importDefault(require("./routes/promotion.routes"));
const sitemap_routes_1 = __importDefault(require("./routes/sitemap.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const banner_routes_1 = __importDefault(require("./routes/banner.routes"));
const campaign_routes_1 = __importDefault(require("./routes/campaign.routes"));
const path_1 = __importDefault(require("path"));
const error_1 = require("./middleware/error");
const prisma_1 = __importDefault(require("./config/prisma"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ===== SECURITY =====
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://www.bjsluxe.com',
    'https://bjsluxe.com',
    'http://localhost:5173'
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use((0, cookie_parser_1.default)());
// Apply rate limiting (only in production)
if (process.env.NODE_ENV === 'production') {
    const apiLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 200, message: { success: false, message: 'Too many requests' } });
    const authLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many authentication attempts' } });
    app.use('/api/', apiLimiter);
    app.use('/api/auth/', authLimiter);
}
// ===== BODY PARSING =====
// Raw body for Razorpay webhook
app.use('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, hpp_1.default)()); // Prevent HTTP Parameter Pollution
// ===== LOGGING =====
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
// ===== HEALTH =====
app.get('/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));
// ===== ROUTES =====
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/banners', banner_routes_1.default);
app.use('/api/campaigns', campaign_routes_1.default);
app.use('/api/promotions', promotion_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// Sitemap
app.use('/api/sitemap.xml', sitemap_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
// Static uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'public', 'uploads')));
// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, message: 'Endpoint not found' }));
// Global error handler
app.use(error_1.errorHandler);
// ===== START =====
const start = async () => {
    try {
        await prisma_1.default.$connect();
        console.log('✅ Database connected');
        app.listen(PORT, () => {
            console.log(`🚀 BJ\'S Natural Care API running on http://localhost:${PORT}`);
            console.log(`📦 Environment: ${process.env.NODE_ENV}`);
        });
    }
    catch (err) {
        console.error('❌ Failed to connect to database:', err);
        process.exit(1);
    }
};
start();
process.on('SIGTERM', async () => {
    await prisma_1.default.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCreateAdmin = exports.adminDeleteShippingZone = exports.adminUpdateShippingZone = exports.adminCreateShippingZone = exports.adminGetShippingZones = exports.adminGetPayments = exports.adminUpdatePromotion = exports.adminCreatePromotion = exports.adminGetPromotions = exports.deleteReview = exports.updateReviewStatus = exports.getReviews = exports.adminGetInventory = exports.getCustomers = exports.subscribeNewsletter = exports.adminGetAuditLogs = exports.adminGetSupportTickets = exports.createSupportTicket = exports.adminUpdateSettings = exports.getStoreSettings = exports.adminDeleteReview = exports.adminApproveReview = exports.adminGetReviews = exports.adminDeleteCoupon = exports.adminUpdateCoupon = exports.adminCreateCoupon = exports.adminGetCoupons = exports.adminUpdateCampaign = exports.adminCreateCampaign = exports.getActiveCampaigns = exports.adminDeleteBanner = exports.adminUpdateBanner = exports.adminCreateBanner = exports.getBanners = exports.adminToggleUserStatus = exports.adminGetCustomers = exports.getDashboard = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../config/prisma"));
const error_1 = require("../middleware/error");
const audit_1 = require("../utils/audit");
// ========== DASHBOARD ANALYTICS ==========
exports.getDashboard = (0, error_1.asyncHandler)(async (req, res) => {
    const { filter = '30days', startDate: customStart, endDate: customEnd } = req.query;
    let start = new Date();
    let end = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (filter) {
        case 'today':
            start = new Date(today);
            end = new Date(today);
            end.setHours(23, 59, 59, 999);
            break;
        case 'yesterday':
            start = new Date(today);
            start.setDate(start.getDate() - 1);
            end = new Date(start);
            end.setHours(23, 59, 59, 999);
            break;
        case '7days':
            start = new Date(today);
            start.setDate(start.getDate() - 7);
            end = new Date();
            break;
        case '30days':
            start = new Date(today);
            start.setDate(start.getDate() - 30);
            end = new Date();
            break;
        case 'this_month':
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date();
            break;
        case 'last_month':
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'custom':
            if (customStart)
                start = new Date(customStart);
            if (customEnd)
                end = new Date(customEnd);
            end.setHours(23, 59, 59, 999);
            break;
        default:
            start = new Date(today);
            start.setDate(start.getDate() - 30);
            end = new Date();
            break;
    }
    const dateFilter = {
        gte: start,
        lte: end
    };
    const [allOrders, pendingOrdersCount, completedOrdersCount, refundsCount, newCustomersCount, totalCustomersCount, totalProducts, lowStockProducts, topProducts, categoryStats, paymentStats] = await Promise.all([
        prisma_1.default.order.findMany({
            where: { createdAt: dateFilter },
            select: { id: true, total: true, paymentStatus: true, createdAt: true, status: true, paymentMethod: true }
        }),
        prisma_1.default.order.count({ where: { status: 'PENDING', createdAt: dateFilter } }),
        prisma_1.default.order.count({ where: { status: 'DELIVERED', createdAt: dateFilter } }),
        prisma_1.default.order.count({ where: { status: 'REFUNDED', createdAt: dateFilter } }),
        prisma_1.default.user.count({ where: { role: { name: 'CUSTOMER' }, createdAt: dateFilter } }),
        prisma_1.default.user.count({ where: { role: { name: 'CUSTOMER' } } }),
        prisma_1.default.product.count({ where: { isActive: true } }),
        prisma_1.default.inventory.findMany().then(inv => inv.filter(i => i.quantity <= i.lowStockThreshold).length),
        prisma_1.default.orderItem.groupBy({
            by: ['productName'],
            where: { order: { paymentStatus: 'PAID', createdAt: dateFilter } },
            _sum: { quantity: true, total: true },
            orderBy: { _sum: { total: 'desc' } },
            take: 5,
        }),
        prisma_1.default.product.groupBy({
            by: ['categoryId'], where: { isActive: true }, _count: { id: true },
        }),
        prisma_1.default.order.groupBy({
            by: ['paymentMethod'], where: { createdAt: dateFilter }, _count: { id: true },
        }),
    ]);
    const paidOrders = allOrders.filter(o => o.paymentStatus === 'PAID');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = allOrders.length;
    const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
    // Conversion Rate: Paid Orders / Total Orders attempted in that period
    const conversionRate = totalOrders > 0 ? (paidOrders.length / totalOrders) * 100 : 0;
    // For charts, we can just pass the raw orders data, and let frontend group by date, or group it here.
    // We'll pass grouped data to keep frontend simple.
    const revenueChartMap = new Map();
    const ordersChartMap = new Map();
    paidOrders.forEach(o => {
        const d = new Date(o.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD
        revenueChartMap.set(d, (revenueChartMap.get(d) || 0) + Number(o.total));
    });
    allOrders.forEach(o => {
        const d = new Date(o.createdAt).toLocaleDateString('en-CA');
        ordersChartMap.set(d, (ordersChartMap.get(d) || 0) + 1);
    });
    const revenueChart = Array.from(revenueChartMap.entries()).map(([date, total]) => ({ createdAt: new Date(date), _sum: { total } })).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const ordersChart = Array.from(ordersChartMap.entries()).map(([date, count]) => ({ createdAt: new Date(date), _count: { id: count } })).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    res.json({
        success: true,
        data: {
            summary: {
                totalRevenue,
                averageOrderValue,
                conversionRate,
                totalOrders,
                pendingOrders: pendingOrdersCount,
                completedOrders: completedOrdersCount,
                newCustomers: newCustomersCount,
                totalCustomers: totalCustomersCount,
                totalProducts,
                lowStockProducts,
                refunds: refundsCount,
            },
            charts: {
                revenue: revenueChart,
                orders: ordersChart,
                topProducts,
                categoryStats,
                paymentStats
            },
        },
    });
});
// ========== CUSTOMERS ==========
exports.adminGetCustomers = (0, error_1.asyncHandler)(async (req, res) => {
    const { page = '1', limit = '20', search, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { role: { name: 'CUSTOMER' } };
    if (search)
        where.OR = [{ email: { contains: search, mode: 'insensitive' } }, { firstName: { contains: search, mode: 'insensitive' } }];
    if (status === 'active')
        where.isActive = true;
    if (status === 'blocked')
        where.isActive = false;
    const [customers, total] = await Promise.all([
        prisma_1.default.user.findMany({
            where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
            select: {
                id: true, email: true, firstName: true, lastName: true, phone: true,
                isActive: true, createdAt: true,
                _count: { select: { orders: true } },
                orders: { select: { total: true, createdAt: true }, where: { paymentStatus: 'PAID' }, orderBy: { createdAt: 'desc' } },
            },
        }),
        prisma_1.default.user.count({ where }),
    ]);
    res.json({ success: true, data: customers, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});
exports.adminToggleUserStatus = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = await prisma_1.default.user.findUnique({ where: { id }, include: { role: true } });
    if (!user || user.role?.name === 'ADMIN')
        throw (0, error_1.createError)('Cannot modify this user', 400);
    const updated = await prisma_1.default.user.update({ where: { id }, data: { isActive: !user.isActive } });
    await prisma_1.default.adminActivityLog.create({
        data: { adminId: req.user.userId, action: updated.isActive ? 'UNBLOCK_USER' : 'BLOCK_USER', entity: 'User', entityId: id },
    });
    res.json({ success: true, message: `User ${updated.isActive ? 'unblocked' : 'blocked'}`, data: { isActive: updated.isActive } });
});
// ========== BANNERS & CAMPAIGNS ==========
exports.getBanners = (0, error_1.asyncHandler)(async (req, res) => {
    const { placement } = req.query;
    const now = new Date();
    const where = {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    };
    if (placement)
        where.placement = placement;
    const banners = await prisma_1.default.banner.findMany({ where, orderBy: { priority: 'desc' } });
    res.json({ success: true, data: banners });
});
exports.adminCreateBanner = (0, error_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.priority !== undefined)
        data.priority = Number(data.priority);
    if (data.startDate)
        data.startDate = new Date(data.startDate);
    if (data.endDate)
        data.endDate = new Date(data.endDate);
    const banner = await prisma_1.default.banner.create({ data });
    res.status(201).json({ success: true, data: banner });
});
exports.adminUpdateBanner = (0, error_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.priority !== undefined)
        data.priority = Number(data.priority);
    if (data.startDate)
        data.startDate = new Date(data.startDate);
    if (data.endDate)
        data.endDate = new Date(data.endDate);
    const banner = await prisma_1.default.banner.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: banner });
});
exports.adminDeleteBanner = (0, error_1.asyncHandler)(async (req, res) => {
    await prisma_1.default.banner.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Banner deleted' });
});
exports.getActiveCampaigns = (0, error_1.asyncHandler)(async (_req, res) => {
    const now = new Date();
    const campaigns = await prisma_1.default.campaign.findMany({
        where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
        orderBy: { priority: 'desc' },
    });
    res.json({ success: true, data: campaigns });
});
exports.adminCreateCampaign = (0, error_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.priority !== undefined)
        data.priority = Number(data.priority);
    if (data.discount !== undefined)
        data.discount = Number(data.discount);
    if (data.startDate)
        data.startDate = new Date(data.startDate);
    if (data.endDate)
        data.endDate = new Date(data.endDate);
    const campaign = await prisma_1.default.campaign.create({ data });
    res.status(201).json({ success: true, data: campaign });
});
exports.adminUpdateCampaign = (0, error_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.priority !== undefined)
        data.priority = Number(data.priority);
    if (data.discount !== undefined)
        data.discount = Number(data.discount);
    if (data.startDate)
        data.startDate = new Date(data.startDate);
    if (data.endDate)
        data.endDate = new Date(data.endDate);
    const campaign = await prisma_1.default.campaign.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: campaign });
});
// ========== COUPONS ==========
exports.adminGetCoupons = (0, error_1.asyncHandler)(async (_req, res) => {
    const coupons = await prisma_1.default.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        include: { products: true, categories: true }
    });
    res.json({ success: true, data: coupons });
});
exports.adminCreateCoupon = (0, error_1.asyncHandler)(async (req, res) => {
    const { code, products, categories, ...rest } = req.body;
    const coupon = await prisma_1.default.$transaction(async (tx) => {
        const newCoupon = await tx.coupon.create({ data: { ...rest, code: code.toUpperCase() } });
        if (rest.applicableType === 'PRODUCT' && products && products.length > 0) {
            await tx.couponProduct.createMany({ data: products.map((id) => ({ couponId: newCoupon.id, productId: id })) });
        }
        else if (rest.applicableType === 'CATEGORY' && categories && categories.length > 0) {
            await tx.couponCategory.createMany({ data: categories.map((id) => ({ couponId: newCoupon.id, categoryId: id })) });
        }
        return newCoupon;
    });
    res.status(201).json({ success: true, data: coupon });
});
exports.adminUpdateCoupon = (0, error_1.asyncHandler)(async (req, res) => {
    const { products, categories, ...rest } = req.body;
    const couponId = req.params.id;
    const coupon = await prisma_1.default.$transaction(async (tx) => {
        const updated = await tx.coupon.update({ where: { id: couponId }, data: rest });
        await tx.couponProduct.deleteMany({ where: { couponId } });
        await tx.couponCategory.deleteMany({ where: { couponId } });
        if (rest.applicableType === 'PRODUCT' && products && products.length > 0) {
            await tx.couponProduct.createMany({ data: products.map((id) => ({ couponId, productId: id })) });
        }
        else if (rest.applicableType === 'CATEGORY' && categories && categories.length > 0) {
            await tx.couponCategory.createMany({ data: categories.map((id) => ({ couponId, categoryId: id })) });
        }
        return updated;
    });
    res.json({ success: true, data: coupon });
});
exports.adminDeleteCoupon = (0, error_1.asyncHandler)(async (req, res) => {
    await prisma_1.default.coupon.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Coupon deleted' });
});
// ========== REVIEWS ADMIN ==========
exports.adminGetReviews = (0, error_1.asyncHandler)(async (req, res) => {
    const { page = '1', status } = req.query;
    const where = {};
    if (status === 'pending')
        where.isApproved = false;
    if (status === 'approved')
        where.isApproved = true;
    const reviews = await prisma_1.default.review.findMany({
        where, skip: (parseInt(page) - 1) * 20, take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            product: { select: { name: true, slug: true } },
        },
    });
    res.json({ success: true, data: reviews });
});
exports.adminApproveReview = (0, error_1.asyncHandler)(async (req, res) => {
    const review = await prisma_1.default.review.update({ where: { id: req.params.id }, data: { isApproved: true } });
    // Update product avg rating
    const stats = await prisma_1.default.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true }, _count: { rating: true },
    });
    await prisma_1.default.product.update({
        where: { id: review.productId },
        data: { avgRating: stats._avg.rating || 0, reviewCount: stats._count.rating },
    });
    res.json({ success: true, message: 'Review approved' });
});
exports.adminDeleteReview = (0, error_1.asyncHandler)(async (req, res) => {
    await prisma_1.default.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Review deleted' });
});
// ========== SETTINGS ==========
const SENSITIVE_KEYS = ['razorpay_key_secret', 'razorpay_webhook_secret', 'email_pass'];
exports.getStoreSettings = (0, error_1.asyncHandler)(async (_req, res) => {
    const settings = await prisma_1.default.storeSettings.findMany();
    const settingsMap = settings.reduce((acc, s) => {
        if (SENSITIVE_KEYS.includes(s.key) && s.value) {
            acc[s.key] = '********'; // Mask sensitive data
        }
        else {
            acc[s.key] = s.value;
        }
        return acc;
    }, {});
    res.json({ success: true, data: settingsMap });
});
exports.adminUpdateSettings = (0, error_1.asyncHandler)(async (req, res) => {
    const { settings } = req.body;
    const promises = Object.entries(settings).map(([key, value]) => {
        // Skip updating sensitive fields if they haven't been changed from the masked placeholder
        if (SENSITIVE_KEYS.includes(key) && value === '********') {
            return Promise.resolve();
        }
        return prisma_1.default.storeSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value, type: 'text' },
        });
    });
    await Promise.all(promises);
    await (0, audit_1.logAdminAction)({
        adminId: req.user.userId,
        action: 'UPDATE_SETTINGS',
        entity: 'Settings',
        newValue: settings,
    });
    res.json({ success: true, message: 'Settings updated' });
});
// ========== SUPPORT TICKETS ==========
exports.createSupportTicket = (0, error_1.asyncHandler)(async (req, res) => {
    const ticket = await prisma_1.default.supportTicket.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Support ticket submitted', data: ticket });
});
exports.adminGetSupportTickets = (0, error_1.asyncHandler)(async (req, res) => {
    const tickets = await prisma_1.default.supportTicket.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: tickets });
});
// ========== AUDIT LOGS ==========
exports.adminGetAuditLogs = (0, error_1.asyncHandler)(async (req, res) => {
    const logs = await prisma_1.default.adminActivityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { admin: { select: { firstName: true, lastName: true, email: true } } },
    });
    res.json({ success: true, data: logs });
});
// ========== NEWSLETTER ==========
exports.subscribeNewsletter = (0, error_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    await prisma_1.default.newsletterSubscriber.upsert({ where: { email }, update: { isActive: true }, create: { email } });
    res.json({ success: true, message: 'Subscribed successfully' });
});
// ========== INVENTORY OVERVIEW ==========
exports.getCustomers = (0, error_1.asyncHandler)(async (req, res) => {
    const customers = await prisma_1.default.user.findMany({
        where: { role: { name: 'CUSTOMER' } },
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, createdAt: true,
            orders: { select: { id: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: customers });
});
// ========== INVENTORY OVERVIEW ==========
exports.adminGetInventory = (0, error_1.asyncHandler)(async (req, res) => {
    const inventory = await prisma_1.default.inventory.findMany({
        include: {
            product: { select: { name: true, sku: true, isActive: true, images: { where: { isThumbnail: true }, take: 1 } } },
        },
        orderBy: { quantity: 'asc' },
    });
    res.json({ success: true, data: inventory });
});
// ========== REVIEWS ==========
exports.getReviews = (0, error_1.asyncHandler)(async (req, res) => {
    const reviews = await prisma_1.default.review.findMany({
        include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            product: { select: { id: true, name: true, images: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: reviews });
});
exports.updateReviewStatus = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { isApproved, adminReply } = req.body;
    const review = await prisma_1.default.review.findUnique({ where: { id } });
    if (!review)
        throw (0, error_1.createError)('Review not found', 404);
    const updatedReview = await prisma_1.default.review.update({
        where: { id },
        data: {
            isApproved: isApproved !== undefined ? isApproved : review.isApproved,
            adminReply: adminReply !== undefined ? adminReply : review.adminReply
        }
    });
    // Recalculate average rating for product
    const allReviews = await prisma_1.default.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
    });
    await prisma_1.default.product.update({
        where: { id: review.productId },
        data: { avgRating: allReviews._avg.rating || 0, reviewCount: allReviews._count.rating },
    });
    res.json({ success: true, message: 'Review updated', data: updatedReview });
});
exports.deleteReview = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const review = await prisma_1.default.review.findUnique({ where: { id } });
    if (!review)
        throw (0, error_1.createError)('Review not found', 404);
    await prisma_1.default.review.delete({ where: { id } });
    // Recalculate average rating for product
    const allReviews = await prisma_1.default.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
    });
    await prisma_1.default.product.update({
        where: { id: review.productId },
        data: { avgRating: allReviews._avg.rating || 0, reviewCount: allReviews._count.rating },
    });
    res.json({ success: true, message: 'Review deleted' });
});
// ========== PROMOTIONS ==========
exports.adminGetPromotions = (0, error_1.asyncHandler)(async (_req, res) => {
    const promotions = await prisma_1.default.promotion.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: promotions });
});
exports.adminCreatePromotion = (0, error_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.discountValue !== undefined)
        data.discountValue = data.discountValue ? Number(data.discountValue) : null;
    if (data.buyQuantity !== undefined)
        data.buyQuantity = data.buyQuantity ? Number(data.buyQuantity) : null;
    if (data.getQuantity !== undefined)
        data.getQuantity = data.getQuantity ? Number(data.getQuantity) : null;
    if (data.minOrderAmount !== undefined)
        data.minOrderAmount = data.minOrderAmount ? Number(data.minOrderAmount) : null;
    if (data.startDate)
        data.startDate = new Date(data.startDate);
    if (data.endDate)
        data.endDate = new Date(data.endDate);
    const promotion = await prisma_1.default.promotion.create({ data });
    res.status(201).json({ success: true, data: promotion });
});
exports.adminUpdatePromotion = (0, error_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.discountValue !== undefined)
        data.discountValue = data.discountValue ? Number(data.discountValue) : null;
    if (data.buyQuantity !== undefined)
        data.buyQuantity = data.buyQuantity ? Number(data.buyQuantity) : null;
    if (data.getQuantity !== undefined)
        data.getQuantity = data.getQuantity ? Number(data.getQuantity) : null;
    if (data.minOrderAmount !== undefined)
        data.minOrderAmount = data.minOrderAmount ? Number(data.minOrderAmount) : null;
    if (data.startDate)
        data.startDate = new Date(data.startDate);
    if (data.endDate)
        data.endDate = new Date(data.endDate);
    const promotion = await prisma_1.default.promotion.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: promotion });
});
// ========== PAYMENTS ==========
exports.adminGetPayments = (0, error_1.asyncHandler)(async (req, res) => {
    const { page = '1', limit = '20', status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (status) {
        if (status === 'REFUNDED') {
            where.order = { paymentStatus: 'REFUNDED' };
        }
        else {
            where.status = status;
        }
    }
    if (search) {
        where.OR = [
            { razorpayPaymentId: { contains: search, mode: 'insensitive' } },
            { razorpayOrderId: { contains: search, mode: 'insensitive' } },
            { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
            { order: { user: { email: { contains: search, mode: 'insensitive' } } } },
        ];
    }
    const [payments, total] = await Promise.all([
        prisma_1.default.payment.findMany({
            where,
            skip,
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        paymentStatus: true,
                        user: { select: { firstName: true, lastName: true, email: true } },
                        refund: { select: { status: true, amount: true } }
                    }
                }
            }
        }),
        prisma_1.default.payment.count({ where }),
    ]);
    res.json({ success: true, data: payments, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});
// ========== SHIPPING ZONES ==========
exports.adminGetShippingZones = (0, error_1.asyncHandler)(async (req, res) => {
    const zones = await prisma_1.default.shipping.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: zones });
});
exports.adminCreateShippingZone = (0, error_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.shippingCharge !== undefined)
        data.shippingCharge = Number(data.shippingCharge);
    if (data.freeAbove !== undefined)
        data.freeAbove = data.freeAbove ? Number(data.freeAbove) : null;
    const zone = await prisma_1.default.shipping.create({ data });
    res.status(201).json({ success: true, data: zone });
});
exports.adminUpdateShippingZone = (0, error_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.shippingCharge !== undefined)
        data.shippingCharge = Number(data.shippingCharge);
    if (data.freeAbove !== undefined)
        data.freeAbove = data.freeAbove ? Number(data.freeAbove) : null;
    const zone = await prisma_1.default.shipping.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: zone });
});
exports.adminDeleteShippingZone = (0, error_1.asyncHandler)(async (req, res) => {
    await prisma_1.default.shipping.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Shipping zone deleted' });
});
// ========== ADMIN CREATION ==========
exports.adminCreateAdmin = (0, error_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing)
        throw (0, error_1.createError)('Email already registered', 400);
    let adminRole = await prisma_1.default.role.findUnique({ where: { name: 'ADMIN' } });
    if (!adminRole) {
        adminRole = await prisma_1.default.role.create({ data: { name: 'ADMIN', description: 'Administrator Role' } });
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const emailVerifyToken = crypto_1.default.randomBytes(32).toString('hex');
    const user = await prisma_1.default.user.create({
        data: {
            email,
            passwordHash,
            firstName,
            lastName,
            phone,
            roleId: adminRole.id,
            emailVerifyToken,
            isEmailVerified: true // Admins created by admins can be pre-verified
        },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    await (0, audit_1.logAdminAction)({
        adminId: req.user.userId,
        action: 'CREATE_ADMIN',
        entity: 'User',
        entityId: user.id,
        newValue: { email, firstName, lastName, phone, role: 'ADMIN' },
    });
    res.status(201).json({ success: true, message: 'Administrator created successfully', data: user });
});
//# sourceMappingURL=admin.controller.js.map
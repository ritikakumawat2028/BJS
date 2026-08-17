import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { asyncHandler, createError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

// ========== DASHBOARD ANALYTICS ==========
export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { period = '30' } = req.query as Record<string, string>;
  const days = parseInt(period);
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalRevenue, todayRevenue, monthRevenue,
    totalOrders, pendingOrders, completedOrders, refunds,
    totalCustomers, totalProducts, lowStockProducts,
    revenueChart, ordersChart, topProducts, categoryStats, paymentStats
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: today } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: monthStart } }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    prisma.order.count({ where: { status: 'REFUNDED' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.inventory.count({ where: { quantity: { lte: prisma.inventory.fields.lowStockThreshold } } }),
    prisma.order.groupBy({
      by: ['createdAt'], where: { paymentStatus: 'PAID', createdAt: { gte: startDate } },
      _sum: { total: true }, orderBy: { createdAt: 'asc' },
    }),
    prisma.order.groupBy({
      by: ['createdAt'], where: { createdAt: { gte: startDate } },
      _count: { id: true }, orderBy: { createdAt: 'asc' },
    }),
    prisma.orderItem.groupBy({
      by: ['productName'], _sum: { quantity: true, total: true },
      orderBy: { _sum: { total: 'desc' } }, take: 5,
    }),
    prisma.product.groupBy({
      by: ['categoryId'], where: { isActive: true }, _count: { id: true },
    }),
    prisma.order.groupBy({
      by: ['paymentMethod'], _count: { id: true },
    }),
  ]);

  res.json({
    success: true,
    data: {
      summary: {
        totalRevenue: totalRevenue._sum.total || 0,
        todayRevenue: todayRevenue._sum.total || 0,
        monthRevenue: monthRevenue._sum.total || 0,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalCustomers,
        totalProducts,
        lowStockProducts,
        refunds,
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
export const adminGetCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '20', search, status } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: any = { role: 'CUSTOMER' };
  if (search) where.OR = [{ email: { contains: search, mode: 'insensitive' } }, { firstName: { contains: search, mode: 'insensitive' } }];
  if (status === 'active') where.isActive = true;
  if (status === 'blocked') where.isActive = false;

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        isActive: true, createdAt: true,
        _count: { select: { orders: true } },
        orders: { select: { total: true, createdAt: true }, where: { paymentStatus: 'PAID' }, orderBy: { createdAt: 'desc' } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({ success: true, data: customers, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});

export const adminToggleUserStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role === 'ADMIN') throw createError('Cannot modify this user', 400);

  const updated = await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
  await prisma.adminActivityLog.create({
    data: { adminId: req.user!.userId, action: updated.isActive ? 'UNBLOCK_USER' : 'BLOCK_USER', entity: 'User', entityId: id },
  });
  res.json({ success: true, message: `User ${updated.isActive ? 'unblocked' : 'blocked'}`, data: { isActive: updated.isActive } });
});

// ========== BANNERS & CAMPAIGNS ==========
export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  const { placement } = req.query as Record<string, string>;
  const now = new Date();
  const where: any = {
    isActive: true,
    OR: [{ startDate: null }, { startDate: { lte: now } }],
    AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
  };
  if (placement) where.placement = placement;

  const banners = await prisma.banner.findMany({ where, orderBy: { priority: 'desc' } });
  res.json({ success: true, data: banners });
});

export const adminCreateBanner = asyncHandler(async (req: AuthRequest, res: Response) => {
  const banner = await prisma.banner.create({ data: req.body });
  res.status(201).json({ success: true, data: banner });
});

export const adminUpdateBanner = asyncHandler(async (req: AuthRequest, res: Response) => {
  const banner = await prisma.banner.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: banner });
});

export const adminDeleteBanner = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.banner.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Banner deleted' });
});

export const getActiveCampaigns = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const campaigns = await prisma.campaign.findMany({
    where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
    orderBy: { priority: 'desc' },
  });
  res.json({ success: true, data: campaigns });
});

export const adminCreateCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaign = await prisma.campaign.create({ data: req.body });
  res.status(201).json({ success: true, data: campaign });
});

export const adminUpdateCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const campaign = await prisma.campaign.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: campaign });
});

// ========== COUPONS ==========
export const adminGetCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await prisma.coupon.findMany({ 
    orderBy: { createdAt: 'desc' },
    include: { products: true, categories: true }
  });
  res.json({ success: true, data: coupons });
});

export const adminCreateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, products, categories, ...rest } = req.body;
  const coupon = await prisma.$transaction(async (tx) => {
    const newCoupon = await tx.coupon.create({ data: { ...rest, code: code.toUpperCase() } });
    
    if (rest.applicableType === 'PRODUCT' && products && products.length > 0) {
      await tx.couponProduct.createMany({ data: products.map((id: string) => ({ couponId: newCoupon.id, productId: id })) });
    } else if (rest.applicableType === 'CATEGORY' && categories && categories.length > 0) {
      await tx.couponCategory.createMany({ data: categories.map((id: string) => ({ couponId: newCoupon.id, categoryId: id })) });
    }
    return newCoupon;
  });
  res.status(201).json({ success: true, data: coupon });
});

export const adminUpdateCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { products, categories, ...rest } = req.body;
  const couponId = req.params.id;
  
  const coupon = await prisma.$transaction(async (tx) => {
    const updated = await tx.coupon.update({ where: { id: couponId }, data: rest });
    
    await tx.couponProduct.deleteMany({ where: { couponId } });
    await tx.couponCategory.deleteMany({ where: { couponId } });

    if (rest.applicableType === 'PRODUCT' && products && products.length > 0) {
      await tx.couponProduct.createMany({ data: products.map((id: string) => ({ couponId, productId: id })) });
    } else if (rest.applicableType === 'CATEGORY' && categories && categories.length > 0) {
      await tx.couponCategory.createMany({ data: categories.map((id: string) => ({ couponId, categoryId: id })) });
    }
    return updated;
  });
  res.json({ success: true, data: coupon });
});

export const adminDeleteCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.coupon.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Coupon deleted' });
});

// ========== REVIEWS ADMIN ==========
export const adminGetReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', status } = req.query as Record<string, string>;
  const where: any = {};
  if (status === 'pending') where.isApproved = false;
  if (status === 'approved') where.isApproved = true;

  const reviews = await prisma.review.findMany({
    where, skip: (parseInt(page) - 1) * 20, take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
  });
  res.json({ success: true, data: reviews });
});

export const adminApproveReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await prisma.review.update({ where: { id: req.params.id }, data: { isApproved: true } });

  // Update product avg rating
  const stats = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true }, _count: { rating: true },
  });
  await prisma.product.update({
    where: { id: review.productId },
    data: { avgRating: stats._avg.rating || 0, reviewCount: stats._count.rating },
  });

  res.json({ success: true, message: 'Review approved' });
});

export const adminDeleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Review deleted' });
});

// ========== SETTINGS ==========
export const getStoreSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await prisma.storeSettings.findMany();
  const settingsMap = settings.reduce((acc: Record<string, string>, s) => { acc[s.key] = s.value; return acc; }, {});
  res.json({ success: true, data: settingsMap });
});

export const adminUpdateSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { settings } = req.body as { settings: Record<string, string> };
  await Promise.all(
    Object.entries(settings).map(([key, value]) =>
      prisma.storeSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value, type: 'text' },
      })
    )
  );
  res.json({ success: true, message: 'Settings updated' });
});

// ========== SUPPORT TICKETS ==========
export const createSupportTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await prisma.supportTicket.create({ data: req.body });
  res.status(201).json({ success: true, message: 'Support ticket submitted', data: ticket });
});

export const adminGetSupportTickets = asyncHandler(async (req: Request, res: Response) => {
  const tickets = await prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: tickets });
});

// ========== AUDIT LOGS ==========
export const adminGetAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const logs = await prisma.adminActivityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { admin: { select: { firstName: true, lastName: true, email: true } } },
  });
  res.json({ success: true, data: logs });
});

// ========== NEWSLETTER ==========
export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await prisma.newsletterSubscriber.upsert({ where: { email }, update: { isActive: true }, create: { email } });
  res.json({ success: true, message: 'Subscribed successfully' });
});

// ========== INVENTORY OVERVIEW ==========
export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, createdAt: true,
      orders: { select: { id: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: customers });
});

// ========== INVENTORY OVERVIEW ==========
export const adminGetInventory = asyncHandler(async (req: Request, res: Response) => {
  const inventory = await prisma.inventory.findMany({
    include: {
      product: { select: { name: true, sku: true, isActive: true, images: { where: { isThumbnail: true }, take: 1 } } },
    },
    orderBy: { quantity: 'asc' },
  });
  res.json({ success: true, data: inventory });
});

// ========== REVIEWS ==========
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      product: { select: { id: true, name: true, images: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: reviews });
});

export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isApproved, adminReply } = req.body;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw createError('Review not found', 404);

  const updatedReview = await prisma.review.update({
    where: { id },
    data: { 
      isApproved: isApproved !== undefined ? isApproved : review.isApproved,
      adminReply: adminReply !== undefined ? adminReply : review.adminReply
    }
  });

  // Recalculate average rating for product
  const allReviews = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: { avgRating: allReviews._avg.rating || 0, reviewCount: allReviews._count.rating },
  });

  res.json({ success: true, message: 'Review updated', data: updatedReview });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw createError('Review not found', 404);

  await prisma.review.delete({ where: { id } });

  // Recalculate average rating for product
  const allReviews = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: { avgRating: allReviews._avg.rating || 0, reviewCount: allReviews._count.rating },
  });

  res.json({ success: true, message: 'Review deleted' });
});


// ========== PROMOTIONS ==========
export const adminGetPromotions = asyncHandler(async (_req: Request, res: Response) => {
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: promotions });
});

export const adminCreatePromotion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const promotion = await prisma.promotion.create({ data: req.body });
  res.status(201).json({ success: true, data: promotion });
});

export const adminUpdatePromotion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const promotion = await prisma.promotion.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: promotion });
});

// ========== PAYMENTS ==========
export const adminGetPayments = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '20', status, search } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {};
  
  if (status) {
    if (status === 'REFUNDED') {
      where.order = { paymentStatus: 'REFUNDED' };
    } else {
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
    prisma.payment.findMany({
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
    prisma.payment.count({ where }),
  ]);

  res.json({ success: true, data: payments, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});

// ========== SHIPPING ZONES ==========
export const adminGetShippingZones = asyncHandler(async (req: Request, res: Response) => {
  const zones = await prisma.shippingZone.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: zones });
});

export const adminCreateShippingZone = asyncHandler(async (req: AuthRequest, res: Response) => {
  const zone = await prisma.shippingZone.create({ data: req.body });
  res.status(201).json({ success: true, data: zone });
});

export const adminUpdateShippingZone = asyncHandler(async (req: AuthRequest, res: Response) => {
  const zone = await prisma.shippingZone.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: zone });
});

export const adminDeleteShippingZone = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.shippingZone.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Shipping zone deleted' });
});

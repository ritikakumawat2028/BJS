import { Response } from 'express';
import prisma from '../config/prisma';
import { asyncHandler, createError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

// ========== WISHLIST ==========
export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: req.user!.userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true, name: true, slug: true, price: true, comparePrice: true, isActive: true,
              images: { where: { isThumbnail: true }, take: 1 },
              inventory: { select: { quantity: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  res.json({ success: true, data: wishlist?.items || [] });
});

export const addToWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  const userId = req.user!.userId;

  const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
  if (!product) throw createError('Product not found', 404);

  const wishlist = await prisma.wishlist.upsert({ where: { userId }, update: {}, create: { userId } });

  const exists = await prisma.wishlistItem.findUnique({ where: { wishlistId_productId: { wishlistId: wishlist.id, productId } } });
  if (exists) {
    res.json({ success: true, message: 'Already in wishlist' });
    return;
  }

  await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
  res.json({ success: true, message: 'Added to wishlist' });
});

export const removeFromWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  const wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user!.userId } });
  if (!wishlist) throw createError('Wishlist not found', 404);
  await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId } });
  res.json({ success: true, message: 'Removed from wishlist' });
});

// ========== ADDRESSES ==========
export const getAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const addresses = await prisma.address.findMany({ where: { userId: req.user!.userId }, orderBy: { isDefault: 'desc' } });
  res.json({ success: true, data: addresses });
});

export const addAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { label, firstName, lastName, phone, line1, line2, city, state, country, pincode, isDefault } = req.body;
  const userId = req.user!.userId;

  if (isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: { userId, label, firstName, lastName, phone, line1, line2, city, state, country: country || 'India', pincode, isDefault: Boolean(isDefault) },
  });
  res.status(201).json({ success: true, message: 'Address added', data: address });
});

export const updateAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const address = await prisma.address.findFirst({ where: { id, userId } });
  if (!address) throw createError('Address not found', 404);

  if (req.body.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const updated = await prisma.address.update({ where: { id }, data: req.body });
  res.json({ success: true, message: 'Address updated', data: updated });
});

export const deleteAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prisma.address.deleteMany({ where: { id, userId: req.user!.userId } });
  res.json({ success: true, message: 'Address deleted' });
});

// ========== REVIEWS ==========
export const addReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, rating, title, comment, images } = req.body;
  const userId = req.user!.userId;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw createError('Product not found', 404);

  const existingReview = await prisma.review.findUnique({ where: { productId_userId: { productId, userId } } });
  if (existingReview) throw createError('You have already reviewed this product', 400);

  const hasOrdered = await prisma.orderItem.findFirst({
    where: { productId, order: { userId, paymentStatus: 'PAID' } },
  });

  if (!hasOrdered) throw createError('Only verified buyers can review this product.', 403);

  const review = await prisma.review.create({
    data: { productId, userId, rating, title, comment, images, isVerifiedBuyer: true, isApproved: false },
  });

  // Since it is pending, we don't update average rating yet.
  
  res.status(201).json({ success: true, message: 'Review submitted and pending approval', data: review });
});

export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { rating, title, comment, images } = req.body;
  const userId = req.user!.userId;

  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) throw createError('Review not found', 404);

  const updatedReview = await prisma.review.update({
    where: { id },
    data: { rating, title, comment, images, isApproved: false }, // Reset to pending approval
  });

  // Re-calculate rating
  const allReviews = await prisma.review.aggregate({
    where: { productId: updatedReview.productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: updatedReview.productId },
    data: { avgRating: allReviews._avg.rating || 0, reviewCount: allReviews._count.rating },
  });

  res.json({ success: true, message: 'Review updated and pending approval', data: updatedReview });
});

export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) throw createError('Review not found', 404);

  await prisma.review.delete({ where: { id } });

  // Re-calculate rating
  const allReviews = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: { avgRating: allReviews._avg.rating || 0, reviewCount: allReviews._count.rating },
  });

  res.json({ success: true, message: 'Review deleted successfully' });
});

// ========== NOTIFICATIONS ==========
export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ success: true, data: notifications });
});

export const markNotificationRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prisma.notification.update({ where: { id, userId: req.user!.userId }, data: { isRead: true } });
  res.json({ success: true, message: 'Notification marked as read' });
});

export const markAllNotificationsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.userId, isRead: false },
    data: { isRead: true }
  });
  res.json({ success: true, message: 'All notifications marked as read' });
});

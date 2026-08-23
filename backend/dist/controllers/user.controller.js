"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsRead = exports.markNotificationRead = exports.getNotifications = exports.deleteReview = exports.updateReview = exports.addReview = exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.getAddresses = exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_1 = require("../middleware/error");
// ========== WISHLIST ==========
exports.getWishlist = (0, error_1.asyncHandler)(async (req, res) => {
    const wishlist = await prisma_1.default.wishlist.findUnique({
        where: { userId: req.user.userId },
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
exports.addToWishlist = (0, error_1.asyncHandler)(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.userId;
    const product = await prisma_1.default.product.findUnique({ where: { id: productId, isActive: true } });
    if (!product)
        throw (0, error_1.createError)('Product not found', 404);
    const wishlist = await prisma_1.default.wishlist.upsert({ where: { userId }, update: {}, create: { userId } });
    const exists = await prisma_1.default.wishlistItem.findUnique({ where: { wishlistId_productId: { wishlistId: wishlist.id, productId } } });
    if (exists) {
        res.json({ success: true, message: 'Already in wishlist' });
        return;
    }
    await prisma_1.default.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
    res.json({ success: true, message: 'Added to wishlist' });
});
exports.removeFromWishlist = (0, error_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const wishlist = await prisma_1.default.wishlist.findUnique({ where: { userId: req.user.userId } });
    if (!wishlist)
        throw (0, error_1.createError)('Wishlist not found', 404);
    await prisma_1.default.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId } });
    res.json({ success: true, message: 'Removed from wishlist' });
});
// ========== ADDRESSES ==========
exports.getAddresses = (0, error_1.asyncHandler)(async (req, res) => {
    const addresses = await prisma_1.default.address.findMany({ where: { userId: req.user.userId }, orderBy: { isDefault: 'desc' } });
    res.json({ success: true, data: addresses });
});
exports.addAddress = (0, error_1.asyncHandler)(async (req, res) => {
    const { label, firstName, lastName, phone, line1, line2, city, state, country, pincode, isDefault } = req.body;
    const userId = req.user.userId;
    if (isDefault) {
        await prisma_1.default.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const address = await prisma_1.default.address.create({
        data: { userId, label, firstName, lastName, phone, line1, line2, city, state, country: country || 'India', pincode, isDefault: Boolean(isDefault) },
    });
    res.status(201).json({ success: true, message: 'Address added', data: address });
});
exports.updateAddress = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const address = await prisma_1.default.address.findFirst({ where: { id, userId } });
    if (!address)
        throw (0, error_1.createError)('Address not found', 404);
    if (req.body.isDefault) {
        await prisma_1.default.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const updated = await prisma_1.default.address.update({ where: { id }, data: req.body });
    res.json({ success: true, message: 'Address updated', data: updated });
});
exports.deleteAddress = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.address.deleteMany({ where: { id, userId: req.user.userId } });
    res.json({ success: true, message: 'Address deleted' });
});
// ========== REVIEWS ==========
exports.addReview = (0, error_1.asyncHandler)(async (req, res) => {
    let { productId, rating, title, comment, images, productName } = req.body;
    const userId = req.user.userId;
    if (!productId && productName) {
        const p = await prisma_1.default.product.findFirst({
            where: { name: { contains: productName, mode: 'insensitive' } }
        });
        if (p)
            productId = p.id;
    }
    if (!productId)
        throw (0, error_1.createError)('Product not found. Please provide a valid product name.', 404);
    const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
    if (!product)
        throw (0, error_1.createError)('Product not found', 404);
    const existingReview = await prisma_1.default.review.findUnique({ where: { productId_userId: { productId, userId } } });
    if (existingReview)
        throw (0, error_1.createError)('You have already reviewed this product', 400);
    const hasOrdered = await prisma_1.default.orderItem.findFirst({
        where: { productId, order: { userId } }, // removed paymentStatus: 'PAID' requirement to allow COD orders
    });
    if (!hasOrdered)
        throw (0, error_1.createError)('Only buyers who have ordered this product can review it.', 403);
    const review = await prisma_1.default.review.create({
        data: { productId, userId, rating: Number(rating), title, comment, images, isVerifiedBuyer: true, isApproved: false },
    });
    // Since it is pending, we don't update average rating yet.
    res.status(201).json({ success: true, message: 'Review submitted and pending approval', data: review });
});
exports.updateReview = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.userId;
    const review = await prisma_1.default.review.findFirst({ where: { id, userId } });
    if (!review)
        throw (0, error_1.createError)('Review not found', 404);
    const updatedReview = await prisma_1.default.review.update({
        where: { id },
        data: { rating: Number(rating), title, comment, images, isApproved: false }, // Reset to pending approval
    });
    // Re-calculate rating
    const allReviews = await prisma_1.default.review.aggregate({
        where: { productId: updatedReview.productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
    });
    await prisma_1.default.product.update({
        where: { id: updatedReview.productId },
        data: { avgRating: allReviews._avg.rating || 0, reviewCount: allReviews._count.rating },
    });
    res.json({ success: true, message: 'Review updated and pending approval', data: updatedReview });
});
exports.deleteReview = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const review = await prisma_1.default.review.findFirst({ where: { id, userId } });
    if (!review)
        throw (0, error_1.createError)('Review not found', 404);
    await prisma_1.default.review.delete({ where: { id } });
    // Re-calculate rating
    const allReviews = await prisma_1.default.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true },
        _count: { rating: true },
    });
    await prisma_1.default.product.update({
        where: { id: review.productId },
        data: { avgRating: allReviews._avg.rating || 0, reviewCount: allReviews._count.rating },
    });
    res.json({ success: true, message: 'Review deleted successfully' });
});
// ========== NOTIFICATIONS ==========
exports.getNotifications = (0, error_1.asyncHandler)(async (req, res) => {
    const notifications = await prisma_1.default.notification.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
    res.json({ success: true, data: notifications });
});
exports.markNotificationRead = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.notification.update({ where: { id, userId: req.user.userId }, data: { isRead: true } });
    res.json({ success: true, message: 'Notification marked as read' });
});
exports.markAllNotificationsRead = (0, error_1.asyncHandler)(async (req, res) => {
    await prisma_1.default.notification.updateMany({
        where: { userId: req.user.userId, isRead: false },
        data: { isRead: true }
    });
    res.json({ success: true, message: 'All notifications marked as read' });
});
//# sourceMappingURL=user.controller.js.map
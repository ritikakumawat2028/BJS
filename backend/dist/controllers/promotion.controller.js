"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromotion = exports.updatePromotion = exports.createPromotion = exports.getPromotionById = exports.getActivePromotions = exports.getPromotions = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_1 = require("../middleware/error");
exports.getPromotions = (0, error_1.asyncHandler)(async (_req, res) => {
    const promotions = await prisma_1.default.promotion.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            products: { include: { product: { select: { id: true, name: true } } } },
            categories: { include: { category: { select: { id: true, name: true } } } }
        }
    });
    res.json({ success: true, data: promotions });
});
exports.getActivePromotions = (0, error_1.asyncHandler)(async (_req, res) => {
    const now = new Date();
    const promotions = await prisma_1.default.promotion.findMany({
        where: {
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now }
        },
        include: {
            products: { include: { product: { select: { id: true, name: true } } } },
            categories: { include: { category: { select: { id: true, name: true } } } }
        }
    });
    res.json({ success: true, data: promotions });
});
exports.getPromotionById = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const promotion = await prisma_1.default.promotion.findUnique({
        where: { id },
        include: {
            products: { include: { product: { select: { id: true, name: true } } } },
            categories: { include: { category: { select: { id: true, name: true } } } }
        }
    });
    if (!promotion)
        throw (0, error_1.createError)('Promotion not found', 404);
    res.json({ success: true, data: promotion });
});
exports.createPromotion = (0, error_1.asyncHandler)(async (req, res) => {
    const { name, type, description, discountType, discountValue, buyQuantity, getQuantity, minOrderAmount, startDate, endDate, isActive, productIds, categoryIds } = req.body;
    const promotion = await prisma_1.default.promotion.create({
        data: {
            name, type, description, discountType, discountValue,
            buyQuantity, getQuantity, minOrderAmount,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive: isActive !== undefined ? isActive : true,
            products: productIds && productIds.length > 0 ? {
                create: productIds.map((id) => ({ productId: id }))
            } : undefined,
            categories: categoryIds && categoryIds.length > 0 ? {
                create: categoryIds.map((id) => ({ categoryId: id }))
            } : undefined
        }
    });
    res.status(201).json({ success: true, message: 'Promotion created', data: promotion });
});
exports.updatePromotion = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { productIds, categoryIds, startDate, endDate, ...rest } = req.body;
    const data = { ...rest };
    if (startDate)
        data.startDate = new Date(startDate);
    if (endDate)
        data.endDate = new Date(endDate);
    // Update promotion and its relations if provided
    const updatePromises = [
        prisma_1.default.promotion.update({ where: { id }, data })
    ];
    if (productIds) {
        updatePromises.push(prisma_1.default.promotionProduct.deleteMany({ where: { promotionId: id } }));
        if (productIds.length > 0) {
            updatePromises.push(prisma_1.default.promotionProduct.createMany({
                data: productIds.map((pid) => ({ promotionId: id, productId: pid }))
            }));
        }
    }
    if (categoryIds) {
        updatePromises.push(prisma_1.default.promotionCategory.deleteMany({ where: { promotionId: id } }));
        if (categoryIds.length > 0) {
            updatePromises.push(prisma_1.default.promotionCategory.createMany({
                data: categoryIds.map((cid) => ({ promotionId: id, categoryId: cid }))
            }));
        }
    }
    await prisma_1.default.$transaction(updatePromises);
    const updated = await prisma_1.default.promotion.findUnique({
        where: { id },
        include: { products: true, categories: true }
    });
    res.json({ success: true, message: 'Promotion updated', data: updated });
});
exports.deletePromotion = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.$transaction([
        prisma_1.default.promotionProduct.deleteMany({ where: { promotionId: id } }),
        prisma_1.default.promotionCategory.deleteMany({ where: { promotionId: id } }),
        prisma_1.default.promotion.delete({ where: { id } })
    ]);
    res.json({ success: true, message: 'Promotion deleted' });
});
//# sourceMappingURL=promotion.controller.js.map
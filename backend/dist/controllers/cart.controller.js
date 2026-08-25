"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCart = exports.removeCoupon = exports.applyCoupon = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_1 = require("../middleware/error");
const getCartWithDetails = async (cartId) => {
    return prisma_1.default.cart.findUnique({
        where: { id: cartId },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true, name: true, slug: true, price: true, comparePrice: true, isActive: true, categoryId: true,
                            images: { where: { isThumbnail: true }, take: 1 },
                            inventory: { select: { quantity: true } },
                        },
                    },
                    variant: { select: { id: true, name: true, price: true, stock: true, image: true } },
                },
            },
            coupon: true,
        },
    });
};
const calculateCartTotals = async (cartId) => {
    const cart = await getCartWithDetails(cartId);
    if (!cart)
        return null;
    let subtotal = 0;
    for (const item of cart.items) {
        const price = item.variant?.price ?? item.product.price;
        subtotal += Number(price) * item.quantity;
    }
    let discount = 0;
    let isFreeShippingPromotion = false;
    const now = new Date();
    // 1. Apply Active Promotions
    const activePromotions = await prisma_1.default.promotion.findMany({
        where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
        include: { products: true, categories: true }
    });
    for (const promo of activePromotions) {
        if (promo.minOrderAmount && subtotal < Number(promo.minOrderAmount))
            continue;
        if (promo.type === 'FREE_SHIPPING') {
            isFreeShippingPromotion = true;
        }
        else if (promo.type === 'PRODUCT_DISCOUNT' || promo.type === 'FLASH_SALE' || promo.type === 'FESTIVAL_SALE' || promo.type === 'LIMITED_TIME') {
            const validProductIds = promo.products.map(p => p.productId);
            let promoEligibleSubtotal = 0;
            for (const item of cart.items) {
                if (validProductIds.length === 0 || validProductIds.includes(item.productId)) {
                    const price = item.variant?.price ?? item.product.price;
                    promoEligibleSubtotal += Number(price) * item.quantity;
                }
            }
            if (promoEligibleSubtotal > 0 && promo.discountValue) {
                if (promo.discountType === 'PERCENTAGE') {
                    discount += (promoEligibleSubtotal * Number(promo.discountValue)) / 100;
                }
                else {
                    discount += Math.min(Number(promo.discountValue), promoEligibleSubtotal);
                }
            }
        }
        // Add logic for BUY_X_GET_Y and BUNDLE_OFFER as needed
    }
    // 2. Apply Coupon (Assuming coupons can stack with promotions for now)
    if (cart.coupon) {
        const coupon = cart.coupon;
        if (coupon.isActive && (!coupon.expiryDate || coupon.expiryDate > now) && (!coupon.startDate || coupon.startDate <= now)) {
            let eligibleSubtotal = 0;
            if (coupon.applicableType === 'ALL') {
                eligibleSubtotal = subtotal;
            }
            else if (coupon.applicableType === 'PRODUCT') {
                const couponProducts = await prisma_1.default.couponProduct.findMany({ where: { couponId: coupon.id }, select: { productId: true } });
                const validProductIds = couponProducts.map(cp => cp.productId);
                for (const item of cart.items) {
                    if (validProductIds.includes(item.productId)) {
                        const price = item.variant?.price ?? item.product.price;
                        eligibleSubtotal += Number(price) * item.quantity;
                    }
                }
            }
            else if (coupon.applicableType === 'CATEGORY') {
                const couponCategories = await prisma_1.default.couponCategory.findMany({ where: { couponId: coupon.id }, select: { categoryId: true } });
                const validCategoryIds = couponCategories.map(cc => cc.categoryId);
                for (const item of cart.items) {
                    if (item.product && validCategoryIds.includes(item.product.categoryId)) {
                        const price = item.variant?.price ?? item.product.price;
                        eligibleSubtotal += Number(price) * item.quantity;
                    }
                }
            }
            if (eligibleSubtotal > 0 && (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount))) {
                let couponDiscount = 0;
                if (coupon.discountType === 'PERCENTAGE') {
                    couponDiscount = (eligibleSubtotal * Number(coupon.discountValue)) / 100;
                    if (coupon.maxDiscount)
                        couponDiscount = Math.min(couponDiscount, Number(coupon.maxDiscount));
                }
                else {
                    couponDiscount = Math.min(Number(coupon.discountValue), eligibleSubtotal);
                }
                discount += couponDiscount;
            }
        }
    }
    // Ensure discount doesn't exceed subtotal
    discount = Math.min(discount, subtotal);
    const settings = await prisma_1.default.storeSettings.findMany({ where: { group: 'shipping' } });
    const freeShipping = settings.find(s => s.key === 'free_shipping_threshold');
    const shippingCharge = settings.find(s => s.key === 'default_shipping_charge');
    const freeThreshold = freeShipping ? parseFloat(freeShipping.value) : 999;
    let shipping = 0;
    if (!isFreeShippingPromotion && subtotal - discount < freeThreshold) {
        shipping = shippingCharge ? parseFloat(shippingCharge.value) : 99;
    }
    const tax = 0; // Tax calculated server-side per product
    const total = subtotal - discount + shipping + tax;
    return { ...cart, subtotal, discount, shipping, tax, total };
};
exports.getCart = (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const { sessionId } = req.query;
    let cart = null;
    if (userId) {
        cart = await prisma_1.default.cart.findFirst({ where: { userId } });
    }
    else if (sessionId) {
        cart = await prisma_1.default.cart.findFirst({ where: { sessionId } });
    }
    if (!cart) {
        res.json({ success: true, data: { items: [], subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 } });
        return;
    }
    const result = await calculateCartTotals(cart.id);
    res.json({ success: true, data: result });
});
exports.addToCart = (0, error_1.asyncHandler)(async (req, res) => {
    const { productId, variantId, quantity = 1 } = req.body;
    const userId = req.user?.userId;
    const { sessionId } = req.body;
    // Validate product and stock
    const product = await prisma_1.default.product.findUnique({
        where: { id: productId, isActive: true },
        include: { inventory: true, variants: { where: { id: variantId || undefined } } },
    });
    if (!product)
        throw (0, error_1.createError)('Product not found or unavailable', 404);
    const availableStock = variantId
        ? product.variants[0]?.stock ?? 0
        : product.inventory?.quantity ?? 0;
    if (availableStock < quantity)
        throw (0, error_1.createError)('Insufficient stock', 400);
    // Get or create cart
    let cart;
    if (userId) {
        cart = await prisma_1.default.cart.findFirst({ where: { userId } });
        if (!cart)
            cart = await prisma_1.default.cart.create({ data: { userId } });
        // Merge session cart if exists
        if (sessionId) {
            const sessionCart = await prisma_1.default.cart.findFirst({ where: { sessionId } });
            if (sessionCart && sessionCart.id !== cart.id) {
                await prisma_1.default.cartItem.updateMany({ where: { cartId: sessionCart.id }, data: { cartId: cart.id } });
                await prisma_1.default.cart.delete({ where: { id: sessionCart.id } });
            }
        }
    }
    else {
        if (!sessionId)
            throw (0, error_1.createError)('Session ID required for guest cart', 400);
        cart = await prisma_1.default.cart.findFirst({ where: { sessionId } });
        if (!cart)
            cart = await prisma_1.default.cart.create({ data: { sessionId } });
    }
    // Use upsert to prevent P2002 unique constraint race conditions
    const cartId_productId_variantId = { cartId: cart.id, productId, variantId: variantId || null };
    const existing = await prisma_1.default.cartItem.findUnique({
        where: { cartId_productId_variantId: { cartId: cart.id, productId, variantId: variantId || null } },
    });
    if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > availableStock)
            throw (0, error_1.createError)('Insufficient stock', 400);
        await prisma_1.default.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
    }
    else {
        try {
            await prisma_1.default.cartItem.create({ data: { cartId: cart.id, productId, variantId: variantId || null, quantity } });
        }
        catch (error) {
            if (error.code === 'P2002') {
                const raceExisting = await prisma_1.default.cartItem.findUnique({ where: { cartId_productId_variantId: { cartId: cart.id, productId, variantId: variantId || null } } });
                if (raceExisting) {
                    const newQty = raceExisting.quantity + quantity;
                    if (newQty > availableStock)
                        throw (0, error_1.createError)('Insufficient stock', 400);
                    await prisma_1.default.cartItem.update({ where: { id: raceExisting.id }, data: { quantity: newQty } });
                }
            }
            else {
                throw error;
            }
        }
    }
    const result = await calculateCartTotals(cart.id);
    res.json({ success: true, message: 'Item added to cart', data: result });
});
exports.updateCartItem = (0, error_1.asyncHandler)(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const item = await prisma_1.default.cartItem.findUnique({
        where: { id: itemId },
        include: { product: { include: { inventory: true } }, variant: true },
    });
    if (!item)
        throw (0, error_1.createError)('Cart item not found', 404);
    const stock = item.variantId ? item.variant?.stock ?? 0 : item.product.inventory?.quantity ?? 0;
    if (quantity > stock)
        throw (0, error_1.createError)('Insufficient stock', 400);
    if (quantity <= 0) {
        await prisma_1.default.cartItem.delete({ where: { id: itemId } });
    }
    else {
        await prisma_1.default.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }
    const result = await calculateCartTotals(item.cartId);
    res.json({ success: true, message: 'Cart updated', data: result });
});
exports.removeCartItem = (0, error_1.asyncHandler)(async (req, res) => {
    const { itemId } = req.params;
    const item = await prisma_1.default.cartItem.findUnique({ where: { id: itemId } });
    if (!item)
        throw (0, error_1.createError)('Cart item not found', 404);
    await prisma_1.default.cartItem.delete({ where: { id: itemId } });
    const result = await calculateCartTotals(item.cartId);
    res.json({ success: true, message: 'Item removed', data: result });
});
exports.applyCoupon = (0, error_1.asyncHandler)(async (req, res) => {
    const { code, cartId } = req.body;
    const userId = req.user?.userId;
    const coupon = await prisma_1.default.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.isActive)
        throw (0, error_1.createError)('Invalid or expired coupon', 400);
    const now = new Date();
    if (coupon.expiryDate && coupon.expiryDate < now)
        throw (0, error_1.createError)('Coupon has expired', 400);
    if (coupon.startDate && coupon.startDate > now)
        throw (0, error_1.createError)('Coupon is not yet active', 400);
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
        throw (0, error_1.createError)('Coupon usage limit reached', 400);
    if (userId && coupon.perUserLimit) {
        const userOrders = await prisma_1.default.order.count({ where: { userId, couponCode: code.toUpperCase() } });
        if (userOrders >= coupon.perUserLimit)
            throw (0, error_1.createError)('You have already used this coupon', 400);
    }
    let cart;
    if (cartId)
        cart = await prisma_1.default.cart.findUnique({ where: { id: cartId } });
    else if (userId)
        cart = await prisma_1.default.cart.findFirst({ where: { userId } });
    if (!cart)
        throw (0, error_1.createError)('Cart not found', 404);
    await prisma_1.default.cart.update({ where: { id: cart.id }, data: { couponId: coupon.id } });
    const result = await calculateCartTotals(cart.id);
    res.json({ success: true, message: 'Coupon applied', data: result });
});
exports.removeCoupon = (0, error_1.asyncHandler)(async (req, res) => {
    const { cartId } = req.body;
    const userId = req.user?.userId;
    let cart;
    if (cartId)
        cart = await prisma_1.default.cart.findUnique({ where: { id: cartId } });
    else if (userId)
        cart = await prisma_1.default.cart.findFirst({ where: { userId } });
    if (!cart)
        throw (0, error_1.createError)('Cart not found', 404);
    await prisma_1.default.cart.update({ where: { id: cart.id }, data: { couponId: null } });
    const result = await calculateCartTotals(cart.id);
    res.json({ success: true, message: 'Coupon removed', data: result });
});
exports.mergeCart = (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const { sessionId } = req.body;
    if (!sessionId) {
        return res.json({ success: true, message: 'No session to merge' });
    }
    const sessionCart = await prisma_1.default.cart.findFirst({
        where: { sessionId },
        include: { items: true },
    });
    if (!sessionCart || sessionCart.items.length === 0) {
        return res.json({ success: true, message: 'Session cart empty' });
    }
    let userCart = await prisma_1.default.cart.findFirst({
        where: { userId },
        include: { items: true },
    });
    if (!userCart) {
        userCart = await prisma_1.default.cart.update({
            where: { id: sessionCart.id },
            data: { userId, sessionId: null },
            include: { items: true },
        });
    }
    else {
        for (const item of sessionCart.items) {
            const existing = userCart.items.find((i) => i.productId === item.productId && i.variantId === item.variantId);
            if (existing) {
                await prisma_1.default.cartItem.update({
                    where: { id: existing.id },
                    data: { quantity: existing.quantity + item.quantity },
                });
            }
            else {
                await prisma_1.default.cartItem.update({
                    where: { id: item.id },
                    data: { cartId: userCart.id },
                });
            }
        }
        await prisma_1.default.cart.delete({ where: { id: sessionCart.id } });
    }
    const result = await calculateCartTotals(userCart.id);
    res.json({ success: true, data: result, message: 'Carts merged successfully' });
});
//# sourceMappingURL=cart.controller.js.map
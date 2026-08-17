import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { asyncHandler, createError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

const getCartWithDetails = async (cartId: string) => {
  return prisma.cart.findUnique({
    where: { id: cartId },
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
          variant: { select: { id: true, name: true, price: true, stock: true, image: true } },
        },
      },
      coupon: true,
    },
  });
};

const calculateCartTotals = async (cartId: string) => {
  const cart = await getCartWithDetails(cartId);
  if (!cart) return null;

  let subtotal = 0;
  for (const item of cart.items) {
    const price = item.variant?.price ?? item.product.price;
    subtotal += Number(price) * item.quantity;
  }

  let discount = 0;
  let isFreeShippingPromotion = false;
  const now = new Date();

  // 1. Apply Active Promotions
  const activePromotions = await prisma.promotion.findMany({
    where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
    include: { products: true, categories: true }
  });

  for (const promo of activePromotions) {
    if (promo.minOrderAmount && subtotal < Number(promo.minOrderAmount)) continue;

    if (promo.type === 'FREE_SHIPPING') {
      isFreeShippingPromotion = true;
    } else if (promo.type === 'PRODUCT_DISCOUNT' || promo.type === 'FLASH_SALE' || promo.type === 'FESTIVAL_SALE' || promo.type === 'LIMITED_TIME') {
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
        } else {
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
      } else if (coupon.applicableType === 'PRODUCT') {
        const couponProducts = await prisma.couponProduct.findMany({ where: { couponId: coupon.id }, select: { productId: true } });
        const validProductIds = couponProducts.map(cp => cp.productId);
        for (const item of cart.items) {
          if (validProductIds.includes(item.productId)) {
             const price = item.variant?.price ?? item.product.price;
             eligibleSubtotal += Number(price) * item.quantity;
          }
        }
      } else if (coupon.applicableType === 'CATEGORY') {
        const couponCategories = await prisma.couponCategory.findMany({ where: { couponId: coupon.id }, select: { categoryId: true } });
        const validCategoryIds = couponCategories.map(cc => cc.categoryId);
        for (const item of cart.items) {
           const productCategories = await prisma.productCategory.findMany({ where: { productId: item.productId } });
           const hasValidCategory = productCategories.some(pc => validCategoryIds.includes(pc.categoryId));
           if (hasValidCategory) {
              const price = item.variant?.price ?? item.product.price;
              eligibleSubtotal += Number(price) * item.quantity;
           }
        }
      }

      if (eligibleSubtotal > 0 && (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount))) {
        let couponDiscount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
          couponDiscount = (eligibleSubtotal * Number(coupon.discountValue)) / 100;
          if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, Number(coupon.maxDiscount));
        } else {
          couponDiscount = Math.min(Number(coupon.discountValue), eligibleSubtotal);
        }
        discount += couponDiscount;
      }
    }
  }

  // Ensure discount doesn't exceed subtotal
  discount = Math.min(discount, subtotal);

  const settings = await prisma.storeSettings.findMany({ where: { group: 'shipping' } });
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

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { sessionId } = req.query as Record<string, string>;

  let cart = null;
  if (userId) {
    cart = await prisma.cart.findUnique({ where: { userId } });
  } else if (sessionId) {
    cart = await prisma.cart.findUnique({ where: { sessionId } });
  }

  if (!cart) {
    res.json({ success: true, data: { items: [], subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 } });
    return;
  }

  const result = await calculateCartTotals(cart.id);
  res.json({ success: true, data: result });
});

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, variantId, quantity = 1 } = req.body;
  const userId = req.user?.userId;
  const { sessionId } = req.body;

  // Validate product and stock
  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    include: { inventory: true, variants: { where: { id: variantId || undefined } } },
  });
  if (!product) throw createError('Product not found or unavailable', 404);

  const availableStock = variantId
    ? product.variants[0]?.stock ?? 0
    : product.inventory?.quantity ?? 0;

  if (availableStock < quantity) throw createError('Insufficient stock', 400);

  // Get or create cart
  let cart;
  if (userId) {
    cart = await prisma.cart.upsert({ where: { userId }, update: {}, create: { userId } });
    // Merge session cart if exists
    if (sessionId) {
      const sessionCart = await prisma.cart.findUnique({ where: { sessionId } });
      if (sessionCart) {
        await prisma.cartItem.updateMany({ where: { cartId: sessionCart.id }, data: { cartId: cart.id } });
        await prisma.cart.delete({ where: { id: sessionCart.id } });
      }
    }
  } else {
    if (!sessionId) throw createError('Session ID required for guest cart', 400);
    cart = await prisma.cart.upsert({ where: { sessionId }, update: {}, create: { sessionId } });
  }

  // Add or update item
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId || null },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > availableStock) throw createError('Insufficient stock', 400);
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, variantId, quantity } });
  }

  const result = await calculateCartTotals(cart.id);
  res.json({ success: true, message: 'Item added to cart', data: result });
});

export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: { include: { inventory: true } }, variant: true },
  });
  if (!item) throw createError('Cart item not found', 404);

  const stock = item.variantId ? item.variant?.stock ?? 0 : item.product.inventory?.quantity ?? 0;
  if (quantity > stock) throw createError('Insufficient stock', 400);

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  const result = await calculateCartTotals(item.cartId);
  res.json({ success: true, message: 'Cart updated', data: result });
});

export const removeCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) throw createError('Cart item not found', 404);
  await prisma.cartItem.delete({ where: { id: itemId } });
  const result = await calculateCartTotals(item.cartId);
  res.json({ success: true, message: 'Item removed', data: result });
});

export const applyCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, cartId } = req.body;
  const userId = req.user?.userId;

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.isActive) throw createError('Invalid or expired coupon', 400);

  const now = new Date();
  if (coupon.expiryDate && coupon.expiryDate < now) throw createError('Coupon has expired', 400);
  if (coupon.startDate && coupon.startDate > now) throw createError('Coupon is not yet active', 400);
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw createError('Coupon usage limit reached', 400);

  if (userId && coupon.perUserLimit) {
    const userOrders = await prisma.order.count({ where: { userId, couponCode: code.toUpperCase() } });
    if (userOrders >= coupon.perUserLimit) throw createError('You have already used this coupon', 400);
  }

  let cart;
  if (cartId) cart = await prisma.cart.findUnique({ where: { id: cartId } });
  else if (userId) cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) throw createError('Cart not found', 404);

  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: coupon.id } });

  const result = await calculateCartTotals(cart.id);
  res.json({ success: true, message: 'Coupon applied', data: result });
});

export const removeCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cartId } = req.body;
  const userId = req.user?.userId;

  let cart;
  if (cartId) cart = await prisma.cart.findUnique({ where: { id: cartId } });
  else if (userId) cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw createError('Cart not found', 404);

  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: null } });
  const result = await calculateCartTotals(cart.id);
  res.json({ success: true, message: 'Coupon removed', data: result });
});

export const mergeCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.json({ success: true, message: 'No session to merge' });
  }

  const sessionCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });

  if (!sessionCart || sessionCart.items.length === 0) {
    return res.json({ success: true, message: 'Session cart empty' });
  }

  let userCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    userCart = await prisma.cart.update({
      where: { id: sessionCart.id },
      data: { userId, sessionId: null },
      include: { items: true },
    });
  } else {
    for (const item of sessionCart.items) {
      const existing = userCart.items.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.update({
          where: { id: item.id },
          data: { cartId: userCart.id },
        });
      }
    }
    await prisma.cart.delete({ where: { id: sessionCart.id } });
  }

  const result = await calculateCartTotals(userCart.id);
  res.json({ success: true, data: result, message: 'Carts merged successfully' });
});

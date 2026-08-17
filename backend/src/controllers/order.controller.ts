import { Response } from 'express';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { asyncHandler, createError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';
import { NotificationService } from '../services/notification.service';
import { PaymentFactory } from '../services/payment/payment.factory';

const generateOrderNumber = () => `BJS${Date.now()}${Math.floor(Math.random() * 1000)}`;

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { shippingAddressId, billingAddressId, paymentMethod, notes } = req.body;
  const userId = req.user!.userId;

  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { inventory: true } },
          variant: true,
        },
      },
      coupon: true,
    },
  });

  if (!cart || cart.items.length === 0) throw createError('Cart is empty', 400);

  // Validate address
  const address = await prisma.address.findFirst({ where: { id: shippingAddressId, userId } });
  if (!address) throw createError('Invalid shipping address', 400);

  // Server-side price + stock validation
  let subtotal = 0;
  const orderItemsData = [];

  for (const item of cart.items) {
    if (!item.product.isActive) throw createError(`Product "${item.product.name}" is no longer available`, 400);

    const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
    const stock = item.variant ? item.variant.stock : item.product.inventory?.quantity ?? 0;

    if (stock < item.quantity) throw createError(`Insufficient stock for "${item.product.name}"`, 400);

    subtotal += price * item.quantity;

    orderItemsData.push({
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      variantName: item.variant?.name || null,
      sku: item.variant?.sku || item.product.sku || '',
      quantity: item.quantity,
      unitPrice: price,
      discount: 0,
      tax: 0,
      total: price * item.quantity,
      image: item.product.images?.[0]?.url || null,
    });
  }

  // Coupon discount
  let couponDiscount = 0;
  let couponCode = null;
  if (cart.coupon) {
    const c = cart.coupon;
    const now = new Date();
    if (c.isActive && (!c.expiryDate || c.expiryDate > now) && (!c.startDate || c.startDate <= now)) {
      
      let eligibleSubtotal = 0;
      if (c.applicableType === 'ALL') {
        eligibleSubtotal = subtotal;
      } else if (c.applicableType === 'PRODUCT') {
        const couponProducts = await prisma.couponProduct.findMany({ where: { couponId: c.id }, select: { productId: true } });
        const validProductIds = couponProducts.map(cp => cp.productId);
        for (const item of cart.items) {
          if (validProductIds.includes(item.productId)) {
             const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
             eligibleSubtotal += price * item.quantity;
          }
        }
      } else if (c.applicableType === 'CATEGORY') {
        const couponCategories = await prisma.couponCategory.findMany({ where: { couponId: c.id }, select: { categoryId: true } });
        const validCategoryIds = couponCategories.map(cc => cc.categoryId);
        for (const item of cart.items) {
           const productCategories = await prisma.productCategory.findMany({ where: { productId: item.productId } });
           const hasValidCategory = productCategories.some(pc => validCategoryIds.includes(pc.categoryId));
           if (hasValidCategory) {
              const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
              eligibleSubtotal += price * item.quantity;
           }
        }
      }

      if (eligibleSubtotal > 0 && (!c.minOrderAmount || subtotal >= Number(c.minOrderAmount))) {
        if (c.discountType === 'PERCENTAGE') {
          couponDiscount = (eligibleSubtotal * Number(c.discountValue)) / 100;
          if (c.maxDiscount) couponDiscount = Math.min(couponDiscount, Number(c.maxDiscount));
        } else {
          couponDiscount = Math.min(Number(c.discountValue), eligibleSubtotal);
        }
        couponCode = c.code;
      }
    }
  }

  // Shipping logic via Shipping Zones
  const shippingSettings = await prisma.storeSettings.findMany({ where: { group: 'shipping' } });
  let freeThreshold = parseFloat(shippingSettings.find(s => s.key === 'free_shipping_threshold')?.value || '999');
  let shippingChargeValue = parseFloat(shippingSettings.find(s => s.key === 'default_shipping_charge')?.value || '99');

  // Find matching Shipping Zone
  const zones = await prisma.shippingZone.findMany({ where: { isActive: true } });
  const matchingZone = zones.find(z => z.states?.toLowerCase().includes(address.state.toLowerCase()));
  
  if (matchingZone) {
    shippingChargeValue = Number(matchingZone.shippingCharge);
    if (matchingZone.freeAbove) {
      freeThreshold = Number(matchingZone.freeAbove);
    }
  }

  const subtotalAfterDiscount = subtotal - couponDiscount;
  const shippingCharge = subtotalAfterDiscount >= freeThreshold ? 0 : shippingChargeValue;
  const total = subtotalAfterDiscount + shippingCharge;

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        paymentMethod: paymentMethod as string,
        shippingAddressId,
        billingAddressId: billingAddressId || shippingAddressId,
        subtotal,
        discount: 0,
        tax: 0,
        shippingCharge,
        couponDiscount,
        couponCode,
        total,
        notes,
        items: { create: orderItemsData },
        timeline: { create: { status: 'PENDING', message: 'Order placed successfully' } },
        payment: {
          create: {
            amount: total,
            method: paymentMethod as string,
            status: paymentMethod === 'COD' ? 'PENDING' : 'PENDING', // Will be PAID after verification if not COD
          },
        },
      },
      include: { items: true, shippingAddress: true },
    });

    // Deduct stock
    for (const item of cart.items) {
      if (item.variantId) {
        await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } });
      } else {
        await tx.inventory.update({ where: { productId: item.productId }, data: { quantity: { decrement: item.quantity } } });
      }
      await tx.product.update({ where: { id: item.productId }, data: { totalSold: { increment: item.quantity } } });
    }

    // Increment coupon usage
    if (cart.couponId) {
      await tx.coupon.update({ where: { id: cart.couponId }, data: { usedCount: { increment: 1 } } });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    await tx.cart.update({ where: { id: cart.id }, data: { couponId: null } });

    return newOrder;
  });

  // Send confirmation email if COD
  if (paymentMethod === 'COD') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await NotificationService.orderPlaced(order, user);
      await NotificationService.adminNewOrder(order);
    }
  }

  res.status(201).json({ success: true, message: 'Order created', data: order });
});

export const createRazorpayOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.body;

  const order = await prisma.order.findFirst({ where: { id: orderId, userId: req.user!.userId } });
  if (!order) throw createError('Order not found', 404);

  const provider = PaymentFactory.getProvider();
  
  try {
    const paymentInitResponse = await provider.initializePayment(
      order.id,
      Number(order.total),
      'INR',
      order.orderNumber
    );

    await prisma.payment.update({
      where: { orderId },
      data: { 
        razorpayOrderId: paymentInitResponse.providerOrderId,
        status: 'PENDING'
      },
    });

    res.json({ 
      success: true, 
      data: { 
        razorpayOrderId: paymentInitResponse.providerOrderId, 
        amount: paymentInitResponse.amount, 
        currency: paymentInitResponse.currency, 
        key: paymentInitResponse.key 
      } 
    });
  } catch (error: any) {
    throw createError(error.message || 'Payment initialization failed', 500);
  }
});

export const verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const order = await prisma.order.findFirst({ where: { id: orderId }, include: { payment: true } });
  if (!order) throw createError('Order not found', 404);

  const provider = PaymentFactory.getProvider();
  
  const isValid = await provider.verifySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  });

  if (!isValid) {
    await prisma.$transaction([
      prisma.payment.update({ where: { orderId }, data: { status: 'FAILED' } }),
      prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'FAILED' } }),
      prisma.orderTimeline.create({ data: { orderId, status: 'FAILED', message: 'Payment signature verification failed' } })
    ]);
    const user = await prisma.user.findUnique({ where: { id: order.userId } });
    if (user) {
      await NotificationService.paymentFailed(order, user);
      await NotificationService.adminPaymentIssue(order, 'Invalid signature on verification');
    }
    throw createError('Payment verification failed. Invalid signature.', 400);
  }

  // Signature valid - Mark order as paid
  await prisma.$transaction([
    prisma.payment.update({
      where: { orderId },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'PAID',
      },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    }),
    prisma.orderTimeline.create({
      data: { orderId, status: 'CONFIRMED', message: 'Payment received securely and order confirmed' },
    }),
  ]);

  // Send Confirmation Email and Notification now that payment is confirmed
  const user = await prisma.user.findUnique({ where: { id: order.userId } });
  if (user) {
    await NotificationService.paymentSuccessful(order, user);
    await NotificationService.orderPlaced(order, user);
    await NotificationService.adminNewOrder(order);
  }

  res.json({ success: true, message: 'Payment verified successfully' });
});

export const razorpayWebhook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = req.body.toString ? req.body.toString() : JSON.stringify(req.body);

  const provider = PaymentFactory.getProvider();
  
  try {
    const result = await provider.handleWebhook(rawBody, signature);

    if (!result.success) {
      res.status(400).json({ success: false, message: result.failureReason });
      return;
    }

    if (!result.orderId || !result.paymentStatus) {
      res.json({ success: true, message: 'Webhook received but no actionable order state' });
      return;
    }

    // Resolve internal DB order ID
    let internalOrder = await prisma.order.findUnique({ where: { id: result.orderId } });
    if (!internalOrder) {
      // Try resolving by razorpay order ID from Payment table
      const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: result.orderId } });
      if (payment) {
        internalOrder = await prisma.order.findUnique({ where: { id: payment.orderId } });
      }
    }

    if (internalOrder) {
      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({ where: { orderId: internalOrder!.id } });
        
        // Prevent double processing if already PAID
        if (payment && payment.status !== result.paymentStatus) {
          await tx.payment.update({
            where: { id: payment.id },
            data: { 
              status: result.paymentStatus!, 
              failureReason: result.failureReason || payment.failureReason 
            },
          });
          
          await tx.order.update({
            where: { id: internalOrder!.id },
            data: { paymentStatus: result.paymentStatus! },
          });

          await tx.orderTimeline.create({
            data: { 
              orderId: internalOrder!.id, 
              status: result.paymentStatus === 'PAID' ? 'CONFIRMED' : result.paymentStatus!, 
              message: `Payment status updated to ${result.paymentStatus} via Webhook` 
            }
          });
        }
      });
      // Fire notifications outside transaction
      const user = await prisma.user.findUnique({ where: { id: internalOrder!.userId } });
      if (user) {
        if (result.paymentStatus === 'PAID') {
          await NotificationService.paymentSuccessful(internalOrder, user);
          await NotificationService.orderPlaced(internalOrder, user);
          await NotificationService.adminNewOrder(internalOrder);
        } else if (result.paymentStatus === 'FAILED') {
          await NotificationService.paymentFailed(internalOrder, user);
          await NotificationService.adminPaymentIssue(internalOrder, result.failureReason || 'Webhook reported payment failure');
        }
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, message: 'Internal Webhook Error' });
  }
});

export const getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '10' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
      include: {
        items: { select: { productName: true, quantity: true, unitPrice: true, image: true } },
        payment: { select: { status: true, method: true } },
      },
    }),
    prisma.order.count({ where: { userId: req.user!.userId } }),
  ]);

  res.json({ success: true, data: orders, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findFirst({
    where: { id, userId: req.user!.userId },
    include: {
      items: { include: { product: { select: { slug: true } } } },
      shippingAddress: true,
      billingAddress: true,
      payment: true,
      timeline: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!order) throw createError('Order not found', 404);
  res.json({ success: true, data: order });
});

// ===================== ADMIN =====================

export const adminGetOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '20', status, paymentStatus, search, startDate, endDate, minAmount, maxAmount } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {};
  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (search) where.OR = [{ orderNumber: { contains: search, mode: 'insensitive' } }, { user: { email: { contains: search, mode: 'insensitive' } } }];
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }
  if (minAmount || maxAmount) {
    where.total = {};
    if (minAmount) where.total.gte = parseFloat(minAmount);
    if (maxAmount) where.total.lte = parseFloat(maxAmount);
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: { select: { productName: true, quantity: true } },
        payment: { select: { status: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ success: true, data: orders, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});

export const adminGetOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      items: { include: { product: { select: { slug: true } } } },
      shippingAddress: true,
      billingAddress: true,
      payment: true,
      timeline: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!order) throw createError('Order not found', 404);
  res.json({ success: true, data: order });
});

export const adminUpdateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber, deliveryPartner, message } = req.body;

  const order = await prisma.order.update({
    where: { id },
    data: { status, trackingNumber, deliveryPartner },
  });

  await prisma.orderTimeline.create({
    data: { orderId: id, status, message: message || `Order status updated to ${status}`, createdBy: req.user!.userId },
  });

  await prisma.adminActivityLog.create({
    data: { adminId: req.user!.userId, action: 'UPDATE_ORDER_STATUS', entity: 'Order', entityId: id, newValue: JSON.stringify({ status }) },
  });

  const orderForNotification = await prisma.order.findUnique({ where: { id } });
  if (orderForNotification) {
    const user = await prisma.user.findUnique({ where: { id: orderForNotification.userId } });
    if (user) {
      if (status === 'SHIPPED') await NotificationService.orderShipped(orderForNotification, user);
      if (status === 'DELIVERED') await NotificationService.orderDelivered(orderForNotification, user);
    }
  }

  res.json({ success: true, message: 'Order status updated', data: order });
});

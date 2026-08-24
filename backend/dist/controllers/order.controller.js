"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateOrderStatus = exports.adminGetOrderById = exports.adminGetOrders = exports.getOrderById = exports.getUserOrders = exports.razorpayWebhook = exports.verifyPayment = exports.createRazorpayOrder = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_1 = require("../middleware/error");
const notification_service_1 = require("../services/notification.service");
const payment_factory_1 = require("../services/payment/payment.factory");
const generateOrderNumber = () => `BJS${Date.now()}${Math.floor(Math.random() * 1000)}`;
exports.createOrder = (0, error_1.asyncHandler)(async (req, res) => {
    const { shippingAddressId, billingAddressId, paymentMethod, notes, sessionId } = req.body;
    const userId = req.user.userId;
    // Get user's cart
    let cart = await prisma_1.default.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: { include: { inventory: true, images: { where: { isThumbnail: true }, take: 1 } } },
                    variant: true,
                },
            },
            coupon: true,
        },
    });
    // If user cart is empty but session ID is provided, try session cart (guest cart not yet merged)
    if ((!cart || cart.items.length === 0) && sessionId) {
        const sessionCart = await prisma_1.default.cart.findUnique({
            where: { sessionId },
            include: {
                items: {
                    include: {
                        product: { include: { inventory: true, images: { where: { isThumbnail: true }, take: 1 } } },
                        variant: true,
                    },
                },
                coupon: true,
            },
        });
        if (sessionCart && sessionCart.items.length > 0) {
            cart = sessionCart;
        }
    }
    if (!cart || cart.items.length === 0)
        throw (0, error_1.createError)('Cart is empty', 400);
    // Validate address
    const address = await prisma_1.default.address.findFirst({ where: { id: shippingAddressId, userId } });
    if (!address)
        throw (0, error_1.createError)('Invalid shipping address', 400);
    // Server-side price + stock validation
    let subtotal = 0;
    const orderItemsData = [];
    for (const item of cart.items) {
        if (!item.product.isActive)
            throw (0, error_1.createError)(`Product "${item.product.name}" is no longer available`, 400);
        const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
        const stock = item.variant ? item.variant.stock : item.product.inventory?.quantity ?? 0;
        if (stock < item.quantity)
            throw (0, error_1.createError)(`Insufficient stock for "${item.product.name}"`, 400);
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
            }
            else if (c.applicableType === 'PRODUCT') {
                const couponProducts = await prisma_1.default.couponProduct.findMany({ where: { couponId: c.id }, select: { productId: true } });
                const validProductIds = couponProducts.map(cp => cp.productId);
                for (const item of cart.items) {
                    if (validProductIds.includes(item.productId)) {
                        const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
                        eligibleSubtotal += price * item.quantity;
                    }
                }
            }
            else if (c.applicableType === 'CATEGORY') {
                const couponCategories = await prisma_1.default.couponCategory.findMany({ where: { couponId: c.id }, select: { categoryId: true } });
                const validCategoryIds = couponCategories.map(cc => cc.categoryId);
                for (const item of cart.items) {
                    if (item.product && validCategoryIds.includes(item.product.categoryId)) {
                        const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
                        eligibleSubtotal += price * item.quantity;
                    }
                }
            }
            if (eligibleSubtotal > 0 && (!c.minOrderAmount || subtotal >= Number(c.minOrderAmount))) {
                if (c.discountType === 'PERCENTAGE') {
                    couponDiscount = (eligibleSubtotal * Number(c.discountValue)) / 100;
                    if (c.maxDiscount)
                        couponDiscount = Math.min(couponDiscount, Number(c.maxDiscount));
                }
                else {
                    couponDiscount = Math.min(Number(c.discountValue), eligibleSubtotal);
                }
                couponCode = c.code;
            }
        }
    }
    // Shipping logic via Shipping Zones
    const shippingSettings = await prisma_1.default.storeSettings.findMany({ where: { group: 'shipping' } });
    let freeThreshold = parseFloat(shippingSettings.find(s => s.key === 'free_shipping_threshold')?.value || '999');
    let shippingChargeValue = parseFloat(shippingSettings.find(s => s.key === 'default_shipping_charge')?.value || '99');
    // Find matching Shipping Zone
    const zones = await prisma_1.default.shipping.findMany({ where: { isActive: true } });
    const matchingZone = zones.find(z => z.states?.toLowerCase()?.includes(address.state?.toLowerCase() || ''));
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
    const order = await prisma_1.default.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId,
                paymentMethod: paymentMethod,
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
                        method: paymentMethod,
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
            }
            else {
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
    }, { maxWait: 5000, timeout: 20000 });
    // Send confirmation email if COD
    if (paymentMethod === 'COD') {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (user) {
            await notification_service_1.NotificationService.orderPlaced(order, user);
            await notification_service_1.NotificationService.adminNewOrder(order);
        }
    }
    res.status(201).json({ success: true, message: 'Order created', data: order });
});
exports.createRazorpayOrder = (0, error_1.asyncHandler)(async (req, res) => {
    const { orderId } = req.body;
    const order = await prisma_1.default.order.findFirst({ where: { id: orderId, userId: req.user.userId } });
    if (!order)
        throw (0, error_1.createError)('Order not found', 404);
    const provider = payment_factory_1.PaymentFactory.getProvider();
    try {
        const paymentInitResponse = await provider.initializePayment(order.id, Number(order.total), 'INR', order.orderNumber);
        await prisma_1.default.payment.update({
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
    }
    catch (error) {
        throw (0, error_1.createError)(error.message || 'Payment initialization failed', 500);
    }
});
exports.verifyPayment = (0, error_1.asyncHandler)(async (req, res) => {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const order = await prisma_1.default.order.findFirst({ where: { id: orderId }, include: { payment: true } });
    if (!order)
        throw (0, error_1.createError)('Order not found', 404);
    const provider = payment_factory_1.PaymentFactory.getProvider();
    const isValid = await provider.verifySignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
    });
    if (!isValid) {
        await prisma_1.default.$transaction([
            prisma_1.default.payment.update({ where: { orderId }, data: { status: 'FAILED' } }),
            prisma_1.default.order.update({ where: { id: orderId }, data: { paymentStatus: 'FAILED' } }),
            prisma_1.default.orderTimeline.create({ data: { orderId, status: 'FAILED', message: 'Payment signature verification failed' } })
        ]);
        const user = await prisma_1.default.user.findUnique({ where: { id: order.userId } });
        if (user) {
            await notification_service_1.NotificationService.paymentFailed(order, user);
            await notification_service_1.NotificationService.adminPaymentIssue(order, 'Invalid signature on verification');
        }
        throw (0, error_1.createError)('Payment verification failed. Invalid signature.', 400);
    }
    // Signature valid - Mark order as paid
    await prisma_1.default.$transaction([
        prisma_1.default.payment.update({
            where: { orderId },
            data: { status: 'PAID', razorpayPaymentId, razorpaySignature }
        }),
        prisma_1.default.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'PAID', status: 'CONFIRMED' }
        }),
        prisma_1.default.orderTimeline.create({
            data: { orderId, status: 'CONFIRMED', message: 'Payment received securely and order confirmed' },
        }),
    ]);
    // Send Confirmation Email and Notification now that payment is confirmed
    const user = await prisma_1.default.user.findUnique({ where: { id: order.userId } });
    if (user) {
        await notification_service_1.NotificationService.paymentSuccessful(order, user);
        await notification_service_1.NotificationService.orderPlaced(order, user);
        await notification_service_1.NotificationService.adminNewOrder(order);
    }
    res.json({ success: true, message: 'Payment verified successfully' });
});
exports.razorpayWebhook = (0, error_1.asyncHandler)(async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body.toString ? req.body.toString() : JSON.stringify(req.body);
    const provider = payment_factory_1.PaymentFactory.getProvider();
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
        let internalOrder = await prisma_1.default.order.findUnique({ where: { id: result.orderId } });
        if (!internalOrder) {
            // Try resolving by razorpay order ID from Payment table
            const payment = await prisma_1.default.payment.findFirst({ where: { razorpayOrderId: result.orderId } });
            if (payment) {
                internalOrder = await prisma_1.default.order.findUnique({ where: { id: payment.orderId } });
            }
        }
        if (internalOrder) {
            await prisma_1.default.$transaction(async (tx) => {
                const payment = await tx.payment.findUnique({ where: { orderId: internalOrder.id } });
                // GUARD 1: Never overwrite a successfully paid order
                if (payment && payment.status === 'PAID') {
                    console.log(`[WEBHOOK] Skipping update for order ${internalOrder.id} - already PAID`);
                    return;
                }
                // GUARD 2: For FAILED events, only mark as failed if there's a real razorpayPaymentId
                // (i.e. an actual payment attempt). Popup close events send no paymentId.
                if (result.paymentStatus === 'FAILED') {
                    const rzpPaymentId = JSON.parse(rawBody)?.payload?.payment?.entity?.id;
                    if (!rzpPaymentId) {
                        console.log(`[WEBHOOK] Skipping FAILED update - no razorpay_payment_id (likely popup close)`);
                        return;
                    }
                }
                if (payment && payment.status !== result.paymentStatus) {
                    await tx.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: result.paymentStatus,
                            failureReason: result.failureReason || payment.failureReason
                        },
                    });
                    await tx.order.update({
                        where: { id: internalOrder.id },
                        data: { paymentStatus: result.paymentStatus },
                    });
                    await tx.orderTimeline.create({
                        data: {
                            orderId: internalOrder.id,
                            status: result.paymentStatus === 'PAID' ? 'CONFIRMED' : result.paymentStatus,
                            message: `Payment status updated to ${result.paymentStatus} via Webhook`
                        }
                    });
                }
            });
            // Fire notifications outside transaction
            const user = await prisma_1.default.user.findUnique({ where: { id: internalOrder.userId } });
            if (user) {
                if (result.paymentStatus === 'PAID') {
                    await notification_service_1.NotificationService.paymentSuccessful(internalOrder, user);
                    await notification_service_1.NotificationService.orderPlaced(internalOrder, user);
                    await notification_service_1.NotificationService.adminNewOrder(internalOrder);
                }
                else if (result.paymentStatus === 'FAILED') {
                    await notification_service_1.NotificationService.paymentFailed(internalOrder, user);
                    await notification_service_1.NotificationService.adminPaymentIssue(internalOrder, result.failureReason || 'Webhook reported payment failure');
                }
            }
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ success: false, message: 'Internal Webhook Error' });
    }
});
exports.getUserOrders = (0, error_1.asyncHandler)(async (req, res) => {
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
        prisma_1.default.order.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: parseInt(limit),
            include: {
                items: { select: { productName: true, quantity: true, unitPrice: true, image: true } },
                payment: { select: { status: true, method: true } },
            },
        }),
        prisma_1.default.order.count({ where: { userId: req.user.userId } }),
    ]);
    res.json({ success: true, data: orders, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});
exports.getOrderById = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await prisma_1.default.order.findFirst({
        where: { id, userId: req.user.userId },
        include: {
            items: { include: { product: { select: { slug: true } } } },
            shippingAddress: true,
            billingAddress: true,
            payment: true,
            timeline: { orderBy: { createdAt: 'asc' } },
        },
    });
    if (!order)
        throw (0, error_1.createError)('Order not found', 404);
    res.json({ success: true, data: order });
});
// ===================== ADMIN =====================
exports.adminGetOrders = (0, error_1.asyncHandler)(async (req, res) => {
    const { page = '1', limit = '20', status, paymentStatus, search, startDate, endDate, minAmount, maxAmount } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (status)
        where.status = status;
    if (paymentStatus)
        where.paymentStatus = paymentStatus;
    if (search)
        where.OR = [{ orderNumber: { contains: search, mode: 'insensitive' } }, { user: { email: { contains: search, mode: 'insensitive' } } }];
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate)
            where.createdAt.gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setUTCHours(23, 59, 59, 999);
            where.createdAt.lte = end;
        }
    }
    if (minAmount || maxAmount) {
        where.total = {};
        if (minAmount)
            where.total.gte = parseFloat(minAmount);
        if (maxAmount)
            where.total.lte = parseFloat(maxAmount);
    }
    const [orders, total] = await Promise.all([
        prisma_1.default.order.findMany({
            where, skip, take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                items: { select: { productName: true, quantity: true } },
                payment: { select: { status: true } },
            },
        }),
        prisma_1.default.order.count({ where }),
    ]);
    res.json({ success: true, data: orders, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});
exports.adminGetOrderById = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await prisma_1.default.order.findUnique({
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
    if (!order)
        throw (0, error_1.createError)('Order not found', 404);
    res.json({ success: true, data: order });
});
exports.adminUpdateOrderStatus = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus, trackingNumber, deliveryPartner, message } = req.body;
    const existingOrder = await prisma_1.default.order.findUnique({ where: { id }, include: { items: true } });
    if (!existingOrder)
        throw (0, error_1.createError)('Order not found', 404);
    const dataToUpdate = {};
    if (status)
        dataToUpdate.status = status;
    if (paymentStatus)
        dataToUpdate.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined)
        dataToUpdate.trackingNumber = trackingNumber;
    if (deliveryPartner !== undefined)
        dataToUpdate.deliveryPartner = deliveryPartner;
    const order = await prisma_1.default.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
            where: { id },
            data: dataToUpdate,
        });
        // Stock Restoration
        if (status === 'CANCELLED' && existingOrder.status !== 'CANCELLED') {
            for (const item of existingOrder.items) {
                if (item.variantId) {
                    await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } });
                }
                else {
                    await tx.inventory.update({ where: { productId: item.productId }, data: { quantity: { increment: item.quantity } } });
                }
                await tx.product.update({ where: { id: item.productId }, data: { totalSold: { decrement: item.quantity } } });
            }
        }
        // Refund Record
        if (paymentStatus === 'REFUNDED' && existingOrder.paymentStatus !== 'REFUNDED') {
            await tx.refund.create({
                data: {
                    orderId: id,
                    amount: existingOrder.total,
                    reason: message || 'Admin initiated refund',
                    status: 'COMPLETED',
                    processedAt: new Date()
                }
            });
        }
        return updatedOrder;
    }, { maxWait: 5000, timeout: 20000 });
    await prisma_1.default.orderTimeline.create({
        data: { orderId: id, status, message: message || `Order status updated to ${status}`, createdBy: req.user.userId },
    });
    await prisma_1.default.adminActivityLog.create({
        data: { adminId: req.user.userId, action: 'UPDATE_ORDER_STATUS', entity: 'Order', entityId: id, newValue: JSON.stringify({ status }) },
    });
    const orderForNotification = await prisma_1.default.order.findUnique({ where: { id } });
    if (orderForNotification) {
        const user = await prisma_1.default.user.findUnique({ where: { id: orderForNotification.userId } });
        if (user) {
            if (status === 'SHIPPED')
                await notification_service_1.NotificationService.orderShipped(orderForNotification, user);
            if (status === 'DELIVERED')
                await notification_service_1.NotificationService.orderDelivered(orderForNotification, user);
        }
    }
    res.json({ success: true, message: 'Order status updated', data: order });
});
//# sourceMappingURL=order.controller.js.map
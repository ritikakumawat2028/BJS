"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const email_1 = require("../utils/email");
class NotificationService {
    /**
     * Creates an In-App notification and attempts to dispatch configured external providers
     */
    static async dispatch(userIds, type, title, message, emailOptions, data) {
        const ids = Array.isArray(userIds) ? userIds : [userIds];
        // 1. Create In-App Notifications
        for (const userId of ids) {
            await prisma_1.default.notification.create({
                data: {
                    userId,
                    type,
                    title,
                    message,
                    data: data ? JSON.stringify(data) : null,
                },
            });
        }
        // 2. Dispatch Email if configured
        if (emailOptions) {
            const emailSent = await (0, email_1.sendEmail)(emailOptions);
            if (!emailSent) {
                console.log(`[NOTIFICATION] External dispatch skipped or failed for ${title}`);
            }
        }
    }
    // ==========================================
    // CUSTOMER NOTIFICATIONS
    // ==========================================
    static async orderPlaced(order, user) {
        await this.dispatch(user.id, 'ORDER_PLACED', 'Order Placed', `Your order #${order.id.slice(-6)} has been placed successfully.`, {
            to: user.email,
            subject: `Order Confirmation - #${order.id.slice(-6)}`,
            html: (0, email_1.orderConfirmationEmail)(order.id.slice(-6), user.firstName, order.total.toString()),
        }, { orderId: order.id });
    }
    static async paymentSuccessful(order, user) {
        await this.dispatch(user.id, 'PAYMENT_SUCCESS', 'Payment Successful', `Payment for order #${order.id.slice(-6)} was successful.`, undefined, { orderId: order.id });
    }
    static async paymentFailed(order, user) {
        await this.dispatch(user.id, 'PAYMENT_FAILED', 'Payment Failed', `Your payment for order #${order.id.slice(-6)} has failed. Please try again.`, undefined, { orderId: order.id });
    }
    static async orderShipped(order, user) {
        await this.dispatch(user.id, 'ORDER_SHIPPED', 'Order Shipped', `Great news! Your order #${order.id.slice(-6)} has been shipped.`, {
            to: user.email,
            subject: `Your Order #${order.id.slice(-6)} has shipped!`,
            html: `<p>Dear ${user.firstName},</p><p>Your order is on the way!</p>`,
        }, { orderId: order.id });
    }
    static async orderDelivered(order, user) {
        await this.dispatch(user.id, 'ORDER_DELIVERED', 'Order Delivered', `Your order #${order.id.slice(-6)} has been delivered. Enjoy your products!`, undefined, { orderId: order.id });
    }
    static async refundProcessed(order, user) {
        await this.dispatch(user.id, 'REFUND_PROCESSED', 'Refund Processed', `A refund for order #${order.id.slice(-6)} has been processed.`, {
            to: user.email,
            subject: `Refund Processed - #${order.id.slice(-6)}`,
            html: `<p>Dear ${user.firstName},</p><p>Your refund has been initiated.</p>`,
        }, { orderId: order.id });
    }
    // ==========================================
    // ADMIN NOTIFICATIONS
    // ==========================================
    static async getAdminIds() {
        const admins = await prisma_1.default.user.findMany({ where: { role: { name: 'ADMIN' } }, select: { id: true } });
        return admins.map((a) => a.id);
    }
    static async adminNewOrder(order) {
        const adminIds = await this.getAdminIds();
        if (!adminIds.length)
            return;
        await this.dispatch(adminIds, 'ADMIN_NEW_ORDER', 'New Order Received', `A new order #${order.id.slice(-6)} has been placed for ₹${order.total}.`, undefined, // Don't spam admin email unless specifically configured later
        { orderId: order.id });
    }
    static async adminLowStock(product) {
        const adminIds = await this.getAdminIds();
        if (!adminIds.length)
            return;
        await this.dispatch(adminIds, 'ADMIN_LOW_STOCK', 'Low Stock Alert', `Product "${product.name}" is low on stock (Only ${product.inventory?.quantity || 0} left).`, undefined, { productId: product.id });
    }
    static async adminPaymentIssue(order, issueDetails) {
        const adminIds = await this.getAdminIds();
        if (!adminIds.length)
            return;
        await this.dispatch(adminIds, 'ADMIN_PAYMENT_ISSUE', 'Payment Issue', `Order #${order.id.slice(-6)} encountered a payment issue: ${issueDetails}`, undefined, { orderId: order.id });
    }
    static async adminReturnRequest(returnReq) {
        const adminIds = await this.getAdminIds();
        if (!adminIds.length)
            return;
        await this.dispatch(adminIds, 'ADMIN_RETURN_REQUEST', 'Return Request', `A new return request has been submitted for order #${returnReq.orderId?.slice(-6) || 'Unknown'}.`, undefined, { returnRequestId: returnReq.id });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map
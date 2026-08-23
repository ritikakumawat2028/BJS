"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayProvider = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const getSetting_1 = require("../../utils/getSetting");
class RazorpayProvider {
    async getKeys() {
        const keyId = await (0, getSetting_1.getSetting)('razorpay_key_id', 'RAZORPAY_KEY_ID') || '';
        const keySecret = await (0, getSetting_1.getSetting)('razorpay_key_secret', 'RAZORPAY_KEY_SECRET') || '';
        const webhookSecret = await (0, getSetting_1.getSetting)('razorpay_webhook_secret', 'RAZORPAY_WEBHOOK_SECRET') || '';
        if (!keyId || keyId === 'rzp_test_placeholder') {
            console.warn('Razorpay is not fully configured (using placeholder keys).');
        }
        return { keyId, keySecret, webhookSecret };
    }
    async getRazorpayInstance() {
        const { keyId, keySecret } = await this.getKeys();
        return new razorpay_1.default({
            key_id: keyId,
            key_secret: keySecret,
        });
    }
    async initializePayment(orderId, amount, currency, receipt) {
        const razorpay = await this.getRazorpayInstance();
        const { keyId } = await this.getKeys();
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert to subunits (e.g., paise)
            currency,
            receipt,
            notes: { internal_order_id: orderId }
        });
        return {
            providerOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount / 100, // keep the interface normalized
            currency: razorpayOrder.currency,
            key: keyId,
        };
    }
    async verifySignature(payload) {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = payload;
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return false;
        }
        const { keySecret } = await this.getKeys();
        const expectedSignature = crypto_1.default
            .createHmac('sha256', keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');
        return expectedSignature === razorpaySignature;
    }
    async handleWebhook(body, signature) {
        const { webhookSecret } = await this.getKeys();
        const expectedSignature = crypto_1.default
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');
        if (signature !== expectedSignature) {
            return { success: false, failureReason: 'Invalid webhook signature' };
        }
        const event = JSON.parse(body);
        const paymentEntity = event.payload?.payment?.entity;
        // Fallback orderId extraction
        const internalOrderId = paymentEntity?.notes?.internal_order_id;
        // We also need the razorpay order ID to look up in DB if notes is missing
        const rzpOrderId = paymentEntity?.order_id;
        if (!paymentEntity) {
            return { success: false, failureReason: 'Malformed webhook payload' };
        }
        switch (event.event) {
            case 'payment.captured':
                return {
                    success: true,
                    orderId: internalOrderId || rzpOrderId, // Will handle resolution in the controller
                    paymentStatus: 'PAID',
                };
            case 'payment.failed':
                return {
                    success: true,
                    orderId: internalOrderId || rzpOrderId,
                    paymentStatus: 'FAILED',
                    failureReason: paymentEntity.error_description || 'Payment failed on provider side',
                };
            case 'refund.processed':
                return {
                    success: true,
                    orderId: internalOrderId || rzpOrderId,
                    paymentStatus: 'REFUNDED',
                };
            default:
                // Unhandled event type, but perfectly valid webhook
                return { success: true };
        }
    }
}
exports.RazorpayProvider = RazorpayProvider;
//# sourceMappingURL=razorpay.provider.js.map
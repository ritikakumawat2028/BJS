import Razorpay from 'razorpay';
import crypto from 'crypto';
import { IPaymentProvider, PaymentInitializationResponse, WebhookResult } from './payment.interface';

export class RazorpayProvider implements IPaymentProvider {
  private razorpay: Razorpay;
  private webhookSecret: string;
  private keyId: string;
  private keySecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    if (!this.keyId || this.keyId === 'rzp_test_placeholder') {
      console.warn('Razorpay is not fully configured (using placeholder keys).');
    }

    this.razorpay = new Razorpay({
      key_id: this.keyId,
      key_secret: this.keySecret,
    });
  }

  async initializePayment(orderId: string, amount: number, currency: string, receipt: string): Promise<PaymentInitializationResponse> {
    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to subunits (e.g., paise)
      currency,
      receipt,
      notes: { internal_order_id: orderId }
    });

    return {
      providerOrderId: razorpayOrder.id,
      amount: (razorpayOrder.amount as number) / 100, // keep the interface normalized
      currency: razorpayOrder.currency,
      key: this.keyId,
    };
  }

  verifySignature(payload: Record<string, any>): boolean {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = payload;
    
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }

  async handleWebhook(body: string, signature: string): Promise<WebhookResult> {
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
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

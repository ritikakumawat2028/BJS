import Razorpay from 'razorpay';
import crypto from 'crypto';
import { IPaymentProvider, PaymentInitializationResponse, WebhookResult } from './payment.interface';
import { getSetting } from '../../utils/getSetting';

export class RazorpayProvider implements IPaymentProvider {
  private async getKeys() {
    const keyId = await getSetting('razorpay_key_id', 'RAZORPAY_KEY_ID') || '';
    const keySecret = await getSetting('razorpay_key_secret', 'RAZORPAY_KEY_SECRET') || '';
    const webhookSecret = await getSetting('razorpay_webhook_secret', 'RAZORPAY_WEBHOOK_SECRET') || '';

    if (!keyId || keyId === 'rzp_test_placeholder') {
      console.warn('Razorpay is not fully configured (using placeholder keys).');
    }

    return { keyId, keySecret, webhookSecret };
  }

  private async getRazorpayInstance() {
    const { keyId, keySecret } = await this.getKeys();
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  async initializePayment(orderId: string, amount: number, currency: string, receipt: string): Promise<PaymentInitializationResponse> {
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
      amount: (razorpayOrder.amount as number) / 100, // keep the interface normalized
      currency: razorpayOrder.currency,
      key: keyId,
    };
  }

  async verifySignature(payload: Record<string, any>): Promise<boolean> {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = payload;
    
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return false;
    }

    const { keySecret } = await this.getKeys();

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }

  async handleWebhook(body: string, signature: string): Promise<WebhookResult> {
    const { webhookSecret } = await this.getKeys();

    const expectedSignature = crypto
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

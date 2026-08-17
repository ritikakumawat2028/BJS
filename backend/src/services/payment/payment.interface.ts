export interface PaymentInitializationResponse {
  providerOrderId: string;
  amount: number;
  currency: string;
  key?: string; // e.g., Razorpay Key ID
  meta?: any;
}

export interface WebhookResult {
  success: boolean;
  orderId?: string;
  paymentStatus?: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  failureReason?: string;
}

export interface IPaymentProvider {
  /**
   * Initializes a payment intent/order on the provider's side.
   * @param orderId Internal DB order ID
   * @param amount Total amount in primary currency (e.g., INR)
   * @param currency Currency code (e.g., 'INR')
   * @param receipt Receipt identifier (e.g., orderNumber)
   */
  initializePayment(orderId: string, amount: number, currency: string, receipt: string): Promise<PaymentInitializationResponse>;

  /**
   * Verifies the cryptographic signature of the payment callback.
   * @param payload Provider-specific payload containing signatures
   */
  verifySignature(payload: Record<string, any>): boolean;

  /**
   * Processes a webhook payload from the provider.
   * @param body Raw body of the request (stringified)
   * @param signature Signature header sent by provider
   */
  handleWebhook(body: string, signature: string): Promise<WebhookResult>;
}

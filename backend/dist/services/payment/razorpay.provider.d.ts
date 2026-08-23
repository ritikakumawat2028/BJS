import { IPaymentProvider, PaymentInitializationResponse, WebhookResult } from './payment.interface';
export declare class RazorpayProvider implements IPaymentProvider {
    private getKeys;
    private getRazorpayInstance;
    initializePayment(orderId: string, amount: number, currency: string, receipt: string): Promise<PaymentInitializationResponse>;
    verifySignature(payload: Record<string, any>): Promise<boolean>;
    handleWebhook(body: string, signature: string): Promise<WebhookResult>;
}
//# sourceMappingURL=razorpay.provider.d.ts.map
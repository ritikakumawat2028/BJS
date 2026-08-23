export declare class NotificationService {
    /**
     * Creates an In-App notification and attempts to dispatch configured external providers
     */
    private static dispatch;
    static orderPlaced(order: any, user: any): Promise<void>;
    static paymentSuccessful(order: any, user: any): Promise<void>;
    static paymentFailed(order: any, user: any): Promise<void>;
    static orderShipped(order: any, user: any): Promise<void>;
    static orderDelivered(order: any, user: any): Promise<void>;
    static refundProcessed(order: any, user: any): Promise<void>;
    private static getAdminIds;
    static adminNewOrder(order: any): Promise<void>;
    static adminLowStock(product: any): Promise<void>;
    static adminPaymentIssue(order: any, issueDetails: string): Promise<void>;
    static adminReturnRequest(returnReq: any): Promise<void>;
}
//# sourceMappingURL=notification.service.d.ts.map
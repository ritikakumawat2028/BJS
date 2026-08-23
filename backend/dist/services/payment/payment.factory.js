"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentFactory = void 0;
const razorpay_provider_1 = require("./razorpay.provider");
class PaymentFactory {
    static getProvider(providerName) {
        const activeProviderName = providerName || process.env.ACTIVE_PAYMENT_PROVIDER || 'RAZORPAY';
        if (this.providerInstances[activeProviderName]) {
            return this.providerInstances[activeProviderName];
        }
        let provider;
        switch (activeProviderName.toUpperCase()) {
            case 'RAZORPAY':
                provider = new razorpay_provider_1.RazorpayProvider();
                break;
            // case 'STRIPE':
            //   provider = new StripeProvider();
            //   break;
            default:
                provider = new razorpay_provider_1.RazorpayProvider(); // Default to Razorpay
        }
        this.providerInstances[activeProviderName] = provider;
        return provider;
    }
}
exports.PaymentFactory = PaymentFactory;
PaymentFactory.providerInstances = {};
//# sourceMappingURL=payment.factory.js.map
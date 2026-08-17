import { IPaymentProvider } from './payment.interface';
import { RazorpayProvider } from './razorpay.provider';

export class PaymentFactory {
  private static providerInstances: Record<string, IPaymentProvider> = {};

  static getProvider(providerName?: string): IPaymentProvider {
    const activeProviderName = providerName || process.env.ACTIVE_PAYMENT_PROVIDER || 'RAZORPAY';

    if (this.providerInstances[activeProviderName]) {
      return this.providerInstances[activeProviderName];
    }

    let provider: IPaymentProvider;

    switch (activeProviderName.toUpperCase()) {
      case 'RAZORPAY':
        provider = new RazorpayProvider();
        break;
      // case 'STRIPE':
      //   provider = new StripeProvider();
      //   break;
      default:
        provider = new RazorpayProvider(); // Default to Razorpay
    }

    this.providerInstances[activeProviderName] = provider;
    return provider;
  }
}

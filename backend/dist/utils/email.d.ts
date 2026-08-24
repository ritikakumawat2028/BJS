interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare const sendEmail: ({ to, subject, html }: EmailOptions) => Promise<boolean>;
export declare const orderConfirmationEmail: (orderNumber: string, customerName: string, total: string) => string;
export declare const otpVerificationEmailTemplate: (otp: string) => string;
export declare const newsletterWelcomeEmailTemplate: (unsubscribeUrl: string) => string;
export declare const newsletterVerificationEmailTemplate: (verifyUrl: string) => string;
export {};
//# sourceMappingURL=email.d.ts.map
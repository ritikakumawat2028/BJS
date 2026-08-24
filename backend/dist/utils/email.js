"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordEmailTemplate = exports.newsletterVerificationEmailTemplate = exports.newsletterWelcomeEmailTemplate = exports.otpVerificationEmailTemplate = exports.orderConfirmationEmail = exports.sendEmail = void 0;
const resend_1 = require("resend");
const getSetting_1 = require("./getSetting");
const sendEmail = async ({ to, subject, html }) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.log(`\n======================================================`);
        console.log(`[EMAIL SKIPPED - RESEND_API_KEY NOT CONFIGURED]`);
        console.log(`To: ${to} | Subject: ${subject}`);
        console.log(`======================================================\n`);
        return false;
    }
    // Get from address — must use a verified domain on Resend
    const emailFrom = await (0, getSetting_1.getSetting)('email_from', 'EMAIL_FROM');
    if (!emailFrom) {
        console.error(`[EMAIL ERROR] EMAIL_FROM is not configured. Set EMAIL_FROM env variable to an address using your verified Resend domain (e.g. noreply@bjsluxe.com).`);
        return false;
    }
    const resend = new resend_1.Resend(resendApiKey);
    try {
        const { data, error } = await resend.emails.send({
            from: emailFrom,
            replyTo: 'jay250576@gmail.com',
            to,
            subject,
            html,
        });
        if (error) {
            console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error);
            return false;
        }
        return true;
    }
    catch (error) {
        console.error(`[EMAIL ERROR] Unexpected error sending email to ${to}:`, error);
        return false;
    }
};
exports.sendEmail = sendEmail;
const orderConfirmationEmail = (orderNumber, customerName, total) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: 'Georgia', serif; background: #080808; color: #F8F5EE; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .logo { font-size: 24px; letter-spacing: 3px; color: #C9A227; text-align: center; margin-bottom: 32px; }
  .heading { font-size: 28px; text-align: center; color: #F8F5EE; margin-bottom: 16px; }
  .body { font-size: 16px; line-height: 1.8; color: #ccc; }
  .order-box { background: #1A1A1A; border: 1px solid #C9A227; padding: 24px; margin: 24px 0; border-radius: 4px; }
  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; }
</style></head>
<body>
<div class="container">
  <div class="logo">BJ'S NATURAL CARE</div>
  <div class="heading">Order Confirmed ✓</div>
  <div class="body">
    <p>Dear ${customerName},</p>
    <p>Thank you for your order. We've received it and are preparing it with care.</p>
    <div class="order-box">
      <strong>Order Number:</strong> ${orderNumber}<br/>
      <strong>Total:</strong> ₹${total}
    </div>
    <p>You will receive tracking information once your order is shipped.</p>
    <p>Thank you for choosing BJ'S Natural Care — where luxury meets nature.</p>
  </div>
  <div class="footer">© BJ'S Natural Care. All rights reserved.</div>
</div>
</body>
</html>
`;
exports.orderConfirmationEmail = orderConfirmationEmail;
const otpVerificationEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: 'Georgia', serif; background: #080808; color: #F8F5EE; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .logo { font-size: 24px; letter-spacing: 3px; color: #C9A227; text-align: center; margin-bottom: 32px; }
  .heading { font-size: 28px; text-align: center; color: #F8F5EE; margin-bottom: 16px; }
  .body { font-size: 16px; line-height: 1.8; color: #ccc; text-align: center; }
  .otp-box { background: #1A1A1A; border: 1px solid #C9A227; padding: 24px; margin: 24px auto; border-radius: 4px; max-width: 300px; }
  .otp { font-size: 36px; letter-spacing: 8px; color: #C9A227; margin: 0; font-weight: bold; }
  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; }
</style></head>
<body>
<div class="container">
  <div class="logo">BJ'S NATURAL CARE</div>
  <div class="heading">Verify Your Email</div>
  <div class="body">
    <p>Welcome to BJ'S Natural Care.</p>
    <p>Please use the following OTP to verify your email address and complete your registration:</p>
    <div class="otp-box">
      <p class="otp">${otp}</p>
    </div>
    <p>This code will expire in 10 minutes.</p>
  </div>
  <div class="footer">© BJ'S Natural Care. All rights reserved.</div>
</div>
</body>
</html>
`;
exports.otpVerificationEmailTemplate = otpVerificationEmailTemplate;
const newsletterWelcomeEmailTemplate = (unsubscribeUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: 'Georgia', serif; background: #080808; color: #F8F5EE; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .logo { font-size: 24px; letter-spacing: 3px; color: #C9A227; text-align: center; margin-bottom: 32px; }
  .heading { font-size: 28px; text-align: center; color: #F8F5EE; margin-bottom: 16px; }
  .body { font-size: 16px; line-height: 1.8; color: #ccc; text-align: center; }
  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; }
  .unsubscribe { color: #888; text-decoration: underline; font-size: 11px; margin-top: 10px; display: block; }
</style></head>
<body>
<div class="container">
  <div class="logo">BJ'S NATURAL CARE</div>
  <div class="heading">Welcome to the family ✨</div>
  <div class="body">
    <p>Thank you for subscribing to our newsletter!</p>
    <p>Get ready to receive exclusive offers, early access to new collections, and beauty tips curated just for you.</p>
    <p>We are thrilled to have you with us on this journey where luxury meets nature.</p>
  </div>
  <div class="footer">
    © BJ'S Natural Care. All rights reserved.<br/>
    <a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe anytime</a>
  </div>
</div>
</body>
</html>
`;
exports.newsletterWelcomeEmailTemplate = newsletterWelcomeEmailTemplate;
const newsletterVerificationEmailTemplate = (verifyUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: 'Georgia', serif; background: #080808; color: #F8F5EE; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .logo { font-size: 24px; letter-spacing: 3px; color: #C9A227; text-align: center; margin-bottom: 32px; }
  .heading { font-size: 28px; text-align: center; color: #F8F5EE; margin-bottom: 16px; }
  .body { font-size: 16px; line-height: 1.8; color: #ccc; text-align: center; }
  .btn { display: inline-block; background: #C9A227; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; margin: 20px 0; }
  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; }
</style></head>
<body>
<div class="container">
  <div class="logo">BJ'S NATURAL CARE</div>
  <div class="heading">Confirm your subscription</div>
  <div class="body">
    <p>You're almost there! Please confirm your subscription to the BJ'S Natural Care newsletter by clicking the button below.</p>
    <a href="${verifyUrl}" class="btn">Verify My Email</a>
    <p style="font-size: 12px; color: #888;">If you didn't request this, you can safely ignore this email.</p>
  </div>
  <div class="footer">© BJ'S Natural Care. All rights reserved.</div>
</div>
</body>
</html>
`;
exports.newsletterVerificationEmailTemplate = newsletterVerificationEmailTemplate;
const forgotPasswordEmailTemplate = (resetUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: 'Georgia', serif; background: #080808; color: #F8F5EE; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .logo { font-size: 24px; letter-spacing: 3px; color: #C9A227; text-align: center; margin-bottom: 32px; }
  .heading { font-size: 28px; text-align: center; color: #F8F5EE; margin-bottom: 16px; }
  .body { font-size: 16px; line-height: 1.8; color: #ccc; text-align: center; }
  .btn { display: inline-block; background: #C9A227; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; margin: 20px 0; }
  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; }
</style></head>
<body>
<div class="container">
  <div class="logo">BJ'S NATURAL CARE</div>
  <div class="heading">Reset Your Password</div>
  <div class="body">
    <p>We received a request to reset your password for your BJ'S Natural Care account.</p>
    <p>Click the button below to choose a new password:</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <p style="font-size: 12px; color: #888;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
  </div>
  <div class="footer">© BJ'S Natural Care. All rights reserved.</div>
</div>
</body>
</html>
`;
exports.forgotPasswordEmailTemplate = forgotPasswordEmailTemplate;
//# sourceMappingURL=email.js.map
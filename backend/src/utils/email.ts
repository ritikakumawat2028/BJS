import nodemailer from 'nodemailer';
import { getSetting } from './getSetting';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<boolean> => {
  const emailHost = await getSetting('email_host', 'EMAIL_HOST');
  const emailPort = await getSetting('email_port', 'EMAIL_PORT');
  const emailUser = await getSetting('email_user', 'EMAIL_USER');
  const emailPass = await getSetting('email_pass', 'EMAIL_PASS');
  const emailFrom = await getSetting('email_from', 'EMAIL_FROM');

  if (!emailUser || emailUser === 'placeholder@gmail.com') {
    console.log(`\n======================================================`);
    console.log(`[EMAIL SKIPPED - NOT CONFIGURED]`);
    console.log(`To: ${to} | Subject: ${subject}`);
    console.log(`Message Content:\n${html}`);
    console.log(`======================================================\n`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: Number(emailPort) || 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.sendMail({
      from: emailFrom || emailUser,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error);
    return false;
  }
};

export const orderConfirmationEmail = (orderNumber: string, customerName: string, total: string): string => `
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

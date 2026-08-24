import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { sendEmail, newsletterWelcomeEmailTemplate, newsletterVerificationEmailTemplate } from '../utils/email';

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  let { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  email = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  let subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (subscriber) {
    if (subscriber.status === 'active' && subscriber.isVerified) {
      return res.status(400).json({ success: false, message: "You're already subscribed to our newsletter." });
    }

    if (subscriber.status === 'unsubscribed') {
      const verifyToken = crypto.randomBytes(32).toString('hex');
      subscriber = await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: {
          status: 'pending',
          isVerified: false,
          verifyToken,
          unsubscribedAt: null,
          subscribedAt: new Date()
        }
      });
      
      const verifyUrl = `${FRONTEND_URL}/newsletter/verify?token=${verifyToken}&email=${encodeURIComponent(email)}`;
      await sendEmail({
        to: email,
        subject: 'Confirm your subscription',
        html: newsletterVerificationEmailTemplate(verifyUrl)
      });

      return res.json({ success: true, message: 'Welcome back! Please check your inbox to confirm your subscription.' });
    }

    if (!subscriber.isVerified) {
      const verifyUrl = `${FRONTEND_URL}/newsletter/verify?token=${subscriber.verifyToken}&email=${encodeURIComponent(email)}`;
      await sendEmail({
        to: email,
        subject: 'Confirm your subscription',
        html: newsletterVerificationEmailTemplate(verifyUrl)
      });
      return res.json({ success: true, message: 'Verification email resent. Please check your inbox.' });
    }
  }

  // Create new subscriber
  const verifyToken = crypto.randomBytes(32).toString('hex');
  subscriber = await prisma.newsletterSubscriber.create({
    data: {
      email,
      status: 'pending',
      isVerified: false,
      verifyToken
    }
  });

  const verifyUrl = `${FRONTEND_URL}/newsletter/verify?token=${verifyToken}&email=${encodeURIComponent(email)}`;
  await sendEmail({
    to: email,
    subject: 'Confirm your subscription',
    html: newsletterVerificationEmailTemplate(verifyUrl)
  });

  res.status(201).json({ success: true, message: 'Thank you for subscribing! Please check your inbox to confirm.' });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token, email } = req.body;

  if (!token || !email) {
    return res.status(400).json({ success: false, message: 'Invalid verification link' });
  }

  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email: String(email) } });

  if (!subscriber) {
    return res.status(404).json({ success: false, message: 'Subscriber not found' });
  }

  if (subscriber.isVerified && subscriber.status === 'active') {
    return res.json({ success: true, message: 'Email is already verified.' });
  }

  if (subscriber.verifyToken !== token) {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      isVerified: true,
      status: 'active',
      verifyToken: null
    }
  });

  const unsubscribeUrl = `${FRONTEND_URL}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
  await sendEmail({
    to: subscriber.email,
    subject: 'Welcome to the family ✨',
    html: newsletterWelcomeEmailTemplate(unsubscribeUrl)
  });

  res.json({ success: true, message: 'Successfully subscribed to our newsletter.' });
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email: String(email) } });

  if (!subscriber) {
    return res.status(404).json({ success: false, message: 'Subscriber not found' });
  }

  if (subscriber.status === 'unsubscribed') {
    return res.json({ success: true, message: 'You are already unsubscribed.' });
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: {
      status: 'unsubscribed',
      unsubscribedAt: new Date(),
      verifyToken: null
    }
  });

  res.json({ success: true, message: 'You have been successfully unsubscribed.' });
});

// Admin management
export const getAdminSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || '';
  const status = (req.query.status as string) || '';

  const skip = (page - 1) * limit;
  const where: any = {};

  if (search) {
    where.email = { contains: search, mode: 'insensitive' };
  }
  if (status) {
    where.status = status;
  }

  const [subscribers, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      skip,
      take: limit,
      orderBy: { subscribedAt: 'desc' }
    }),
    prisma.newsletterSubscriber.count({ where })
  ]);

  const [totalSubscribers, activeSubscribers, unsubscribedSubscribers, verifiedSubscribers] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { status: 'active' } }),
    prisma.newsletterSubscriber.count({ where: { status: 'unsubscribed' } }),
    prisma.newsletterSubscriber.count({ where: { isVerified: true } })
  ]);

  res.json({
    success: true,
    data: subscribers,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    },
    stats: {
      total: totalSubscribers,
      active: activeSubscribers,
      unsubscribed: unsubscribedSubscribers,
      verified: verifiedSubscribers
    }
  });
});

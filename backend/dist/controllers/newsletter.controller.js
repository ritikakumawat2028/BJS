"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSubscribers = exports.unsubscribe = exports.verifyEmail = exports.subscribe = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../config/prisma"));
const email_1 = require("../utils/email");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
exports.subscribe = asyncHandler(async (req, res) => {
    let { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    email = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    let subscriber = await prisma_1.default.newsletterSubscriber.findUnique({ where: { email } });
    if (subscriber) {
        if (subscriber.status === 'active' && subscriber.isVerified) {
            return res.status(400).json({ success: false, message: "You're already subscribed to our newsletter." });
        }
        if (subscriber.status === 'unsubscribed') {
            const verifyToken = crypto_1.default.randomBytes(32).toString('hex');
            subscriber = await prisma_1.default.newsletterSubscriber.update({
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
            await (0, email_1.sendEmail)({
                to: email,
                subject: 'Confirm your subscription',
                html: (0, email_1.newsletterVerificationEmailTemplate)(verifyUrl)
            });
            return res.json({ success: true, message: 'Welcome back! Please check your inbox to confirm your subscription.' });
        }
        if (!subscriber.isVerified) {
            const verifyUrl = `${FRONTEND_URL}/newsletter/verify?token=${subscriber.verifyToken}&email=${encodeURIComponent(email)}`;
            await (0, email_1.sendEmail)({
                to: email,
                subject: 'Confirm your subscription',
                html: (0, email_1.newsletterVerificationEmailTemplate)(verifyUrl)
            });
            return res.json({ success: true, message: 'Verification email resent. Please check your inbox.' });
        }
    }
    // Create new subscriber
    const verifyToken = crypto_1.default.randomBytes(32).toString('hex');
    subscriber = await prisma_1.default.newsletterSubscriber.create({
        data: {
            email,
            status: 'pending',
            isVerified: false,
            verifyToken
        }
    });
    const verifyUrl = `${FRONTEND_URL}/newsletter/verify?token=${verifyToken}&email=${encodeURIComponent(email)}`;
    await (0, email_1.sendEmail)({
        to: email,
        subject: 'Confirm your subscription',
        html: (0, email_1.newsletterVerificationEmailTemplate)(verifyUrl)
    });
    res.status(201).json({ success: true, message: 'Thank you for subscribing! Please check your inbox to confirm.' });
});
exports.verifyEmail = asyncHandler(async (req, res) => {
    const { token, email } = req.body;
    if (!token || !email) {
        return res.status(400).json({ success: false, message: 'Invalid verification link' });
    }
    const subscriber = await prisma_1.default.newsletterSubscriber.findUnique({ where: { email: String(email) } });
    if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    if (subscriber.isVerified && subscriber.status === 'active') {
        return res.json({ success: true, message: 'Email is already verified.' });
    }
    if (subscriber.verifyToken !== token) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
    }
    await prisma_1.default.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: {
            isVerified: true,
            status: 'active',
            verifyToken: null
        }
    });
    const unsubscribeUrl = `${FRONTEND_URL}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
    await (0, email_1.sendEmail)({
        to: subscriber.email,
        subject: 'Welcome to the family ✨',
        html: (0, email_1.newsletterWelcomeEmailTemplate)(unsubscribeUrl)
    });
    res.json({ success: true, message: 'Successfully subscribed to our newsletter.' });
});
exports.unsubscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const subscriber = await prisma_1.default.newsletterSubscriber.findUnique({ where: { email: String(email) } });
    if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    if (subscriber.status === 'unsubscribed') {
        return res.json({ success: true, message: 'You are already unsubscribed.' });
    }
    await prisma_1.default.newsletterSubscriber.update({
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
exports.getAdminSubscribers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const skip = (page - 1) * limit;
    const where = {};
    if (search) {
        where.email = { contains: search, mode: 'insensitive' };
    }
    if (status) {
        where.status = status;
    }
    const [subscribers, total] = await Promise.all([
        prisma_1.default.newsletterSubscriber.findMany({
            where,
            skip,
            take: limit,
            orderBy: { subscribedAt: 'desc' }
        }),
        prisma_1.default.newsletterSubscriber.count({ where })
    ]);
    const [totalSubscribers, activeSubscribers, unsubscribedSubscribers, verifiedSubscribers] = await Promise.all([
        prisma_1.default.newsletterSubscriber.count(),
        prisma_1.default.newsletterSubscriber.count({ where: { status: 'active' } }),
        prisma_1.default.newsletterSubscriber.count({ where: { status: 'unsubscribed' } }),
        prisma_1.default.newsletterSubscriber.count({ where: { isVerified: true } })
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
//# sourceMappingURL=newsletter.controller.js.map
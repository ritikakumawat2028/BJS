"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.logout = exports.login = exports.resendOtp = exports.register = exports.sendRegisterOtp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const error_1 = require("../middleware/error");
const email_1 = require("../utils/email");
exports.sendRegisterOtp = (0, error_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    if (!email)
        throw (0, error_1.createError)('Email is required', 400);
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing)
        throw (0, error_1.createError)('Email already registered', 400);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // Send email FIRST before saving OTP, so DB is only updated if email succeeds
    const emailSent = await (0, email_1.sendEmail)({
        to: email,
        subject: "Verify your email - BJ'S Natural Care",
        html: (0, email_1.otpVerificationEmailTemplate)(otp),
    });
    if (!emailSent) {
        throw (0, error_1.createError)('Failed to send OTP email. Please try again.', 500);
    }
    // Only save OTP to DB after email was sent successfully
    await prisma_1.default.otpVerification.upsert({
        where: { email },
        update: { otp, expiresAt },
        create: { email, otp, expiresAt },
    });
    // For development convenience, return OTP in response body
    if (process.env.NODE_ENV !== 'production') {
        res.json({ success: true, message: 'OTP sent to your email.', devOtp: otp });
    }
    else {
        res.json({ success: true, message: 'OTP sent to your email.' });
    }
});
exports.register = (0, error_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName, phone, otp } = req.body;
    if (!otp)
        throw (0, error_1.createError)('OTP is required', 400);
    const verification = await prisma_1.default.otpVerification.findUnique({ where: { email } });
    if (!verification || verification.otp !== otp || verification.expiresAt < new Date()) {
        throw (0, error_1.createError)('Invalid or expired OTP', 400);
    }
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing)
        throw (0, error_1.createError)('Email already registered', 400);
    let defaultRole = await prisma_1.default.role.findUnique({ where: { name: 'CUSTOMER' } });
    if (!defaultRole) {
        defaultRole = await prisma_1.default.role.create({ data: { name: 'CUSTOMER', description: 'Default Customer Role' } });
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const user = await prisma_1.default.user.create({
        data: { email, passwordHash, firstName, lastName, phone, roleId: defaultRole.id, isEmailVerified: true },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    // Delete OTP after successful registration
    await prisma_1.default.otpVerification.delete({ where: { email } });
    const roleName = user.role?.name || 'CUSTOMER';
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, role: roleName, email: user.email });
    const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user.id, role: roleName, email: user.email });
    await prisma_1.default.refreshToken.create({
        data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    res.cookie('bjs_refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, message: 'Account created successfully.', data: { user, accessToken } });
});
exports.resendOtp = (0, error_1.asyncHandler)(async (req, res) => {
    // Aliased to sendRegisterOtp for the pre-registration flow
    req.body.email = req.body.email; // Ensure email is in body
    return (0, exports.sendRegisterOtp)(req, res, () => { });
});
exports.login = (0, error_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.default.user.findUnique({ where: { email }, include: { role: true } });
    if (!user || !user.isActive)
        throw (0, error_1.createError)('Invalid credentials', 401);
    const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isMatch)
        throw (0, error_1.createError)('Invalid credentials', 401);
    const roleName = user.role?.name || 'CUSTOMER';
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: user.id, role: roleName, email: user.email });
    const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user.id, role: roleName, email: user.email });
    await prisma_1.default.refreshToken.create({
        data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    res.cookie('bjs_refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: roleName, avatar: user.avatar },
            accessToken,
        },
    });
});
exports.logout = (0, error_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies.bjs_refresh_token;
    if (refreshToken) {
        await prisma_1.default.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.clearCookie('bjs_refresh_token');
    res.json({ success: true, message: 'Logged out successfully' });
});
exports.refreshToken = (0, error_1.asyncHandler)(async (req, res) => {
    const token = req.cookies.bjs_refresh_token;
    if (!token)
        throw (0, error_1.createError)('Refresh token required', 401);
    const stored = await prisma_1.default.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
        throw (0, error_1.createError)('Invalid or expired refresh token', 401);
    }
    const payload = (0, jwt_1.verifyRefreshToken)(token);
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: payload.userId, role: payload.role, email: payload.email });
    res.json({ success: true, data: { accessToken } });
});
exports.forgotPassword = (0, error_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (user) {
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry: resetExpiry },
        });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await (0, email_1.sendEmail)({
            to: email,
            subject: "Reset your BJ'S Natural Care password",
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
        });
    }
    // Always respond the same to prevent email enumeration
    res.json({ success: true, message: 'If this email exists, a reset link has been sent' });
});
exports.resetPassword = (0, error_1.asyncHandler)(async (req, res) => {
    const { token, password } = req.body;
    const user = await prisma_1.default.user.findFirst({
        where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });
    if (!user)
        throw (0, error_1.createError)('Invalid or expired reset token', 400);
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });
    await prisma_1.default.refreshToken.deleteMany({ where: { userId: user.id } });
    res.json({ success: true, message: 'Password reset successful' });
});
exports.getProfile = (0, error_1.asyncHandler)(async (req, res) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: req.user.userId },
        select: {
            id: true, email: true, firstName: true, lastName: true,
            phone: true, role: true, avatar: true, isEmailVerified: true,
            createdAt: true, addresses: true,
            _count: { select: { orders: true } },
        },
    });
    if (!user)
        throw (0, error_1.createError)('User not found', 404);
    res.json({ success: true, data: user });
});
exports.updateProfile = (0, error_1.asyncHandler)(async (req, res) => {
    const { firstName, lastName, phone } = req.body;
    const user = await prisma_1.default.user.update({
        where: { id: req.user.userId },
        data: { firstName, lastName, phone },
        select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true },
    });
    res.json({ success: true, message: 'Profile updated', data: user });
});
exports.changePassword = (0, error_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma_1.default.user.findUnique({ where: { id: req.user.userId } });
    if (!user)
        throw (0, error_1.createError)('User not found', 404);
    const isMatch = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
    if (!isMatch)
        throw (0, error_1.createError)('Current password is incorrect', 400);
    const passwordHash = await bcryptjs_1.default.hash(newPassword, 12);
    await prisma_1.default.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ success: true, message: 'Password changed successfully' });
});
//# sourceMappingURL=auth.controller.js.map
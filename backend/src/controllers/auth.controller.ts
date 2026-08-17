import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { asyncHandler, createError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw createError('Email already registered', 400);

  let defaultRole = await prisma.role.findUnique({ where: { name: 'CUSTOMER' } });
  if (!defaultRole) {
    defaultRole = await prisma.role.create({ data: { name: 'CUSTOMER', description: 'Default Customer Role' } });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const emailVerifyToken = crypto.randomBytes(32).toString('hex');
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, phone, roleId: defaultRole.id, emailVerifyToken },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });

  const roleName = user.role?.name || 'CUSTOMER';
  const accessToken = generateAccessToken({ userId: user.id, role: roleName, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id, role: roleName, email: user.email });

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });
  
  // Send Verification Email
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerifyToken}`;
  await sendEmail({
    to: email,
    subject: "Verify your email - BJ'S Natural Care",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
  });

  res.cookie('bjs_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({ success: true, message: 'Account created. Please check your email to verify your account.', data: { user, accessToken } });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
  if (!user) throw createError('Invalid or expired verification token', 400);

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerifyToken: null },
  });

  res.json({ success: true, message: 'Email verified successfully' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  if (!user || !user.isActive) throw createError('Invalid credentials', 401);

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw createError('Invalid credentials', 401);

  const roleName = user.role?.name || 'CUSTOMER';
  const accessToken = generateAccessToken({ userId: user.id, role: roleName, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id, role: roleName, email: user.email });

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });

  res.cookie('bjs_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
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

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.bjs_refresh_token;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  res.clearCookie('bjs_refresh_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.bjs_refresh_token;
  if (!token) throw createError('Refresh token required', 401);

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    throw createError('Invalid or expired refresh token', 401);
  }

  const payload = verifyRefreshToken(token);
  const accessToken = generateAccessToken({ userId: payload.userId, role: payload.role, email: payload.email });

  res.json({ success: true, data: { accessToken } });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry: resetExpiry },
    });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: "Reset your BJ'S Natural Care password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });
  }
  // Always respond the same to prevent email enumeration
  res.json({ success: true, message: 'If this email exists, a reset link has been sent' });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  });
  if (!user) throw createError('Invalid or expired reset token', 400);

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

  res.json({ success: true, message: 'Password reset successful' });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      phone: true, role: true, avatar: true, isEmailVerified: true,
      createdAt: true, addresses: true,
      _count: { select: { orders: true } },
    },
  });
  if (!user) throw createError('User not found', 404);
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, phone } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { firstName, lastName, phone },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true },
  });
  res.json({ success: true, message: 'Profile updated', data: user });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw createError('User not found', 404);

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) throw createError('Current password is incorrect', 400);

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  res.json({ success: true, message: 'Password changed successfully' });
});

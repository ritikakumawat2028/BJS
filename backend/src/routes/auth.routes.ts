import { Router } from 'express';
import {
  register, login, logout, refreshToken, forgotPassword,
  resetPassword, getProfile, updateProfile, changePassword,
  verifyEmail
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { 
  registerSchema, loginSchema, resetPasswordSchema, 
  forgotPasswordSchema, changePasswordSchema 
} from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/verify-email', verifyEmail);

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);
router.put('/me/password', authenticate, validate(changePasswordSchema), changePassword);

export default router;

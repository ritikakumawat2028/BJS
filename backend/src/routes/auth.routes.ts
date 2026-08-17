import { Router } from 'express';
import {
  register, login, logout, refreshToken, forgotPassword,
  resetPassword, getProfile, updateProfile, changePassword,
  verifyEmail
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);
router.put('/me/password', authenticate, changePassword);

export default router;

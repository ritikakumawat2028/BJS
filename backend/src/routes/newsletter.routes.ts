import { Router } from 'express';
import {
  subscribe,
  verifyEmail,
  unsubscribe,
  getAdminSubscribers
} from '../controllers/newsletter.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/verify', verifyEmail);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/admin/subscribers', authenticate, requireAdmin, getAdminSubscribers);

export default router;

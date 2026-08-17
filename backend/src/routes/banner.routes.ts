import { Router } from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/banner.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { apiCache } from '../middleware/cache';

const router = Router();

// Public route (cached for 5 minutes)
router.get('/', apiCache('5 minutes'), getActiveBanners);

// Admin routes
router.get('/admin', authenticate, requireAdmin, getAllBanners);
router.post('/', authenticate, requireAdmin, createBanner);
router.put('/:id', authenticate, requireAdmin, updateBanner);
router.delete('/:id', authenticate, requireAdmin, deleteBanner);

export default router;

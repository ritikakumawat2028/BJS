import { Router } from 'express';
import { campaignController } from '../controllers/campaign.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { apiCache } from '../middleware/cache';

const router = Router();

// Public routes
router.get('/', apiCache('5 minutes'), campaignController.getActive);

// Admin routes
router.get('/admin', authenticate, requireAdmin, campaignController.getAll);
router.get('/:id', authenticate, requireAdmin, campaignController.getById);
router.post('/', authenticate, requireAdmin, campaignController.create);
router.put('/:id', authenticate, requireAdmin, campaignController.update);
router.delete('/:id', authenticate, requireAdmin, campaignController.delete);

export default router;

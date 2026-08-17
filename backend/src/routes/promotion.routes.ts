import { Router } from 'express';
import {
  getPromotions, getActivePromotions, getPromotionById,
  createPromotion, updatePromotion, deletePromotion
} from '../controllers/promotion.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/active', getActivePromotions);
router.get('/', authenticate, requireAdmin, getPromotions);
router.get('/:id', getPromotionById); // Usually public or at least needs to be fetchable
router.post('/', authenticate, requireAdmin, createPromotion);
router.put('/:id', authenticate, requireAdmin, updatePromotion);
router.delete('/:id', authenticate, requireAdmin, deletePromotion);

export default router;

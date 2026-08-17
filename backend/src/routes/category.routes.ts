import { Router } from 'express';
import {
  getCategories, getCategoryBySlug, adminCreateCategory, adminUpdateCategory,
  adminDeleteCategory, adminCreateSubcategory,
} from '../controllers/category.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { apiCache } from '../middleware/cache';

const router = Router();

router.get('/', apiCache('5 minutes'), getCategories);
router.get('/:slug', apiCache('5 minutes'), getCategoryBySlug);
router.post('/', authenticate, requireAdmin, adminCreateCategory);
router.put('/:id', authenticate, requireAdmin, adminUpdateCategory);
router.delete('/:id', authenticate, requireAdmin, adminDeleteCategory);
router.post('/subcategories', authenticate, requireAdmin, adminCreateSubcategory);

export default router;

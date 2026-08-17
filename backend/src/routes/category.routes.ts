import { Router } from 'express';
import {
  getCategories, getCategoryBySlug, adminCreateCategory, adminUpdateCategory,
  adminDeleteCategory, adminCreateSubcategory,
} from '../controllers/category.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', authenticate, requireAdmin, adminCreateCategory);
router.put('/:id', authenticate, requireAdmin, adminUpdateCategory);
router.delete('/:id', authenticate, requireAdmin, adminDeleteCategory);
router.post('/subcategories', authenticate, requireAdmin, adminCreateSubcategory);

export default router;

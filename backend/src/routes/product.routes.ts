import { Router } from 'express';
import {
  getProducts, getProductBySlug, getFeaturedProducts, getBestsellerProducts,
  getNewArrivals, searchProducts, adminGetProducts, adminCreateProduct,
  adminUpdateProduct, adminDeleteProduct, adminUpdateInventory, adminUploadProductImages,
} from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellerProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:slug', getProductBySlug);

// Admin
router.get('/admin/all', authenticate, requireAdmin, adminGetProducts);
router.post('/', authenticate, requireAdmin, adminCreateProduct);
router.put('/:id', authenticate, requireAdmin, adminUpdateProduct);
router.delete('/:id', authenticate, requireAdmin, adminDeleteProduct);
router.put('/:id/inventory', authenticate, requireAdmin, adminUpdateInventory);
router.post('/:id/images', authenticate, requireAdmin, adminUploadProductImages);

export default router;

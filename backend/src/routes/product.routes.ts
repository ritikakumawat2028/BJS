import { Router } from 'express';
import {
  getProducts, getProductBySlug, getFeaturedProducts, getBestsellerProducts,
  getNewArrivals, searchProducts, adminGetProducts, adminCreateProduct,
  adminUpdateProduct, adminDeleteProduct, adminUpdateInventory, adminUploadProductImages,
  getProductReviews
} from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { apiCache } from '../middleware/cache';

const router = Router();

// Public
router.get('/', apiCache('5 minutes'), getProducts);
router.get('/search', apiCache('5 minutes'), searchProducts);
router.get('/featured', apiCache('5 minutes'), getFeaturedProducts);
router.get('/bestsellers', apiCache('5 minutes'), getBestsellerProducts);
router.get('/new-arrivals', apiCache('5 minutes'), getNewArrivals);
router.get('/:slug', apiCache('5 minutes'), getProductBySlug);
router.get('/:id/reviews', apiCache('5 minutes'), getProductReviews);

// Admin
router.get('/admin/all', authenticate, requireAdmin, adminGetProducts);
router.post('/', authenticate, requireAdmin, adminCreateProduct);
router.put('/:id', authenticate, requireAdmin, adminUpdateProduct);
router.delete('/:id', authenticate, requireAdmin, adminDeleteProduct);
router.put('/:id/inventory', authenticate, requireAdmin, adminUpdateInventory);
router.post('/:id/images', authenticate, requireAdmin, adminUploadProductImages);

export default router;

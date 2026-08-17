import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, applyCoupon, removeCoupon, mergeCart } from '../controllers/cart.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addToCart);
router.put('/items/:itemId', optionalAuth, updateCartItem);
router.delete('/items/:itemId', optionalAuth, removeCartItem);
router.post('/coupon', optionalAuth, applyCoupon);
router.delete('/coupon', optionalAuth, removeCoupon);
router.post('/merge', authenticate, mergeCart);

export default router;

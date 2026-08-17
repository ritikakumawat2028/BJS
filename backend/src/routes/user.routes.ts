import { Router } from 'express';
import {
  getWishlist, addToWishlist, removeFromWishlist,
  getAddresses, addAddress, updateAddress, deleteAddress,
  addReview, updateReview, deleteReview,
  getNotifications, markNotificationRead,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Wishlist
router.get('/wishlist', authenticate, getWishlist);
router.post('/wishlist', authenticate, addToWishlist);
router.delete('/wishlist/:productId', authenticate, removeFromWishlist);

// Addresses
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);
router.put('/addresses/:id', authenticate, updateAddress);
router.delete('/addresses/:id', authenticate, deleteAddress);

// Reviews
router.post('/reviews', authenticate, addReview);
router.put('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);

// Notifications
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:id/read', authenticate, markNotificationRead);

export default router;

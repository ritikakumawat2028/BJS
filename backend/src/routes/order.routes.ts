import { Router } from 'express';
import {
  createOrder, createRazorpayOrder, verifyPayment, razorpayWebhook,
  getUserOrders, getOrderById, adminGetOrders, adminUpdateOrderStatus,
} from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Customer
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/payment/create', authenticate, createRazorpayOrder);
router.post('/payment/verify', authenticate, verifyPayment);
router.post('/payment/webhook', razorpayWebhook);

// Admin
router.get('/admin/all', authenticate, requireAdmin, adminGetOrders);
router.put('/admin/:id/status', authenticate, requireAdmin, adminUpdateOrderStatus);

export default router;

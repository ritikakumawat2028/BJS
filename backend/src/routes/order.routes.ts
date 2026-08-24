import { Router } from 'express';
import {
  createOrder, getUserOrders, getOrderById, cancelPendingOrder,
  adminGetOrders, adminGetOrderById, adminUpdateOrderStatus,
} from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Customer
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/:id/cancel', authenticate, cancelPendingOrder);

// Admin
router.get('/admin/all', authenticate, requireAdmin, adminGetOrders);
router.put('/admin/:id/status', authenticate, requireAdmin, adminUpdateOrderStatus);

export default router;

import { Router } from 'express';
import { createRazorpayOrder, verifyPayment, razorpayWebhook } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create', authenticate, createRazorpayOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/webhook', razorpayWebhook);

export default router;

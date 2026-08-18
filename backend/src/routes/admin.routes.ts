import { Router } from 'express';
import {
  getDashboard, adminGetCustomers, adminToggleUserStatus,
  getBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner,
  getActiveCampaigns, adminCreateCampaign, adminUpdateCampaign,
  adminGetCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon,
  getReviews, updateReviewStatus, deleteReview,
  getStoreSettings, adminUpdateSettings,
  createSupportTicket, adminGetSupportTickets,
  adminGetAuditLogs, subscribeNewsletter, adminGetInventory,
  adminGetPromotions, adminCreatePromotion, adminUpdatePromotion,
  adminGetPayments,
  adminGetShippingZones, adminCreateShippingZone, adminUpdateShippingZone, adminDeleteShippingZone,
  adminCreateAdmin,
} from '../controllers/admin.controller';
import {
  adminGetOrders, adminGetOrderById, adminUpdateOrderStatus,
} from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Dashboard
router.get('/dashboard', authenticate, requireAdmin, getDashboard);

// Customers & Admins
router.get('/customers', authenticate, requireAdmin, adminGetCustomers);
router.put('/customers/:id/toggle-status', authenticate, requireAdmin, adminToggleUserStatus);
router.post('/admins', authenticate, requireAdmin, adminCreateAdmin);

// Orders & Payments
router.get('/orders', authenticate, requireAdmin, adminGetOrders);
router.get('/orders/:id', authenticate, requireAdmin, adminGetOrderById);
router.put('/orders/:id/status', authenticate, requireAdmin, adminUpdateOrderStatus);
router.get('/payments', authenticate, requireAdmin, adminGetPayments);

// Banners (public read)
router.get('/banners', getBanners);
router.post('/banners', authenticate, requireAdmin, adminCreateBanner);
router.put('/banners/:id', authenticate, requireAdmin, adminUpdateBanner);
router.delete('/banners/:id', authenticate, requireAdmin, adminDeleteBanner);

// Campaigns
router.get('/campaigns', authenticate, requireAdmin, getActiveCampaigns);
router.post('/campaigns', authenticate, requireAdmin, adminCreateCampaign);
router.put('/campaigns/:id', authenticate, requireAdmin, adminUpdateCampaign);

// Coupons
router.get('/coupons', authenticate, requireAdmin, adminGetCoupons);
router.post('/coupons', authenticate, requireAdmin, adminCreateCoupon);
router.put('/coupons/:id', authenticate, requireAdmin, adminUpdateCoupon);
router.delete('/coupons/:id', authenticate, requireAdmin, adminDeleteCoupon);

// Promotions
router.get('/promotions', authenticate, requireAdmin, adminGetPromotions);
router.post('/promotions', authenticate, requireAdmin, adminCreatePromotion);
router.put('/promotions/:id', authenticate, requireAdmin, adminUpdatePromotion);

// Inventory
router.get('/inventory', authenticate, requireAdmin, adminGetInventory);

// Shipping Zones
router.get('/shipping-zones', authenticate, requireAdmin, adminGetShippingZones);
router.post('/shipping-zones', authenticate, requireAdmin, adminCreateShippingZone);
router.put('/shipping-zones/:id', authenticate, requireAdmin, adminUpdateShippingZone);
router.delete('/shipping-zones/:id', authenticate, requireAdmin, adminDeleteShippingZone);

// Settings
router.put('/settings', authenticate, requireAdmin, adminUpdateSettings);

// Settings (public read for store info)
router.get('/settings', getStoreSettings);
router.put('/settings', authenticate, requireAdmin, adminUpdateSettings);

// Reviews
router.get('/reviews', authenticate, requireAdmin, getReviews);
router.put('/reviews/:id/status', authenticate, requireAdmin, updateReviewStatus);
router.delete('/reviews/:id', authenticate, requireAdmin, deleteReview);

// Support
router.post('/support', createSupportTicket);
router.get('/support', authenticate, requireAdmin, adminGetSupportTickets);

// Audit
router.get('/audit-logs', authenticate, requireAdmin, adminGetAuditLogs);

// Newsletter
router.post('/newsletter/subscribe', subscribeNewsletter);

// Inventory
import { getInventoryStats, getInventoryList, adjustStock, getStockHistory } from '../controllers/inventory.controller';

router.get('/inventory/stats', authenticate, requireAdmin, getInventoryStats);
router.get('/inventory/list', authenticate, requireAdmin, getInventoryList);
router.post('/inventory/adjust', authenticate, requireAdmin, adjustStock);
router.get('/inventory/history', authenticate, requireAdmin, getStockHistory);

// Promotions
router.get('/promotions', authenticate, requireAdmin, adminGetPromotions);
router.post('/promotions', authenticate, requireAdmin, adminCreatePromotion);
router.put('/promotions/:id', authenticate, requireAdmin, adminUpdatePromotion);

export default router;

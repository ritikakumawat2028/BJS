"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Dashboard
router.get('/dashboard', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.getDashboard);
// Customers & Admins
router.get('/customers', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetCustomers);
router.put('/customers/:id/toggle-status', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminToggleUserStatus);
router.post('/admins', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminCreateAdmin);
// Orders & Payments
router.get('/orders', auth_1.authenticate, auth_1.requireAdmin, order_controller_1.adminGetOrders);
router.get('/orders/:id', auth_1.authenticate, auth_1.requireAdmin, order_controller_1.adminGetOrderById);
router.put('/orders/:id/status', auth_1.authenticate, auth_1.requireAdmin, order_controller_1.adminUpdateOrderStatus);
router.get('/payments', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetPayments);
// Banners (public read)
router.get('/banners', admin_controller_1.getBanners);
router.post('/banners', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminCreateBanner);
router.put('/banners/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminUpdateBanner);
router.delete('/banners/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminDeleteBanner);
// Coupons
router.get('/coupons', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetCoupons);
router.post('/coupons', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminCreateCoupon);
router.put('/coupons/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminUpdateCoupon);
router.delete('/coupons/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminDeleteCoupon);
// Promotions
router.get('/promotions', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetPromotions);
router.post('/promotions', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminCreatePromotion);
router.put('/promotions/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminUpdatePromotion);
// Inventory
router.get('/inventory', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetInventory);
// Shipping Zones
router.get('/shipping-zones', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetShippingZones);
router.post('/shipping-zones', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminCreateShippingZone);
router.put('/shipping-zones/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminUpdateShippingZone);
router.delete('/shipping-zones/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminDeleteShippingZone);
// Settings
router.put('/settings', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminUpdateSettings);
// Settings (public read for store info)
router.get('/settings', admin_controller_1.getStoreSettings);
router.put('/settings', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminUpdateSettings);
// Reviews
router.get('/reviews', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.getReviews);
router.put('/reviews/:id/status', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.updateReviewStatus);
router.delete('/reviews/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.deleteReview);
// Support
router.post('/support', admin_controller_1.createSupportTicket);
router.get('/support', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetSupportTickets);
// Audit
router.get('/audit-logs', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetAuditLogs);
// Newsletter
// Inventory
const inventory_controller_1 = require("../controllers/inventory.controller");
router.get('/inventory/stats', auth_1.authenticate, auth_1.requireAdmin, inventory_controller_1.getInventoryStats);
router.get('/inventory/list', auth_1.authenticate, auth_1.requireAdmin, inventory_controller_1.getInventoryList);
router.post('/inventory/adjust', auth_1.authenticate, auth_1.requireAdmin, inventory_controller_1.adjustStock);
router.get('/inventory/history', auth_1.authenticate, auth_1.requireAdmin, inventory_controller_1.getStockHistory);
// Promotions
router.get('/promotions', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminGetPromotions);
router.post('/promotions', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminCreatePromotion);
router.put('/promotions/:id', auth_1.authenticate, auth_1.requireAdmin, admin_controller_1.adminUpdatePromotion);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map
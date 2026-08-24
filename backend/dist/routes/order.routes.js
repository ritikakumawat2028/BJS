"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Customer
router.post('/', auth_1.authenticate, order_controller_1.createOrder);
router.get('/', auth_1.authenticate, order_controller_1.getUserOrders);
router.get('/:id', auth_1.authenticate, order_controller_1.getOrderById);
router.post('/:id/cancel', auth_1.authenticate, order_controller_1.cancelPendingOrder);
// Admin
router.get('/admin/all', auth_1.authenticate, auth_1.requireAdmin, order_controller_1.adminGetOrders);
router.put('/admin/:id/status', auth_1.authenticate, auth_1.requireAdmin, order_controller_1.adminUpdateOrderStatus);
exports.default = router;
//# sourceMappingURL=order.routes.js.map
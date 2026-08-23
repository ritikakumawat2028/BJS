"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/create', auth_1.authenticate, order_controller_1.createRazorpayOrder);
router.post('/verify', auth_1.authenticate, order_controller_1.verifyPayment);
router.post('/webhook', order_controller_1.razorpayWebhook);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map
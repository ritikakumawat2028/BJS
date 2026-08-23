"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.optionalAuth, cart_controller_1.getCart);
router.post('/items', auth_1.optionalAuth, cart_controller_1.addToCart);
router.put('/items/:itemId', auth_1.optionalAuth, cart_controller_1.updateCartItem);
router.delete('/items/:itemId', auth_1.optionalAuth, cart_controller_1.removeCartItem);
router.post('/coupon', auth_1.optionalAuth, cart_controller_1.applyCoupon);
router.delete('/coupon', auth_1.optionalAuth, cart_controller_1.removeCoupon);
router.post('/merge', auth_1.authenticate, cart_controller_1.mergeCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map
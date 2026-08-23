"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Wishlist
router.get('/wishlist', auth_1.authenticate, user_controller_1.getWishlist);
router.post('/wishlist', auth_1.authenticate, user_controller_1.addToWishlist);
router.delete('/wishlist/:productId', auth_1.authenticate, user_controller_1.removeFromWishlist);
// Addresses
router.get('/addresses', auth_1.authenticate, user_controller_1.getAddresses);
router.post('/addresses', auth_1.authenticate, user_controller_1.addAddress);
router.put('/addresses/:id', auth_1.authenticate, user_controller_1.updateAddress);
router.delete('/addresses/:id', auth_1.authenticate, user_controller_1.deleteAddress);
// Reviews
router.post('/reviews', auth_1.authenticate, user_controller_1.addReview);
router.put('/reviews/:id', auth_1.authenticate, user_controller_1.updateReview);
router.delete('/reviews/:id', auth_1.authenticate, user_controller_1.deleteReview);
// Notifications
router.get('/notifications', auth_1.authenticate, user_controller_1.getNotifications);
router.put('/notifications/read-all', auth_1.authenticate, user_controller_1.markAllNotificationsRead);
router.put('/notifications/:id/read', auth_1.authenticate, user_controller_1.markNotificationRead);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("../controllers/newsletter.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/subscribe', newsletter_controller_1.subscribe);
router.post('/verify', newsletter_controller_1.verifyEmail);
router.post('/unsubscribe', newsletter_controller_1.unsubscribe);
// Admin routes
router.get('/admin/subscribers', auth_1.authenticate, auth_1.requireAdmin, newsletter_controller_1.getAdminSubscribers);
exports.default = router;
//# sourceMappingURL=newsletter.routes.js.map
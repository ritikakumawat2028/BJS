"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const banner_controller_1 = require("../controllers/banner.controller");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
// Public route (cached for 5 minutes)
router.get('/', (0, cache_1.apiCache)('5 minutes'), banner_controller_1.getActiveBanners);
// Admin routes
router.get('/admin', auth_1.authenticate, auth_1.requireAdmin, banner_controller_1.getAllBanners);
router.post('/', auth_1.authenticate, auth_1.requireAdmin, banner_controller_1.createBanner);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, banner_controller_1.updateBanner);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, banner_controller_1.deleteBanner);
exports.default = router;
//# sourceMappingURL=banner.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promotion_controller_1 = require("../controllers/promotion.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/active', promotion_controller_1.getActivePromotions);
router.get('/', auth_1.authenticate, auth_1.requireAdmin, promotion_controller_1.getPromotions);
router.get('/:id', promotion_controller_1.getPromotionById); // Usually public or at least needs to be fetchable
router.post('/', auth_1.authenticate, auth_1.requireAdmin, promotion_controller_1.createPromotion);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, promotion_controller_1.updatePromotion);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, promotion_controller_1.deletePromotion);
exports.default = router;
//# sourceMappingURL=promotion.routes.js.map
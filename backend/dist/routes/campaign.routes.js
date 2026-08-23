"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_controller_1 = require("../controllers/campaign.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', campaign_controller_1.campaignController.getActive);
// Admin routes
router.get('/admin', auth_1.authenticate, auth_1.requireAdmin, campaign_controller_1.campaignController.getAll);
router.get('/:id', auth_1.authenticate, auth_1.requireAdmin, campaign_controller_1.campaignController.getById);
router.post('/', auth_1.authenticate, auth_1.requireAdmin, campaign_controller_1.campaignController.create);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, campaign_controller_1.campaignController.update);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, campaign_controller_1.campaignController.delete);
exports.default = router;
//# sourceMappingURL=campaign.routes.js.map
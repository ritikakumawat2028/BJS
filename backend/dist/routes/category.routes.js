"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
router.get('/', (0, cache_1.apiCache)('5 minutes'), category_controller_1.getCategories);
router.get('/:slug', (0, cache_1.apiCache)('5 minutes'), category_controller_1.getCategoryBySlug);
router.post('/', auth_1.authenticate, auth_1.requireAdmin, category_controller_1.adminCreateCategory);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, category_controller_1.adminUpdateCategory);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, category_controller_1.adminDeleteCategory);
router.post('/subcategories', auth_1.authenticate, auth_1.requireAdmin, category_controller_1.adminCreateSubcategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map
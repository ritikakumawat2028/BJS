"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)();
// Public
router.get('/reviews/all', (0, cache_1.apiCache)('5 minutes'), product_controller_1.getAllApprovedReviews);
router.post('/reviews/guest', product_controller_1.addGuestReview);
router.get('/', (0, cache_1.apiCache)('5 minutes'), product_controller_1.getProducts);
router.get('/search', (0, cache_1.apiCache)('5 minutes'), product_controller_1.searchProducts);
router.get('/featured', (0, cache_1.apiCache)('5 minutes'), product_controller_1.getFeaturedProducts);
router.get('/bestsellers', (0, cache_1.apiCache)('5 minutes'), product_controller_1.getBestsellerProducts);
router.get('/new-arrivals', (0, cache_1.apiCache)('5 minutes'), product_controller_1.getNewArrivals);
router.get('/:slug', (0, cache_1.apiCache)('5 minutes'), product_controller_1.getProductBySlug);
router.get('/:id/reviews', (0, cache_1.apiCache)('5 minutes'), product_controller_1.getProductReviews);
// Admin
router.get('/admin/all', auth_1.authenticate, auth_1.requireAdmin, product_controller_1.adminGetProducts);
router.post('/', auth_1.authenticate, auth_1.requireAdmin, product_controller_1.adminCreateProduct);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, product_controller_1.adminUpdateProduct);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, product_controller_1.adminDeleteProduct);
router.put('/:id/inventory', auth_1.authenticate, auth_1.requireAdmin, product_controller_1.adminUpdateInventory);
router.post('/:id/images', auth_1.authenticate, auth_1.requireAdmin, product_controller_1.adminUploadProductImages);
exports.default = router;
//# sourceMappingURL=product.routes.js.map
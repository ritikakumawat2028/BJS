"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCreateSubcategory = exports.adminDeleteCategory = exports.adminUpdateCategory = exports.adminCreateCategory = exports.getCategoryBySlug = exports.getCategories = void 0;
const slugify_1 = __importDefault(require("slugify"));
const prisma_1 = __importDefault(require("../config/prisma"));
const error_1 = require("../middleware/error");
const cache_1 = require("../middleware/cache");
exports.getCategories = (0, error_1.asyncHandler)(async (_req, res) => {
    const categories = await prisma_1.default.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
            subcategories: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
            _count: { select: { products: { where: { isActive: true } } } },
        },
    });
    res.json({ success: true, data: categories });
});
exports.getCategoryBySlug = (0, error_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const category = await prisma_1.default.category.findUnique({
        where: { slug },
        include: { subcategories: { where: { isActive: true } } },
    });
    if (!category)
        throw (0, error_1.createError)('Category not found', 404);
    res.json({ success: true, data: category });
});
exports.adminCreateCategory = (0, error_1.asyncHandler)(async (req, res) => {
    const { name, description, image, sortOrder, metaTitle, metaDesc } = req.body;
    if (!name)
        throw (0, error_1.createError)('Category name is required', 400);
    const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
    const category = await prisma_1.default.category.create({
        data: {
            name,
            slug,
            description: description || null,
            image: image || null,
            sortOrder: sortOrder ? Number(sortOrder) : 0,
            metaTitle: metaTitle || null,
            metaDesc: metaDesc || null
        },
    });
    (0, cache_1.clearAllCache)();
    res.status(201).json({ success: true, message: 'Category created', data: category });
});
exports.adminUpdateCategory = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.sortOrder !== undefined)
        updateData.sortOrder = Number(updateData.sortOrder);
    if (updateData.name)
        updateData.slug = (0, slugify_1.default)(updateData.name, { lower: true, strict: true });
    const category = await prisma_1.default.category.update({ where: { id }, data: updateData });
    (0, cache_1.clearAllCache)();
    res.json({ success: true, message: 'Category updated', data: category });
});
exports.adminDeleteCategory = (0, error_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const count = await prisma_1.default.product.count({ where: { categoryId: id, isActive: true } });
    if (count > 0)
        throw (0, error_1.createError)(`Cannot delete: ${count} active products exist in this category`, 400);
    await prisma_1.default.category.update({ where: { id }, data: { isActive: false } });
    (0, cache_1.clearAllCache)();
    res.json({ success: true, message: 'Category deactivated' });
});
exports.adminCreateSubcategory = (0, error_1.asyncHandler)(async (req, res) => {
    const { name, categoryId, description, image, sortOrder } = req.body;
    if (!name || !categoryId)
        throw (0, error_1.createError)('Name and Category are required', 400);
    const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
    const sub = await prisma_1.default.subcategory.create({
        data: {
            name,
            slug,
            categoryId,
            description: description || null,
            image: image || null,
            sortOrder: sortOrder ? Number(sortOrder) : 0
        }
    });
    (0, cache_1.clearAllCache)();
    res.status(201).json({ success: true, data: sub });
});
//# sourceMappingURL=category.controller.js.map
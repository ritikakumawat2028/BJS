"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getAllBanners = exports.getActiveBanners = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getActiveBanners = async (req, res) => {
    try {
        const banners = await prisma_1.default.banner.findMany({
            where: {
                isActive: true,
                OR: [
                    { startDate: null },
                    { startDate: { lte: new Date() } }
                ],
                AND: [
                    {
                        OR: [
                            { endDate: null },
                            { endDate: { gte: new Date() } }
                        ]
                    }
                ]
            },
            orderBy: { priority: 'desc' }
        });
        res.json({ success: true, data: banners });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch banners' });
    }
};
exports.getActiveBanners = getActiveBanners;
const getAllBanners = async (req, res) => {
    try {
        const banners = await prisma_1.default.banner.findMany({
            orderBy: { priority: 'desc' }
        });
        res.json({ success: true, data: banners });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch banners' });
    }
};
exports.getAllBanners = getAllBanners;
const createBanner = async (req, res) => {
    try {
        const { priority, ...rest } = req.body;
        const banner = await prisma_1.default.banner.create({
            data: {
                ...rest,
                priority: priority ? parseInt(priority) : 0,
            }
        });
        res.status(201).json({ success: true, data: banner });
    }
    catch (error) {
        console.error('Banner create error:', error);
        res.status(500).json({ success: false, message: 'Failed to create banner' });
    }
};
exports.createBanner = createBanner;
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: _id, createdAt, updatedAt, priority, ...updateData } = req.body;
        const banner = await prisma_1.default.banner.update({
            where: { id },
            data: {
                ...updateData,
                ...(priority !== undefined && { priority: priority ? parseInt(priority) : 0 }),
            }
        });
        res.json({ success: true, data: banner });
    }
    catch (error) {
        console.error('Banner update error:', error);
        res.status(500).json({ success: false, message: 'Failed to update banner' });
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.banner.delete({ where: { id } });
        res.json({ success: true, message: 'Banner deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete banner' });
    }
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=banner.controller.js.map
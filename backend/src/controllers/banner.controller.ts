import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getActiveBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { priority: 'desc' }
    });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const banner = await prisma.banner.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create banner' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as any;
    const banner = await prisma.banner.update({
      where: { id },
      data: req.body
    });
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update banner' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as any;
    await prisma.banner.delete({ where: { id } });
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
};

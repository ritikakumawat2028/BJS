import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { logAdminAction } from '../utils/audit';

const prisma = new PrismaClient();

export const campaignController = {
  // Public
  getActive: async (req: Request, res: Response) => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        },
        orderBy: { priority: 'desc' }
      });
      res.json({ success: true, data: campaigns });
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  // Admin
  getAll: async (req: Request, res: Response) => {
    try {
      const campaigns = await prisma.campaign.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: campaigns });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: req.params.id as string }
      });
      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }
      res.json({ success: true, data: campaign });
    } catch (error) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  create: async (req: AuthRequest, res: Response) => {
    try {
      const { name, desktopBanner, mobileBanner, heading, subtitle, description, ctaText, ctaUrl, discount, couponCode, startDate, endDate, priority, isActive } = req.body;
      
      const campaign = await prisma.campaign.create({
        data: {
          name,
          desktopBanner,
          mobileBanner,
          heading,
          subtitle,
          description,
          ctaText,
          ctaUrl,
          discount: discount ? Number(discount) : null,
          couponCode,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          priority: priority ? Number(priority) : 0,
          isActive: isActive ?? true
        }
      });

      if (req.user) {
        await logAdminAction({ adminId: req.user.userId, action: 'CREATE', entity: 'Campaign', entityId: campaign.id, newValue: JSON.stringify(campaign), ipAddress: req.ip || '' });
      }

      res.status(201).json({ success: true, data: campaign });
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      const { name, desktopBanner, mobileBanner, heading, subtitle, description, ctaText, ctaUrl, discount, couponCode, startDate, endDate, priority, isActive } = req.body;
      
      const oldCampaign = await prisma.campaign.findUnique({ where: { id: req.params.id as string } });
      if (!oldCampaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      const campaign = await prisma.campaign.update({
        where: { id: req.params.id as string },
        data: {
          name: name !== undefined ? name : oldCampaign.name,
          desktopBanner: desktopBanner !== undefined ? desktopBanner : oldCampaign.desktopBanner,
          mobileBanner: mobileBanner !== undefined ? mobileBanner : oldCampaign.mobileBanner,
          heading: heading !== undefined ? heading : oldCampaign.heading,
          subtitle: subtitle !== undefined ? subtitle : oldCampaign.subtitle,
          description: description !== undefined ? description : oldCampaign.description,
          ctaText: ctaText !== undefined ? ctaText : oldCampaign.ctaText,
          ctaUrl: ctaUrl !== undefined ? ctaUrl : oldCampaign.ctaUrl,
          discount: discount !== undefined ? (discount ? Number(discount) : null) : oldCampaign.discount,
          couponCode: couponCode !== undefined ? couponCode : oldCampaign.couponCode,
          startDate: startDate !== undefined ? new Date(startDate) : oldCampaign.startDate,
          endDate: endDate !== undefined ? new Date(endDate) : oldCampaign.endDate,
          priority: priority !== undefined ? Number(priority) : oldCampaign.priority,
          isActive: isActive !== undefined ? isActive : oldCampaign.isActive
        }
      });

      if (req.user) {
        await logAdminAction({ adminId: req.user.userId, action: 'UPDATE', entity: 'Campaign', entityId: campaign.id, previousValue: JSON.stringify(oldCampaign), newValue: JSON.stringify(campaign), ipAddress: req.ip || '' });
      }

      res.json({ success: true, data: campaign });
    } catch (error) {
      console.error('Error updating campaign:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id as string } });
      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      await prisma.campaign.delete({
        where: { id: req.params.id as string }
      });

      if (req.user) {
        await logAdminAction({ adminId: req.user.userId, action: 'DELETE', entity: 'Campaign', entityId: req.params.id as string, previousValue: JSON.stringify(campaign), ipAddress: req.ip || '' });
      }

      res.json({ success: true, message: 'Campaign deleted successfully' });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

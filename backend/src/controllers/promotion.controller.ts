import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { asyncHandler, createError } from '../middleware/error';

export const getPromotions = asyncHandler(async (_req: Request, res: Response) => {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      products: { include: { product: { select: { id: true, name: true } } } },
      categories: { include: { category: { select: { id: true, name: true } } } }
    }
  });
  res.json({ success: true, data: promotions });
});

export const getActivePromotions = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now }
    },
    include: {
      products: { include: { product: { select: { id: true, name: true } } } },
      categories: { include: { category: { select: { id: true, name: true } } } }
    }
  });
  res.json({ success: true, data: promotions });
});

export const getPromotionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as any;
  const promotion = await prisma.promotion.findUnique({
    where: { id },
    include: {
      products: { include: { product: { select: { id: true, name: true } } } },
      categories: { include: { category: { select: { id: true, name: true } } } }
    }
  });
  if (!promotion) throw createError('Promotion not found', 404);
  res.json({ success: true, data: promotion });
});

export const createPromotion = asyncHandler(async (req: Request, res: Response) => {
  const { 
    name, type, description, discountType, discountValue, 
    buyQuantity, getQuantity, minOrderAmount, startDate, endDate, 
    isActive, productIds, categoryIds 
  } = req.body;

  const promotion = await prisma.promotion.create({
    data: {
      name, type, description, discountType, discountValue,
      buyQuantity, getQuantity, minOrderAmount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive !== undefined ? isActive : true,
      products: productIds && productIds.length > 0 ? {
        create: productIds.map((id: string) => ({ productId: id }))
      } : undefined,
      categories: categoryIds && categoryIds.length > 0 ? {
        create: categoryIds.map((id: string) => ({ categoryId: id }))
      } : undefined
    }
  });

  res.status(201).json({ success: true, message: 'Promotion created', data: promotion });
});

export const updatePromotion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as any;
  const { productIds, categoryIds, startDate, endDate, ...rest } = req.body;

  const data: any = { ...rest };
  if (startDate) data.startDate = new Date(startDate);
  if (endDate) data.endDate = new Date(endDate);

  // Update promotion and its relations if provided
  const updatePromises: any[] = [
    prisma.promotion.update({ where: { id }, data })
  ];

  if (productIds) {
    updatePromises.push(prisma.promotionProduct.deleteMany({ where: { promotionId: id } }));
    if (productIds.length > 0) {
      updatePromises.push(
        prisma.promotionProduct.createMany({
          data: productIds.map((pid: string) => ({ promotionId: id, productId: pid }))
        })
      );
    }
  }

  if (categoryIds) {
    updatePromises.push(prisma.promotionCategory.deleteMany({ where: { promotionId: id } }));
    if (categoryIds.length > 0) {
      updatePromises.push(
        prisma.promotionCategory.createMany({
          data: categoryIds.map((cid: string) => ({ promotionId: id, categoryId: cid }))
        })
      );
    }
  }

  await prisma.$transaction(updatePromises);
  
  const updated = await prisma.promotion.findUnique({
    where: { id },
    include: { products: true, categories: true }
  });

  res.json({ success: true, message: 'Promotion updated', data: updated });
});

export const deletePromotion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as any;
  
  await prisma.$transaction([
    prisma.promotionProduct.deleteMany({ where: { promotionId: id } }),
    prisma.promotionCategory.deleteMany({ where: { promotionId: id } }),
    prisma.promotion.delete({ where: { id } })
  ]);

  res.json({ success: true, message: 'Promotion deleted' });
});

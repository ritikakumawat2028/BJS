import { Request, Response } from 'express';
import slugify from 'slugify';
import prisma from '../config/prisma';
import { asyncHandler, createError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

// ===================== PUBLIC =====================

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1', limit = '12', category, subcategory, search,
    minPrice, maxPrice, brand, rating, inStock, sort = 'createdAt',
    featured, bestseller, newArrival,
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const where: any = { isActive: true };

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (subcategory) {
    const sub = await prisma.subcategory.findUnique({ where: { slug: subcategory } });
    if (sub) where.subcategoryId = sub.id;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { tags: { contains: search } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (brand) where.brand = { equals: brand, mode: 'insensitive' };
  if (rating) where.avgRating = { gte: parseFloat(rating) };
  if (inStock === 'true') where.inventory = { quantity: { gt: 0 } };
  if (featured === 'true') where.isFeatured = true;
  if (bestseller === 'true') where.isBestseller = true;
  if (newArrival === 'true') where.isNewArrival = true;

  const sortMap: Record<string, any> = {
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    'price-low': { price: 'asc' },
    'price-high': { price: 'desc' },
    popular: { totalSold: 'desc' },
    rating: { avgRating: 'desc' },
    createdAt: { createdAt: 'desc' },
  };
  const orderBy = sortMap[sort] || { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      select: {
        id: true, name: true, slug: true, brand: true, price: true,
        comparePrice: true, avgRating: true, reviewCount: true,
        isFeatured: true, isBestseller: true, isNewArrival: true,
        images: { where: { isThumbnail: true }, take: 1 },
        inventory: { select: { quantity: true } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true } },
      inventory: true,
      category: { select: { name: true, slug: true } },
      subcategory: { select: { name: true, slug: true } },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  if (!product) throw createError('Product not found', 404);

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
    take: 6,
    select: {
      id: true, name: true, slug: true, price: true, comparePrice: true, avgRating: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 2 },
    },
  });

  res.json({ success: true, data: { ...product, related } });
});

export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 8,
    select: {
      id: true, name: true, slug: true, price: true, comparePrice: true,
      avgRating: true, reviewCount: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 2 },
    },
  });
  res.json({ success: true, data: products });
});

export const getBestsellerProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { isBestseller: true, isActive: true },
    take: 8,
    orderBy: { totalSold: 'desc' },
    select: {
      id: true, name: true, slug: true, price: true, comparePrice: true,
      avgRating: true, reviewCount: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 2 },
    },
  });
  res.json({ success: true, data: products });
});

export const getNewArrivals = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { isNewArrival: true, isActive: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, slug: true, price: true, comparePrice: true,
      avgRating: true, reviewCount: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 2 },
    },
  });
  res.json({ success: true, data: products });
});

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { q, limit = '10' } = req.query as Record<string, string>;
  if (!q || q.trim().length < 2) {
    res.json({ success: true, data: [] });
    return;
  }
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { tags: { contains: q } },
      ],
    },
    take: parseInt(limit),
    select: {
      id: true, name: true, slug: true, price: true,
      images: { where: { isThumbnail: true }, take: 1 },
      category: { select: { name: true } },
    },
  });
  res.json({ success: true, data: products });
});

// ===================== ADMIN =====================

export const adminGetProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '20', search, category, status } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: any = {};
  if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }];
  if (category) where.categoryId = category;
  if (status === 'active') where.isActive = true;
  if (status === 'inactive') where.isActive = false;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: { category: true, inventory: true, variants: true, images: { where: { isThumbnail: true }, take: 1 } },
    }),
    prisma.product.count({ where }),
  ]);
  res.json({ success: true, data: products, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});

export const adminCreateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, sku, categoryId, subcategoryId, description, shortDescription,
    ingredients, benefits, howToUse, price, comparePrice, taxPercent,
    weight, gender, fragrance, tags, isFeatured, isBestseller, isNewArrival,
    metaTitle, metaDesc, metaKeywords, initialStock = 0, lowStockThreshold = 5, image, variants } = req.body;

  const slug = slugify(name, { lower: true, strict: true });
  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) throw createError('A product with this name already exists', 400);

  const existingSku = await prisma.product.findUnique({ where: { sku } });
  if (existingSku) throw createError('A product with this SKU already exists', 400);

  const product = await prisma.product.create({
    data: {
      name, sku, slug, categoryId, subcategoryId, description, shortDescription,
      ingredients, benefits, howToUse, price, comparePrice, taxPercent,
      weight, gender, fragrance, tags: tags ? JSON.stringify(tags) : "[]",
      isFeatured: Boolean(isFeatured), isBestseller: Boolean(isBestseller), isNewArrival: Boolean(isNewArrival),
      metaTitle, metaDesc, metaKeywords,
      images: image ? { create: [{ url: image, isThumbnail: true }] } : undefined,
      inventory: { create: { quantity: parseInt(initialStock), lowStockThreshold: parseInt(lowStockThreshold) } },
      variants: variants?.length > 0 ? {
        create: variants.map((v: any) => ({
          name: v.name, sku: v.sku, price: v.price, comparePrice: v.comparePrice, stock: parseInt(v.stock || 0)
        }))
      } : undefined,
    },
    include: { inventory: true, variants: true },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: req.user!.userId,
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: product.id,
      newValue: JSON.stringify({ name, sku, price }),
    },
  });

  res.status(201).json({ success: true, message: 'Product created', data: product });
});

export const adminUpdateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.product.findUnique({ where: { id }, include: { variants: true } });
  if (!existing) throw createError('Product not found', 404);

  const { image, variants, stock, initialStock, ...updateData } = req.body;

  if (updateData.sku && updateData.sku !== existing.sku) {
    const existingSku = await prisma.product.findUnique({ where: { sku: updateData.sku } });
    if (existingSku) throw createError('A product with this SKU already exists', 400);
  }

  if (updateData.name && updateData.name !== existing.name) {
    const slug = slugify(updateData.name, { lower: true, strict: true });
    updateData.slug = slug;
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) throw createError('A product with this name already exists', 400);
  }

  if (updateData.tags && Array.isArray(updateData.tags)) {
    updateData.tags = JSON.stringify(updateData.tags);
  }

  // Update variants logic
  let variantUpdateData = {};
  if (variants && Array.isArray(variants)) {
    const incomingIds = variants.filter((v: any) => v.id).map((v: any) => v.id);
    // Delete variants not in incoming array
    const toDelete = existing.variants.filter(v => !incomingIds.includes(v.id)).map(v => ({ id: v.id }));
    
    variantUpdateData = {
      deleteMany: toDelete,
      upsert: variants.map((v: any) => ({
        where: { id: v.id || 'new' },
        create: { name: v.name, sku: v.sku, price: v.price, comparePrice: v.comparePrice, stock: parseInt(v.stock || 0) },
        update: { name: v.name, sku: v.sku, price: v.price, comparePrice: v.comparePrice, stock: parseInt(v.stock || 0) }
      }))
    };
  }

  const product = await prisma.product.update({
    where: { id },
    data: { 
      ...updateData, 
      updatedAt: new Date(),
      variants: Object.keys(variantUpdateData).length > 0 ? variantUpdateData : undefined
    },
    include: { variants: true }
  });

  if (stock !== undefined) {
    await prisma.inventory.upsert({
      where: { productId: id },
      update: { quantity: parseInt(stock) },
      create: { productId: id, quantity: parseInt(stock), lowStockThreshold: 5 }
    });
  }

  if (image) {
    const existingImage = await prisma.productImage.findFirst({ where: { productId: id, isThumbnail: true } });
    if (existingImage) {
      await prisma.productImage.update({ where: { id: existingImage.id }, data: { url: image } });
    } else {
      await prisma.productImage.create({ data: { url: image, isThumbnail: true, productId: id } });
    }
  }

  await prisma.adminActivityLog.create({
    data: {
      adminId: req.user!.userId,
      action: 'UPDATE_PRODUCT',
      entity: 'Product',
      entityId: id,
      previousValue: JSON.stringify({ name: existing.name, price: existing.price }),
      newValue: JSON.stringify({ name: product.name, price: product.price }),
    },
  });

  res.json({ success: true, message: 'Product updated', data: product });
});

export const adminDeleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  // Soft delete: deactivate instead of deleting
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  await prisma.adminActivityLog.create({
    data: { adminId: req.user!.userId, action: 'DEACTIVATE_PRODUCT', entity: 'Product', entityId: id },
  });
  res.json({ success: true, message: 'Product deactivated' });
});

export const adminUpdateInventory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { type, quantity, note } = req.body;

  const inventory = await prisma.inventory.findUnique({ where: { productId: id } });
  if (!inventory) throw createError('Inventory record not found', 404);

  let newQuantity = inventory.quantity;
  if (type === 'ADD') newQuantity += parseInt(quantity);
  else if (type === 'REMOVE') newQuantity = Math.max(0, newQuantity - parseInt(quantity));
  else if (type === 'ADJUST') newQuantity = parseInt(quantity);

  const [updated] = await prisma.$transaction([
    prisma.inventory.update({ where: { productId: id }, data: { quantity: newQuantity } }),
    prisma.inventoryTransaction.create({
      data: { inventoryId: inventory.id, type, quantity: parseInt(quantity), note, adminId: req.user!.userId },
    }),
  ]);

  res.json({ success: true, message: 'Inventory updated', data: updated });
});

export const adminUploadProductImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { images } = req.body; // Array of { url, altText, isThumbnail, sortOrder }

  const created = await prisma.productImage.createMany({
    data: images.map((img: any) => ({ ...img, productId: id })),
  });

  res.json({ success: true, message: 'Images uploaded', data: created });
});
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => { const { id } = req.params; const reviews = await prisma.review.findMany({ where: { productId: id, isApproved: true }, include: { user: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }); res.json({ success: true, data: reviews }); });

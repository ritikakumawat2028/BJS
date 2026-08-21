import { Request, Response } from 'express';
import slugify from 'slugify';
import prisma from '../config/prisma';
import { asyncHandler, createError } from '../middleware/error';

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      subcategories: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  res.json({ success: true, data: categories });
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { subcategories: { where: { isActive: true } } },
  });
  if (!category) throw createError('Category not found', 404);
  res.json({ success: true, data: category });
});

export const adminCreateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, image, sortOrder, metaTitle, metaDesc } = req.body;
  if (!name) throw createError('Category name is required', 400);
  const slug = slugify(name, { lower: true, strict: true });
  const category = await prisma.category.create({
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
  res.status(201).json({ success: true, message: 'Category created', data: category });
});

export const adminUpdateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (updateData.sortOrder !== undefined) updateData.sortOrder = Number(updateData.sortOrder);
  if (updateData.name) updateData.slug = slugify(updateData.name, { lower: true, strict: true });
  
  const category = await prisma.category.update({ where: { id }, data: updateData });
  res.json({ success: true, message: 'Category updated', data: category });
});

export const adminDeleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const count = await prisma.product.count({ where: { categoryId: id, isActive: true } });
  if (count > 0) throw createError(`Cannot delete: ${count} active products exist in this category`, 400);
  await prisma.category.update({ where: { id }, data: { isActive: false } });
  res.json({ success: true, message: 'Category deactivated' });
});

export const adminCreateSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, categoryId, description, image, sortOrder } = req.body;
  if (!name || !categoryId) throw createError('Name and Category are required', 400);
  const slug = slugify(name, { lower: true, strict: true });
  const sub = await prisma.subcategory.create({ 
    data: { 
      name, 
      slug, 
      categoryId, 
      description: description || null, 
      image: image || null, 
      sortOrder: sortOrder ? Number(sortOrder) : 0 
    } 
  });
  res.status(201).json({ success: true, data: sub });
});

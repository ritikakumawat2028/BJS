import { Response } from 'express';
import prisma from '../config/prisma';
import { asyncHandler, createError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

// 1. Get overall inventory stats
export const getInventoryStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [products, variants] = await Promise.all([
    prisma.product.findMany({
      include: { inventory: true },
    }),
    prisma.productVariant.findMany({
      include: { product: true },
    }),
  ]);

  let totalItems = 0;
  let availableStock = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let inventoryValue = 0;

  // Process standalone products (no variants)
  const standaloneProducts = products.filter(p => !variants.some(v => v.productId === p.id));
  
  for (const product of standaloneProducts) {
    totalItems++;
    const stock = product.inventory?.quantity || 0;
    const threshold = product.inventory?.lowStockThreshold || 5;
    
    availableStock += stock;
    inventoryValue += stock * Number(product.price);
    
    if (stock <= 0) outOfStockCount++;
    else if (stock <= threshold) lowStockCount++;
  }

  // Process variants
  for (const variant of variants) {
    totalItems++;
    const stock = variant.stock;
    const threshold = 5; // Default threshold for variants
    
    availableStock += stock;
    inventoryValue += stock * Number(variant.price);
    
    if (stock <= 0) outOfStockCount++;
    else if (stock <= threshold) lowStockCount++;
  }

  res.json({
    success: true,
    data: {
      totalItems,
      availableStock,
      lowStockCount,
      outOfStockCount,
      inventoryValue,
    }
  });
});

// 2. Get paginated inventory list
export const getInventoryList = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '20', search = '' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Since we have a disjoint between variants and base products for stock, 
  // we will fetch both and merge in memory (assuming manageable catalog sizes for an artisanal brand), 
  // or use Prisma features to find them.
  // For production scale, a denormalized search table or view is better, but this works perfectly for typical e-commerce bounds.

  let [standaloneProducts, variants] = await Promise.all([
    prisma.product.findMany({
      where: {
        AND: [
          { variants: { none: {} } },
          { OR: [ { name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } } ] }
        ]
      },
      include: { inventory: true },
    }),
    prisma.productVariant.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { product: { name: { contains: search, mode: 'insensitive' } } }
        ]
      },
      include: { product: { select: { name: true } } },
    }),
  ]);

  const items = [
    ...standaloneProducts.map(p => ({
      id: p.id,
      isVariant: false,
      productId: p.id,
      name: p.name,
      sku: p.sku,
      price: Number(p.price),
      stock: p.inventory?.quantity || 0,
      threshold: p.inventory?.lowStockThreshold || 5,
    })),
    ...variants.map(v => ({
      id: v.id,
      isVariant: true,
      productId: v.productId,
      name: `${v.product.name} - ${v.name}`,
      sku: v.sku,
      price: Number(v.price),
      stock: v.stock,
      threshold: 5,
    }))
  ];

  // Sort and paginate
  items.sort((a, b) => a.name.localeCompare(b.name));
  
  const total = items.length;
  const paginatedItems = items.slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: paginatedItems.map(item => ({
      ...item,
      status: item.stock <= 0 ? 'OUT_OF_STOCK' : item.stock <= item.threshold ? 'LOW_STOCK' : 'IN_STOCK'
    })),
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    }
  });
});

// 3. Adjust stock safely
export const adjustStock = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, isVariant, type, quantity, note } = req.body; 
  // type: 'ADD', 'REMOVE', 'SET'

  if (!id || typeof isVariant === 'undefined' || !type || typeof quantity !== 'number') {
    throw createError('Invalid adjustment parameters', 400);
  }

  if (quantity < 0) {
    throw createError('Quantity must be positive', 400);
  }

  const adminId = req.user!.userId;

  const result = await prisma.$transaction(async (tx) => {
    let currentStock = 0;
    let inventoryId = null;

    if (isVariant) {
      const variant = await tx.productVariant.findUnique({ where: { id } });
      if (!variant) throw createError('Variant not found', 404);
      currentStock = variant.stock;
    } else {
      let inventory = await tx.inventory.findUnique({ where: { productId: id } });
      if (!inventory) {
        inventory = await tx.inventory.create({ data: { productId: id, quantity: 0 } });
      }
      currentStock = inventory.quantity;
      inventoryId = inventory.id;
    }

    let change = 0;
    let newStock = 0;

    if (type === 'ADD') {
      change = quantity;
      newStock = currentStock + change;
    } else if (type === 'REMOVE') {
      change = -quantity;
      newStock = currentStock + change;
      if (newStock < 0) throw createError('Cannot remove more stock than available', 400);
    } else if (type === 'SET') {
      change = quantity - currentStock;
      newStock = quantity;
    } else {
      throw createError('Invalid adjustment type', 400);
    }

    if (change === 0) {
      return { success: true, message: 'No change required', newStock };
    }

    // Apply change
    if (isVariant) {
      await tx.productVariant.update({ where: { id }, data: { stock: newStock } });
    } else {
      await tx.inventory.update({ where: { id: inventoryId! }, data: { quantity: newStock } });
    }

    // Record transaction
    await tx.inventoryTransaction.create({
      data: {
        inventoryId: isVariant ? null : inventoryId,
        variantId: isVariant ? id : null,
        type: type,
        quantity: change > 0 ? change : -change, // store absolute quantity
        note: note || `Manual ${type} adjustment`,
        adminId,
      }
    });

    return { success: true, message: 'Stock updated successfully', newStock };
  });

  res.json(result);
});

// 4. Get stock history
export const getStockHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, isVariant } = req.query as { id: string, isVariant: string };
  const variantBool = isVariant === 'true';

  let transactions = [];

  if (variantBool) {
    transactions = await prisma.inventoryTransaction.findMany({
      where: { variantId: id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  } else {
    const inventory = await prisma.inventory.findUnique({ where: { productId: id } });
    if (inventory) {
      transactions = await prisma.inventoryTransaction.findMany({
        where: { inventoryId: inventory.id },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
    }
  }

  // Also fetch order items to show sales history implicitly if they are not in transactions
  // Our system currently doesn't create an InventoryTransaction during order creation (as per order.controller.ts)
  // To provide full history, we merge OrderItem records as 'SALE'
  
  let sales: any[] = [];
  if (variantBool) {
    sales = await prisma.orderItem.findMany({
      where: { variantId: id },
      include: { order: { select: { orderNumber: true, createdAt: true } } },
      orderBy: { order: { createdAt: 'desc' } },
      take: 50
    });
  } else {
    sales = await prisma.orderItem.findMany({
      where: { productId: id, variantId: null },
      include: { order: { select: { orderNumber: true, createdAt: true } } },
      orderBy: { order: { createdAt: 'desc' } },
      take: 50
    });
  }

  const combinedHistory = [
    ...transactions.map(t => ({
      id: t.id,
      type: t.type,
      quantity: t.quantity,
      note: t.note,
      date: t.createdAt,
      adminId: t.adminId
    })),
    ...sales.map(s => ({
      id: s.id,
      type: 'SALE',
      quantity: s.quantity,
      note: `Order ${s.order.orderNumber}`,
      date: s.order.createdAt,
      adminId: null
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 50);

  res.json({ success: true, data: combinedHistory });
});

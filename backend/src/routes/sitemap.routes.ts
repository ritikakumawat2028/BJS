import express, { Request, Response } from 'express';
import prisma from '../config/prisma';
import { asyncHandler } from '../middleware/error';

const router = express.Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://bjsluxe.com';

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static routes
  const staticRoutes = [
    '/', '/shop', '/about', '/contact', '/faq', 
    '/login', '/register', '/privacy-policy', '/terms',
    '/return-policy', '/shipping-policy'
  ];

  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${frontendUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  // Categories
  categories.forEach(cat => {
    xml += `
  <url>
    <loc>${frontendUrl}/shop?category=${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Products
  products.forEach(product => {
    xml += `
  <url>
    <loc>${frontendUrl}/products/${product.slug}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
}));

export default router;

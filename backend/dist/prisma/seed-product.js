"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const defaultRole = await prisma.role.findFirst();
    let category = await prisma.category.findFirst();
    if (!category) {
        category = await prisma.category.create({
            data: { name: 'Test Category', slug: 'test-category', description: 'Test', sortOrder: 1 }
        });
    }
    const existingProduct = await prisma.product.findFirst({ where: { name: 'E2E Test Product' } });
    if (!existingProduct) {
        const p = await prisma.product.create({
            data: {
                sku: 'E2E-TEST-01',
                name: 'E2E Test Product',
                slug: 'e2e-test-product',
                description: 'Test product for E2E tests',
                price: 500,
                categoryId: category.id,
                inventory: { create: { quantity: 100 } },
                images: { create: { url: 'https://images.unsplash.com/photo-1608248593842-8d7d964268e0?w=1600', altText: 'Test', isThumbnail: true } }
            }
        });
        console.log('✅ Seeded E2E Test Product:', p.id);
    }
    else {
        console.log('✅ E2E Test Product already exists');
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-product.js.map
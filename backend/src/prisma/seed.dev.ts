import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// ============================================================
// DEVELOPMENT / TESTING SEED — DO NOT run on production
// Creates: 6 demo products + 1 sample banner
//
// Run with: npm run seed:dev
// Delete these from Admin Panel before going live!
// ============================================================

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Seeding DEMO data for testing...');
  console.log('⚠️  These are fake products — delete before going live!\n');

  // Lookup category IDs
  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  const catMap: Record<string, string> = {};
  for (const c of categories) catMap[c.slug] = c.id;

  if (Object.keys(catMap).length === 0) {
    console.error('❌ No categories found. Run npm run seed first.');
    process.exit(1);
  }

  // ===== DEMO PRODUCTS =====
  const sampleProducts = [
    {
      sku: 'DEMO-PERF-001',
      name: 'Oud Royale Eau de Parfum [DEMO]',
      slug: 'oud-royale-eau-de-parfum-demo',
      categoryId: catMap['fragrance'],
      description: 'A rich, smoky oud fragrance with notes of rose, amber, and sandalwood. THIS IS A DEMO PRODUCT — delete before going live.',
      shortDescription: 'Rich oud with rose & amber accords',
      ingredients: 'Alcohol Denat., Fragrance (Parfum), Aqua, Oud Extract, Rose Absolute, Amber Resinoid',
      benefits: 'Long-lasting 8-10 hour wear | Leaves a luxurious scent trail | Mood-enhancing aroma',
      howToUse: 'Apply to pulse points — wrists, neck, and behind ears.',
      price: 2999,
      comparePrice: 3999,
      taxPercent: 18,
      weight: '100ml',
      gender: 'Unisex',
      fragrance: 'Oud, Rose, Amber',
      brand: "BJ'S Natural Care",
      tags: JSON.stringify(['demo', 'oud', 'luxury', 'unisex']),
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      initialStock: 50,
    },
    {
      sku: 'DEMO-PERF-002',
      name: 'Rose Absolue Perfume [DEMO]',
      slug: 'rose-absolue-perfume-demo',
      categoryId: catMap['fragrance'],
      description: 'An exquisite floral perfume built around the finest rose absolute. THIS IS A DEMO PRODUCT.',
      shortDescription: 'Pure rose absolute with jasmine & musk',
      price: 1999,
      comparePrice: 2499,
      taxPercent: 18,
      weight: '50ml',
      gender: 'Women',
      fragrance: 'Rose, Jasmine, Musk',
      brand: "BJ'S Natural Care",
      tags: JSON.stringify(['demo', 'rose', 'floral', 'women']),
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      initialStock: 35,
    },
    {
      sku: 'DEMO-HAIR-001',
      name: 'Argan Oil Luxury Shampoo [DEMO]',
      slug: 'argan-oil-luxury-shampoo-demo',
      categoryId: catMap['hair-care'],
      description: 'Enriched with pure Moroccan argan oil. THIS IS A DEMO PRODUCT.',
      shortDescription: 'Argan oil sulfate-free nourishing shampoo',
      ingredients: 'Aqua, Sodium Lauryl Sulfoacetate, Cocamidopropyl Betaine, Argan Oil, Keratin, Vitamin E',
      benefits: 'Reduces frizz | Adds shine | Strengthens hair | Sulfate-free',
      howToUse: 'Apply to wet hair, lather gently, leave for 2 minutes, rinse.',
      price: 799,
      comparePrice: 999,
      taxPercent: 12,
      weight: '250ml',
      brand: "BJ'S Natural Care",
      tags: JSON.stringify(['demo', 'argan', 'shampoo', 'sulfate-free']),
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      initialStock: 100,
    },
    {
      sku: 'DEMO-SKIN-001',
      name: 'Saffron Glow Face Cream [DEMO]',
      slug: 'saffron-glow-face-cream-demo',
      categoryId: catMap['skin-care'],
      description: 'Infused with real saffron extract and hyaluronic acid. THIS IS A DEMO PRODUCT.',
      shortDescription: 'Saffron & hyaluronic acid brightening cream',
      price: 1499,
      comparePrice: 1999,
      taxPercent: 12,
      weight: '50g',
      gender: 'Women',
      brand: "BJ'S Natural Care",
      tags: JSON.stringify(['demo', 'saffron', 'skincare', 'brightening']),
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      initialStock: 60,
    },
    {
      sku: 'DEMO-BODY-001',
      name: 'Rose Gold Body Lotion [DEMO]',
      slug: 'rose-gold-body-lotion-demo',
      categoryId: catMap['body-care'],
      description: 'A luxurious body lotion with rose extract. THIS IS A DEMO PRODUCT.',
      shortDescription: 'Rose & gold shimmer body lotion',
      price: 1199,
      comparePrice: 1599,
      taxPercent: 12,
      weight: '200ml',
      brand: "BJ'S Natural Care",
      tags: JSON.stringify(['demo', 'rose', 'body-lotion', 'luxury']),
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      initialStock: 75,
    },
    {
      sku: 'DEMO-GIFT-001',
      name: 'Luxury Fragrance Gift Set [DEMO]',
      slug: 'luxury-fragrance-gift-set-demo',
      categoryId: catMap['gift-sets'],
      description: 'Curated 3-piece luxury fragrance set. THIS IS A DEMO PRODUCT.',
      shortDescription: 'Curated 3-piece luxury fragrance set',
      price: 3999,
      comparePrice: 5499,
      taxPercent: 18,
      weight: 'Set',
      brand: "BJ'S Natural Care",
      tags: JSON.stringify(['demo', 'gift-set', 'luxury', 'fragrance']),
      isFeatured: true,
      isBestseller: false,
      isNewArrival: false,
      initialStock: 25,
    },
  ];

  let created = 0;
  for (const p of sampleProducts) {
    const { initialStock, ...productData } = p;
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          ...productData,
          inventory: { create: { quantity: initialStock, lowStockThreshold: 5 } },
        },
      });
      created++;
    }
  }
  console.log(`✅ ${created} demo product(s) created`);

  // ===== DEMO BANNER =====
  const demoBanner = await prisma.banner.findFirst({ where: { title: 'Luxury, Naturally Crafted. [DEMO]' } });
  if (!demoBanner) {
    await prisma.banner.create({
      data: {
        title: 'Luxury, Naturally Crafted. [DEMO]',
        subtitle: 'Premium Perfumes & Natural Beauty',
        description: 'Explore our curated collection of luxury fragrances, skincare, and haircare products.',
        desktopImage: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1920',
        mobileImage: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800',
        ctaText: 'Shop Collection',
        ctaUrl: '/shop',
        placement: 'HERO',
        priority: 1,
        isActive: true,
      },
    });
    console.log('✅ Demo banner created');
  }

  console.log('\n🧪 Demo data seeded successfully!');
  console.log('\n⚠️  REMINDER: Delete all [DEMO] products and banner before going live!');
  console.log('   Admin Panel → Products → filter by "DEMO" → delete all');
  console.log('   Admin Panel → Banners → delete demo banner\n');
}

main()
  .catch((e) => { console.error('❌ Seed:dev error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

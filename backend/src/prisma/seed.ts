import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BJ\'S Natural Care database...');

  // ===== ADMIN USER =====
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bjsnaturalcare.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@BJS2024!';
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.ADMIN_LAST_NAME || 'BJS',
      role: "ADMIN",
      isEmailVerified: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ===== STORE SETTINGS =====
  const defaultSettings = [
    { key: 'store_name', value: "BJ'S Natural Care", group: 'store', label: 'Store Name' },
    { key: 'store_tagline', value: 'Luxury, Naturally Crafted.', group: 'store', label: 'Tagline' },
    { key: 'store_email', value: 'info@bjsnaturalcare.com', group: 'store', label: 'Contact Email' },
    { key: 'store_phone', value: '+91 98765 43210', group: 'store', label: 'Phone' },
    { key: 'store_address', value: 'Mumbai, Maharashtra, India', group: 'store', label: 'Address' },
    { key: 'default_shipping_charge', value: '99', group: 'shipping', label: 'Default Shipping Charge' },
    { key: 'free_shipping_threshold', value: '999', group: 'shipping', label: 'Free Shipping Above (₹)' },
    { key: 'cod_enabled', value: 'true', group: 'payment', label: 'Cash on Delivery Enabled' },
    { key: 'instagram', value: 'https://instagram.com/bjsnaturalcare', group: 'social', label: 'Instagram' },
    { key: 'facebook', value: 'https://facebook.com/bjsnaturalcare', group: 'social', label: 'Facebook' },
    { key: 'youtube', value: '', group: 'social', label: 'YouTube' },
    { key: 'meta_title', value: "BJ'S Natural Care — Premium Luxury Beauty & Fragrance", group: 'seo', label: 'SEO Title' },
    { key: 'meta_description', value: 'Shop premium perfumes, skincare, haircare and natural beauty products. Luxury, naturally crafted.', group: 'seo', label: 'SEO Description' },
    { key: 'about_heading', value: 'Our Story', group: 'content', label: 'About Heading' },
    { key: 'about_text', value: "BJ'S Natural Care was born from a passion for natural beauty and luxury craftsmanship. We believe that true beauty is rooted in nature — pure, powerful, and timeless. [Update this content in Admin > Settings > Content]", group: 'content', label: 'About Text' },
    { key: 'hero_heading', value: 'Luxury, Naturally Crafted.', group: 'content', label: 'Hero Heading' },
    { key: 'hero_subheading', value: 'Premium perfumes, skincare & haircare — elevated for the discerning few.', group: 'content', label: 'Hero Subheading' },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSettings.upsert({ where: { key: s.key }, update: {}, create: { ...s, updatedAt: new Date() } });
  }
  console.log('✅ Store settings seeded');

  // ===== CATEGORIES =====
  const categories = [
    { name: 'Fragrance', slug: 'fragrance', description: 'Luxury perfumes and fragrances', sortOrder: 1 },
    { name: 'Hair Care', slug: 'hair-care', description: 'Premium shampoos, conditioners and hair treatments', sortOrder: 2 },
    { name: 'Skin Care', slug: 'skin-care', description: 'Face and body skincare products', sortOrder: 3 },
    { name: 'Body Care', slug: 'body-care', description: 'Body wash, lotions and scrubs', sortOrder: 4 },
    { name: 'Natural Care', slug: 'natural-care', description: 'Herbal and natural wellness products', sortOrder: 5 },
    { name: 'Gift Sets', slug: 'gift-sets', description: 'Curated luxury gift collections', sortOrder: 6 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
    createdCategories[cat.slug] = c.id;
  }
  console.log('✅ Categories seeded');

  // ===== SUBCATEGORIES =====
  const subcategories = [
    { name: 'Eau de Parfum', slug: 'eau-de-parfum', categoryId: createdCategories['fragrance'] },
    { name: 'Perfume', slug: 'perfume', categoryId: createdCategories['fragrance'] },
    { name: 'Gift Sets', slug: 'fragrance-gift-sets', categoryId: createdCategories['fragrance'] },
    { name: 'Shampoo', slug: 'shampoo', categoryId: createdCategories['hair-care'] },
    { name: 'Conditioner', slug: 'conditioner', categoryId: createdCategories['hair-care'] },
    { name: 'Hair Oil', slug: 'hair-oil', categoryId: createdCategories['hair-care'] },
    { name: 'Face Care', slug: 'face-care', categoryId: createdCategories['skin-care'] },
    { name: 'Body Lotion', slug: 'body-lotion', categoryId: createdCategories['skin-care'] },
    { name: 'Body Wash', slug: 'body-wash', categoryId: createdCategories['body-care'] },
    { name: 'Herbal Products', slug: 'herbal-products', categoryId: createdCategories['natural-care'] },
  ];

  for (const sub of subcategories) {
    await prisma.subcategory.upsert({ where: { slug: sub.slug }, update: {}, create: sub });
  }
  console.log('✅ Subcategories seeded');

  // ===== DEMO PRODUCTS (for development) =====
  const sampleProducts = [
    {
      sku: 'BJS-PERF-001',
      name: 'Oud Royale Eau de Parfum',
      slug: 'oud-royale-eau-de-parfum',
      categoryId: createdCategories['fragrance'],
      description: 'A rich, smoky oud fragrance with notes of rose, amber, and sandalwood. This luxurious Eau de Parfum is crafted for those who seek depth and sophistication.',
      shortDescription: 'Rich oud with rose & amber accords',
      ingredients: 'Alcohol Denat., Fragrance (Parfum), Aqua, Oud Extract, Rose Absolute, Amber Resinoid',
      benefits: 'Long-lasting 8-10 hour wear | Leaves a luxurious scent trail | Mood-enhancing aroma',
      howToUse: 'Apply to pulse points — wrists, neck, and behind ears. For longer wear, apply to moisturized skin.',
      price: 2999,
      comparePrice: 3999,
      taxPercent: 18,
      weight: '100ml',
      gender: 'Unisex',
      fragrance: 'Oud, Rose, Amber',
      tags: JSON.stringify(['oud', 'luxury', 'unisex', 'long-lasting', 'premium']),
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      initialStock: 50,
    },
    {
      sku: 'BJS-PERF-002',
      name: 'Rose Absolue Perfume',
      slug: 'rose-absolue-perfume',
      categoryId: createdCategories['fragrance'],
      description: 'An exquisite floral perfume built around the finest rose absolute. Delicate, feminine, and deeply romantic — perfect for special occasions.',
      shortDescription: 'Pure rose absolute with jasmine & musk',
      price: 1999,
      comparePrice: 2499,
      taxPercent: 18,
      weight: '50ml',
      gender: 'Women',
      fragrance: 'Rose, Jasmine, Musk',
      tags: JSON.stringify(['rose', 'floral', 'women', 'romantic']),
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      initialStock: 35,
    },
    {
      sku: 'BJS-HAIR-001',
      name: 'Argan Oil Luxury Shampoo',
      slug: 'argan-oil-luxury-shampoo',
      categoryId: createdCategories['hair-care'],
      description: 'Enriched with pure Moroccan argan oil, this sulfate-free shampoo deeply nourishes and adds brilliant shine to all hair types.',
      shortDescription: 'Argan oil sulfate-free nourishing shampoo',
      ingredients: 'Aqua, Sodium Lauryl Sulfoacetate, Cocamidopropyl Betaine, Argan Oil, Keratin, Vitamin E',
      benefits: 'Reduces frizz | Adds shine | Strengthens hair | Sulfate-free | Safe for colored hair',
      howToUse: 'Apply to wet hair, lather gently, leave for 2 minutes, rinse thoroughly. Repeat if necessary.',
      price: 799,
      comparePrice: 999,
      taxPercent: 12,
      weight: '250ml',
      tags: JSON.stringify(['argan', 'shampoo', 'sulfate-free', 'haircare']),
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      initialStock: 100,
    },
    {
      sku: 'BJS-SKIN-001',
      name: 'Saffron Glow Face Cream',
      slug: 'saffron-glow-face-cream',
      categoryId: createdCategories['skin-care'],
      description: 'Infused with real saffron extract and hyaluronic acid, this luxurious face cream brightens skin tone and deeply hydrates for a radiant complexion.',
      shortDescription: 'Saffron & hyaluronic acid brightening cream',
      price: 1499,
      comparePrice: 1999,
      taxPercent: 12,
      weight: '50g',
      gender: 'Women',
      tags: JSON.stringify(['saffron', 'skincare', 'brightening', 'moisturizer']),
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      initialStock: 60,
    },
    {
      sku: 'BJS-BODY-001',
      name: 'Rose Gold Body Lotion',
      slug: 'rose-gold-body-lotion',
      categoryId: createdCategories['body-care'],
      description: 'A luxurious body lotion with rose extract and 24k gold flakes. Leaves skin silky smooth, deeply nourished, and subtly shimmering.',
      shortDescription: 'Rose & gold shimmer body lotion',
      price: 1199,
      comparePrice: 1599,
      taxPercent: 12,
      weight: '200ml',
      tags: JSON.stringify(['rose', 'body-lotion', 'luxury', 'shimmer']),
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      initialStock: 75,
    },
    {
      sku: 'BJS-GIFT-001',
      name: 'Luxury Fragrance Gift Set',
      slug: 'luxury-fragrance-gift-set',
      categoryId: createdCategories['gift-sets'],
      description: 'The ultimate luxury gift — includes Oud Royale (30ml), Rose Absolue (30ml), and a complementing body lotion. Beautifully presented in a signature gift box.',
      shortDescription: 'Curated 3-piece luxury fragrance set',
      price: 3999,
      comparePrice: 5499,
      taxPercent: 18,
      weight: 'Set',
      tags: JSON.stringify(['gift-set', 'luxury', 'fragrance', 'combo']),
      isFeatured: true,
      isBestseller: false,
      isNewArrival: false,
      initialStock: 25,
    },
  ];

  for (const p of sampleProducts) {
    const { initialStock, ...productData } = p;
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          ...productData,
          brand: "BJ'S Natural Care",
          inventory: { create: { quantity: initialStock, lowStockThreshold: 5 } },
        },
      });
    }
  }
  console.log('✅ Sample products seeded (development only)');

  // ===== SAMPLE BANNER =====
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.create({
      data: {
        title: 'Luxury, Naturally Crafted.',
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
    console.log('✅ Sample banner created');
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log(`\n🔑 Admin Login:\n   Email: ${adminEmail}\n   Password: ${adminPassword}`);
  console.log('\n⚠️  IMPORTANT: Change admin password in production!\n');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// ============================================================
// PRODUCTION SEED — safe to run on live database
// Creates: Admin user, Store settings, Categories, Subcategories
//
// NO demo products — NO fake banners — NO test data
// For demo data (testing only), run: npm run seed:dev
// ============================================================

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BJ'S Natural Care database (production)...");

  // ===== ROLES =====
  let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { name: 'ADMIN', description: 'Administrator Role' } });
  }
  let customerRole = await prisma.role.findUnique({ where: { name: 'CUSTOMER' } });
  if (!customerRole) {
    customerRole = await prisma.role.create({ data: { name: 'CUSTOMER', description: 'Customer Role' } });
  }

  // ===== ADMIN USER =====
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bjsluxe.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@BJS2024!';
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { roleId: adminRole.id },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.ADMIN_LAST_NAME || 'BJS',
      roleId: adminRole.id,
      isEmailVerified: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ===== STORE SETTINGS =====
  // Override these with env vars on Render, or update via Admin > Settings after deploy
  const defaultSettings = [
    { key: 'store_name',               value: "BJ'S Natural Care",                              group: 'store',    label: 'Store Name' },
    { key: 'store_tagline',            value: 'Luxury, Naturally Crafted.',                     group: 'store',    label: 'Tagline' },
    { key: 'store_email',              value: process.env.STORE_EMAIL    || 'info@bjsluxe.com', group: 'store', label: 'Contact Email' },
    { key: 'store_phone',              value: process.env.STORE_PHONE    || '+91 98252 68872',  group: 'store',    label: 'Phone' },
    { key: 'store_address',            value: process.env.STORE_ADDRESS  || 'Surat, Gujarat, India', group: 'store', label: 'Address' },
    { key: 'default_shipping_charge',  value: '99',                                              group: 'shipping', label: 'Default Shipping Charge' },
    { key: 'free_shipping_threshold',  value: '999',                                             group: 'shipping', label: 'Free Shipping Above (₹)' },
    { key: 'cod_enabled',              value: 'true',                                            group: 'payment',  label: 'Cash on Delivery Enabled' },
    { key: 'instagram',                value: process.env.STORE_INSTAGRAM || '',                group: 'social',   label: 'Instagram' },
    { key: 'facebook',                 value: process.env.STORE_FACEBOOK  || '',                group: 'social',   label: 'Facebook' },
    { key: 'youtube',                  value: process.env.STORE_YOUTUBE   || '',                group: 'social',   label: 'YouTube' },
    { key: 'meta_title',               value: "BJ'S Natural Care — Premium Luxury Beauty & Fragrance", group: 'seo', label: 'SEO Title' },
    { key: 'meta_description',         value: 'Shop premium perfumes, skincare, haircare and natural beauty products. Luxury, naturally crafted.', group: 'seo', label: 'SEO Description' },
    { key: 'about_heading',            value: 'Our Story',                                       group: 'content',  label: 'About Heading' },
    { key: 'about_text',               value: "BJ'S Natural Care was born from a passion for natural beauty and luxury craftsmanship. [Update this in Admin > Settings > Pages]", group: 'content', label: 'About Text' },
    { key: 'hero_heading',             value: 'Luxury, Naturally Crafted.',                     group: 'content',  label: 'Hero Heading' },
    { key: 'hero_subheading',          value: 'Premium perfumes, skincare & haircare — elevated for the discerning few.', group: 'content', label: 'Hero Subheading' },
    { key: 'trust_secure_payments',    value: 'We use industry-standard encryption for all transactions.', group: 'content', label: 'Trust: Secure Payments' },
    { key: 'trust_quality_products',   value: 'Every product is thoughtfully formulated and carefully inspected.', group: 'content', label: 'Trust: Quality Products' },
    { key: 'trust_easy_returns',       value: 'Hassle-free returns within our standard policy window.', group: 'content', label: 'Trust: Easy Returns' },
    { key: 'trust_customer_support',   value: 'Reach out to our team anytime for assistance with your order.', group: 'content', label: 'Trust: Customer Support' },
    { key: 'trust_fast_delivery',      value: 'Orders are typically dispatched within 24–48 hours.', group: 'content', label: 'Trust: Fast Delivery' },
    { key: 'footer_desc',              value: "Premium luxury beauty and fragrance brand, crafting exquisite perfumes, skincare, haircare, and body care with the finest natural ingredients.", group: 'content', label: 'Footer Description' },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSettings.upsert({ where: { key: s.key }, update: {}, create: { ...s, updatedAt: new Date() } });
  }
  console.log('✅ Store settings seeded');

  // ===== CATEGORIES =====
  const categories = [
    { name: 'Fragrance',    slug: 'fragrance',    description: 'Luxury perfumes and fragrances',                   sortOrder: 1 },
    { name: 'Hair Care',    slug: 'hair-care',    description: 'Premium shampoos, conditioners and hair treatments', sortOrder: 2 },
    { name: 'Skin Care',    slug: 'skin-care',    description: 'Face and body skincare products',                  sortOrder: 3 },
    { name: 'Body Care',    slug: 'body-care',    description: 'Body wash, lotions and scrubs',                    sortOrder: 4 },
    { name: 'Natural Care', slug: 'natural-care', description: 'Herbal and natural wellness products',             sortOrder: 5 },
    { name: 'Gift Sets',    slug: 'gift-sets',    description: 'Curated luxury gift collections',                  sortOrder: 6 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
    createdCategories[cat.slug] = c.id;
  }
  console.log('✅ Categories seeded');

  // ===== SUBCATEGORIES =====
  const subcategories = [
    { name: 'Eau de Parfum',  slug: 'eau-de-parfum',        categoryId: createdCategories['fragrance'] },
    { name: 'Perfume',        slug: 'perfume',              categoryId: createdCategories['fragrance'] },
    { name: 'Gift Sets',      slug: 'fragrance-gift-sets',  categoryId: createdCategories['fragrance'] },
    { name: 'Shampoo',        slug: 'shampoo',              categoryId: createdCategories['hair-care'] },
    { name: 'Conditioner',    slug: 'conditioner',          categoryId: createdCategories['hair-care'] },
    { name: 'Hair Oil',       slug: 'hair-oil',             categoryId: createdCategories['hair-care'] },
    { name: 'Face Care',      slug: 'face-care',            categoryId: createdCategories['skin-care'] },
    { name: 'Body Lotion',    slug: 'body-lotion',          categoryId: createdCategories['skin-care'] },
    { name: 'Body Wash',      slug: 'body-wash',            categoryId: createdCategories['body-care'] },
    { name: 'Herbal Products',slug: 'herbal-products',      categoryId: createdCategories['natural-care'] },
  ];

  for (const sub of subcategories) {
    await prisma.subcategory.upsert({ where: { slug: sub.slug }, update: {}, create: sub });
  }
  console.log('✅ Subcategories seeded');

  // ===== COMPLETE =====
  console.log('\n🎉 Production database seeded successfully!');
  console.log(`\n🔑 Admin Login:\n   Email: ${adminEmail}\n   Password: ${adminPassword}`);
  console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');
  console.log('💡 To add demo products for testing, run: npm run seed:dev\n');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

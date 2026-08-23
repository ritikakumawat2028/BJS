"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// ============================================================
// SMART SEED — Safe to run on every deploy
// Only creates data if it doesn't already exist.
// NEVER deletes or overwrites existing products/orders/users.
// ============================================================
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Running smart seed check...");
    // ===== ROLES =====
    let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    if (!adminRole) {
        adminRole = await prisma.role.create({ data: { name: 'ADMIN', description: 'Administrator Role' } });
        console.log('✅ Admin role created');
    }
    let customerRole = await prisma.role.findUnique({ where: { name: 'CUSTOMER' } });
    if (!customerRole) {
        customerRole = await prisma.role.create({ data: { name: 'CUSTOMER', description: 'Customer Role' } });
        console.log('✅ Customer role created');
    }
    // ===== ADMIN USER =====
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bjsnaturalcare.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@BJS2024!';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const adminHash = await bcryptjs_1.default.hash(adminPassword, 12);
        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: adminHash,
                firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
                lastName: process.env.ADMIN_LAST_NAME || 'BJS',
                roleId: adminRole.id,
                isEmailVerified: true,
            },
        });
        console.log(`✅ Admin user created: ${adminEmail}`);
    }
    else {
        console.log(`ℹ️  Admin already exists: ${adminEmail}`);
    }
    // ===== STORE SETTINGS (only create if not exists) =====
    const defaultSettings = [
        { key: 'store_name', value: "BJ'S Natural Care", group: 'store', label: 'Store Name' },
        { key: 'store_tagline', value: 'Luxury, Naturally Crafted.', group: 'store', label: 'Tagline' },
        { key: 'store_email', value: process.env.STORE_EMAIL || 'jay250576@gmail.com', group: 'store', label: 'Contact Email' },
        { key: 'store_phone', value: process.env.STORE_PHONE || '+91 92745 96622', group: 'store', label: 'Contact Phone' },
        { key: 'store_address', value: process.env.STORE_ADDRESS || 'Surat, Gujarat, India', group: 'store', label: 'Address' },
        { key: 'default_shipping_charge', value: '99', group: 'shipping', label: 'Default Shipping Charge' },
        { key: 'free_shipping_threshold', value: '999', group: 'shipping', label: 'Free Shipping Above (₹)' },
        { key: 'cod_enabled', value: 'true', group: 'payment', label: 'Cash on Delivery Enabled' },
        { key: 'instagram', value: process.env.INSTAGRAM || 'https://www.instagram.com/bjs.essence?igsi=dWF1c3Uya3NlcHMz&utm_source=qr', group: 'social', label: 'Instagram' },
        { key: 'facebook', value: '', group: 'social', label: 'Facebook' },
        { key: 'youtube', value: '', group: 'social', label: 'YouTube' },
        { key: 'meta_title', value: "BJ'S Natural Care — Premium Luxury Beauty & Fragrance", group: 'seo', label: 'SEO Title' },
        { key: 'meta_description', value: 'Shop premium perfumes, skincare, haircare and natural beauty products. Luxury, naturally crafted.', group: 'seo', label: 'SEO Description' },
        { key: 'about_heading', value: 'Our Story', group: 'content', label: 'About Heading' },
        { key: 'about_text', value: "BJ'S Natural Care was born from a passion for natural beauty and luxury craftsmanship.", group: 'content', label: 'About Text' },
        { key: 'hero_heading', value: 'Luxury, Naturally Crafted.', group: 'content', label: 'Hero Heading' },
        { key: 'hero_subheading', value: 'Premium perfumes, skincare & haircare — elevated for the discerning few.', group: 'content', label: 'Hero Subheading' },
        { key: 'trust_secure_payments', value: 'We use industry-standard encryption for all transactions.', group: 'content', label: 'Trust: Secure Payments' },
        { key: 'trust_quality_products', value: 'Every product is thoughtfully formulated and carefully inspected.', group: 'content', label: 'Trust: Quality Products' },
        { key: 'trust_easy_returns', value: 'Hassle-free returns within our standard policy window.', group: 'content', label: 'Trust: Easy Returns' },
        { key: 'trust_customer_support', value: 'Reach out to our team anytime for assistance with your order.', group: 'content', label: 'Trust: Customer Support' },
        { key: 'trust_fast_delivery', value: 'Orders are typically dispatched within 24–48 hours.', group: 'content', label: 'Trust: Fast Delivery' },
        { key: 'footer_desc', value: "Premium luxury beauty and fragrance brand, crafting exquisite perfumes, skincare, haircare, and body care with the finest natural ingredients.", group: 'content', label: 'Footer Description' },
    ];
    for (const s of defaultSettings) {
        // Only create if not exists — never overwrite admin-customized settings
        await prisma.storeSettings.upsert({
            where: { key: s.key },
            update: {}, // Never update existing values — admin may have changed them
            create: { ...s, updatedAt: new Date() },
        });
    }
    console.log('✅ Store settings checked');
    // ===== CATEGORIES (only create if not exists) =====
    const categories = [
        { name: 'Fragrance', slug: 'fragrance', description: 'Luxury perfumes and fragrances', sortOrder: 1 },
        { name: 'Hair Care', slug: 'hair-care', description: 'Premium shampoos, conditioners and hair treatments', sortOrder: 2 },
        { name: 'Skin Care', slug: 'skin-care', description: 'Face and body skincare products', sortOrder: 3 },
        { name: 'Body Care', slug: 'body-care', description: 'Body wash, lotions and scrubs', sortOrder: 4 },
        { name: 'Natural Care', slug: 'natural-care', description: 'Herbal and natural wellness products', sortOrder: 5 },
        { name: 'Gift Sets', slug: 'gift-sets', description: 'Curated luxury gift collections', sortOrder: 6 },
    ];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {}, // Never overwrite
            create: cat,
        });
    }
    console.log('✅ Categories checked');
    // ===== SUBCATEGORIES =====
    const catMap = {};
    const allCats = await prisma.category.findMany({ select: { id: true, slug: true } });
    for (const c of allCats)
        catMap[c.slug] = c.id;
    const subcategories = [
        { name: 'Eau de Parfum', slug: 'eau-de-parfum', categoryId: catMap['fragrance'] },
        { name: 'Perfume', slug: 'perfume', categoryId: catMap['fragrance'] },
        { name: 'Gift Sets', slug: 'fragrance-gift-sets', categoryId: catMap['fragrance'] },
        { name: 'Shampoo', slug: 'shampoo', categoryId: catMap['hair-care'] },
        { name: 'Conditioner', slug: 'conditioner', categoryId: catMap['hair-care'] },
        { name: 'Hair Oil', slug: 'hair-oil', categoryId: catMap['hair-care'] },
        { name: 'Face Care', slug: 'face-care', categoryId: catMap['skin-care'] },
        { name: 'Body Lotion', slug: 'body-lotion', categoryId: catMap['skin-care'] },
        { name: 'Body Wash', slug: 'body-wash', categoryId: catMap['body-care'] },
        { name: 'Herbal Products', slug: 'herbal-products', categoryId: catMap['natural-care'] },
    ];
    for (const sub of subcategories) {
        if (!sub.categoryId)
            continue;
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: sub,
        });
    }
    console.log('✅ Subcategories checked');
    const productCount = await prisma.product.count();
    console.log(`\n✅ Smart seed complete! Products in DB: ${productCount}`);
    console.log('ℹ️  Products are NEVER touched by this seed — they are safe.');
}
main()
    .catch((e) => { console.error('❌ Smart seed error:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=seed.js.map
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    const products = await prisma.product.count();
    const categories = await prisma.category.count();
    const users = await prisma.user.count();
    
    console.log(`Products: ${products}`);
    console.log(`Categories: ${categories}`);
    console.log(`Users: ${users}`);
    
    // Check if admin exists
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (admin) {
      console.log(`Admin user exists: ${admin.email}`);
    } else {
      console.log('No admin user found!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();

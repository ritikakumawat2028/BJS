const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const name = "Test Product 4";
    const sku = "TEST-4-" + Date.now();
    const slug = "test-prod-4-" + Date.now();
    
    // Simulate user payload with empty categoryId
    const categoryId = ""; // empty string

    // Apply the exact logic from my fix:
    if (!name || !sku || !categoryId || 2500 === undefined || 2500 === null || 2500 === '') {
      throw new Error("Name, SKU, Category, and Price are required fields");
    }

  } catch (e) {
    console.error("ERROR CAUGHT:");
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();

import { test, expect } from '@playwright/test';

// Assuming an admin user already exists via database seed
const adminUser = {
  email: 'admin@bjsnaturalcare.com',
  password: 'Admin@BJS2024!'
};

const timestamp = Date.now();

test.describe('Admin End-to-End Flow', () => {
  test('Complete admin operations journey', async ({ page }, testInfo) => {
    const uniqueId = `${Date.now()}-${testInfo.workerIndex}`;

    // 1. Admin Login
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', adminUser.email);
    await page.fill('input[name="password"]', adminUser.password);
    await page.keyboard.press('Enter');

    // Should redirect to admin dashboard because of role
    await page.waitForURL('**/admin', { timeout: 15000 });
    await expect(page.locator('h1.section-title, h1:has-text("Dashboard")').first()).toHaveText(/Dashboard/i);

    // 2. Add Category
    await page.goto('http://localhost:5173/admin/categories');
    await page.click('button:has-text("Add New Category")');
    await page.fill('input[name="name"]', `E2E Category ${uniqueId}`);
    await page.click('button:has-text("Create Category")');
    await expect(page.locator(`text=E2E Category ${uniqueId}`)).toBeVisible();

    // 3. Add Product
    await page.goto('http://localhost:5173/admin/products');
    await page.click('button:has-text("Add Product")');
    await page.fill('input[name="name"]', `E2E Luxury Soap ${uniqueId}`);
    await page.fill('input[name="sku"]', `SKU-${uniqueId}`);
    await page.fill('input[name="price"]', '999');
    await page.fill('input[name="stock"]', '10');
    
    // Select the newly created category (assuming it's in the dropdown)
    await page.selectOption('select[name="categoryId"]', { label: `E2E Category ${uniqueId}` });
    
    await page.click('button:has-text("Publish Product")');
    await expect(page.locator(`text=E2E Luxury Soap ${uniqueId}`)).toBeVisible();

    // 4. Update Stock (Inventory)
    await page.goto('http://localhost:5173/admin/inventory');
    // Search for the product
    await page.fill('input[placeholder*="Search"]', `SKU-${uniqueId}`);
    await page.click('button:has-text("Adjust")');
    await page.fill('input[type="number"]', '50'); // Add 50 units
    await page.click('button:has-text("Confirm")');

    // 5. Create Festival Campaign
    await page.goto('http://localhost:5173/admin/campaigns');
    await page.click('button:has-text("Add New Campaign")');
    await page.fill('input[name="name"]', `Diwali Sale ${uniqueId}`);
    await page.fill('input[name="discount"]', '20');
    await page.fill('input[name="couponCode"]', `DIWALI${uniqueId}`);
    await page.click('button:has-text("Create Campaign")');
    await expect(page.locator(`text=Diwali Sale ${uniqueId}`)).toBeVisible();

    // 6. Manage Orders (Simulate processing an order)
    await page.goto('http://localhost:5173/admin/orders');
    // Click on the first order in the table
    const firstOrderRow = page.locator('table tbody tr').first();
    if (await firstOrderRow.isVisible()) {
      await firstOrderRow.locator('button:has-text("View")').click();
      
      // Update Delivery Status to "Shipped"
      await page.selectOption('select[name="orderStatus"]', 'SHIPPED');
      await page.click('button:has-text("Save & Notify Customer")');
    }
  });
});

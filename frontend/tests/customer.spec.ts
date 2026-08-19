import { test, expect } from '@playwright/test';

// Using a unique timestamp to prevent email collisions across test runs
const timestamp = Date.now();
const testUser = {
  firstName: 'Test',
  lastName: 'Customer',
  email: `testcustomer${timestamp}@bjs.com`,
  password: 'Password123!',
  phone: '9876543210'
};

test.describe('Customer End-to-End Flow', () => {
  test('Complete shopping journey', async ({ page }) => {
    // 1. Register & Login
    await page.goto('http://localhost:5173/login');
    // Assuming there's a toggle to register or a direct route
    await page.click('text=Create account');
    await page.fill('input[name="firstName"]', testUser.firstName);
    await page.fill('input[name="lastName"]', testUser.lastName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]:has-text("Create Account")');
    
    // Wait for redirect to login or dashboard
    await expect(page).toHaveURL(/.*(\/login|\/account)/);

    // If redirected to login, perform login
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]:has-text("Sign In")');
      await expect(page).toHaveURL(/.*\/account/);
    }

    // 2. Browse, Search & Filter
    await page.goto('http://localhost:5173/shop');
    await page.fill('input[placeholder*="Search"]', 'Rose');
    await page.press('input[placeholder*="Search"]', 'Enter');
    
    // Wait for results
    await page.waitForTimeout(1000); 

    // Click on the first product
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.click();

    // 3. Product Details & Add to Cart
    await expect(page).toHaveURL(/.*\/product\/.+/);
    await page.click('button:has-text("Add to Cart")');
    
    // 4. Cart & Coupon
    await page.click('button:has-text("View Cart")'); // Or wait for cart drawer
    // Try to apply a generic welcome coupon if applicable
    const couponInput = page.locator('input[placeholder*="coupon"]');
    if (await couponInput.isVisible()) {
      await couponInput.fill('WELCOME10');
      await page.click('button:has-text("Apply")');
    }

    // 5. Checkout
    await page.click('text="Proceed to Checkout"');
    await expect(page).toHaveURL(/.*\/checkout/);

    // Fill shipping details
    await page.fill('input[name="address"]', '123 Test St');
    await page.fill('input[name="city"]', 'Mumbai');
    await page.fill('input[name="state"]', 'MH');
    await page.fill('input[name="pincode"]', '400001');

    // 6. Payment & Order Creation
    // In a test environment, we click the "Place Order" which might mock Razorpay
    await page.click('button:has-text("Place Order")');

    // Wait for success page
    await expect(page).toHaveURL(/.*\/order-success/);
    
    // Extract Order ID
    const orderIdElement = page.locator('.order-id');
    if (await orderIdElement.isVisible()) {
      const orderId = await orderIdElement.innerText();
      console.log(`Order created: ${orderId}`);
    }

    // 7. Order History
    await page.goto('http://localhost:5173/account');
    await page.click('text="Orders"');
    await expect(page.locator('text="Order #"')).toBeVisible();
  });
});

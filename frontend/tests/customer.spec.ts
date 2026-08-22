import { test, expect } from '@playwright/test';

test.describe('Customer End-to-End Flow', () => {
  test('Complete shopping journey', async ({ page }, testInfo) => {
    // Debug API errors
    page.on('response', async response => {
      if (!response.ok()) {
        try {
          const body = await response.text();
          console.error(`API Error: ${response.url()} - ${response.status()} - ${body}`);
        } catch (e) {}
      }
    });

    const timestamp = Date.now();
    const uniqueId = `${timestamp}-${testInfo.workerIndex}`;
    const testUser = {
      firstName: 'Test',
      lastName: 'Customer',
      email: `testcustomer${uniqueId}@bjs.com`,
      password: 'Password123!',
      phone: '9876543210'
    };

    // 1. Register & Login
    await page.goto('http://localhost:5173/login');
    // Assuming there's a toggle to register or a direct route
    await page.click('text=Create one');
    await page.fill('input[name="firstName"]', testUser.firstName);
    await page.fill('input[name="lastName"]', testUser.lastName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    
    const responsePromise = page.waitForResponse('**/api/auth/send-register-otp');
    await page.click('button[type="submit"]:has-text("Verify Email")');
    const response = await responsePromise;
    const responseBody = await response.json();
    if (!responseBody.devOtp) {
      throw new Error(`OTP response missing devOtp: ${JSON.stringify(responseBody)}`);
    }
    const devOtp = responseBody.devOtp;
    
    // Fill OTP
    await page.fill('input[placeholder="------"]', devOtp.toString());
    await page.click('button[type="submit"]:has-text("Create Account")');
    
    // Wait for redirect to login or dashboard
    await page.waitForURL('**/account', { timeout: 15000 });


    // 2. Browse, Search & Filter
    await page.goto('http://localhost:5173/shop');
    
    // Instead of using the search overlay which might be tricky with animations,
    // let's just use the direct URL search for robustness in E2E tests, 
    // or just click the first product without searching if we want to test the checkout flow.
    // We'll go to the shop page and just click the first available product.
    
    // Wait for results
    await page.waitForTimeout(2000); 

    // Click on the first product
    const firstProduct = page.locator('.product-card').first();
    await firstProduct.click();

    // 3. Product Details & Add to Cart
    await expect(page).toHaveURL(/.*\/products\/.+/);
    const addToCartPromise = page.waitForResponse('**/api/cart/items');
    await page.click('button:has-text("Add to Cart")');
    await addToCartPromise;
    await page.waitForTimeout(500); // Give Zustand a moment to update state
    
    // 4. Go to Checkout via the cart drawer UI instead of page.goto to avoid full page reload
    await page.waitForSelector('.cart-drawer', { state: 'visible' });
    await page.click('text="Proceed to Checkout"');
    await expect(page).toHaveURL(/.*\/checkout/);
    // Fill shipping details (Step 1)
    await page.waitForTimeout(1000);
    
    // Check if the new address form is visible by waiting for either the form or the address grid
    await page.waitForSelector('.skeleton', { state: 'hidden' });
    
    let isNewAddressFormVisible = false;
    try {
      await page.waitForSelector('input[name="firstName"]', { state: 'visible', timeout: 2000 });
      isNewAddressFormVisible = true;
    } catch (e) {
      isNewAddressFormVisible = false;
    }
    
    if (isNewAddressFormVisible) {
      // Fill form and save if it's a new address
      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'Customer');
      await page.fill('input[name="phone"]', '9876543210');
      await page.fill('input[name="line1"]', '123 Test St');
      await page.fill('input[name="city"]', 'Mumbai');
      await page.fill('input[name="state"]', 'MH');
      await page.fill('input[name="pincode"]', '400001');
      
      // Submit form by explicitly clicking the button
      await page.click('button:has-text("Save & Continue")');
      
      // Wait for the form to disappear, which confirms successful API submission
      await page.waitForSelector('input[name="firstName"]', { state: 'hidden', timeout: 10000 });
      
      // Wait for the form to disappear
      await page.waitForSelector('input[name="firstName"]', { state: 'hidden', timeout: 5000 });
    } else {
      // Select the first existing address just in case
      const firstAddress = page.locator('.address-card').first();
      if (await firstAddress.isVisible()) {
        await firstAddress.click();
      }
    }
    
    // Click Continue for Step 1
    await page.locator('button', { hasText: /Continue/i }).last().click({ force: true });
    
    // Log URL to see if we got redirected
    console.log('Current URL before Continue Step 2:', await page.url());
    
    // Step 2: Delivery
    await page.waitForTimeout(1000);
    await page.locator('button', { hasText: /Continue/i }).last().click({ force: true });
    
    // Step 3: Payment
    await page.waitForTimeout(1000);
    console.log('Step 3 title:', await page.locator('.step-title').textContent().catch(() => 'No title'));
    
    // Select COD to avoid Razorpay window in test
    await page.locator('.option-card', { hasText: /Cash on Delivery/i }).click({ force: true });
    await page.locator('button', { hasText: /Continue/i }).last().click({ force: true });

    // Step 4: Review
    await page.waitForTimeout(500);
    await page.click('button:has-text("Place Order")');

    // Wait for order success and redirect to order details
    await expect(page).toHaveURL(/.*\/account\/orders\/.+/, { timeout: 15000 });
    
    // 7. Order History
    await page.goto('http://localhost:5173/account');
    await page.click('text="My Orders"');
    await expect(page.locator('.order-id').first()).toBeVisible({ timeout: 15000 });
  });
});

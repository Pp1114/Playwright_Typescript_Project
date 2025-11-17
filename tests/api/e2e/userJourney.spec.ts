import { test as base, expect } from '@playwright/test';
import { generateTestUser } from '../../../utils/testDataGenerator';
import { SignupPage } from '../../../pages/SignupPage';
import { CartPage } from '../../../pages/CartPage';
import { CheckoutPage } from '../../../pages/CheckoutPage';
import { PaymentPage } from '../../../pages/PaymentPage';

const test = base.extend<{
    signupPage: SignupPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    paymentPage: PaymentPage;
}>({
    signupPage: async ({ page }, use) => await use(new SignupPage(page)),
    cartPage: async ({ page }, use) => await use(new CartPage(page)),
    checkoutPage: async ({ page }, use) => await use(new CheckoutPage(page)),
    paymentPage: async ({ page }, use) => await use(new PaymentPage(page)),
});

/**
 * ⚡ OPTIMIZED API + UI Hybrid E2E Test ⚡
 *
 * STRATEGY: Use the FASTEST method for each step
 *
 * WHY THIS COMBINATION?
 * ==================
 *
 * ❌ API create user (955ms) + UI login (4942ms) = 5897ms
 * ✅ UI signup/login (streamlined ~4-5s total)
 *
 * The UI signup flow is FASTER because:
 * - It combines signup + auto-login in one flow
 * - No need for separate login step
 * - Browser session is established immediately
 *
 * ✅ API add products (instant per product)
 * - Adding products via page.request API calls is MUCH faster than UI clicking
 * - Can add ALL 34 products in ~8s vs clicking each one in UI (would take 60-90s)
 * - Uses browser session from signup, so cookies work properly
 *
 * FLOW:
 * =====
 * 1. UI: Signup (fastest way to create user + establish session)
 * 2. API: Add ALL products to cart via page.request (instant - no UI clicking!)
 * 3. UI: Checkout → Payment (user-facing flow that must be tested in UI)
 *
 * RESULT: Fastest possible E2E test for this website
 */

test.describe('⚡ Optimized API + UI E2E', () => {

    test('Fastest E2E: UI signup + API add products + UI checkout', async ({
        page,
        signupPage,
        cartPage,
        checkoutPage,
        paymentPage
    }) => {
        console.log('\n⚡ OPTIMIZED: Fastest possible E2E combination\n');

        const startTime = Date.now();
        const testUser = generateTestUser();

        // ================================================================
        // STEP 1: UI Signup (FASTEST way to create user + get session)
        // ================================================================
        const step1Start = Date.now();
        console.log('📝 STEP 1 (UI): Signup (fastest for user creation + login)...');

        await signupPage.goto();
        await signupPage.fillInitialSignupForm(testUser.name, testUser.email);
        await signupPage.fillRegistrationForm(testUser);
        await signupPage.submitRegistration();
        await signupPage.verifyAccountCreated();
        await signupPage.clickContinue();

        console.log(`✅ Signup complete (${Date.now() - step1Start}ms)`);

        // ================================================================
        // STEP 2: API - Add ALL products to cart (INSTANT!)
        // ================================================================
        const step2Start = Date.now();
        console.log('\n🛒 STEP 2 (API): Adding ALL products to cart...');

        // Get all products
        const productsResponse = await page.request.get('https://automationexercise.com/api/productsList');
        const productsBody = await productsResponse.json();
        const products = productsBody.products;

        console.log(`   Found ${products.length} products`);

        // Add ALL products via API (uses session from UI signup)
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            await page.request.get(`https://automationexercise.com/add_to_cart/${product.id}`);
            if (i < 5 || i === products.length - 1) {
                console.log(`   ${i + 1}. ${product.name} (ID: ${product.id})`);
                if (i === 4 && products.length > 6) console.log('   ...');
            }
        }

        console.log(`✅ Added ${products.length} products (${Date.now() - step2Start}ms)`);

        // ================================================================
        // STEP 3: UI - Checkout flow (user-facing validation)
        // ================================================================
        const step3Start = Date.now();
        console.log('\n💳 STEP 3 (UI): Checkout flow...');

        // Go to cart
        await cartPage.goto();
        await cartPage.verifyCartPageLoaded();

        // Verify products
        const cartItemCount = await cartPage.getCartItemCount();
        expect(cartItemCount).toBe(products.length);
        console.log(`   ✅ Verified ${cartItemCount} products in cart`);

        // Checkout
        await cartPage.proceedToCheckout();
        await checkoutPage.addOrderComment('⚡ Optimized API+UI E2E test');
        await checkoutPage.placeOrder();

        // Payment
        await paymentPage.completePaymentWithTestCard(testUser.firstName + ' ' + testUser.lastName);

        console.log(`✅ Checkout complete (${Date.now() - step3Start}ms)`);

        // ================================================================
        // Summary
        // ================================================================
        const totalTime = Date.now() - startTime;
        console.log(`\n🎉 TOTAL: ${totalTime}ms (${(totalTime/1000).toFixed(1)}s)`);
        console.log(`📊 UI signup: ${Date.now() - step1Start}ms`);
        console.log(`📊 API add ${products.length} products: ${Date.now() - step2Start}ms`);
        console.log(`📊 UI checkout: ${Date.now() - step3Start}ms\n`);
    });
});

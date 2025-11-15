import { test, expect } from '../../../fixtures/pageFixtures';
import { generateTestUser } from '../../../utils/testDataGenerator';

/**
 * End-to-End Checkout Flow Test
 *
 * Tests the complete user journey from registration to successful order placement:
 * 1. User signup/registration
 * 2. Browse and select product
 * 3. Add product to cart
 * 4. Proceed to checkout
 * 5. Complete payment and verify order success
 *
 * This simulates a real user's first-time purchase experience
 */

test.describe('E2E: Complete Checkout Flow', () => {
    test('Complete user journey: Signup → Product Selection → Cart → Checkout → Payment', async ({
        homePage,
        signupPage,
        productsPage,
        cartPage,
        checkoutPage,
        paymentPage,
        page
    }) => {
        // Generate unique test user for this E2E flow
        const testUser = generateTestUser();

        // STEP 1: User Signup
        await homePage.goto();
        await homePage.clickSignupLoginLink();

        // Fill initial signup form
        await signupPage.fillInitialSignupForm(testUser.name, testUser.email);

        // Wait for registration page and complete signup
        await expect(signupPage.passwordInput).toBeVisible();
        await signupPage.fillRegistrationForm(testUser);
        await signupPage.submitRegistration();

        // Verify account created successfully
        await expect(page).toHaveURL(/account_created/);
        const accountCreatedMessage = page.locator('h2:has-text("Account Created")').first();
        await expect(accountCreatedMessage).toBeVisible();

        // Continue after account creation
        const continueButton = page.locator('a[data-qa="continue-button"], a:has-text("Continue")');
        await continueButton.click();

        // Verify user is logged in
        const loggedInUser = page.locator('a:has-text("Logged in as")');
        await expect(loggedInUser).toBeVisible();

        // STEP 2: Browse and Select Product
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();

        // Get first product name for later verification
        const productNames = await productsPage.getAllProductNames();
        const selectedProductName = productNames[0];

        // STEP 3: Add Product to Cart
        await productsPage.addFirstProductToCart();

        // Wait for modal and go to cart
        await expect(productsPage.viewCartButton).toBeVisible();
        await productsPage.goToCart();

        // Verify product is in cart
        await cartPage.verifyCartPageLoaded();
        await cartPage.verifyProductInCart(selectedProductName);

        const cartItemCount = await cartPage.getCartItemCount();
        expect(cartItemCount).toBe(1);

        // STEP 4: Proceed to Checkout
        await cartPage.proceedToCheckout();

        // Verify checkout page loaded
        await expect(page).toHaveURL(/checkout/);

        // Verify product is in order review (simple check)
        const orderItemsVisible = await checkoutPage.reviewOrderSection.isVisible();
        expect(orderItemsVisible).toBeTruthy();

        // Add optional order comment
        const commentBox = checkoutPage.commentTextarea;
        const isCommentVisible = await commentBox.isVisible().catch(() => false);
        if (isCommentVisible) {
            await checkoutPage.addOrderComment('E2E test order - please process');
        }

        // Place order
        await checkoutPage.placeOrder();

        // STEP 5: Complete Payment
        await expect(page).toHaveURL(/payment/);

        // Fill payment details and submit
        await paymentPage.completePaymentWithTestCard(testUser.firstName + ' ' + testUser.lastName);

        // Verify order was placed successfully by checking URL navigation
        // Should navigate to payment_done or download page after successful payment
        await expect(page).toHaveURL(/payment_done|download/, { timeout: 15000 });
    });
});

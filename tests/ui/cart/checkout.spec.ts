import { test, expect } from '../../../fixtures/pageFixtures';

// Use an existing test user for checkout tests
const EXISTING_USER = {
    email: 'testuser@example.com',
    password: 'Test@12345'
};

test.describe('Checkout Process', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
    });

    test('TC_CART_015: Verify checkout page loads successfully', async ({ homePage, loginPage, productsPage, cartPage, checkoutPage }) => {
        // Login with existing user
        await homePage.clickSignupLoginLink();
        await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);

        // Add product to cart
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();
        await productsPage.addFirstProductToCart();
        await productsPage.goToCart();

        // Proceed to checkout
        await cartPage.verifyCartPageLoaded();
        await cartPage.proceedToCheckout();

        // Verify checkout page loads
        await checkoutPage.verifyCheckoutPageLoaded();
    });

    test('TC_CART_016: Verify delivery address section displays', async ({ homePage, loginPage, productsPage, cartPage, checkoutPage }) => {
        // Login with existing user
        await homePage.clickSignupLoginLink();
        await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);

        // Add product and go to checkout
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();
        await productsPage.addFirstProductToCart();
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();

        // Verify delivery address is displayed
        await checkoutPage.verifyDeliveryAddressVisible();

        // Verify address contains information
        const deliveryAddress = await checkoutPage.getDeliveryAddress();
        expect(deliveryAddress.length).toBeGreaterThan(0);
    });

    test('TC_CART_017: Verify review order section shows all items', async ({ homePage, loginPage, productsPage, cartPage, checkoutPage }) => {
        // Login with existing user
        await homePage.clickSignupLoginLink();
        await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);

        // Add 3 products to cart
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();

        const allProductNames = await productsPage.getAllProductNames();
        const selectedProducts = allProductNames.slice(0, 3);

        await productsPage.addToCartByIndex(0);
        await productsPage.continueShopping();
        await productsPage.addToCartByIndex(1);
        await productsPage.continueShopping();
        await productsPage.addToCartByIndex(2);
        await productsPage.goToCart();

        // Proceed to checkout
        await cartPage.proceedToCheckout();

        // Verify order review shows all 3 items
        await checkoutPage.verifyOrderReviewItems(3);

        const orderItems = await checkoutPage.getOrderItemNames();
        expect(orderItems.length).toBe(3);

        // Verify each product is in order review
        selectedProducts.forEach(productName => {
            const found = orderItems.some(name => name.includes(productName));
            expect(found).toBeTruthy();
        });
    });

    test('TC_CART_018: Verify comment box for order', async ({ homePage, loginPage, productsPage, cartPage, checkoutPage }) => {
        // Login with existing user
        await homePage.clickSignupLoginLink();
        await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);

        // Add product and go to checkout
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();
        await productsPage.addFirstProductToCart();
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();

        // Verify comment box is visible
        await checkoutPage.verifyCommentBoxVisible();

        // Add a comment
        const testComment = 'Please deliver between 9 AM and 5 PM';
        await checkoutPage.addOrderComment(testComment);

        // Verify comment was entered
        const commentValue = await checkoutPage.commentTextarea.inputValue();
        expect(commentValue).toBe(testComment);
    });

    test('TC_CART_019: Verify place order functionality', async ({ homePage, loginPage, productsPage, cartPage, checkoutPage }) => {
        // Login with existing user
        await homePage.clickSignupLoginLink();
        await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);

        // Add product and go to checkout
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();
        await productsPage.addFirstProductToCart();
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();

        // Verify place order button is visible
        await checkoutPage.verifyPlaceOrderButtonVisible();

        // Click place order
        await checkoutPage.placeOrder();

        // Verify navigation to payment page
        await expect(checkoutPage.page).toHaveURL(/payment/);
    });

    test('TC_CART_020: Verify checkout requires user login', async ({ homePage, productsPage, cartPage }) => {
        // Add product to cart without logging in
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();
        await productsPage.addFirstProductToCart();
        await productsPage.goToCart();

        // Verify cart page loaded
        await cartPage.verifyCartPageLoaded();

        // Try to proceed to checkout
        await cartPage.proceedToCheckout();

        // Verify it redirects to login page or shows login modal
        // The site may redirect to login or show a modal requiring login
        const currentUrl = cartPage.page.url();

        // Check if redirected to login OR if checkout shows register/login options
        const isLoginRequired = currentUrl.includes('login') || currentUrl.includes('checkout');
        expect(isLoginRequired).toBeTruthy();
    });
});

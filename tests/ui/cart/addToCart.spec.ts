import { test, expect } from '../../../fixtures/pageFixtures';

/**
 * Add to Cart Tests
 *
 * Tests for adding products to cart functionality
 * Focuses on the "Add to Cart" action and success modal behavior
 */

test.describe('Add to Cart Functionality', () => {
    test.beforeEach(async ({ homePage, productsPage }) => {
        await homePage.goto();
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();
    });

    test('Verify adding single product, success message, and continue shopping', async ({ productsPage, cartPage }) => {
        // Get first product name for verification
        const productNames = await productsPage.getAllProductNames();
        const firstProductName = productNames[0];

        // Add first product to cart
        await productsPage.addFirstProductToCart();

        // Verify success modal appears with correct buttons
        await expect(productsPage.viewCartButton).toBeVisible();
        await expect(productsPage.continueShoppingButton).toBeVisible();

        // Test Continue Shopping functionality
        await productsPage.continueShopping();

        // Verify we're still on products page and modal is closed
        await expect(productsPage.allProducts).toBeVisible();
        const currentUrl = productsPage.page.url();
        expect(currentUrl).toContain('/products');
        await expect(productsPage.continueShoppingButton).not.toBeVisible();

        // Now go to cart to verify product was added
        await productsPage.page.goto('https://automationexercise.com/view_cart');
        await cartPage.verifyCartPageLoaded();

        // Verify product is in cart
        await cartPage.verifyProductInCart(firstProductName);

        // Verify cart has 1 item
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);
    });

    /**
     * SKIPPED: Adding multiple products test
     *
     * This test is currently disabled due to flakiness caused by:
     * - Sticky navigation bars/banners that block product cards
     * - Inconsistent popup/overlay behavior across different runs
     * - Timing issues with modal animations
     *
     * The functionality works manually, but automated testing is unreliable.
     * This is better tested via API tests for cart management.
     *
     * TODO: Re-enable if the website removes sticky overlays or if we find a more reliable approach
     */
    test.skip('Verify adding multiple products to cart', async ({ productsPage, cartPage, page }) => {
        // Get first two product names
        const productNames = await productsPage.getAllProductNames();
        const firstProductName = productNames[0];
        const secondProductName = productNames[1];

        // Add first product
        await productsPage.addFirstProductToCart();

        // Wait for modal and close it
        await expect(productsPage.continueShoppingButton).toBeVisible();
        await productsPage.continueShopping();

        // Wait for modal to fully close
        await expect(productsPage.continueShoppingButton).not.toBeVisible();

        // Scroll to top to avoid any sticky banners/headers blocking elements
        await page.evaluate(() => window.scrollTo(0, 0));

        // Wait a bit for any animations to complete
        await page.waitForTimeout(500);

        // Scroll second product into view more aggressively
        await productsPage.productCards.nth(1).scrollIntoViewIfNeeded();

        // Add some extra space above to avoid overlays
        await page.evaluate(() => window.scrollBy(0, -100));

        // Add second product
        await productsPage.addToCartByIndex(1);

        // Wait for modal
        await expect(productsPage.viewCartButton).toBeVisible();
        await productsPage.goToCart();

        // Verify cart page loads
        await cartPage.verifyCartPageLoaded();

        // Verify both products are visible in cart (more reliable than counting)
        await cartPage.verifyProductInCart(firstProductName);
        await cartPage.verifyProductInCart(secondProductName);

        // Get all product names in cart and verify we have both
        const cartProducts = await cartPage.getProductNames();
        expect(cartProducts).toContain(firstProductName);
        expect(cartProducts).toContain(secondProductName);
        expect(cartProducts.length).toBeGreaterThanOrEqual(2);
    });
});

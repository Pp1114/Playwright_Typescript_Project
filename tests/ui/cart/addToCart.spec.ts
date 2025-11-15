import { test, expect } from '../../../fixtures/pageFixtures';

/**
 * Add to Cart Tests
 *
 * Tests for adding products to cart functionality
 * Each test is independent and can run in isolation
 */

test.describe('Add to Cart Functionality', () => {
    test.beforeEach(async ({ homePage, productsPage }) => {
        await homePage.goto();
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();
    });

    test('Verify adding single product to cart', async ({ productsPage, cartPage }) => {
        // Get first product name for verification
        const productNames = await productsPage.getAllProductNames();
        const firstProductName = productNames[0];

        // Add first product to cart
        await productsPage.addFirstProductToCart();

        // Wait for modal to appear
        await expect(productsPage.viewCartButton).toBeVisible();

        // Go to cart
        await productsPage.goToCart();

        // Verify cart page loads
        await cartPage.verifyCartPageLoaded();

        // Verify product is in cart
        await cartPage.verifyProductInCart(firstProductName);

        // Verify cart has 1 item
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);
    });

    test('Verify "Continue Shopping" functionality', async ({ productsPage }) => {
        // Add product to cart
        await productsPage.addFirstProductToCart();

        // Wait for modal to appear
        await expect(productsPage.continueShoppingButton).toBeVisible();

        // Click Continue Shopping
        await productsPage.continueShopping();

        // Verify we're still on products page
        await expect(productsPage.allProducts).toBeVisible();
        const currentUrl = productsPage.page.url();
        expect(currentUrl).toContain('/products');

        // Verify modal is closed
        await expect(productsPage.continueShoppingButton).not.toBeVisible();
    });

    test('Verify removing product from cart and empty cart state', async ({ productsPage, cartPage }) => {
        // Add a product to cart first
        await productsPage.addFirstProductToCart();
        await expect(productsPage.viewCartButton).toBeVisible();
        await productsPage.goToCart();

        // Verify cart has 1 item
        await cartPage.verifyCartPageLoaded();
        let itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // Remove the product from cart
        await cartPage.removeProduct(0);

        // Verify cart is now empty
        itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);

        // Verify empty cart state
        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBeTruthy();
    });
});

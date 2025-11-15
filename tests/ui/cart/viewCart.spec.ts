import { test, expect } from '../../../fixtures/pageFixtures';

/**
 * View and Manage Cart Tests
 *
 * Tests for viewing cart contents and managing products in cart
 * Each test is independent and can run in isolation
 */

test.describe('View and Manage Cart', () => {
    test.beforeEach(async ({ homePage, productsPage }) => {
        await homePage.goto();
        await homePage.clickProductsLink();
        await productsPage.waitForProductsToLoad();
    });

    test('Verify product details in cart (image, name, price, quantity)', async ({ productsPage, cartPage }) => {
        // Add product to cart
        await productsPage.addFirstProductToCart();
        await expect(productsPage.viewCartButton).toBeVisible();
        await productsPage.goToCart();

        // Verify cart page loaded
        await cartPage.verifyCartPageLoaded();

        // Verify product details are visible
        await cartPage.verifyProductDetailsVisible();

        // Verify specific elements
        await expect(cartPage.productImages.first()).toBeVisible();
        await expect(cartPage.productNames.first()).toBeVisible();
        await expect(cartPage.productPrices.first()).toBeVisible();
        await expect(cartPage.productQuantities.first()).toBeVisible();
    });

    test('Verify total price calculation is correct', async ({ productsPage, cartPage }) => {
        // Add product to cart
        await productsPage.addFirstProductToCart();
        await expect(productsPage.viewCartButton).toBeVisible();
        await productsPage.goToCart();

        // Verify cart page loaded
        await cartPage.verifyCartPageLoaded();

        // Verify total price calculation
        const cartData = await cartPage.getCartData();

        // Manual calculation
        let expectedTotal = 0;
        cartData.products.forEach(product => {
            const price = cartPage.parsePriceToNumber(product.price);
            const total = price * product.quantity;
            expectedTotal += total;
        });

        const actualTotal = cartPage.parsePriceToNumber(cartData.totalPrice);
        expect(actualTotal).toBe(expectedTotal);
    });

    test('Verify quantity is displayed correctly', async ({ productsPage, cartPage }) => {
        // Add product to cart
        await productsPage.addFirstProductToCart();
        await expect(productsPage.viewCartButton).toBeVisible();
        await productsPage.goToCart();

        // Verify cart page loaded
        await cartPage.verifyCartPageLoaded();

        // Get quantity
        const quantity = await cartPage.getProductQuantity(0);

        // Verify quantity is 1 (default when adding single product)
        expect(quantity).toBe(1);
    });

    test('Verify product can be removed from cart', async ({ productsPage, cartPage }) => {
        // Add product to cart
        await productsPage.addFirstProductToCart();
        await expect(productsPage.viewCartButton).toBeVisible();
        await productsPage.goToCart();

        // Verify cart has 1 item
        await cartPage.verifyCartPageLoaded();
        const initialCount = await cartPage.getCartItemCount();
        expect(initialCount).toBe(1);

        // Get product name before removing
        const productNames = await cartPage.getProductNames();
        const firstProductName = productNames[0];

        // Remove the product
        await cartPage.removeProduct(0);

        // Wait for page to update
        await cartPage.page.waitForTimeout(1000);

        // Verify cart is now empty
        const finalCount = await cartPage.getCartItemCount();
        expect(finalCount).toBe(0);

        // Verify the product is no longer in cart
        const updatedProductNames = await cartPage.getProductNames();
        const stillExists = updatedProductNames.some(name => name === firstProductName);
        expect(stillExists).toBeFalsy();
    });

    test('Verify empty cart message when no items', async ({ cartPage }) => {
        // Go directly to cart page without adding products
        await cartPage.goto();

        // Verify cart is empty
        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBeTruthy();

        // Verify cart has 0 items
        const itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);
    });

    test('Verify Proceed to Checkout button is visible', async ({ productsPage, cartPage }) => {
        // Add product to cart
        await productsPage.addFirstProductToCart();
        await expect(productsPage.viewCartButton).toBeVisible();
        await productsPage.goToCart();

        // Verify cart page loaded
        await cartPage.verifyCartPageLoaded();

        // Verify checkout button is visible
        await cartPage.verifyCheckoutButtonVisible();
        await expect(cartPage.proceedToCheckoutButton).toBeVisible();
    });
});

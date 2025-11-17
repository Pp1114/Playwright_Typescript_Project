import { test, expect } from '../../../fixtures/pageFixtures';

/**
 * View and Manage Cart Tests
 *
 * Tests for viewing cart contents and managing cart operations
 * Tests assume products are already added to cart (done in beforeEach)
 */

test.describe('View and Manage Cart', () => {
    test.beforeEach(async ({ productsPage, page }) => {
        // Navigate directly to products page (faster than home → products)
        await productsPage.goto();
        await productsPage.waitForProductsToLoad();

        // Add a product to cart
        await productsPage.addFirstProductToCart();
        await expect(productsPage.viewCartButton).toBeVisible();

        // Navigate directly to cart (faster than clicking modal button)
        await page.goto('https://automationexercise.com/view_cart');
        await expect(page).toHaveURL(/view_cart/);
    });

    test('Verify product details in cart (image, name, price, quantity)', async ({ cartPage }) => {
        // Verify product details are visible
        await cartPage.verifyProductDetailsVisible();

        // Verify specific elements
        await expect(cartPage.productImages.first()).toBeVisible();
        await expect(cartPage.productNames.first()).toBeVisible();
        await expect(cartPage.productPrices.first()).toBeVisible();
        await expect(cartPage.productQuantities.first()).toBeVisible();
    });

    test('Verify total price calculation is correct', async ({ cartPage }) => {
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

    test('Verify quantity is displayed correctly', async ({ cartPage }) => {
        // Get quantity
        const quantity = await cartPage.getProductQuantity(0);

        // Verify quantity is 1 (default when adding single product)
        expect(quantity).toBe(1);
    });

    test('Verify Proceed to Checkout button is visible', async ({ cartPage }) => {
        // Verify checkout button is visible
        await cartPage.verifyCheckoutButtonVisible();
        await expect(cartPage.proceedToCheckoutButton).toBeVisible();
    });

    test('Verify removing product from cart and empty cart message', async ({ cartPage }) => {
        // Verify cart has 1 item initially
        let itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // Remove the product from cart
        await cartPage.removeProduct(0);

        // Verify cart is now empty (0 items)
        itemCount = await cartPage.getCartItemCount();
        expect(itemCount).toBe(0);

        // Get and verify the empty cart message text
        const emptyMessage = await cartPage.getEmptyCartMessage();
        console.log('Empty cart message:', emptyMessage);
        expect(emptyMessage).toContain('Cart is empty!');
    });
});

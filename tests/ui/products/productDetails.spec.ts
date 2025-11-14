import { test, expect } from '../../../fixtures/pageFixtures';
import { TIMEOUTS } from '../../../utils/constants';

test.describe('Product Details Tests', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
    });

    test('TC_PROD_006 - Verify product detail page opens on click', async ({ productsPage }) => {
        // Click first product's "View Product" button
        await productsPage.viewFirstProduct();

        // Verify URL changed to product detail page
        await expect(productsPage.page).toHaveURL(/product_details/);

        // Verify we're on a product detail page
        const productInfo = productsPage.page.locator('.product-information');
        await expect(productInfo).toBeVisible();
    });

    test('TC_PROD_010 - Verify Add to Cart button is functional', async ({ productsPage }) => {
        // Add first product to cart
        await productsPage.addFirstProductToCart();

        // Verify modal appears with "Continue Shopping" and "View Cart" options
        await expect(productsPage.continueShoppingButton).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await expect(productsPage.viewCartButton).toBeVisible();
    });
});

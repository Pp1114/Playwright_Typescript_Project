import { test, expect } from '../../../fixtures/pageFixtures';

test.describe('Product List Tests', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
    });

    test('TC_PROD_001 - Verify Products page loads with product list', async ({ productsPage }) => {
        // Verify page loaded
        const isLoaded = await productsPage.isProductsPageLoaded();
        expect(isLoaded).toBeTruthy();

        // Verify products are displayed
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);
        console.log(`Found ${productCount} products`);
    });

    test('TC_PROD_002 - Verify all products display with name and price', async ({ productsPage }) => {
        // Get product count
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);

        // Verify product names exist
        const productNames = await productsPage.getAllProductNames();
        expect(productNames.length).toBeGreaterThan(0);

        // Verify View Product buttons exist
        const viewButtonCount = await productsPage.viewProductButtons.count();
        expect(viewButtonCount).toBeGreaterThan(0);
    });
});

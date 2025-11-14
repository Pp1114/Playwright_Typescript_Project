import { test, expect } from '../../../fixtures/pageFixtures';

test.describe('Product Search Tests', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
    });

    test('TC_PROD_011 - Verify search functionality with valid product name', async ({ productsPage }) => {
        const searchTerm = 'shirt';

        await productsPage.searchProduct(searchTerm);
        await productsPage.validateSearchResultsPage();

        const { productNames, relevant } = await productsPage.getRelevantProducts(searchTerm);

        expect(productNames.length).toBeGreaterThan(0);
        expect(relevant.length).toBeGreaterThan(0);

        console.log(
            `Found ${relevant.length} relevant items out of ${productNames.length} for "${searchTerm}": ${relevant.join(', ')}`
        );
    });

    test('TC_PROD_012 - Verify search with partial product name', async ({ productsPage }) => {
        const searchTerm = 'jean';

        await productsPage.searchProduct(searchTerm);
        await productsPage.validateSearchResultsPage();

        const { productNames, relevant } = await productsPage.getRelevantProducts(searchTerm);

        expect(productNames.length).toBeGreaterThan(0);
        expect(relevant.length).toBeGreaterThan(0);

        console.log(
            `Found ${relevant.length} partial matches for "${searchTerm}": ${relevant.join(', ')}`
        );
    });

    test('TC_PROD_014 - Verify search with no results', async ({ productsPage }) => {
        const searchTerm = 'xyzabc999notfound';

        await productsPage.searchProduct(searchTerm);
        await productsPage.validateSearchResultsPage();

        const productCount = await productsPage.getProductCount();
        expect(productCount).toBe(0);

        console.log(`Verified no products found for: "${searchTerm}"`);
    });
});

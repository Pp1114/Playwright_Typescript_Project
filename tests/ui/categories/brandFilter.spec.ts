import { test, expect } from '../../../fixtures/pageFixtures';

test.describe('Brand Filtering', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
    });

    test('Verify Polo brand filtering', async ({ productsPage, page }) => {
        const targetBrand = 'Polo';

        // Get expected count from sidebar (e.g., "Polo (3)")
        const brandTextWithCount = await productsPage.getBrandWithCount(targetBrand);
        const expectedCount = parseInt(brandTextWithCount.match(/\((\d+)\)/)?.[1] || '0');

        // Click brand
        await productsPage.clickBrand(targetBrand);
        await page.waitForURL(/brand/);

        // Verify brand title
        const categoryTitle = await productsPage.getCategoryTitle();
        expect(categoryTitle).toContain('Brand');
        expect(categoryTitle.toLowerCase()).toContain(targetBrand.toLowerCase());

        // Verify product count matches parenthesis count
        const actualCount = await productsPage.getFilteredProductCount();
        expect(actualCount).toBe(expectedCount);
        console.log(`✓ ${targetBrand} brand: Expected ${expectedCount} products, found ${actualCount} products - MATCH`);
    });

    test('Verify H&M brand filtering', async ({ productsPage, page }) => {
        const targetBrand = 'H&M';

        // Get expected count from sidebar (e.g., "H&M (6)")
        const brandTextWithCount = await productsPage.getBrandWithCount(targetBrand);
        const expectedCount = parseInt(brandTextWithCount.match(/\((\d+)\)/)?.[1] || '0');

        // Click brand
        await productsPage.clickBrand(targetBrand);
        await page.waitForURL(/brand/);

        // Verify brand title
        const categoryTitle = await productsPage.getCategoryTitle();
        expect(categoryTitle).toContain('Brand');
        expect(categoryTitle.toLowerCase()).toContain('h&m');

        // Verify product count matches parenthesis count
        const actualCount = await productsPage.getFilteredProductCount();
        expect(actualCount).toBe(expectedCount);
        console.log(`✓ H&M brand: Expected ${expectedCount} products, found ${actualCount} products - MATCH`);
    });

    test('Verify Madame brand filtering', async ({ productsPage, page }) => {
        const targetBrand = 'Madame';

        // Get expected count from sidebar (e.g., "Madame (5)")
        const brandTextWithCount = await productsPage.getBrandWithCount(targetBrand);
        const expectedCount = parseInt(brandTextWithCount.match(/\((\d+)\)/)?.[1] || '0');

        // Click brand
        await productsPage.clickBrand(targetBrand);
        await page.waitForURL(/brand/);

        // Verify brand title
        const categoryTitle = await productsPage.getCategoryTitle();
        expect(categoryTitle).toContain('Brand');
        expect(categoryTitle.toLowerCase()).toContain('madame');

        // Verify product count matches parenthesis count
        const actualCount = await productsPage.getFilteredProductCount();
        expect(actualCount).toBe(expectedCount);
        console.log(`✓ Madame brand: Expected ${expectedCount} products, found ${actualCount} products - MATCH`);
    });
});

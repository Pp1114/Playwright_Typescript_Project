import { test, expect } from '../../../fixtures/pageFixtures';
import { URLS } from '../../../utils/constants';

test.describe('Category Filtering', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
    });

    test('Verify Women > Dress category filtering', async ({ productsPage, page }) => {
        // Click Women > Dress subcategory
        await productsPage.clickSubcategory('Women', 'Dress');
        await page.waitForURL(URLS.CATEGORY_WOMEN_DRESS);

        // Verify category title
        const categoryTitle = await productsPage.getCategoryTitle();
        expect(categoryTitle).toContain('Women');
        expect(categoryTitle).toContain('Dress');

        // Verify products are dress-related
        const productNames = await productsPage.getAllProductNames();
        console.log('Women > Dress products:', productNames);
        expect(productNames.length).toBeGreaterThan(0);

        const hasDressProducts = productNames.some(name =>
            name.toLowerCase().includes('dress') ||
            name.toLowerCase().includes('gown') ||
            name.toLowerCase().includes('frock')
        );
        expect(hasDressProducts).toBeTruthy();
    });

    test('Verify Men > Tshirts category filtering', async ({ productsPage, page }) => {
        // Click Men > Tshirts subcategory
        await productsPage.clickSubcategory('Men', 'Tshirts');
        await page.waitForURL(URLS.CATEGORY_MEN_TSHIRTS);

        // Verify category title
        const categoryTitle = await productsPage.getCategoryTitle();
        expect(categoryTitle).toContain('Men');
        expect(categoryTitle).toContain('Tshirts');

        // Verify products are t-shirt related
        const productNames = await productsPage.getAllProductNames();
        console.log('Men > Tshirts products:', productNames);
        expect(productNames.length).toBeGreaterThan(0);

        const hasTshirtProducts = productNames.some(name =>
            name.toLowerCase().includes('tshirt') ||
            name.toLowerCase().includes('t-shirt') ||
            name.toLowerCase().includes('shirt')
        );
        expect(hasTshirtProducts).toBeTruthy();
    });

    test('Verify Kids > Dress category filtering', async ({ productsPage, page }) => {
        // Click Kids > Dress subcategory
        await productsPage.clickSubcategory('Kids', 'Dress');
        await page.waitForURL(URLS.CATEGORY_KIDS_DRESS);

        // Verify category title
        const categoryTitle = await productsPage.getCategoryTitle();
        expect(categoryTitle).toContain('Kids');
        expect(categoryTitle).toContain('Dress');

        // Verify products displayed
        const productNames = await productsPage.getAllProductNames();
        console.log('Kids > Dress products:', productNames);
        expect(productNames.length).toBeGreaterThan(0);
    });
});

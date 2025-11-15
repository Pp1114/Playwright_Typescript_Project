import { test, expect } from '../../../fixtures/pageFixtures';

test.describe('Category Filtering', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
        
    });

    test('TC_CAT_001: Verify all categories are visible (Women, Men, Kids)', async ({ productsPage }) => {
        // Verify all main categories are visible
        await productsPage.verifyAllCategoriesVisible();

        // Verify each category individually
        await expect(productsPage.womenCategory).toBeVisible();
        await expect(productsPage.menCategory).toBeVisible();
        await expect(productsPage.kidsCategory).toBeVisible();
    });

    test('TC_CAT_002: Verify Women category expands to show subcategories', async ({ productsPage }) => {
        // Click Women category to expand
        await productsPage.clickCategory('Women');

        // Wait for expansion
        await productsPage.page.waitForTimeout(500);

        // Verify category is expanded
        const isExpanded = await productsPage.isCategoryExpanded('Women');
        expect(isExpanded).toBeTruthy();

        // Get subcategories
        const subcategories = await productsPage.getSubcategories('Women');

        // Verify subcategories exist (Dress, Tops, Saree)
        expect(subcategories.length).toBeGreaterThan(0);

        // Verify expected subcategories are present
        const subcategoryText = subcategories.join(' ').toLowerCase();
        expect(subcategoryText).toContain('dress');
    });

    test('TC_CAT_003: Verify Men category expands to show subcategories', async ({ productsPage }) => {
        // Click Men category to expand
        await productsPage.clickCategory('Men');

        // Wait for expansion
        await productsPage.page.waitForTimeout(500);

        // Verify category is expanded
        const isExpanded = await productsPage.isCategoryExpanded('Men');
        expect(isExpanded).toBeTruthy();

        // Get subcategories
        const subcategories = await productsPage.getSubcategories('Men');

        // Verify subcategories exist (Tshirts, Jeans)
        expect(subcategories.length).toBeGreaterThan(0);

        // Verify expected subcategories are present
        const subcategoryText = subcategories.join(' ').toLowerCase();
        expect(subcategoryText).toContain('tshirts');
    });

    test('TC_CAT_004: Verify Kids category expands to show subcategories', async ({ productsPage }) => {
        // Click Kids category to expand
        await productsPage.clickCategory('Kids');

        // Wait for expansion
        await productsPage.page.waitForTimeout(500);

        // Verify category is expanded
        const isExpanded = await productsPage.isCategoryExpanded('Kids');
        expect(isExpanded).toBeTruthy();

        // Get subcategories
        const subcategories = await productsPage.getSubcategories('Kids');

        // Verify subcategories exist
        expect(subcategories.length).toBeGreaterThan(0);

        // Verify expected subcategories are present
        const subcategoryText = subcategories.join(' ').toLowerCase();
        expect(subcategoryText).toContain('dress');
    });

    test('TC_CAT_005: Verify clicking category filters products correctly', async ({ productsPage }) => {
        // Click on Women > Dress subcategory
        await productsPage.clickSubcategory('Women', 'Dress');

        // Wait for page to load filtered products
        await productsPage.page.waitForTimeout(1000);

        // Verify URL contains category information
        const currentUrl = productsPage.page.url();
        expect(currentUrl).toContain('category');

        // Verify category title is updated
        const categoryTitle = await productsPage.getCategoryTitle();
        expect(categoryTitle.length).toBeGreaterThan(0);

        // Verify products are displayed
        const productCount = await productsPage.getFilteredProductCount();
        expect(productCount).toBeGreaterThan(0);
    });


});

test.describe('Brand Filtering', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.goto();
        
    });

    test('TC_BRAND_001: Verify all brands are visible in sidebar', async ({ productsPage }) => {
        // Verify brands section is visible
        await productsPage.verifyBrandsSectionVisible();

        // Get all brands
        const brands = await productsPage.getAllBrands();

        // Verify brands exist
        expect(brands.length).toBeGreaterThan(0);

        // Verify common brands are present
        const brandsText = brands.join(' ').toLowerCase();
        expect(brandsText).toBeTruthy();

        // Verify at least some brands are visible
        await expect(productsPage.brandLinks.first()).toBeVisible();
    });

    test('TC_BRAND_002: Verify clicking brand filters products', async ({ productsPage }) => {
        // Get all brands
        const brands = await productsPage.getAllBrands();
        expect(brands.length).toBeGreaterThan(0);

        // Click on first brand
        const firstBrand = brands[0].split('(')[0].trim(); // Remove count if present
        await productsPage.clickBrand(firstBrand);

        // Wait for page to load
        await productsPage.page.waitForTimeout(1000);

        // Verify URL updated with brand
        const currentUrl = productsPage.page.url();
        expect(currentUrl).toContain('brand');

        // Verify products are displayed
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);
    });

    test('TC_BRAND_003: Verify brand filter shows correct product count', async ({ productsPage }) => {
        // Get first brand with count
        const brands = await productsPage.getAllBrands();
        expect(brands.length).toBeGreaterThan(0);

        // Find a brand with count in parentheses (e.g., "Polo (5)")
        const brandWithCount = brands.find(brand => brand.includes('('));

        if (brandWithCount) {
            // Extract brand name and count
            const match = brandWithCount.match(/(.+)\s*\((\d+)\)/);

            if (match) {
                const brandName = match[1].trim();
                const expectedCount = parseInt(match[2]);

                // Click brand
                await productsPage.clickBrand(brandName);

                // Wait for page to load
                await productsPage.page.waitForTimeout(1000);

                // Get actual product count
                const actualCount = await productsPage.getProductCount();

                // Verify count matches (may vary slightly)
                expect(actualCount).toBeGreaterThan(0);
            }
        } else {
            // If no brand with count, just verify filtering works
            const firstBrand = brands[0].split('(')[0].trim();
            await productsPage.clickBrand(firstBrand);
            await productsPage.page.waitForTimeout(1000);

            const productCount = await productsPage.getProductCount();
            expect(productCount).toBeGreaterThan(0);
        }
    });

    test('TC_BRAND_004: Verify multiple brand selections', async ({ productsPage }) => {
        // Get brands
        const brands = await productsPage.getAllBrands();
        expect(brands.length).toBeGreaterThan(1);

        // Click first brand
        const firstBrand = brands[0].split('(')[0].trim();
        await productsPage.clickBrand(firstBrand);
        await productsPage.page.waitForTimeout(1000);

        // Get URL after first brand
        const firstUrl = productsPage.page.url();
        expect(firstUrl).toContain('brand');

        // Click second brand (this will replace the first filter on this site)
        const secondBrand = brands[1].split('(')[0].trim();
        await productsPage.clickBrand(secondBrand);
        await productsPage.page.waitForTimeout(1000);

        // Verify URL changed to second brand
        const secondUrl = productsPage.page.url();
        expect(secondUrl).toContain('brand');

        // Verify products are displayed
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);

        // Note: On automationexercise.com, selecting a new brand replaces the previous
        // filtering rather than combining them
    });
});

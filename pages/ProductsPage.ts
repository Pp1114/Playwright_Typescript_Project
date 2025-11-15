import { Page, Locator,expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../utils/constants';

export class ProductsPage extends BasePage {
    // Search elements
    readonly searchBox: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsTitle: Locator;

    // Product list elements
    readonly allProducts: Locator;
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly viewProductButtons: Locator;
    readonly addToCartButtons: Locator;

    // Category sidebar
    readonly womenCategory: Locator;
    readonly menCategory: Locator;
    readonly kidsCategory: Locator;

    // Category subcategories
    readonly categorySubcategories: Locator;

    // Category title and breadcrumb
    readonly categoryTitle: Locator;
    readonly breadcrumb: Locator;

    // Brand sidebar
    readonly brandsSection: Locator;
    readonly brandLinks: Locator;

    // Product detail modal (appears after add to cart)
    readonly continueShoppingButton: Locator;
    readonly viewCartButton: Locator;

    constructor(page: Page) {
        super(page);

        // Search elements
        this.searchBox = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.searchedProductsTitle = page.locator('.title.text-center');

        // Product list elements
        this.allProducts = page.locator('.features_items');
        this.productCards = page.locator('.product-image-wrapper');
        this.productNames = page.locator('.productinfo p');
        this.productPrices = page.locator('.productinfo h2');
        this.viewProductButtons = page.locator('.choose a').filter({ hasText: 'View Product' });
        this.addToCartButtons = page.locator('.product-image-wrapper .add-to-cart');

        // Category sidebar
        this.womenCategory = page.locator('a[href="#Women"]');
        this.menCategory = page.locator('a[href="#Men"]');
        this.kidsCategory = page.locator('a[href="#Kids"]');

        // Category subcategories
        this.categorySubcategories = page.locator('.panel-body ul li a');

        // Category title and breadcrumb
        this.categoryTitle = page.locator('.title.text-center, .features_items .title');
        this.breadcrumb = page.locator('.breadcrumbs, ol.breadcrumb');

        // Brand sidebar
        this.brandsSection = page.locator('.brands_products');
        this.brandLinks = page.locator('.brands-name li a');

        // Modal elements
        this.continueShoppingButton = page.locator('button[data-dismiss="modal"]');
        this.viewCartButton = page.locator('text=View Cart');
    }

    /**
     * Navigate to products page
     */
    async goto() {
        await super.goto(URLS.PRODUCTS);
    }

    /**
     * Wait for products to load on the page
     */
    async waitForProductsToLoad() {
        await this.allProducts.waitFor({ state: 'visible' });
    }

    /**
     * Search for a product
     * @param productName - Name of product to search
     */
    async searchProduct(productName: string) {
        await this.searchBox.fill(productName);
        await this.searchButton.click();
    }

    /**
     * Get count of all products displayed
     */
    async getProductCount(): Promise<number> {
        return await this.productCards.count();
    }

    /**
     * Get all product names visible on page
     */
    async getAllProductNames(): Promise<string[]> {
        const names = await this.productNames.allTextContents();
        return names;
    }

    /**
     * Click "View Product" button for a specific product by index
     * @param index - Product index (0-based)
     */
    async viewProductByIndex(index: number) {
        await this.viewProductButtons.nth(index).click();
    }

    /**
     * Click "View Product" button for first product
     */
    async viewFirstProduct() {
        await this.viewProductButtons.first().click();
    }

    /**
     * Add product to cart by index
     * @param index - Product index (0-based)
     */
    async addToCartByIndex(index: number) {
        // Scroll product into view first to avoid overlays
        await this.productCards.nth(index).scrollIntoViewIfNeeded();

        // Hover over product to make "Add to cart" button visible
        await this.productCards.nth(index).hover();

        // Wait for button to be actionable (handles animations/overlays)
        await this.addToCartButtons.nth(index).waitFor({ state: 'visible' });

        // Click add to cart button
        await this.addToCartButtons.nth(index).click({ force: true });
    }

    /**
     * Add first product to cart
     */
    async addFirstProductToCart() {
        // Scroll product into view first to avoid overlays
        await this.productCards.first().scrollIntoViewIfNeeded();

        // Hover over product to make "Add to cart" button visible
        await this.productCards.first().hover();

        // Wait for button to be actionable (handles animations/overlays)
        await this.addToCartButtons.first().waitFor({ state: 'visible' });

        // Click add to cart button
        await this.addToCartButtons.first().click({ force: true });
    }

    /**
     * Continue shopping after adding to cart (closes modal)
     */
    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    /**
     * Go to cart after adding product
     */
    async goToCart() {
        await this.viewCartButton.click();
    }

    /**
     * Click on a category
     * @param category - 'Women', 'Men', or 'Kids'
     */
    async clickCategory(category: 'Women' | 'Men' | 'Kids') {
        switch (category) {
            case 'Women':
                await this.womenCategory.click();
                break;
            case 'Men':
                await this.menCategory.click();
                break;
            case 'Kids':
                await this.kidsCategory.click();
                break;
        }
    }

    /**
     * Click on a brand filter
     * @param brandName - Name of the brand
     */
    async clickBrand(brandName: string) {
        await this.page.locator(`.brands-name li a:has-text("${brandName}")`).click();
    }

    /**
     * Check if products page loaded successfully
     */
    async isProductsPageLoaded(): Promise<boolean> {
        return await this.allProducts.isVisible();
    }

    /**
     * Verify search results are displayed
     */
    async areSearchResultsVisible(): Promise<boolean> {
        return await this.searchedProductsTitle.isVisible();
    }

    /**
     * Get search results title text
     */
    async getSearchResultsTitle(): Promise<string> {
        return await this.searchedProductsTitle.textContent() || '';
    }
        /**
     * Validate the basic elements of the search results page
     */
    async validateSearchResultsPage() {
        const visible = await this.areSearchResultsVisible();
        expect(visible).toBeTruthy();

        const title = await this.getSearchResultsTitle();
        expect(title).toContain('Searched Products');
    }

    /**
     * Return all product names + only the ones matching the search term
     * @param searchTerm - Search keyword
     */
    async getRelevantProducts(searchTerm: string) {
        const productNames = await this.getAllProductNames();

        const relevant = productNames.filter(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return { productNames, relevant };
    }

    /**
     * Click on a subcategory within a category
     * @param category - 'Women', 'Men', or 'Kids'
     * @param subcategory - Subcategory name (e.g., 'Dress', 'Tops', 'Tshirts')
     */
    async clickSubcategory(category: 'Women' | 'Men' | 'Kids', subcategory: string) {
        // First expand the category
        await this.clickCategory(category);

        // Wait for subcategories to expand
        await this.page.waitForTimeout(500);

        // Click the subcategory
        await this.page.locator(`.panel-body a:has-text("${subcategory}")`).first().click();
    }

    /**
     * Get all visible subcategories for a category
     * @param category - 'Women', 'Men', or 'Kids'
     */
    async getSubcategories(category: 'Women' | 'Men' | 'Kids'): Promise<string[]> {
        // Expand category if not already expanded
        const categorySelector = category === 'Women' ? '#Women' :
                                 category === 'Men' ? '#Men' : '#Kids';

        const isExpanded = await this.page.locator(`${categorySelector}.in`).isVisible().catch(() => false);

        if (!isExpanded) {
            await this.clickCategory(category);
            await this.page.waitForTimeout(500);
        }

        const subcategoryLinks = this.page.locator(`${categorySelector} .panel-body a`);
        const subcategories = await subcategoryLinks.allTextContents();
        return subcategories.map(s => s.trim());
    }

    /**
     * Verify category title displays correctly
     * @param expectedCategory - Expected category text
     */
    async verifyCategoryTitle(expectedCategory: string) {
        const titleText = await this.categoryTitle.textContent() || '';
        expect(titleText.toLowerCase()).toContain(expectedCategory.toLowerCase());
    }

    /**
     * Get current category title text
     */
    async getCategoryTitle(): Promise<string> {
        return await this.categoryTitle.textContent() || '';
    }

    /**
     * Verify breadcrumb navigation
     * @param expectedPath - Expected breadcrumb text
     */
    async verifyBreadcrumb(expectedPath: string) {
        const breadcrumbText = await this.breadcrumb.textContent() || '';
        expect(breadcrumbText).toContain(expectedPath);
    }

    /**
     * Get product count after filtering
     */
    async getFilteredProductCount(): Promise<number> {
        return await this.getProductCount();
    }

    /**
     * Verify all main categories are visible
     */
    async verifyAllCategoriesVisible() {
        await expect(this.womenCategory).toBeVisible();
        await expect(this.menCategory).toBeVisible();
        await expect(this.kidsCategory).toBeVisible();
    }

    /**
     * Verify brands section is visible
     */
    async verifyBrandsSectionVisible() {
        await expect(this.brandsSection).toBeVisible();
    }

    /**
     * Get all brand names from sidebar
     */
    async getAllBrands(): Promise<string[]> {
        const brandTexts = await this.brandLinks.allTextContents();
        return brandTexts.map(brand => brand.trim());
    }

    /**
     * Get brand name with product count (e.g., "Polo (5)")
     * @param brandName - Brand name
     */
    async getBrandWithCount(brandName: string): Promise<string> {
        const brandLocator = this.page.locator(`.brands-name li a:has-text("${brandName}")`).first();
        return await brandLocator.textContent() || '';
    }

    /**
     * Verify category is expanded
     * @param category - 'Women', 'Men', or 'Kids'
     */
    async isCategoryExpanded(category: 'Women' | 'Men' | 'Kids'): Promise<boolean> {
        const categoryId = category === 'Women' ? '#Women' :
                          category === 'Men' ? '#Men' : '#Kids';

        try {
            return await this.page.locator(`${categoryId}.in`).isVisible({ timeout: 2000 });
        } catch {
            return false;
        }
    }

}
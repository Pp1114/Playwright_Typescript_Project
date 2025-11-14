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
        this.productCards = page.locator('.single-products');
        this.productNames = page.locator('.productinfo p');
        this.productPrices = page.locator('.productinfo h2');
        this.viewProductButtons = page.locator('.choose a').filter({ hasText: 'View Product' });
        this.addToCartButtons = page.locator('.productinfo a').filter({ hasText: 'Add to cart' });

        // Category sidebar
        this.womenCategory = page.locator('a[href="#Women"]');
        this.menCategory = page.locator('a[href="#Men"]');
        this.kidsCategory = page.locator('a[href="#Kids"]');

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
        // Hover over product to make "Add to cart" button visible
        await this.productCards.nth(index).hover();
        await this.addToCartButtons.nth(index).click();
    }

    /**
     * Add first product to cart
     */
    async addFirstProductToCart() {
        await this.productCards.first().hover();
        await this.addToCartButtons.first().click();
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

}
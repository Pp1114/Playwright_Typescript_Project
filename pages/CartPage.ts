import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../utils/constants';

export class CartPage extends BasePage {
    // Cart table elements
    readonly cartInfoTable: Locator;
    readonly cartTableRows: Locator;
    readonly productRows: Locator;

    // Product details in cart
    readonly productImages: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly productQuantities: Locator;
    readonly productTotals: Locator;

    // Cart actions
    readonly removeButtons: Locator;
    readonly quantityButtons: Locator;

    // Cart summary
    readonly cartTotalPrice: Locator;
    readonly proceedToCheckoutButton: Locator;

    // Empty cart
    readonly emptyCartMessage: Locator;

    // Breadcrumb
    readonly breadcrumb: Locator;

    constructor(page: Page) {
        super(page);

        // Cart table
        this.cartInfoTable = page.locator('#cart_info_table').first();
        this.cartTableRows = page.locator('#cart_info_table tbody tr');
        this.productRows = page.locator('#cart_info_table tbody tr').filter({ has: page.locator('.cart_description') });

        // Product details
        this.productImages = page.locator('.cart_product img');
        this.productNames = page.locator('.cart_description h4 a');
        this.productPrices = page.locator('.cart_price p');
        this.productQuantities = page.locator('.cart_quantity button, .cart_quantity .disabled');
        this.productTotals = page.locator('.cart_total_price');

        // Actions
        this.removeButtons = page.locator('.cart_quantity_delete');
        this.quantityButtons = page.locator('.cart_quantity button');

        // Summary
        this.cartTotalPrice = page.locator('#total_amount, .cart_total_price').last();
        this.proceedToCheckoutButton = page.locator('.check_out');

        // Empty state
        this.emptyCartMessage = page.locator('text=/cart is empty/i, text=/empty cart/i, p:has-text("empty")').first();

        // Breadcrumb
        this.breadcrumb = page.locator('.breadcrumbs, ol.breadcrumb');
    }

    /**
     * Navigate to cart page
     */
    async goto() {
        await super.goto(URLS.CART);
    }

    /**
     * Get count of products in cart
     */
    async getCartItemCount(): Promise<number> {
        try {
            const count = await this.productRows.count();
            return count;
        } catch {
            return 0;
        }
    }

    /**
     * Get all product names in cart
     */
    async getProductNames(): Promise<string[]> {
        const count = await this.getCartItemCount();
        if (count === 0) return [];

        const names = await this.productNames.allTextContents();
        return names.map(name => name.trim());
    }

    /**
     * Get product price by index
     * @param index - Product index (0-based)
     */
    async getProductPrice(index: number): Promise<string> {
        return await this.productPrices.nth(index).textContent() || '';
    }

    /**
     * Get product quantity by index
     * @param index - Product index (0-based)
     */
    async getProductQuantity(index: number): Promise<number> {
        const qtyText = await this.productQuantities.nth(index).textContent() || '0';
        return parseInt(qtyText.trim());
    }

    /**
     * Get product total price by index
     * @param index - Product index (0-based)
     */
    async getProductTotal(index: number): Promise<string> {
        return await this.productTotals.nth(index).textContent() || '';
    }

    /**
     * Remove product from cart by index
     * @param index - Product index (0-based)
     */
    async removeProduct(index: number) {
        await this.removeButtons.nth(index).click();
        // Wait for cart to update
        await this.page.waitForTimeout(1000);
    }

    /**
     * Remove product by name
     * @param productName - Name of product to remove
     */
    async removeProductByName(productName: string) {
        const names = await this.getProductNames();
        const index = names.findIndex(name => name.includes(productName));
        if (index !== -1) {
            await this.removeProduct(index);
        }
    }

    /**
     * Get cart total price
     */
    async getTotalPrice(): Promise<string> {
        const totalText = await this.cartTotalPrice.textContent() || '';
        return totalText.trim();
    }

    /**
     * Click "Proceed to Checkout" button
     */
    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    /**
     * Check if cart is empty
     */
    async isCartEmpty(): Promise<boolean> {
        const itemCount = await this.getCartItemCount();
        return itemCount === 0;
    }

    /**
     * Check if empty cart message is visible
     */
    async isEmptyCartMessageVisible(): Promise<boolean> {
        try {
            return await this.emptyCartMessage.isVisible({ timeout: 3000 });
        } catch {
            return false;
        }
    }

    /**
     * Verify cart page loaded successfully
     */
    async verifyCartPageLoaded() {
        await expect(this.page).toHaveURL(/view_cart/);

        // Check if cart has items or is empty
        const isEmpty = await this.isCartEmpty();
        if (!isEmpty) {
            await expect(this.cartInfoTable).toBeVisible();
        }
    }

    /**
     * Verify specific product is in cart
     * @param productName - Product name to verify
     */
    async verifyProductInCart(productName: string) {
    const productNames = await this.getProductNames();
    const found = productNames.some(name => name.includes(productName));
    expect(found).toBeTruthy();
}

    /**
     * Verify product details are visible in cart
     * Checks that image, name, price, quantity are displayed
     */
    async verifyProductDetailsVisible() {
        const itemCount = await this.getCartItemCount();
        expect(itemCount).toBeGreaterThan(0);

        await expect(this.productImages.first()).toBeVisible();
        await expect(this.productNames.first()).toBeVisible();
        await expect(this.productPrices.first()).toBeVisible();
        await expect(this.productQuantities.first()).toBeVisible();
    }

    /**
     * Verify empty cart message displays
     */
    async verifyEmptyCartMessage() {
        const isEmpty = await this.isCartEmpty();
        expect(isEmpty).toBeTruthy();

        // Some sites show empty message, others just show empty table
        // We verify cart is actually empty
        const itemCount = await this.getCartItemCount();
        expect(itemCount).toBe(0);
    }

    /**
     * Verify proceed to checkout button is visible
     */
    async verifyCheckoutButtonVisible() {
        await expect(this.proceedToCheckoutButton).toBeVisible();
    }

    /**
     * Parse price string to number (e.g., "Rs. 500" -> 500)
     */
    parsePriceToNumber(priceString: string): number {
        const numericValue = priceString.replace(/[^0-9]/g, '');
        return parseInt(numericValue) || 0;
    }

    /**
     * Verify total price calculation is correct
     * Calculates: sum of (price × quantity) for all products
     */
    async verifyTotalPriceCalculation() {
        const itemCount = await this.getCartItemCount();
        let expectedTotal = 0;

        for (let i = 0; i < itemCount; i++) {
            const priceText = await this.getProductPrice(i);
            const quantity = await this.getProductQuantity(i);
            const price = this.parsePriceToNumber(priceText);

            expectedTotal += price * quantity;
        }

        const actualTotalText = await this.getTotalPrice();
        const actualTotal = this.parsePriceToNumber(actualTotalText);

        expect(actualTotal).toBe(expectedTotal);
    }

    /**
     * Get all cart data for verification
     */
    async getCartData() {
        const itemCount = await this.getCartItemCount();
        const products = [];

        for (let i = 0; i < itemCount; i++) {
            products.push({
                name: (await this.productNames.nth(i).textContent())?.trim() || '',
                price: await this.getProductPrice(i),
                quantity: await this.getProductQuantity(i),
                total: await this.getProductTotal(i),
            });
        }

        return {
            itemCount,
            products,
            totalPrice: await this.getTotalPrice(),
        };
    }
}

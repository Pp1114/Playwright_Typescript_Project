import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../utils/constants';

export class CheckoutPage extends BasePage {
    // Address sections
    readonly deliveryAddressSection: Locator;
    readonly billingAddressSection: Locator;
    readonly deliveryAddressDetails: Locator;
    readonly billingAddressDetails: Locator;

    // Order review
    readonly reviewOrderSection: Locator;
    readonly orderItems: Locator;
    readonly orderProductNames: Locator;
    readonly orderProductPrices: Locator;
    readonly orderProductQuantities: Locator;
    readonly orderTotalPrice: Locator;

    // Comment/Message
    readonly commentTextarea: Locator;

    // Actions
    readonly placeOrderButton: Locator;

    // Breadcrumb
    readonly breadcrumb: Locator;

    constructor(page: Page) {
        super(page);

        // Address sections
        this.deliveryAddressSection = page.locator('#address_delivery, .address.delivery');
        this.billingAddressSection = page.locator('#address_invoice, .address.invoice');
        this.deliveryAddressDetails = page.locator('#address_delivery ul li, #address_delivery .address_details');
        this.billingAddressDetails = page.locator('#address_invoice ul li, #address_invoice .address_details');

        // Order review
        this.reviewOrderSection = page.locator('#cart_info, .cart_info');
        this.orderItems = page.locator('#cart_info tbody tr, .cart_info tbody tr');
        this.orderProductNames = page.locator('.cart_description h4 a');
        this.orderProductPrices = page.locator('.cart_price p');
        this.orderProductQuantities = page.locator('.cart_quantity button, .cart_quantity .disabled');
        this.orderTotalPrice = page.locator('.cart_total_price').last();

        // Comment
        this.commentTextarea = page.locator('textarea[name="message"], .form-control.textarea');

        // Actions
        this.placeOrderButton = page.locator('a[href="/payment"]').filter({ hasText: 'Place Order' });

        // Breadcrumb
        this.breadcrumb = page.locator('.breadcrumbs, ol.breadcrumb');
    }

    /**
     * Navigate to checkout page
     */
    async goto() {
        await super.goto(URLS.CHECKOUT);
    }

    /**
     * Add comment/message for order
     * @param message - Order comment text
     */
    async addOrderComment(message: string) {
        await this.commentTextarea.fill(message);
    }

    /**
     * Click "Place Order" button
     */
    async placeOrder() {
        await this.placeOrderButton.click();
    }

    /**
     * Get delivery address text
     */
    async getDeliveryAddress(): Promise<string[]> {
        const addressLines = await this.deliveryAddressDetails.allTextContents();
        return addressLines.map(line => line.trim()).filter(line => line.length > 0);
    }

    /**
     * Get billing address text
     */
    async getBillingAddress(): Promise<string[]> {
        const addressLines = await this.billingAddressDetails.allTextContents();
        return addressLines.map(line => line.trim()).filter(line => line.length > 0);
    }

    /**
     * Get all order item names
     */
    async getOrderItemNames(): Promise<string[]> {
        const names = await this.orderProductNames.allTextContents();
        return names.map(name => name.trim());
    }

    /**
     * Get count of items in order review
     */
    async getOrderItemCount(): Promise<number> {
        return await this.orderProductNames.count();
    }

    /**
     * Verify checkout page loaded successfully
     */
    async verifyCheckoutPageLoaded() {
        await expect(this.page).toHaveURL(/checkout/);
        await expect(this.deliveryAddressSection).toBeVisible();
        await expect(this.reviewOrderSection).toBeVisible();
    }

    /**
     * Verify delivery address section displays
     */
    async verifyDeliveryAddressVisible() {
        await expect(this.deliveryAddressSection).toBeVisible();

        const addressLines = await this.getDeliveryAddress();
        expect(addressLines.length).toBeGreaterThan(0);
    }

    /**
     * Verify billing address section displays
     */
    async verifyBillingAddressVisible() {
        await expect(this.billingAddressSection).toBeVisible();

        const addressLines = await this.getBillingAddress();
        expect(addressLines.length).toBeGreaterThan(0);
    }

    /**
     * Verify order review section shows all items
     * @param expectedItemCount - Expected number of items (optional)
     */
    async verifyOrderReviewItems(expectedItemCount?: number) {
        await expect(this.reviewOrderSection).toBeVisible();

        const itemCount = await this.getOrderItemCount();
        expect(itemCount).toBeGreaterThan(0);

        if (expectedItemCount !== undefined) {
            expect(itemCount).toBe(expectedItemCount);
        }
    }

    /**
     * Verify comment textarea is visible and functional
     */
    async verifyCommentBoxVisible() {
        await expect(this.commentTextarea).toBeVisible();
        await expect(this.commentTextarea).toBeEditable();
    }

    /**
     * Verify place order button is visible
     */
    async verifyPlaceOrderButtonVisible() {
        await expect(this.placeOrderButton).toBeVisible();
    }

    /**
     * Verify specific product is in order review
     * @param productName - Product name to verify
     */
    async verifyProductInOrder(productName: string) {
        const productNames = await this.getOrderItemNames();
        const found = productNames.some(name => name.includes(productName));
        expect(found).toBeTruthy();
    }

    /**
     * Get complete checkout data for verification
     */
    async getCheckoutData() {
        return {
            deliveryAddress: await this.getDeliveryAddress(),
            billingAddress: await this.getBillingAddress(),
            orderItems: await this.getOrderItemNames(),
            itemCount: await this.getOrderItemCount(),
        };
    }
}

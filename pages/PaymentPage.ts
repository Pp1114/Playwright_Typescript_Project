import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaymentPage extends BasePage {
    // Payment form fields
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;

    // Actions
    readonly payAndConfirmButton: Locator;

    // Success message
    readonly orderSuccessMessage: Locator;
    readonly orderPlacedMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Payment form fields
        this.nameOnCardInput = page.locator('input[name="name_on_card"], input[data-qa="name-on-card"]');
        this.cardNumberInput = page.locator('input[name="card_number"], input[data-qa="card-number"]');
        this.cvcInput = page.locator('input[name="cvc"], input[data-qa="cvc"]');
        this.expiryMonthInput = page.locator('input[name="expiry_month"], input[data-qa="expiry-month"]');
        this.expiryYearInput = page.locator('input[name="expiry_year"], input[data-qa="expiry-year"]');

        // Actions
        this.payAndConfirmButton = page.locator('button[data-qa="pay-button"], button:has-text("Pay and Confirm Order")');

        // Success messages
        this.orderSuccessMessage = page.locator('p:has-text("Congratulations"), p:has-text("order has been placed"), .alert-success');
        this.orderPlacedMessage = page.locator('text=/order.*placed.*successfully/i, text=/congratulations/i');
    }

    /**
     * Fill payment information
     * @param cardDetails - Card details object
     */
    async fillPaymentDetails(cardDetails: {
        nameOnCard: string;
        cardNumber: string;
        cvc: string;
        expiryMonth: string;
        expiryYear: string;
    }) {
        await this.nameOnCardInput.fill(cardDetails.nameOnCard);
        await this.cardNumberInput.fill(cardDetails.cardNumber);
        await this.cvcInput.fill(cardDetails.cvc);
        await this.expiryMonthInput.fill(cardDetails.expiryMonth);
        await this.expiryYearInput.fill(cardDetails.expiryYear);
    }

    /**
     * Click "Pay and Confirm Order" button
     */
    async submitPayment() {
        await this.payAndConfirmButton.click();
    }

    /**
     * Verify payment page loaded
     */
    async verifyPaymentPageLoaded() {
        await expect(this.page).toHaveURL(/payment/);
        await expect(this.nameOnCardInput).toBeVisible();
        await expect(this.cardNumberInput).toBeVisible();
    }

    /**
     * Verify order success message is displayed
     */
    async verifyOrderSuccess() {
        try {
            await expect(this.orderSuccessMessage).toBeVisible({ timeout: 10000 });
        } catch {
            // Try alternative selector
            await expect(this.orderPlacedMessage).toBeVisible({ timeout: 5000 });
        }
    }

    /**
     * Complete payment with default test card
     */
    async completePaymentWithTestCard(nameOnCard: string = 'Test User') {
        await this.fillPaymentDetails({
            nameOnCard: nameOnCard,
            cardNumber: '4242424242424242',
            cvc: '123',
            expiryMonth: '12',
            expiryYear: '2030'
        });
        await this.submitPayment();
    }
}

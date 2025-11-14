import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS, TIMEOUTS } from '../utils/constants';

export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginHeader: Locator;
    readonly errorMessage: Locator;
    readonly loggedInAsText: Locator;

    constructor(page: Page) {
        super(page);
        // Locators for login form elements
        this.emailInput = page.locator('input[data-qa="login-email"]');
        this.passwordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');
        this.loginHeader = page.locator('text=Login to your account');
        this.errorMessage = page.locator('p[style*="color: red"]');
        this.loggedInAsText = page.locator('text=Logged in as');
    }

    /**
     * Navigate to the login page
     */
    async goto() {
        await super.goto(URLS.LOGIN);
    }

    /**
     * Navigate to login page from homepage
     */
    async navigateToLoginFromHome() {
        await super.goto(URLS.HOME);
        await this.page.locator('a[href="/login"]').click();
    }

    /**
     * Perform login with email and password
     * @param email - User email
     * @param password - User password
     */
    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /**
     * Check if login form is visible
     */
    async isLoginFormVisible(): Promise<boolean> {
        return await this.loginHeader.isVisible();
    }

    /**
     * Get error message text
     */
    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() || '';
    }

    /**
     * Check if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        return await this.loggedInAsText.isVisible();
    }

    /**
     * Get logged in username
     */
    async getLoggedInUsername(): Promise<string> {
        const text = await this.loggedInAsText.textContent();
        return text?.replace('Logged in as ', '').trim() || '';
    }

    /**
     * Verify login form is visible
     */
    async verifyLoginFormVisible() {
        await expect(this.loginHeader).toBeVisible();
    }

    /**
     * Verify error message appears with expected text
     * @param expectedText - Text that should be in the error message
     */
    async verifyErrorMessage(expectedText: string) {
        await expect(this.errorMessage).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        const errorText = await this.getErrorMessage();
        expect(errorText).toContain(expectedText);
    }

    /**
     * Verify user is successfully logged in
     * @param expectedUsername - Expected username to verify (optional)
     */
    async verifySuccessfulLogin(expectedUsername?: string) {
        await expect(this.loggedInAsText).toBeVisible({ timeout: TIMEOUTS.LONG });

        if (expectedUsername) {
            const username = await this.getLoggedInUsername();
            expect(username).toBe(expectedUsername);
        }
    }
}

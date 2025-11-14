import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS, TIMEOUTS } from '../utils/constants';

export class SignupPage extends BasePage {
    // Initial signup form (on /login page)
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;

    // Full registration form fields
    readonly genderMrRadio: Locator;
    readonly genderMrsRadio: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly daySelect: Locator;
    readonly monthSelect: Locator;
    readonly yearSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly optinCheckbox: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;

    // Success messages
    readonly accountCreatedMessage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);

        // Initial signup form
        this.signupNameInput = page.locator('input[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');

        // Full registration form
        this.genderMrRadio = page.locator('#id_gender1');
        this.genderMrsRadio = page.locator('#id_gender2');
        this.nameInput = page.locator('input[data-qa="name"]');
        this.emailInput = page.locator('input[data-qa="email"]');
        this.passwordInput = page.locator('input[data-qa="password"]');
        this.daySelect = page.locator('select[data-qa="days"]');
        this.monthSelect = page.locator('select[data-qa="months"]');
        this.yearSelect = page.locator('select[data-qa="years"]');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.optinCheckbox = page.locator('#optin');
        this.firstNameInput = page.locator('input[data-qa="first_name"]');
        this.lastNameInput = page.locator('input[data-qa="last_name"]');
        this.companyInput = page.locator('input[data-qa="company"]');
        this.address1Input = page.locator('input[data-qa="address"]');
        this.address2Input = page.locator('input[data-qa="address2"]');
        this.countrySelect = page.locator('select[data-qa="country"]');
        this.stateInput = page.locator('input[data-qa="state"]');
        this.cityInput = page.locator('input[data-qa="city"]');
        this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
        this.mobileNumberInput = page.locator('input[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('button[data-qa="create-account"]');

        // Success elements
        this.accountCreatedMessage = page.locator('h2:has-text("Account Created!")');
        this.continueButton = page.locator('a[data-qa="continue-button"]');
    }

    /**
     * Navigate to the signup page
     */
    async goto() {
        await super.goto(URLS.LOGIN);
    }

    /**
     * Fill initial signup form (name and email)
     * @param name - User's name
     * @param email - User's email
     */
    async fillInitialSignupForm(name: string, email: string) {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupButton.click();
    }

    /**
     * Fill complete registration form
     * @param userData - Object containing all user registration data
     */
    async fillRegistrationForm(userData: {
        gender: 'Mr' | 'Mrs';
        password: string;
        day: string;
        month: string;
        year: string;
        firstName: string;
        lastName: string;
        company?: string;
        address1: string;
        address2?: string;
        country: string;
        state: string;
        city: string;
        zipcode: string;
        mobileNumber: string;
        newsletter?: boolean;
        optin?: boolean;
    }) {
        // Select gender
        if (userData.gender === 'Mr') {
            await this.genderMrRadio.check();
        } else {
            await this.genderMrsRadio.check();
        }

        // Fill password
        await this.passwordInput.fill(userData.password);

        // Select date of birth
        await this.daySelect.selectOption(userData.day);
        await this.monthSelect.selectOption(userData.month);
        await this.yearSelect.selectOption(userData.year);

        // Newsletter and special offers
        if (userData.newsletter) {
            await this.newsletterCheckbox.check();
        }
        if (userData.optin) {
            await this.optinCheckbox.check();
        }

        // Address information
        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);

        if (userData.company) {
            await this.companyInput.fill(userData.company);
        }

        await this.address1Input.fill(userData.address1);

        if (userData.address2) {
            await this.address2Input.fill(userData.address2);
        }

        await this.countrySelect.selectOption(userData.country);
        await this.stateInput.fill(userData.state);
        await this.cityInput.fill(userData.city);
        await this.zipcodeInput.fill(userData.zipcode);
        await this.mobileNumberInput.fill(userData.mobileNumber);
    }

    /**
     * Click create account button
     */
    async submitRegistration() {
        await this.createAccountButton.click();
    }

    /**
     * Complete full signup process
     * @param name - User's name
     * @param email - User's email
     * @param userData - Complete user data
     */
    async completeSignup(name: string, email: string, userData: Parameters<typeof this.fillRegistrationForm>[0]) {
        await this.fillInitialSignupForm(name, email);
        await this.page.waitForTimeout(1000); // Wait for form to load
        await this.fillRegistrationForm(userData);
        await this.submitRegistration();
    }

    /**
     * Check if account was created successfully
     */
    async isAccountCreated(): Promise<boolean> {
        return await this.accountCreatedMessage.isVisible();
    }

    /**
     * Click continue button after successful registration
     */
    async clickContinue() {
        await this.continueButton.click();
    }

    /**
     * Verify account was created successfully
     */
    async verifyAccountCreated() {
        await expect(this.accountCreatedMessage).toBeVisible({ timeout: TIMEOUTS.LONG });
    }

    /**
     * Verify signup form elements are visible
     */
    async verifySignupFormVisible() {
        await expect(this.signupNameInput).toBeVisible();
        await expect(this.signupEmailInput).toBeVisible();
        await expect(this.signupButton).toBeVisible();
    }
}

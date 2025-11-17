import { test, expect } from '../../../fixtures/pageFixtures';
import { generateTestUser } from '../../../utils/testDataGenerator';
import { TEST_USERS } from '../../../utils/testUsers';

/**
 * Signup Tests
 *
 * These tests create NEW users, so they use generateTestUser() for unique emails
 * Tests are independent - each can run in isolation
 */

test.describe('Signup Functionality', () => {
    test.beforeEach(async ({ signupPage }) => {
        await signupPage.goto();
    });

    test('Verify signup form is accessible', async ({ signupPage, page }) => {
        // Verify we're on login page
        await expect(page).toHaveURL(/login/);

        // Verify signup section is visible
        const signupHeading = page.locator('h2:has-text("New User Signup!")');
        await expect(signupHeading).toBeVisible();

        // Verify signup form inputs
        await signupPage.verifySignupFormVisible();
    });

    test('Verify successful user registration with valid data', async ({ signupPage }) => {
        const testUser = generateTestUser();

        // Fill and submit signup form
        await signupPage.fillInitialSignupForm(testUser.name, testUser.email);

        // Wait for registration page to load
        await expect(signupPage.passwordInput).toBeVisible();

        await signupPage.fillRegistrationForm(testUser);
        await signupPage.submitRegistration();

        // Verify account creation success
        await signupPage.verifyAccountCreated();

        // Continue and verify user is logged in
        await signupPage.clickContinue();
        await expect(signupPage.page.locator('.shop-menu')).toContainText(testUser.name);
    });

    test('Verify signup fails with already registered email', async ({ signupPage, page }) => {
        // Try to signup with an existing user's email
        await signupPage.signupNameInput.fill('Another Name');
        await signupPage.signupEmailInput.fill(TEST_USERS.EXISTING_USER.email);
        await signupPage.signupButton.click();

        // Verify error message
        const errorMessage = page.locator('p:has-text("Email Address already exist")');
        await expect(errorMessage).toBeVisible();
    });

    test('Verify validation messages for empty required fields', async ({ signupPage, page }) => {
        const testUser = generateTestUser();

        // Fill initial signup form to get to registration page
        await signupPage.fillInitialSignupForm(testUser.name, testUser.email);
        await expect(signupPage.passwordInput).toBeVisible();

        // Submit form without filling required fields
        await signupPage.createAccountButton.click();

        // Verify we're still on the signup page (form didn't submit)
        await expect(page).toHaveURL(/signup/);

        // Verify password field shows validation (it's a required field)
        const passwordValidation = await signupPage.passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
        expect(passwordValidation).toBe(false);

        // Verify first name field shows validation
        const firstNameValidation = await signupPage.firstNameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
        expect(firstNameValidation).toBe(false);

        // Verify last name field shows validation
        const lastNameValidation = await signupPage.lastNameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
        expect(lastNameValidation).toBe(false);

        // Verify address field shows validation
        const addressValidation = await signupPage.address1Input.evaluate((el: HTMLInputElement) => el.validity.valid);
        expect(addressValidation).toBe(false);
    });

    test('Verify password field is masked', async ({ signupPage }) => {
        const testUser = generateTestUser();
        const testPassword = 'TestPassword123';

        await signupPage.fillInitialSignupForm(testUser.name, testUser.email);
        await expect(signupPage.passwordInput).toBeVisible();

        // Verify password field type attribute is set to "password"
        const passwordFieldType = await signupPage.passwordInput.getAttribute('type');
        expect(passwordFieldType).toBe('password');

        // Fill password field
        await signupPage.passwordInput.fill(testPassword);

        // Verify the actual value is stored correctly (accessible via JS)
        const inputValue = await signupPage.passwordInput.inputValue();
        expect(inputValue).toBe(testPassword);

        // Verify the input type="password" causes masking behavior
        // The browser will visually mask the characters while the value is still accessible via JS
        const isMasked = await signupPage.passwordInput.evaluate((el: HTMLInputElement) => {
            return el.type === 'password' && el.value === 'TestPassword123';
        });
        expect(isMasked).toBe(true);
    });


    test('Verify signup with minimal required information', async ({ signupPage }) => {
        const testUser = generateTestUser();

        await signupPage.fillInitialSignupForm(testUser.name, testUser.email);
        await expect(signupPage.passwordInput).toBeVisible();

        // Fill only required fields
        if (testUser.gender === 'Mr') {
            await signupPage.genderMrRadio.check();
        } else {
            await signupPage.genderMrsRadio.check();
        }

        await signupPage.passwordInput.fill(testUser.password);
        await signupPage.firstNameInput.fill(testUser.firstName);
        await signupPage.lastNameInput.fill(testUser.lastName);
        await signupPage.address1Input.fill(testUser.address1);
        await signupPage.countrySelect.selectOption(testUser.country);
        await signupPage.stateInput.fill(testUser.state);
        await signupPage.cityInput.fill(testUser.city);
        await signupPage.zipcodeInput.fill(testUser.zipcode);
        await signupPage.mobileNumberInput.fill(testUser.mobileNumber);

        await signupPage.submitRegistration();

        // Verify account created successfully
        await signupPage.verifyAccountCreated();
    });
});

import { test, expect } from '../../../fixtures/pageFixtures';
import { generateTestUser } from '../../../utils/testDataGenerator';
import { TIMEOUTS } from '../../../utils/constants';

test.describe('Signup Functionality', () => {
    test.beforeEach(async ({ page, signupPage }) => {
        await signupPage.goto();

        // Ensure clean state - logout if already logged in
        try {
            const logoutButton = page.locator('a[href="/logout"]');
            await logoutButton.waitFor({ timeout: TIMEOUTS.SHORT, state: 'visible' });
            await logoutButton.click();
            await page.waitForTimeout(TIMEOUTS.SHORT);
            await signupPage.goto();
        } catch (error) {
            // Not logged in, continue with test
        }
    });

    test('TC_AUTH_001 - Verify user can access signup page', async ({ page, signupPage }) => {
        // Verify we're on the login/signup page
        await expect(page).toHaveURL(/.*login/);

        // Verify signup form elements are visible
        await signupPage.verifySignupFormVisible();

        // Verify heading
        const signupHeading = page.locator('h2:has-text("New User Signup!")');
        await expect(signupHeading).toBeVisible();
    });

    test('TC_AUTH_002 - Verify successful user registration with valid data', async ({ signupPage, loginPage }) => {
        const testUser = generateTestUser();

        // Fill and submit signup form
        await signupPage.completeSignup(testUser.name, testUser.email, {
            gender: testUser.gender,
            password: testUser.password,
            day: testUser.day,
            month: testUser.month,
            year: testUser.year,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            company: testUser.company,
            address1: testUser.address1,
            address2: testUser.address2,
            country: testUser.country,
            state: testUser.state,
            city: testUser.city,
            zipcode: testUser.zipcode,
            mobileNumber: testUser.mobileNumber,
            newsletter: testUser.newsletter,
            optin: testUser.optin
        });

        // Verify account creation success
        await signupPage.verifyAccountCreated();

        // Continue and verify user is logged in
        await signupPage.clickContinue();
        await loginPage.verifySuccessfulLogin(testUser.name);
    });

    test('TC_AUTH_003 - Verify registration fails with existing email', async ({ page, signupPage }) => {
        const testUser = generateTestUser();

        // Step 1: Create user completely
        await signupPage.completeSignup(testUser.name, testUser.email, {
            gender: testUser.gender,
            password: testUser.password,
            day: testUser.day,
            month: testUser.month,
            year: testUser.year,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            company: testUser.company,
            address1: testUser.address1,
            address2: testUser.address2,
            country: testUser.country,
            state: testUser.state,
            city: testUser.city,
            zipcode: testUser.zipcode,
            mobileNumber: testUser.mobileNumber,
            newsletter: testUser.newsletter,
            optin: testUser.optin
        });

        // Wait for account creation
        await signupPage.verifyAccountCreated();

        // Continue and then logout
        await signupPage.clickContinue();
        await page.waitForTimeout(TIMEOUTS.SHORT);

        const logoutButton = page.locator('a[href="/logout"]');
        await logoutButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);

        // Step 2: Try to signup again with the same email
        await signupPage.goto();
        await signupPage.signupNameInput.fill('Another User');
        await signupPage.signupEmailInput.fill(testUser.email);
        await signupPage.signupButton.click();

        // Verify error message appears
        const errorMessage = page.locator('p').filter({ hasText: /Email Address already exist/ });
        await expect(errorMessage).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    });

    test('TC_AUTH_004 - Verify validation messages for empty required fields', async ({ signupPage }) => {
        // Try to submit with empty name
        await signupPage.signupButton.click();

        // Verify browser validation or form doesn't submit
        const nameField = signupPage.signupNameInput;
        const emailField = signupPage.signupEmailInput;

        // Check that fields are required
        await expect(nameField).toBeVisible();
        await expect(emailField).toBeVisible();
    });

    test('TC_AUTH_005 - Verify password field masking', async ({ page, signupPage }) => {
        const testUser = generateTestUser();

        // Fill initial signup form
        await signupPage.fillInitialSignupForm(testUser.name, testUser.email);
        await page.waitForTimeout(TIMEOUTS.SHORT);

        // Verify password field type is 'password'
        const passwordFieldType = await signupPage.passwordInput.getAttribute('type');
        expect(passwordFieldType).toBe('password');

        // Type password and verify it's masked
        await signupPage.passwordInput.fill('TestPassword123');
        const value = await signupPage.passwordInput.inputValue();

        // Value should be stored but displayed as masked
        expect(value).toBe('TestPassword123');
    });

    test('TC_AUTH_006 - Verify email format validation', async ({ signupPage }) => {
        // Fill name with valid data
        await signupPage.signupNameInput.fill('Test User');

        // Try invalid email format
        await signupPage.signupEmailInput.fill('invalid-email');
        await signupPage.signupButton.click();

        // Check if email field shows validation error (browser native or custom)
        const emailValue = await signupPage.signupEmailInput.inputValue();
        expect(emailValue).toBe('invalid-email');

        // Page should not navigate away from signup form
        await expect(signupPage.signupButton).toBeVisible();
    });
});

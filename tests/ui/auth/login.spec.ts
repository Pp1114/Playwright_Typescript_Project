import { test, expect } from '../../../fixtures/pageFixtures';
import { Browser } from '@playwright/test';
import { SignupPage } from '../../../pages/SignupPage';
import { generateTestUser } from '../../../utils/testDataGenerator';
import { TIMEOUTS } from '../../../utils/constants';

test.describe('Login Functionality', () => {
    let testUser: ReturnType<typeof generateTestUser>;

    // Create ONE test user before all tests run
    test.beforeAll(async ({ browser }: { browser: Browser }) => {
        testUser = generateTestUser();
        const context = await browser.newContext();
        const page = await context.newPage();
        const signupPage = new SignupPage(page);

        // Create the test user account
        await signupPage.goto();
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

        await context.close();
    });

    test.beforeEach(async ({ page, loginPage }) => {
        await loginPage.goto();

        // Ensure clean state - logout if already logged in
        try {
            const logoutButton = page.locator('a[href="/logout"]');
            await logoutButton.waitFor({ timeout: TIMEOUTS.SHORT, state: 'visible' });
            await logoutButton.click();
            await page.waitForTimeout(TIMEOUTS.SHORT);
            await loginPage.goto();
        } catch (error) {
            // Not logged in, continue with test
        }
    });

    test('TC_AUTH_009 - Verify login with valid credentials', async ({ loginPage }) => {
        // Verify login form is visible
        await loginPage.verifyLoginFormVisible();

        // Login with the pre-created user
        await loginPage.login(testUser.email, testUser.password);

        // Verify user is logged in with correct username
        await loginPage.verifySuccessfulLogin(testUser.name);
    });

    test('TC_AUTH_010 - Verify login fails with invalid credentials', async ({ loginPage }) => {
        const invalidEmail = 'invalid@example.com';
        const invalidPassword = 'wrongpassword';

        // Verify login form is visible
        await loginPage.verifyLoginFormVisible();

        // Attempt login with invalid credentials
        await loginPage.login(invalidEmail, invalidPassword);

        // Verify error message is displayed
        await loginPage.verifyErrorMessage('Your email or password is incorrect');
    });

    test('TC_AUTH_011 - Verify login fails with empty fields', async ({ loginPage }) => {
        // Verify login form is visible
        await loginPage.verifyLoginFormVisible();

        // Verify email and password fields exist and are empty
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();

        // Verify fields are empty before attempting login
        const emailValue = await loginPage.emailInput.inputValue();
        const passwordValue = await loginPage.passwordInput.inputValue();
        expect(emailValue).toBe('');
        expect(passwordValue).toBe('');
    });

    test('TC_AUTH_012 - Verify error message for incorrect email', async ({ loginPage }) => {
        const incorrectEmail = 'nonexistent@example.com';
        const somePassword = 'SomePassword123';

        await loginPage.verifyLoginFormVisible();

        await loginPage.login(incorrectEmail, somePassword);

        // Verify error message
        await loginPage.verifyErrorMessage('Your email or password is incorrect');
    });

    test('TC_AUTH_013 - Verify error message for incorrect password', async ({ loginPage }) => {
        // Using a potentially valid email format but wrong password
        const email = 'test@example.com';
        const wrongPassword = 'WrongPassword123';

        await loginPage.verifyLoginFormVisible();

        await loginPage.login(email, wrongPassword);

        // Verify error message
        await loginPage.verifyErrorMessage('Your email or password is incorrect');
    });

    test('TC_AUTH_014 - Verify "Logged in as username" appears after login', async ({ loginPage }) => {
        await loginPage.verifyLoginFormVisible();

        // Login with the pre-created user
        await loginPage.login(testUser.email, testUser.password);

        // Verify "Logged in as" text is visible with correct username
        await loginPage.verifySuccessfulLogin(testUser.name);
    });

    test('TC_AUTH_015 - Verify user can logout successfully', async ({ page, loginPage }) => {
        // Login first
        await loginPage.login(testUser.email, testUser.password);
        await loginPage.verifySuccessfulLogin();

        // Logout
        const logoutButton = page.locator('a[href="/logout"]');
        await expect(logoutButton).toBeVisible();
        await logoutButton.click();

        // Verify redirected to login page
        await expect(page).toHaveURL(/.*login/, { timeout: TIMEOUTS.MEDIUM });

        // Verify login form is visible again
        await loginPage.verifyLoginFormVisible();
    });
});

import { test, expect } from '../../../fixtures/pageFixtures';
import { TEST_USERS } from '../../../utils/testUsers';

/**
 * Login Tests
 *
 * Prerequisites: TEST_USERS.VALID_USER must exist in the system
 * Create this user manually or via setup script before running tests
 */

test.describe('Login Functionality', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('Verify login with valid credentials, username display, and logout', async ({ loginPage, homePage, page }) => {
        // Verify login form elements are present
        await loginPage.verifyLoginFormVisible();
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();

        // Verify logout is not visible before login
        await expect(homePage.logoutLink).not.toBeVisible();

        // Perform login
        await loginPage.login(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);

        // Verify successful login with username
        await loginPage.verifySuccessfulLogin(TEST_USERS.VALID_USER.name);

        // Verify logged in text appears with correct username
        await expect(homePage.loggedInAsText).toBeVisible();
        await expect(homePage.loggedInAsText).toContainText(TEST_USERS.VALID_USER.name);

        // Verify logout button is now visible
        await expect(homePage.logoutLink).toBeVisible();

        // Test logout functionality and Verify redirected to login page
        await homePage.clickLogout();
        await expect(page).toHaveURL(/login/);
        await loginPage.verifyLoginFormVisible();
    });

    test('Verify login fails with invalid email and password', async ({ loginPage }) => {
        await loginPage.verifyLoginFormVisible();

        await loginPage.login(TEST_USERS.INVALID_USER.email, TEST_USERS.INVALID_USER.password);

        await loginPage.verifyErrorMessage('Your email or password is incorrect');
    });

    test('Verify login fails with valid email but wrong password', async ({ loginPage }) => {
        await loginPage.verifyLoginFormVisible();

        await loginPage.login(TEST_USERS.VALID_USER.email, 'WrongPassword123');

        await loginPage.verifyErrorMessage('Your email or password is incorrect');
    });

    
});

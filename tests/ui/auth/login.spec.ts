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

    test('Verify login with valid credentials', async ({ loginPage }) => {
        
          // Verify log in displays properl, key elements are present
        await loginPage.verifyLoginFormVisible();
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();

        await loginPage.login(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);

        await loginPage.verifySuccessfulLogin(TEST_USERS.VALID_USER.name);
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

    test('Verify successful login shows logged in username', async ({ loginPage, homePage }) => {
        await loginPage.login(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);

        // Verify logged in text appears
        await expect(homePage.loggedInAsText).toBeVisible();
        await expect(homePage.loggedInAsText).toContainText(TEST_USERS.VALID_USER.name);
    });

    test('Verify logout button visible only when logged in', async ({ loginPage, homePage }) => {
        // When not logged in, logout should not be visible
        await expect(homePage.logoutLink).not.toBeVisible();

        // Login
        await loginPage.login(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);

        // Now logout should be visible
        await expect(homePage.logoutLink).toBeVisible();
    });

     test('Verify logout functionality', async ({ loginPage, homePage, page }) => {
        // Login first
        await loginPage.login(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
        await loginPage.verifySuccessfulLogin();

        // Logout
        await homePage.clickLogout();

        // Verify redirected to login page
        await expect(page).toHaveURL(/login/);
        await loginPage.verifyLoginFormVisible();
    });

    
});

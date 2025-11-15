import { test, expect } from '../../fixtures/pageFixtures';
import { TEST_USERS } from '../../utils/testUsers';

/**
 * One-time setup: Create the test user for login tests
 *
 * Run this ONCE before running login tests:
 * npx playwright test tests/setup/createTestUser.spec.ts --project=chromium
 *
 * This creates TEST_USERS.VALID_USER which is used by all login and checkout tests
 */

test('Create test user for login tests', async ({ signupPage, page }) => {
    const user = TEST_USERS.VALID_USER;

    await signupPage.goto();

    // Fill initial signup form
    await signupPage.fillInitialSignupForm(user.name, user.email);

    // Check if user already exists
    const errorMessage = page.locator('p:has-text("Email Address already exist")');
    const errorVisible = await errorMessage.isVisible().catch(() => false);

    if (errorVisible) {
        console.log('✅ Test user already exists! Skipping creation.');
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        return;
    }

    // Wait for registration page
    await expect(signupPage.passwordInput).toBeVisible();

    // Fill registration form
    await signupPage.genderMrRadio.check();
    await signupPage.passwordInput.fill(user.password);
    await signupPage.daySelect.selectOption('15');
    await signupPage.monthSelect.selectOption('6');
    await signupPage.yearSelect.selectOption('1990');
    await signupPage.firstNameInput.fill(user.firstName);
    await signupPage.lastNameInput.fill(user.lastName);
    await signupPage.address1Input.fill('123 Test Street');
    await signupPage.countrySelect.selectOption('United States');
    await signupPage.stateInput.fill('California');
    await signupPage.cityInput.fill('Los Angeles');
    await signupPage.zipcodeInput.fill('90001');
    await signupPage.mobileNumberInput.fill('+1234567890');

    await signupPage.submitRegistration();

    // Verify account created
    await signupPage.verifyAccountCreated();

    console.log('✅ Test user created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
});

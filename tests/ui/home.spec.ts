import { test, expect } from '../../fixtures/pageFixtures';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigateToHome(); // cookies handled automatically in HomePage
  });

  test('Verify home page loads', async ({ homePage }) => {
    expect(await homePage.verifyHomePageLoaded()).toBeTruthy();
  });

  test('Navigate to Products', async ({ homePage }) => {
    await homePage.clickProducts();
    await expect(homePage.page).toHaveURL(/.*products/);
  });

  test('Navigate to Login', async ({ homePage }) => {
    await homePage.clickSignupLogin();
    await expect(homePage.page).toHaveURL(/.*login/);
  });
});

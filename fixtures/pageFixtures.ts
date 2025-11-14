import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ProductsPage } from '../pages/ProductsPage';

// Define the type interface for all page fixtures
type PageFixtures = {
    homePage: HomePage;
    loginPage: LoginPage;
    signupPage: SignupPage;
    productsPage: ProductsPage;
};

// Create custom fixtures for page objects
export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    signupPage: async ({ page }, use) => {
        const signupPage = new SignupPage(page);
        await use(signupPage);
    },

    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },
});

// Export expect for convenience
export { expect };

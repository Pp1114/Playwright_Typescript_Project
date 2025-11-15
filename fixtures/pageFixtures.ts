import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';

// Define the type interface for all page fixtures
type PageFixtures = {
    homePage: HomePage;
    loginPage: LoginPage;
    signupPage: SignupPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    paymentPage: PaymentPage;
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

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },

    paymentPage: async ({ page }, use) => {
        const paymentPage = new PaymentPage(page);
        await use(paymentPage);
    },
});

// Export expect for convenience
export { expect };

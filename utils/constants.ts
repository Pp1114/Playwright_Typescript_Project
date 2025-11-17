/**
 * Application constants
 */

// Base URL for the application
export const BASE_URL = 'https://automationexercise.com';

// Page URLs
export const URLS = {
    HOME: `${BASE_URL}/`,
    LOGIN: `${BASE_URL}/login`,
    PRODUCTS: `${BASE_URL}/products`,
    CART: `${BASE_URL}/view_cart`,
    CONTACT: `${BASE_URL}/contact_us`,
    CHECKOUT: `${BASE_URL}/checkout`,
    CATEGORY_WOMEN_DRESS: `${BASE_URL}/category_products/1`,
    CATEGORY_MEN_TSHIRTS: `${BASE_URL}/category_products/3`,
    CATEGORY_KIDS_DRESS: `${BASE_URL}/category_products/4`,
} as const;

// Timeout values (in milliseconds)
export const TIMEOUTS = {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 10000,
} as const;

// Selectors
export const COOKIE_SELECTOR = '.fc-button.fc-cta-consent';

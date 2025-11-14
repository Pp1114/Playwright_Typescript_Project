import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../utils/constants';

export class HomePage extends BasePage {
  // Locators - define all elements on the home page
  readonly logo: Locator;
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly contactUsLink: Locator;
  readonly loggedInAsText: Locator;

  constructor(page: Page) {
    super(page); // Call the BasePage constructor

    // Initialize locators
    this.logo = page.locator('.logo');
    this.signupLoginLink = page.locator('a[href="/login"]');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.productsLink = page.locator('a[href="/products"]');
    this.cartLink = page.locator('a[href="/view_cart"]');
    this.contactUsLink = page.locator('a[href="/contact_us"]');
    this.loggedInAsText = page.locator('.shop-menu >> text=Logged in as');
  }

  // Page actions/methods
  async navigateToHome() {
    await super.goto(URLS.HOME);
  }

  async clickSignupLogin() {
    await this.click(this.signupLoginLink);
  }

  async clickProducts() {
    await this.click(this.productsLink);
  }

  async clickCart() {
    await this.click(this.cartLink);
  }

  async clickLogout() {
    await this.click(this.logoutLink);
  }

  async isUserLoggedIn(username: string): Promise<boolean> {
    const text = await this.getText(this.loggedInAsText);
    return text.includes(username);
  }

  async verifyHomePageLoaded(): Promise<boolean> {
    return await this.isVisible(this.logo);
  }
}
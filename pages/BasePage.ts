import { Page, Locator } from '@playwright/test';
import { COOKIE_SELECTOR, TIMEOUTS } from '../utils/constants';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL and handle cookie consent if it appears
   * @param url - The URL to navigate to
   */
  async goto(url: string) {
    await this.page.goto(url);
    await this.handleCookieConsent();
  }

  /**
   * Handle cookie consent banner if it appears
   * This is called automatically after navigation in goto()
   */
  private async handleCookieConsent() {
    try {
      const consentButton = this.page.locator(COOKIE_SELECTOR);
      await consentButton.waitFor({ timeout: TIMEOUTS.SHORT, state: 'visible' });
      await consentButton.click();
      await this.page.waitForTimeout(500);
    } catch (error) {
      // If no consent banner appears, continue
    }
  }

  // Click on an element
  async click(locator: string | Locator) {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.click();
  }

  // Fill input field
  async fill(locator: string | Locator, text: string) {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.fill(text);
  }

  // Get text from element
  async getText(locator: string | Locator): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.textContent() || '';
  }

  // Wait for element to be visible
  async waitForElement(locator: string | Locator) {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: 'visible' });
  }

  // Check if element is visible
  async isVisible(locator: string | Locator): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }
}
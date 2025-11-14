import { chromium } from '@playwright/test';

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to signup page
    await page.goto('https://automationexercise.com/login');

    // Handle cookie consent
    try {
        const consentButton = page.locator('.fc-button.fc-cta-consent');
        await consentButton.waitFor({ timeout: 3000, state: 'visible' });
        await consentButton.click();
        await page.waitForTimeout(1000);
    } catch (error) {
        console.log('No cookie consent banner');
    }

    // Fill initial signup form
    await page.locator('input[data-qa="signup-name"]').fill('Test User');
    await page.locator('input[data-qa="signup-email"]').fill('test' + Date.now() + '@example.com');
    await page.locator('button[data-qa="signup-button"]').click();

    // Wait for signup form page
    await page.waitForTimeout(2000);

    // Get all form elements
    console.log('\n=== SIGNUP FORM FIELDS ===\n');

    const formInputs = await page.locator('input').all();
    for (const input of formInputs) {
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const type = await input.getAttribute('type');
        const dataQa = await input.getAttribute('data-qa');
        console.log(`Input: name="${name}", id="${id}", type="${type}", data-qa="${dataQa}"`);
    }

    const selectFields = await page.locator('select').all();
    for (const select of selectFields) {
        const name = await select.getAttribute('name');
        const id = await select.getAttribute('id');
        const dataQa = await select.getAttribute('data-qa');
        console.log(`Select: name="${name}", id="${id}", data-qa="${dataQa}"`);
    }

    console.log('\n=== Done ===\n');

    await page.waitForTimeout(5000);
    await browser.close();
})();

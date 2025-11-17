import { test as base } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';

type ApiFixtures = {
    apiHelper: ApiHelper;
};

/**
 * API Test Fixtures
 * Extends Playwright's base test with API helper
 */
export const test = base.extend<ApiFixtures>({
    apiHelper: async ({ request }, use) => {
        const helper = new ApiHelper(request);
        await use(helper);
    }
});

export { expect } from '@playwright/test';

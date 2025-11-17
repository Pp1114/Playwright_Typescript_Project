/**
 * Pre-defined test users for login and checkout tests
 *
 * IMPORTANT: VALID_USER must be created manually before running login tests.
 * You can create this user by running the signup test once, or manually registering on the site.
 *
 * Alternatively, update these credentials to match an existing user in your test environment.
 */

export const TEST_USERS = {
    // Valid existing user for login tests
    // This user is created once via tests/setup/createTestUser.spec.ts
    VALID_USER: {
        name: 'Test User',
        email: 'playwright.testuser@automationexercise.com',
        password: 'SecureTest@12345',
        firstName: 'Test',
        lastName: 'User'
    },

    // Invalid credentials for negative tests
    INVALID_USER: {
        email: 'invalid@example.com',
        password: 'WrongPassword123'
    },

    // Existing user for duplicate email signup test
    // This is the same as VALID_USER, used for testing duplicate email validation
    EXISTING_USER: {
        email: 'playwright.testuser@automationexercise.com',
        name: 'Test User'
    }
} as const;

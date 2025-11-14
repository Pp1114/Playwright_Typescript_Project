/**
 * Generate unique test user data
 */
export function generateTestUser() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);

    return {
        name: `Test User ${timestamp}`,
        email: `testuser${timestamp}${randomNum}@example.com`,
        password: 'Test@12345',
        gender: 'Mr' as const,
        day: '15',
        month: '6',
        year: '1990',
        firstName: 'Test',
        lastName: 'User',
        company: 'Test Company',
        address1: '123 Test Street',
        address2: 'Apt 4B',
        country: 'United States',
        state: 'California',
        city: 'Los Angeles',
        zipcode: '90001',
        mobileNumber: '+1234567890',
        newsletter: true,
        optin: true
    };
}

/**
 * Generate unique test user data
 */
export function generateTestUser() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);

    return {
        // Common fields
        name: `Test User ${timestamp}`,
        email: `testuser${timestamp}${randomNum}@example.com`,
        password: 'Test@12345',
        firstName: 'Test',
        lastName: 'User',
        company: 'Test Company',
        country: 'United States',
        state: 'California',
        city: 'Los Angeles',
        zipcode: '90001',

        // UI-specific fields
        gender: 'Mr' as const,
        day: '15',
        month: '6',
        year: '1990',
        address1: '123 Test Street',
        address2: 'Apt 4B',
        mobileNumber: '+1234567890',
        newsletter: true,
        optin: true,

        // API-specific fields (aliases for compatibility)
        title: 'Mr',
        birthDate: '15',
        birthMonth: 'June',
        birthYear: '1990',
        address: '123 Test Street',
        mobile: '1234567890'
    };
}

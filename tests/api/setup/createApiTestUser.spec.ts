import { test } from '@playwright/test';

/**
 * Setup script to create a test user for API authentication tests
 * This user will be used in authentication.spec.ts for valid login tests
 */

const TEST_USER = {
    name: 'API Test User',
    email: 'apitestuser@example.com',
    password: 'Test@12345',
    title: 'Mr',
    birth_date: '15',
    birth_month: 'June',
    birth_year: '1990',
    firstname: 'API',
    lastname: 'User',
    company: 'Test Company',
    address1: '123 Test Street',
    address2: 'Apt 1',
    country: 'United States',
    zipcode: '90001',
    state: 'California',
    city: 'Los Angeles',
    mobile_number: '1234567890'
};

test('Setup: Create API test user', async ({ request }) => {
    // Try to create the user (will fail if already exists, which is fine)
    const response = await request.post('https://automationexercise.com/api/createAccount', {
        form: TEST_USER
    });

    const body = await response.json();
    console.log('Create user response:', body);

    // Either created or already exists - both are acceptable
    if (body.responseCode === 201) {
        console.log('✅ Test user created successfully');
    } else if (body.responseCode === 400 && body.message === 'Email already exists!') {
        console.log('✅ Test user already exists');
    } else {
        console.log('⚠️ Unexpected response:', body);
    }
});

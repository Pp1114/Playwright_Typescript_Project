import { test, expect } from '../../../fixtures/apiFixtures';

// Use API test user credentials (created by setup script)
const VALID_USER = {
    email: 'apitestuser@example.com',
    password: 'Test@12345'
};

test.describe('Authentication API', () => {
    test('API_10: POST Verify Login - Valid Credentials', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/verifyLogin', {
            email: VALID_USER.email,
            password: VALID_USER.password
        });

        // Verify status code
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code
        await apiHelper.verifyResponseCode(response, 200);

        // Verify success message
        await apiHelper.verifyResponseMessage(response, 'User exists!');
    });

    test('API_11: POST Verify Login - Invalid Email', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/verifyLogin', {
            email: 'nonexistent@example.com',
            password: 'password123'
        });

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 404);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'User not found!');
    });

    test('API_12: POST Verify Login - Invalid Password', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/verifyLogin', {
            email: VALID_USER.email,
            password: 'wrongpassword'
        });

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 404);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'User not found!');
    });

    test('API_13: POST Verify Login - Missing Email Parameter', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/verifyLogin', {
            password: 'password123'
        });

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 400);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'Bad request, email or password parameter is missing in POST request.');
    });

    test('API_14: POST Verify Login - Missing Password Parameter', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/verifyLogin', {
            email: VALID_USER.email
        });

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 400);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'Bad request, email or password parameter is missing in POST request.');
    });

    test('API_15: POST Verify Login - Empty Credentials', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/verifyLogin', {
            email: '',
            password: ''
        });

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Note: API treats empty strings as user not found (404) rather than missing parameter (400)
        // This is actual API behavior
        await apiHelper.verifyResponseCode(response, 404);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'User not found!');
    });

    test('API_16: DELETE Verify Login - Invalid Method', async ({ apiHelper }) => {
        const response = await apiHelper.delete('/api/verifyLogin');

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 405);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'This request method is not supported.');
    });
});

import { test, expect } from '../../../fixtures/apiFixtures';
import { generateTestUser } from '../../../utils/testDataGenerator';

test.describe('Account Management API', () => {
    let testUser: ReturnType<typeof generateTestUser>;
    let createdUserEmail: string;

    test.beforeEach(() => {
        testUser = generateTestUser();
        createdUserEmail = testUser.email;
    });

    test('API_17: POST Create Account - Valid Data', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/createAccount', {
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
            title: testUser.title,
            birth_date: testUser.birthDate,
            birth_month: testUser.birthMonth,
            birth_year: testUser.birthYear,
            firstname: testUser.firstName,
            lastname: testUser.lastName,
            company: testUser.company,
            address1: testUser.address,
            address2: testUser.address2,
            country: testUser.country,
            zipcode: testUser.zipcode,
            state: testUser.state,
            city: testUser.city,
            mobile_number: testUser.mobile
        });

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 201);

        // Verify success message
        await apiHelper.verifyResponseMessage(response, 'User created!');
    });

    test('API_18: DELETE Delete Account - Valid Credentials', async ({ apiHelper }) => {
        // First create an account
        await apiHelper.post('/api/createAccount', {
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
            title: testUser.title,
            birth_date: testUser.birthDate,
            birth_month: testUser.birthMonth,
            birth_year: testUser.birthYear,
            firstname: testUser.firstName,
            lastname: testUser.lastName,
            company: testUser.company,
            address1: testUser.address,
            address2: testUser.address2,
            country: testUser.country,
            zipcode: testUser.zipcode,
            state: testUser.state,
            city: testUser.city,
            mobile_number: testUser.mobile
        });

        // Then delete the account
        const deleteResponse = await apiHelper.delete('/api/deleteAccount', {
            email: testUser.email,
            password: testUser.password
        });

        // Verify HTTP status
        await apiHelper.verifyStatusCode(deleteResponse, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(deleteResponse, 200);

        // Verify success message
        await apiHelper.verifyResponseMessage(deleteResponse, 'Account deleted!');
    });

    test('API_19: PUT Update Account - Valid Data', async ({ apiHelper }) => {
        // First create an account
        await apiHelper.post('/api/createAccount', {
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
            title: testUser.title,
            birth_date: testUser.birthDate,
            birth_month: testUser.birthMonth,
            birth_year: testUser.birthYear,
            firstname: testUser.firstName,
            lastname: testUser.lastName,
            company: testUser.company,
            address1: testUser.address,
            address2: testUser.address2,
            country: testUser.country,
            zipcode: testUser.zipcode,
            state: testUser.state,
            city: testUser.city,
            mobile_number: testUser.mobile
        });

        // Update the account
        const updatedCompany = 'Updated Company Inc';
        const updateResponse = await apiHelper.put('/api/updateAccount', {
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
            title: testUser.title,
            birth_date: testUser.birthDate,
            birth_month: testUser.birthMonth,
            birth_year: testUser.birthYear,
            firstname: testUser.firstName,
            lastname: testUser.lastName,
            company: updatedCompany,
            address1: testUser.address,
            address2: testUser.address2,
            country: testUser.country,
            zipcode: testUser.zipcode,
            state: testUser.state,
            city: testUser.city,
            mobile_number: testUser.mobile
        });

        // Verify HTTP status
        await apiHelper.verifyStatusCode(updateResponse, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(updateResponse, 200);

        // Verify success message
        await apiHelper.verifyResponseMessage(updateResponse, 'User updated!');

        // Clean up - delete the account
        await apiHelper.delete('/api/deleteAccount', {
            email: testUser.email,
            password: testUser.password
        });
    });

    test('API_20: GET User Detail By Email - Valid Email', async ({ apiHelper }) => {
        // First create an account
        await apiHelper.post('/api/createAccount', {
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
            title: testUser.title,
            birth_date: testUser.birthDate,
            birth_month: testUser.birthMonth,
            birth_year: testUser.birthYear,
            firstname: testUser.firstName,
            lastname: testUser.lastName,
            company: testUser.company,
            address1: testUser.address,
            address2: testUser.address2,
            country: testUser.country,
            zipcode: testUser.zipcode,
            state: testUser.state,
            city: testUser.city,
            mobile_number: testUser.mobile
        });

        // Get user details
        const response = await apiHelper.get('/api/getUserDetailByEmail', {
            email: testUser.email
        });

        // Verify HTTP status
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 200);

        // Verify user details in response
        const body = await apiHelper.getResponseJson(response);
        expect(body.user).toBeDefined();
        expect(body.user.name).toBe(testUser.name);
        expect(body.user.email).toBe(testUser.email);
        expect(body.user.title).toBe(testUser.title);
        expect(body.user.first_name).toBe(testUser.firstName);
        expect(body.user.last_name).toBe(testUser.lastName);
        expect(body.user.company).toBe(testUser.company);
        expect(body.user.country).toBe(testUser.country);
        expect(body.user.city).toBe(testUser.city);

        // Clean up - delete the account
        await apiHelper.delete('/api/deleteAccount', {
            email: testUser.email,
            password: testUser.password
        });
    });

    test('API_21: POST Create Account - Duplicate Email', async ({ apiHelper }) => {
        // First create an account
        await apiHelper.post('/api/createAccount', {
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
            title: testUser.title,
            birth_date: testUser.birthDate,
            birth_month: testUser.birthMonth,
            birth_year: testUser.birthYear,
            firstname: testUser.firstName,
            lastname: testUser.lastName,
            company: testUser.company,
            address1: testUser.address,
            address2: testUser.address2,
            country: testUser.country,
            zipcode: testUser.zipcode,
            state: testUser.state,
            city: testUser.city,
            mobile_number: testUser.mobile
        });

        // Try to create another account with same email
        const duplicateResponse = await apiHelper.post('/api/createAccount', {
            name: 'Different Name',
            email: testUser.email,
            password: 'DifferentPass123',
            title: testUser.title,
            birth_date: testUser.birthDate,
            birth_month: testUser.birthMonth,
            birth_year: testUser.birthYear,
            firstname: 'John',
            lastname: 'Doe',
            company: 'Test Company',
            address1: '123 Test St',
            address2: 'Apt 1',
            country: 'United States',
            zipcode: '12345',
            state: 'California',
            city: 'Los Angeles',
            mobile_number: '1234567890'
        });

        // Verify it fails appropriately (API returns 200 for everything)
        await apiHelper.verifyStatusCode(duplicateResponse, 200);
        await apiHelper.verifyResponseCode(duplicateResponse, 400);
        await apiHelper.verifyResponseMessage(duplicateResponse, 'Email already exists!');

        // Clean up - delete the original account
        await apiHelper.delete('/api/deleteAccount', {
            email: testUser.email,
            password: testUser.password
        });
    });

    test('API_22: GET User Detail By Email - Non-Existent Email', async ({ apiHelper }) => {
        const response = await apiHelper.get('/api/getUserDetailByEmail', {
            email: 'nonexistent_' + Date.now() + '@example.com'
        });

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 404);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'Account not found with this email, try another email!');
    });

    test('API_23: DELETE Delete Account - Non-Existent User', async ({ apiHelper }) => {
        const response = await apiHelper.delete('/api/deleteAccount', {
            email: 'nonexistent_' + Date.now() + '@example.com',
            password: 'somepassword'
        });

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 404);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'Account not found!');
    });
});

import { test, expect } from '../../../fixtures/apiFixtures';

test.describe('Products API', () => {
    test('API_01: GET All Products List - Valid Request', async ({ apiHelper }) => {
        const response = await apiHelper.get('/api/productsList');

        // Verify status code
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code
        await apiHelper.verifyResponseCode(response, 200);

        // Verify products exist in response
        const body = await apiHelper.getResponseJson(response);
        expect(body.products).toBeDefined();
        expect(Array.isArray(body.products)).toBeTruthy();
        expect(body.products.length).toBeGreaterThan(0);

        // Verify product structure
        const firstProduct = body.products[0];
        expect(firstProduct).toHaveProperty('id');
        expect(firstProduct).toHaveProperty('name');
        expect(firstProduct).toHaveProperty('price');
    });

    test('API_02: POST To All Products List - Invalid Method', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/productsList');

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 405);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'This request method is not supported.');
    });

    test('API_03: POST Search Product - Valid Search', async ({ apiHelper }) => {
        const searchTerm = 'top';
        const response = await apiHelper.post('/api/searchProduct', {
            search_product: searchTerm
        });

        // Verify status code
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code
        await apiHelper.verifyResponseCode(response, 200);

        // Verify products in response
        const body = await apiHelper.getResponseJson(response);
        expect(body.products).toBeDefined();
        expect(Array.isArray(body.products)).toBeTruthy();
        expect(body.products.length).toBeGreaterThan(0);

        // Verify search results contain the search term
        const productNames = body.products.map((p: any) => p.name.toLowerCase());
        const hasMatchingProduct = productNames.some((name: string) =>
            name.includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingProduct).toBeTruthy();
    });

    test('API_04: POST Search Product - Missing Parameter', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/searchProduct');

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 400);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'Bad request, search_product parameter is missing in POST request.');
    });

    test('API_05: POST Search Product - Empty Search Term', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/searchProduct', {
            search_product: ''
        });

        // Verify status code
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code
        await apiHelper.verifyResponseCode(response, 200);

        // Empty search should return all products
        const body = await apiHelper.getResponseJson(response);
        expect(body.products).toBeDefined();
        expect(Array.isArray(body.products)).toBeTruthy();
    });

    test('API_06: POST Search Product - Non-Existent Product', async ({ apiHelper }) => {
        const response = await apiHelper.post('/api/searchProduct', {
            search_product: 'xyznonexistentproduct123'
        });

        // Verify status code
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code
        await apiHelper.verifyResponseCode(response, 200);

        // Should return empty products array
        const body = await apiHelper.getResponseJson(response);
        expect(body.products).toBeDefined();
        expect(Array.isArray(body.products)).toBeTruthy();
        expect(body.products.length).toBe(0);
    });
});

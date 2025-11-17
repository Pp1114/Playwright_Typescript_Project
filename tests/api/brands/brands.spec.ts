import { test, expect } from '../../../fixtures/apiFixtures';

test.describe('Brands API', () => {
    test('API_07: GET All Brands List - Valid Request', async ({ apiHelper }) => {
        const response = await apiHelper.get('/api/brandsList');

        // Verify status code
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code
        await apiHelper.verifyResponseCode(response, 200);

        // Verify brands exist in response
        const body = await apiHelper.getResponseJson(response);
        expect(body.brands).toBeDefined();
        expect(Array.isArray(body.brands)).toBeTruthy();
        expect(body.brands.length).toBeGreaterThan(0);

        // Verify brand structure
        const firstBrand = body.brands[0];
        expect(firstBrand).toHaveProperty('id');
        expect(firstBrand).toHaveProperty('brand');
    });

    test('API_08: PUT To All Brands List - Invalid Method', async ({ apiHelper }) => {
        const response = await apiHelper.put('/api/brandsList');

        // Verify HTTP status (API returns 200 for everything)
        await apiHelper.verifyStatusCode(response, 200);

        // Verify response code in JSON
        await apiHelper.verifyResponseCode(response, 405);

        // Verify error message
        await apiHelper.verifyResponseMessage(response, 'This request method is not supported.');
    });

    test('API_09: GET Brands List - Verify Brand Names', async ({ apiHelper }) => {
        const response = await apiHelper.get('/api/brandsList');

        await apiHelper.verifyStatusCode(response, 200);

        const body = await apiHelper.getResponseJson(response);
        const brandNames = body.brands.map((b: any) => b.brand);

        // Verify known brands exist (based on the website)
        expect(brandNames).toContain('Polo');
        expect(brandNames).toContain('H&M');
        expect(brandNames).toContain('Madame');
    });
});

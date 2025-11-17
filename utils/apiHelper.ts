import { APIRequestContext, expect } from '@playwright/test';

/**
 * API Helper Class
 * Provides reusable methods for API testing
 */
export class ApiHelper {
    readonly request: APIRequestContext;
    readonly baseURL: string = 'https://automationexercise.com';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * GET request helper
     */
    async get(endpoint: string, params?: Record<string, string>) {
        const url = new URL(endpoint, this.baseURL);
        if (params) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }
        return await this.request.get(url.toString());
    }

    /**
     * POST request helper with form data
     */
    async post(endpoint: string, data?: Record<string, string>) {
        const url = `${this.baseURL}${endpoint}`;
        return await this.request.post(url, {
            form: data
        });
    }

    /**
     * PUT request helper with form data
     */
    async put(endpoint: string, data?: Record<string, string>) {
        const url = `${this.baseURL}${endpoint}`;
        return await this.request.put(url, {
            form: data
        });
    }

    /**
     * DELETE request helper with form data
     */
    async delete(endpoint: string, data?: Record<string, string>) {
        const url = `${this.baseURL}${endpoint}`;
        return await this.request.delete(url, {
            form: data
        });
    }

    /**
     * Verify response status code
     */
    async verifyStatusCode(response: any, expectedCode: number) {
        expect(response.status()).toBe(expectedCode);
    }

    /**
     * Get response body as JSON
     */
    async getResponseJson(response: any) {
        return await response.json();
    }

    /**
     * Get response body as text
     */
    async getResponseText(response: any) {
        return await response.text();
    }

    /**
     * Verify response contains expected message
     */
    async verifyResponseMessage(response: any, expectedMessage: string) {
        const body = await response.json();
        expect(body.message).toBe(expectedMessage);
    }

    /**
     * Verify response code in body (API returns responseCode in JSON)
     */
    async verifyResponseCode(response: any, expectedCode: number) {
        const body = await response.json();
        expect(body.responseCode).toBe(expectedCode);
    }
}

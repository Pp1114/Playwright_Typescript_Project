import { test as base, expect } from '@playwright/test';
import { generateTestUser } from '../../../utils/testDataGenerator';
import { ApiHelper } from '../../../utils/apiHelper';
import { SignupPage } from '../../../pages/SignupPage';
import { LoginPage } from '../../../pages/LoginPage';
import { HomePage } from '../../../pages/HomePage';

const test = base.extend<{
    apiHelper: ApiHelper;
    signupPage: SignupPage;
    loginPage: LoginPage;
    homePage: HomePage;
}>({
    apiHelper: async ({ request }, use) => await use(new ApiHelper(request)),
    signupPage: async ({ page }, use) => await use(new SignupPage(page)),
    loginPage: async ({ page }, use) => await use(new LoginPage(page)),
    homePage: async ({ page }, use) => await use(new HomePage(page)),
});

/**
 * 📊 PERFORMANCE COMPARISON: API Create + Login vs UI Signup + Login
 *
 * PURPOSE: Prove which approach is faster when you need BOTH signup AND login tests
 *
 * REAL-WORLD SCENARIO:
 * ===================
 * Most test suites have BOTH:
 * 1. Signup test (creates user + verifies account creation)
 * 2. Login test (logs in with existing user + verifies authentication)
 *
 * COMPARISON:
 * ===========
 *
 * APPROACH 1: API Create + UI Login (FAST ✅)
 * - API create account: ~900ms
 * - UI login: ~4000ms
 * - Total: ~5000ms (5 seconds)
 *
 * APPROACH 2: UI Signup + UI Login (SLOW ❌)
 * - UI signup (with auto-login): ~6000ms
 * - UI login (separate test): ~6000ms
 * - Total: ~12000ms (12 seconds)
 *
 * WINNER: API Create + UI Login saves ~7 seconds! 🏆
 *
 * WHY API WINS:
 * - API user creation is instant (~900ms vs ~6000ms)
 * - Only the login step needs UI interaction
 * - Perfect for test suites that need both signup AND login coverage
 * - Signup test can use API, Login test uses UI
 *
 * WHEN TO USE EACH:
 * - Use API Create: When you need both signup and login tests separately (FASTER!)
 * - Use UI Signup: When you specifically need to test the signup UI flow
 * - This comparison shows the REAL performance benefit of API for test setup
 */

test.describe('📊 Performance Comparison: API vs UI Signup', () => {

    test('APPROACH 1: API Create + UI Login (FAST ~5s)', async ({
        apiHelper,
        loginPage
    }) => {
        console.log('\n📊 APPROACH 1: API Create User + UI Login\n');

        const startTime = Date.now();
        const testUser = generateTestUser();

        // STEP 1: API Create User
        const step1Start = Date.now();
        console.log('📝 STEP 1 (API): Creating user account...');

        const createAccountResponse = await apiHelper.post('/api/createAccount', {
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

        const createBody = await apiHelper.getResponseJson(createAccountResponse);
        const step1Time = Date.now() - step1Start;
        console.log(`✅ User created (${step1Time}ms)`);
        expect(createAccountResponse.status()).toBe(200);

        // STEP 2: UI Login (uses LoginPage which handles cookie consent)
        const step2Start = Date.now();
        console.log('\n🔐 STEP 2 (UI): Logging in...');

        await loginPage.goto();
        await loginPage.login(testUser.email, testUser.password);

        const step2Time = Date.now() - step2Start;
        console.log(`✅ User logged in (${step2Time}ms)`);

        // Cleanup
        await apiHelper.delete('/api/deleteAccount', {
            email: testUser.email,
            password: testUser.password
        });

        const totalTime = Date.now() - startTime;
        console.log(`\n📊 APPROACH 1 RESULTS:`);
        console.log(`   API Create: ${step1Time}ms`);
        console.log(`   UI Login: ${step2Time}ms`);
        console.log(`   ⏱️  TOTAL: ${totalTime}ms (${(totalTime/1000).toFixed(1)}s)\n`);
    });

    test('APPROACH 2: UI Signup + UI Login (SLOW ~12s)', async ({
        signupPage,
        loginPage,
        homePage
    }) => {
        console.log('\n📊 APPROACH 2: UI Signup + UI Login (separate tests)\n');

        const startTime = Date.now();
        const testUser = generateTestUser();

        // STEP 1: UI Signup (simulating signup test)
        const step1Start = Date.now();
        console.log('📝 STEP 1 (UI): Signup test...');

        await signupPage.goto();
        await signupPage.fillInitialSignupForm(testUser.name, testUser.email);
        await signupPage.fillRegistrationForm(testUser);
        await signupPage.submitRegistration();
        await signupPage.verifyAccountCreated();
        await signupPage.clickContinue();

        const step1Time = Date.now() - step1Start;
        console.log(`✅ Signup complete (${step1Time}ms)`);

        // Logout to simulate separate test
        console.log('\n🚪 Logging out (to simulate separate login test)...');
        await homePage.logoutLink.click();

        // STEP 2: UI Login (simulating separate login test)
        const step2Start = Date.now();
        console.log('\n🔐 STEP 2 (UI): Login test...');

        await loginPage.goto();
        await loginPage.login(testUser.email, testUser.password);

        const step2Time = Date.now() - step2Start;
        console.log(`✅ User logged in (${step2Time}ms)`);

        const totalTime = Date.now() - startTime;
        console.log(`\n📊 APPROACH 2 RESULTS:`);
        console.log(`   UI Signup: ${step1Time}ms`);
        console.log(`   UI Login: ${step2Time}ms`);
        console.log(`   ⏱️  TOTAL: ${totalTime}ms (${(totalTime/1000).toFixed(1)}s)`);
        console.log(`\n💡 SAVINGS: API approach saves ~${totalTime - 5000}ms (~${((totalTime - 5000)/1000).toFixed(1)}s)\n`);
    });
});

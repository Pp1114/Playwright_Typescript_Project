# Playwright TypeScript Test Automation Framework

> Production-ready E2E test automation framework for [automationexercise.com](https://automationexercise.com) built with Playwright + TypeScript

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-green.svg)](https://playwright.dev/)
[![Tests](https://img.shields.io/badge/Tests-23%20passing-brightgreen.svg)]()

## 🎯 Overview

A complete test automation framework featuring **Page Object Model (POM)**, **custom Playwright fixtures**, and **helper methods** for clean, maintainable, and scalable test code.

## ✨ Key Features

- **Page Object Model (POM)** - Organized page classes with BasePage inheritance
- **Custom Playwright Fixtures** - Dependency injection for automatic page object instantiation
- **Helper Methods** - Reusable verification methods to eliminate code duplication
- **Centralized Constants** - URLs, timeouts, and selectors in one place
- **Dynamic Test Data** - Unique user generation to avoid test conflicts
- **Automatic Cookie Handling** - Built into BasePage for cleaner tests
- **Feature-Based Organization** - Tests organized by functionality (auth, products, home)
- **CI/CD Ready** - GitHub Actions workflow included

## 📁 Project Structure

```
Playwright_Typescript_Project/
├── fixtures/
│   └── pageFixtures.ts          # Custom Playwright fixtures
├── pages/
│   ├── BasePage.ts              # Base page with common functionality
│   ├── HomePage.ts              # Home page object
│   ├── LoginPage.ts             # Login page object
│   ├── SignupPage.ts            # Signup page object
│   └── ProductsPage.ts          # Products page object
├── tests/
│   └── ui/
│       ├── auth/                # Authentication tests
│       │   ├── login.spec.ts
│       │   └── signup.spec.ts
│       ├── products/            # Product tests
│       │   ├── productList.spec.ts
│       │   ├── productSearch.spec.ts
│       │   └── productDetails.spec.ts
│       └── home.spec.ts         # Home page tests
├── utils/
│   ├── constants.ts             # Centralized constants
│   └── testDataGenerator.ts    # Test data utilities
└── playwright.config.ts         # Playwright configuration
```

## 🧪 Test Coverage

**23 Tests - All Passing ✅**

| Feature | Tests | Status |
|---------|-------|--------|
| Authentication | 13 | ✅ Passing |
| - Login | 7 | ✅ |
| - Signup | 6 | ✅ |
| Products | 7 | ✅ Passing |
| - List | 2 | ✅ |
| - Search | 3 | ✅ |
| - Details | 2 | ✅ |
| Home/Navigation | 3 | ✅ Passing |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Pp1114/Playwright_Typescript_Project.git
cd Playwright_Typescript_Project

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/ui/auth/login.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium

# Run with UI mode
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

## 🏗️ Framework Architecture

### 1. Page Object Model (POM)

```typescript
// pages/LoginPage.ts
export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifySuccessfulLogin(username?: string) {
        await expect(this.loggedInAsText).toBeVisible();
        // ... helper method implementation
    }
}
```

### 2. Custom Fixtures

```typescript
// fixtures/pageFixtures.ts
export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    // ... other fixtures
});

// Usage in tests
test('Login test', async ({ loginPage }) => {
    await loginPage.login('user@test.com', 'password');
    await loginPage.verifySuccessfulLogin();
});
```

### 3. Helper Methods

```typescript
// Instead of repetitive assertions:
await expect(loginPage.loginHeader).toBeVisible();
await expect(loginPage.emailInput).toBeVisible();

// Use helper methods:
await loginPage.verifyLoginFormVisible();
```

## 🎨 Design Patterns & Best Practices

✅ **DRY Principle** - Helper methods eliminate code duplication
✅ **Separation of Concerns** - Clear separation between page objects, fixtures, and tests
✅ **Type Safety** - Full TypeScript support with strict typing
✅ **Consistent Timeouts** - Centralized timeout configuration
✅ **Clean Test Structure** - beforeEach/beforeAll hooks for setup
✅ **Dynamic Data** - Unique test data generation to avoid conflicts

## 📊 Test Results

All tests are verified passing on Chromium, Firefox, and WebKit browsers.

Example test output:
```
Running 23 tests using 8 workers

✓ Auth Tests (13)
  ✓ Login with valid credentials
  ✓ Login with invalid credentials
  ✓ Signup with valid data
  ✓ Signup with existing email
  ...

✓ Product Tests (7)
  ✓ Products page loads
  ✓ Search functionality
  ✓ Product details page
  ...

✓ Home Tests (3)
  ✓ Home page loads
  ✓ Navigation to products
  ✓ Navigation to login
  ...

23 passed (31.3s)
```

## 🛠️ Technology Stack

- **[Playwright](https://playwright.dev/)** - Modern E2E testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **Page Object Model** - Design pattern for maintainability
- **Custom Fixtures** - Dependency injection pattern
- **GitHub Actions** - CI/CD pipeline

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Pp1114**

- GitHub: [@Pp1114](https://github.com/Pp1114)

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Test site: [automationexercise.com](https://automationexercise.com)

---

⭐ If you find this project helpful, please consider giving it a star!

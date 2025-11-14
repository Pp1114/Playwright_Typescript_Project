# Test Plan: AutomationExercise.com E-Commerce Platform

## 1. Test Plan Overview

**Application Under Test:** AutomationExercise.com
**URL:** https://automationexercise.com/
**Purpose:** Full-fledged e-commerce practice website for automation testing
**Test Framework:** Playwright + TypeScript
**Test Level:** End-to-End (E2E) Testing

---

## 2. Test Scope

### 2.1 In Scope
- User Authentication (Sign up, Login, Logout)
- Product Catalog & Search
- Shopping Cart Functionality
- Product Categories & Filters
- Brand Filtering
- Newsletter Subscription
- Contact Form
- Navigation & Routing
- Responsive Design
- API Testing (if applicable)

### 2.2 Out of Scope
- Payment Gateway Integration (if restricted)
- Email Verification (unless test email service available)
- Performance Testing
- Security Testing
- Backend Database Testing

---

## 3. Test Strategy

### 3.1 Testing Types
- **Functional Testing:** Validate all features work as expected
- **UI Testing:** Verify visual elements and layout
- **Cross-Browser Testing:** Chrome, Firefox, Safari, Edge
- **Responsive Testing:** Desktop, Tablet, Mobile viewports
- **Regression Testing:** Ensure existing functionality remains intact
- **Smoke Testing:** Critical path validation

### 3.2 Test Approach
- Page Object Model (POM) design pattern
- Data-driven testing for multiple scenarios
- Parallel test execution where applicable
- Screenshot capture on failures
- Video recording for critical flows

---

## 4. Test Areas & Test Cases

### 4.1 Homepage
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_HOME_001 | Verify homepage loads successfully | High | Smoke |
| TC_HOME_002 | Verify all navigation menu items are visible | High | Functional |
| TC_HOME_003 | Verify featured products carousel functionality | Medium | Functional |
| TC_HOME_004 | Verify recommended items section displays | Medium | Functional |
| TC_HOME_005 | Verify footer links are clickable and navigate correctly | Low | Functional |
| TC_HOME_006 | Verify newsletter subscription form is visible | Medium | Functional |

### 4.2 User Authentication

#### Sign Up
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_AUTH_001 | Verify user can access signup page | High | Smoke |
| TC_AUTH_002 | Verify successful user registration with valid data | High | Functional |
| TC_AUTH_003 | Verify registration fails with existing email | High | Functional |
| TC_AUTH_004 | Verify validation messages for empty required fields | High | Functional |
| TC_AUTH_005 | Verify password field masking | Medium | Functional |
| TC_AUTH_006 | Verify email format validation | Medium | Functional |
| TC_AUTH_007 | Verify all form fields accept valid input | Medium | Functional |
| TC_AUTH_008 | Verify radio buttons and checkboxes functionality | Low | Functional |

#### Login
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_AUTH_009 | Verify login with valid credentials | High | Smoke |
| TC_AUTH_010 | Verify login fails with invalid credentials | High | Functional |
| TC_AUTH_011 | Verify login fails with empty fields | High | Functional |
| TC_AUTH_012 | Verify error message for incorrect email | Medium | Functional |
| TC_AUTH_013 | Verify error message for incorrect password | Medium | Functional |
| TC_AUTH_014 | Verify "Logged in as username" appears after login | High | Functional |

#### Logout
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_AUTH_015 | Verify user can logout successfully | High | Functional |
| TC_AUTH_016 | Verify user is redirected after logout | Medium | Functional |
| TC_AUTH_017 | Verify logout button visibility when logged in | Medium | Functional |

### 4.3 Product Catalog

#### Product Listing
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_PROD_001 | Verify Products page loads with product list | High | Smoke |
| TC_PROD_002 | Verify all products display with image, name, and price | High | Functional |
| TC_PROD_003 | Verify product count matches expected (40+ products) | Medium | Functional |
| TC_PROD_004 | Verify "View Product" button is visible for each product | High | Functional |
| TC_PROD_005 | Verify product prices display in correct format (Rs.) | Medium | Functional |

#### Product Details
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_PROD_006 | Verify product detail page opens on click | High | Functional |
| TC_PROD_007 | Verify product details include name, category, price, availability | High | Functional |
| TC_PROD_008 | Verify product image displays correctly | Medium | Functional |
| TC_PROD_009 | Verify quantity selector functionality | High | Functional |
| TC_PROD_010 | Verify "Add to Cart" button is functional | High | Smoke |

#### Product Search
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_PROD_011 | Verify search functionality with valid product name | High | Functional |
| TC_PROD_012 | Verify search returns relevant results | High | Functional |
| TC_PROD_013 | Verify search with partial product name | Medium | Functional |
| TC_PROD_014 | Verify search with no results shows appropriate message | Medium | Functional |
| TC_PROD_015 | Verify search is case-insensitive | Low | Functional |

### 4.4 Product Categories & Filters

#### Categories
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_CAT_001 | Verify all categories are visible (Women, Men, Kids) | High | Functional |
| TC_CAT_002 | Verify Women category expands to show subcategories | High | Functional |
| TC_CAT_003 | Verify Men category expands to show subcategories | High | Functional |
| TC_CAT_004 | Verify Kids category expands to show subcategories | High | Functional |
| TC_CAT_005 | Verify clicking category filters products correctly | High | Functional |
| TC_CAT_006 | Verify category breadcrumb navigation | Medium | Functional |

#### Brands
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_BRAND_001 | Verify all brands are visible in sidebar | High | Functional |
| TC_BRAND_002 | Verify clicking brand filters products | High | Functional |
| TC_BRAND_003 | Verify brand filter shows correct product count | Medium | Functional |
| TC_BRAND_004 | Verify multiple brand selections (if applicable) | Low | Functional |

### 4.5 Shopping Cart

#### Add to Cart
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_CART_001 | Verify adding single product to cart | High | Smoke |
| TC_CART_002 | Verify adding multiple products to cart | High | Functional |
| TC_CART_003 | Verify cart icon updates with item count | High | Functional |
| TC_CART_004 | Verify success message after adding to cart | Medium | Functional |
| TC_CART_005 | Verify adding product with custom quantity | High | Functional |
| TC_CART_006 | Verify "Continue Shopping" functionality | Medium | Functional |
| TC_CART_007 | Verify "View Cart" button navigates to cart page | High | Functional |

#### View Cart
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_CART_008 | Verify cart page displays all added products | High | Functional |
| TC_CART_009 | Verify product details in cart (image, name, price, qty) | High | Functional |
| TC_CART_010 | Verify total price calculation is correct | High | Functional |
| TC_CART_011 | Verify quantity can be updated from cart page | High | Functional |
| TC_CART_012 | Verify product can be removed from cart | High | Functional |
| TC_CART_013 | Verify empty cart message when no items | Medium | Functional |
| TC_CART_014 | Verify "Proceed to Checkout" button is visible | High | Functional |

#### Checkout Process
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_CART_015 | Verify checkout page loads successfully | High | Smoke |
| TC_CART_016 | Verify delivery address section | High | Functional |
| TC_CART_017 | Verify review order section shows all items | High | Functional |
| TC_CART_018 | Verify comment box for order | Medium | Functional |
| TC_CART_019 | Verify place order functionality | High | Functional |
| TC_CART_020 | Verify checkout requires user login | High | Functional |

### 4.6 Contact Form
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_CONTACT_001 | Verify Contact Us page loads | High | Functional |
| TC_CONTACT_002 | Verify all form fields are present | High | Functional |
| TC_CONTACT_003 | Verify form submission with valid data | High | Functional |
| TC_CONTACT_004 | Verify validation for required fields | High | Functional |
| TC_CONTACT_005 | Verify email format validation | Medium | Functional |
| TC_CONTACT_006 | Verify file upload functionality (if available) | Medium | Functional |
| TC_CONTACT_007 | Verify success message after submission | High | Functional |

### 4.7 Newsletter Subscription
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_NEWS_001 | Verify newsletter subscription form is visible | Medium | Functional |
| TC_NEWS_002 | Verify subscription with valid email | High | Functional |
| TC_NEWS_003 | Verify validation for invalid email format | Medium | Functional |
| TC_NEWS_004 | Verify success/error message display | Medium | Functional |
| TC_NEWS_005 | Verify duplicate email subscription handling | Low | Functional |

### 4.8 Test Cases Page
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_TEST_001 | Verify Test Cases page is accessible | High | Functional |
| TC_TEST_002 | Verify test cases list displays | Medium | Functional |
| TC_TEST_003 | Verify test case details are readable | Low | Functional |

### 4.9 Navigation & Routing
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_NAV_001 | Verify all navigation menu links work | High | Smoke |
| TC_NAV_002 | Verify browser back button functionality | Medium | Functional |
| TC_NAV_003 | Verify browser forward button functionality | Medium | Functional |
| TC_NAV_004 | Verify page refresh maintains state | Medium | Functional |
| TC_NAV_005 | Verify direct URL navigation | Medium | Functional |
| TC_NAV_006 | Verify logo click returns to homepage | Medium | Functional |

### 4.10 Responsive Design
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_RESP_001 | Verify desktop viewport (1920x1080) | High | Responsive |
| TC_RESP_002 | Verify tablet viewport (768x1024) | High | Responsive |
| TC_RESP_003 | Verify mobile viewport (375x667) | High | Responsive |
| TC_RESP_004 | Verify hamburger menu on mobile | High | Responsive |
| TC_RESP_005 | Verify product grid adjusts to viewport | Medium | Responsive |
| TC_RESP_006 | Verify forms are usable on mobile | High | Responsive |

### 4.11 Cross-Browser Testing
| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC_BROWSER_001 | Verify critical flows on Chrome | High | Cross-Browser |
| TC_BROWSER_002 | Verify critical flows on Firefox | High | Cross-Browser |
| TC_BROWSER_003 | Verify critical flows on Safari | Medium | Cross-Browser |
| TC_BROWSER_004 | Verify critical flows on Edge | Medium | Cross-Browser |

---

## 5. Test Data Requirements

### 5.1 User Data
- Valid user credentials (email, password)
- Invalid user credentials
- New user registration data
- Multiple user profiles for different scenarios

### 5.2 Product Data
- Product names for search
- Product categories
- Brand names
- Price ranges
- Quantity values

### 5.3 Contact Form Data
- Valid/invalid email addresses
- Text content for message field
- File upload samples (if applicable)

---

## 6. Test Environment

### 6.1 Browsers
- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version - if on macOS)
- Edge (latest version)

### 6.2 Devices/Viewports
- Desktop: 1920x1080, 1366x768
- Tablet: 768x1024, 820x1180
- Mobile: 375x667 (iPhone), 360x640 (Android)

### 6.3 Test Data Location
- `testData/users.json` - User credentials
- `testData/products.json` - Product information
- `.env` - Environment variables

---

## 7. Test Deliverables

- Test cases in Playwright/TypeScript
- Page Object Models for all pages
- Test execution reports (HTML, JSON)
- Screenshots of failures
- Video recordings of test runs
- Test summary report

---

## 8. Entry & Exit Criteria

### 8.1 Entry Criteria
- Test environment is set up and accessible
- Playwright framework is configured
- Test data is prepared
- Website is accessible and stable

### 8.2 Exit Criteria
- All high-priority test cases executed
- 95% test pass rate for critical functionality
- All critical defects resolved
- Test report generated and reviewed

---

## 9. Test Execution Schedule

### Phase 1: Smoke Testing (Day 1)
- Homepage load
- User login
- Add product to cart
- Basic navigation

### Phase 2: Core Functionality (Days 2-3)
- Complete authentication flows
- Product catalog and search
- Shopping cart operations
- Category and brand filters

### Phase 3: Extended Testing (Days 4-5)
- Contact form
- Newsletter subscription
- Checkout process
- Edge cases and validations

### Phase 4: Cross-Browser & Responsive (Day 6)
- Execute on all browsers
- Test all viewports
- Regression testing

### Phase 5: Reporting (Day 7)
- Consolidate results
- Document defects
- Generate final report

---

## 10. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Website downtime | High | Schedule tests during stable hours, implement retries |
| Flaky tests due to timing | Medium | Use proper waits, increase timeout for slow operations |
| Test data conflicts | Medium | Use unique data generation for each test run |
| Browser compatibility issues | Low | Test on latest stable browser versions |
| Dynamic content loading | Medium | Implement explicit waits and proper selectors |

---

## 11. Defect Management

- **Severity Levels:** Critical, High, Medium, Low
- **Priority Levels:** P0, P1, P2, P3
- **Tracking:** Use issue tracking system (GitHub Issues, Jira, etc.)
- **Reporting:** Include screenshots, steps to reproduce, expected vs actual results

---

## 12. Test Metrics

- **Total Test Cases:** Track number of test cases
- **Test Execution Rate:** Tests executed / Total tests
- **Pass Rate:** Passed tests / Total executed tests
- **Defect Density:** Defects found / Test cases executed
- **Test Coverage:** Features covered / Total features

---

## 13. Automation Framework Structure

```
playwright-project/
├── tests/
│   ├── ui/
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   ├── signup.spec.ts
│   │   │   └── logout.spec.ts
│   │   ├── products/
│   │   │   ├── productList.spec.ts
│   │   │   ├── productDetails.spec.ts
│   │   │   └── productSearch.spec.ts
│   │   ├── cart/
│   │   │   ├── addToCart.spec.ts
│   │   │   ├── viewCart.spec.ts
│   │   │   └── checkout.spec.ts
│   │   ├── categories/
│   │   │   └── categoryFilter.spec.ts
│   │   ├── contact/
│   │   │   └── contactForm.spec.ts
│   │   └── home.spec.ts
│   └── api/
│       └── api.spec.ts (if applicable)
├── pages/
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── SignupPage.ts
│   ├── ProductsPage.ts
│   ├── ProductDetailPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── ContactPage.ts
│   └── BasePage.ts
├── testData/
│   ├── users.json
│   ├── products.json
│   └── testConstants.ts
├── utils/
│   ├── helpers.ts
│   └── dataGenerator.ts
├── playwright.config.ts
└── package.json
```

---

## 14. Best Practices

1. **Use Page Object Model:** Maintain separate page classes
2. **Independent Tests:** Each test should be self-contained
3. **Descriptive Names:** Use clear test and function names
4. **Avoid Hard Waits:** Use Playwright's auto-waiting features
5. **Data-Driven Testing:** Externalize test data
6. **Screenshot on Failure:** Capture evidence for debugging
7. **Parallel Execution:** Run tests in parallel where possible
8. **Regular Maintenance:** Keep selectors and tests updated
9. **Code Reviews:** Review test code for quality
10. **Version Control:** Commit tests to Git regularly

---

## 15. Tools & Technologies

- **Test Framework:** Playwright
- **Language:** TypeScript
- **Reporting:** Playwright HTML Reporter, Allure
- **CI/CD:** GitHub Actions, Jenkins (optional)
- **Version Control:** Git
- **IDE:** VS Code

---

## 16. Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| QA Manager | | | |
| Project Manager | | | |

---

**Document Version:** 1.0
**Last Updated:** 2025-11-13
**Created By:** QA Team

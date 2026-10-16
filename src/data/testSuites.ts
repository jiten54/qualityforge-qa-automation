import { AutomatedTestCase } from '../types/qa';

export const AUTOMATED_TEST_SUITES: AutomatedTestCase[] = [
  // --- SMOKE AUTOMATION SUITE ---
  {
    id: "AUTO-SMK-01",
    name: "test_homepage_launch_and_navigation",
    suiteType: "Smoke",
    file: "tests/ui/test_smoke.py",
    durationMs: 420,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "Navigate to base URL",
        action: "page.goto(BASE_URL)",
        target: "http://localhost:3000",
        expected: "Page loads with HTTP 200 within 1500ms",
        status: "passed",
        durationMs: 140,
        assertionLog: "ASSERT page.title() == 'QualityForge — Manual & Automated Testing Framework'"
      },
      {
        stepNumber: 2,
        description: "Verify header brand and navigation elements",
        action: "expect(page.locator('[data-testid=\"app-brand\"]')).to_be_visible()",
        target: "[data-testid=\"app-brand\"]",
        expected: "Brand element visible and contains 'QualityForge'",
        status: "passed",
        durationMs: 80,
        assertionLog: "ASSERT locator.is_visible() is True"
      },
      {
        stepNumber: 3,
        description: "Verify catalog grid renders products",
        action: "expect(page.locator('[data-testid=\"product-card\"]')).to_have_count(4)",
        target: "[data-testid=\"product-card\"]",
        expected: "Exact count of 4 catalog product cards rendered",
        status: "passed",
        durationMs: 200,
        assertionLog: "ASSERT locator.count() == 4 (Found 4 product cards)"
      }
    ]
  },
  {
    id: "AUTO-SMK-02",
    name: "test_user_successful_authentication",
    suiteType: "Smoke",
    file: "tests/ui/test_auth.py",
    durationMs: 510,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "Click login modal trigger button",
        action: "page.click('[data-testid=\"btn-signin-modal\"]')",
        target: "[data-testid=\"btn-signin-modal\"]",
        expected: "Sign In modal dialog opens and receives focus",
        status: "passed",
        durationMs: 90,
        assertionLog: "ASSERT dialog[data-testid=\"modal-auth\"].is_visible() is True"
      },
      {
        stepNumber: 2,
        description: "Fill valid QA user credentials",
        action: "page.fill('#login-email', 'sarah.qa@strivelogic.com') && page.fill('#login-pass', 'Password123!')",
        target: "#login-email, #login-pass",
        expected: "Credentials entered cleanly into inputs",
        status: "passed",
        durationMs: 150,
        assertionLog: "ASSERT input values match sanitized synthetic test user"
      },
      {
        stepNumber: 3,
        description: "Submit login form and verify session badge",
        action: "page.click('[data-testid=\"btn-submit-login\"]')",
        target: "[data-testid=\"btn-submit-login\"]",
        expected: "Session state authenticated, user name displayed",
        status: "passed",
        durationMs: 270,
        assertionLog: "ASSERT locator('[data-testid=\"user-display-name\"]').inner_text() == 'Sarah Jenkins'"
      }
    ]
  },
  {
    id: "AUTO-SMK-03",
    name: "test_add_to_cart_and_drawer_display",
    suiteType: "Smoke",
    file: "tests/ui/test_cart.py",
    durationMs: 480,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "Click Add to Cart on first item",
        action: "page.click('[data-testid=\"btn-add-to-cart-1\"]')",
        target: "[data-testid=\"btn-add-to-cart-1\"]",
        expected: "Button triggers cart update and visual confirmation",
        status: "passed",
        durationMs: 110,
        assertionLog: "ASSERT locator('[data-testid=\"cart-badge\"]').text_content() == '1'"
      },
      {
        stepNumber: 2,
        description: "Open shopping cart drawer",
        action: "page.click('[data-testid=\"btn-open-cart\"]')",
        target: "[data-testid=\"btn-open-cart\"]",
        expected: "Cart drawer slides in with item details and subtotal",
        status: "passed",
        durationMs: 190,
        assertionLog: "ASSERT locator('[data-testid=\"cart-item-title\"]').inner_text() == 'Aura ANC Studio Wireless Headphones'"
      },
      {
        stepNumber: 3,
        description: "Verify subtotal displays $199.99",
        action: "expect(page.locator('[data-testid=\"cart-subtotal\"]')).to_have_text('$199.99')",
        target: "[data-testid=\"cart-subtotal\"]",
        expected: "Subtotal matches item price $199.99",
        status: "passed",
        durationMs: 180,
        assertionLog: "ASSERT cart_subtotal == '$199.99'"
      }
    ]
  },

  // --- FUNCTIONAL AUTOMATION SUITE ---
  {
    id: "AUTO-FNC-01",
    name: "test_product_search_and_filter",
    suiteType: "Functional",
    file: "tests/ui/test_catalog.py",
    durationMs: 450,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "Search for query 'mechanical'",
        action: "page.fill('[data-testid=\"input-search\"]', 'mechanical')",
        target: "[data-testid=\"input-search\"]",
        expected: "Input updates and triggers debounced search filter",
        status: "passed",
        durationMs: 120,
        assertionLog: "ASSERT search_term == 'mechanical'"
      },
      {
        stepNumber: 2,
        description: "Assert single matching product card displayed",
        action: "expect(page.locator('[data-testid=\"product-card\"]')).to_have_count(1)",
        target: "[data-testid=\"product-card\"]",
        expected: "Exactly 1 item displayed matching mechanical keyboard",
        status: "passed",
        durationMs: 160,
        assertionLog: "ASSERT product_title == 'Vanguard Tenkeyless Mechanical Keyboard'"
      },
      {
        stepNumber: 3,
        description: "Clear search query and assert catalog reset",
        action: "page.click('[data-testid=\"btn-clear-search\"]')",
        target: "[data-testid=\"btn-clear-search\"]",
        expected: "All 4 catalog items restored",
        status: "passed",
        durationMs: 170,
        assertionLog: "ASSERT locator('[data-testid=\"product-card\"]').count() == 4"
      }
    ]
  },
  {
    id: "AUTO-FNC-02",
    name: "test_cart_quantity_mutation_and_totals",
    suiteType: "Functional",
    file: "tests/ui/test_cart.py",
    durationMs: 590,
    status: "failed", // Highlight deliberate bug reproduction DEF-001!
    errorTrace: "AssertionError: Expected subtotal '$399.98', but found '$199.99'. Cart total did not recalculate when quantity incremented from 1 to 2. (DEF-001)",
    steps: [
      {
        stepNumber: 1,
        description: "Ensure cart contains 1 unit of Headphones",
        action: "setup_cart_fixture(product_id=1, qty=1)",
        target: "Cart Fixture",
        expected: "Cart populated with 1 item at $199.99",
        status: "passed",
        durationMs: 130,
        assertionLog: "ASSERT cart.items[0].quantity == 1"
      },
      {
        stepNumber: 2,
        description: "Click increment button to change quantity to 2",
        action: "page.click('[data-testid=\"btn-qty-plus-1\"]')",
        target: "[data-testid=\"btn-qty-plus-1\"]",
        expected: "Quantity input displays '2'",
        status: "passed",
        durationMs: 170,
        assertionLog: "ASSERT locator('[data-testid=\"qty-val-1\"]').inner_text() == '2'"
      },
      {
        stepNumber: 3,
        description: "Assert subtotal recalculated to $399.98 (2 * $199.99)",
        action: "expect(page.locator('[data-testid=\"cart-subtotal\"]')).to_have_text('$399.98')",
        target: "[data-testid=\"cart-subtotal\"]",
        expected: "Subtotal updates to $399.98",
        status: "failed",
        durationMs: 290,
        assertionLog: "FAIL: locator('[data-testid=\"cart-subtotal\"]').inner_text() was '$199.99', expected '$399.98'. Linked to Defect DEF-001."
      }
    ]
  },
  {
    id: "AUTO-FNC-03",
    name: "test_checkout_end_to_end_order_submission",
    suiteType: "Functional",
    file: "tests/ui/test_checkout.py",
    durationMs: 640,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "Navigate to checkout with cart items",
        action: "page.click('[data-testid=\"btn-checkout-nav\"]')",
        target: "[data-testid=\"btn-checkout-nav\"]",
        expected: "Checkout view renders order summary and shipping form",
        status: "passed",
        durationMs: 150,
        assertionLog: "ASSERT locator('[data-testid=\"checkout-form\"]').is_visible() is True"
      },
      {
        stepNumber: 2,
        description: "Fill shipping form fields",
        action: "fill_shipping_form(name='Sarah Jenkins', street='742 Evergreen', city='Springfield', state='OR', zip='97477')",
        target: "Shipping Form inputs",
        expected: "All fields validly populated",
        status: "passed",
        durationMs: 210,
        assertionLog: "ASSERT form.validate() == Valid"
      },
      {
        stepNumber: 3,
        description: "Submit order and assert confirmation number",
        action: "page.click('[data-testid=\"btn-place-order\"]')",
        target: "[data-testid=\"btn-place-order\"]",
        expected: "Confirmation view renders with order prefix 'QFG-2026-'",
        status: "passed",
        durationMs: 280,
        assertionLog: "ASSERT locator('[data-testid=\"order-confirmation-number\"]').inner_text() matches r'QFG-2026-\\d{4}'"
      }
    ]
  },

  // --- API AUTOMATION SUITE ---
  {
    id: "AUTO-API-01",
    name: "test_api_get_products_list_and_schema",
    suiteType: "API",
    file: "tests/api/test_products_api.py",
    durationMs: 210,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "GET /api/v1/products",
        action: "requests.get(f'{API_URL}/products')",
        target: "GET /api/v1/products",
        expected: "HTTP 200 OK, application/json",
        status: "passed",
        durationMs: 85,
        assertionLog: "ASSERT response.status_code == 200, Content-Type == 'application/json'"
      },
      {
        stepNumber: 2,
        description: "Validate JSON response schema and product attributes",
        action: "validate_schema(response.json(), ProductListSchema)",
        target: "Response Body JSON",
        expected: "All items have id, sku, name, price, stock, rating",
        status: "passed",
        durationMs: 65,
        assertionLog: "ASSERT len(data) == 4; all keys conform to OpenAPI 3.0 specification"
      },
      {
        stepNumber: 3,
        description: "Validate pricing values are positive floats",
        action: "assert all(p['price'] > 0 for p in response.json())",
        target: "Price verification",
        expected: "All product prices > 0.00",
        status: "passed",
        durationMs: 60,
        assertionLog: "ASSERT min_price: 79.99, max_price: 249.00"
      }
    ]
  },
  {
    id: "AUTO-API-02",
    name: "test_api_auth_invalid_credentials_returns_401",
    suiteType: "API",
    file: "tests/api/test_auth_api.py",
    durationMs: 180,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "POST /api/v1/auth/login with wrong password",
        action: "requests.post(f'{API_URL}/auth/login', json={'email':'sarah.qa@strivelogic.com', 'password':'WrongPassword!'})",
        target: "POST /api/v1/auth/login",
        expected: "HTTP 401 Unauthorized",
        status: "passed",
        durationMs: 90,
        assertionLog: "ASSERT response.status_code == 401"
      },
      {
        stepNumber: 2,
        description: "Assert error message conforms to security guidelines",
        action: "assert response.json()['error'] == 'Invalid email or password'",
        target: "Error response body",
        expected: "Generic error message prevents account enumeration",
        status: "passed",
        durationMs: 90,
        assertionLog: "ASSERT 'error' in response.json() and 'token' not in response.json()"
      }
    ]
  },
  {
    id: "AUTO-API-03",
    name: "test_api_order_creation_payload_validation",
    suiteType: "API",
    file: "tests/api/test_orders_api.py",
    durationMs: 240,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "POST /api/v1/orders with missing shippingAddress",
        action: "requests.post(f'{API_URL}/orders', json={'items':[{'productId':1,'quantity':1}]})",
        target: "POST /api/v1/orders",
        expected: "HTTP 422 Unprocessable Entity",
        status: "passed",
        durationMs: 110,
        assertionLog: "ASSERT response.status_code == 422"
      },
      {
        stepNumber: 2,
        description: "Verify validation field error details",
        action: "assert 'shippingAddress' in response.json()['errors']",
        target: "Error details",
        expected: "Field error indicates required shipping details",
        status: "passed",
        durationMs: 130,
        assertionLog: "ASSERT validation_errors['shippingAddress'] == 'Field required'"
      }
    ]
  },

  // --- DATABASE AUTOMATION SUITE ---
  {
    id: "AUTO-DB-01",
    name: "test_sqlite_referential_integrity_foreign_keys",
    suiteType: "Database",
    file: "tests/database/test_sqlite_validation.py",
    durationMs: 160,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "Connect to SQLite database and verify FK enforcement",
        action: "db.execute('PRAGMA foreign_keys = ON;')",
        target: "SQLite pragma",
        expected: "Foreign keys enabled",
        status: "passed",
        durationMs: 40,
        assertionLog: "ASSERT cursor.fetchone()[0] == 1"
      },
      {
        stepNumber: 2,
        description: "Query for orphan orders referencing non-existent user IDs",
        action: "SELECT count(*) FROM orders WHERE user_id NOT IN (SELECT id FROM users);",
        target: "orders table",
        expected: "Orphan count equals 0",
        status: "passed",
        durationMs: 60,
        assertionLog: "ASSERT orphan_orders_count == 0 (All orders reference valid users)"
      },
      {
        stepNumber: 3,
        description: "Query for orphan order items referencing non-existent products",
        action: "SELECT count(*) FROM order_items WHERE product_id NOT IN (SELECT id FROM products);",
        target: "order_items table",
        expected: "Orphan items count equals 0",
        status: "passed",
        durationMs: 60,
        assertionLog: "ASSERT orphan_order_items_count == 0"
      }
    ]
  },
  {
    id: "AUTO-DB-02",
    name: "test_sqlite_order_financial_arithmetic_consistency",
    suiteType: "Database",
    file: "tests/database/test_sqlite_validation.py",
    durationMs: 190,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "Reconcile stored total against (subtotal + tax + shipping)",
        action: "SELECT id, total, (subtotal + tax + shipping) FROM orders WHERE ABS(total - (subtotal + tax + shipping)) > 0.01;",
        target: "Financial reconciliation query",
        expected: "0 divergent rows",
        status: "passed",
        durationMs: 100,
        assertionLog: "ASSERT len(divergent_orders) == 0 (100% financial formula integrity)"
      },
      {
        stepNumber: 2,
        description: "Reconcile line items sum against order subtotal",
        action: "SELECT o.id, o.subtotal, SUM(oi.unit_price * oi.quantity) FROM orders o JOIN order_items oi ON o.id = oi.order_id GROUP BY o.id HAVING ABS(o.subtotal - SUM(oi.unit_price * oi.quantity)) > 0.01;",
        target: "Line items reconciliation query",
        expected: "0 discrepancy rows",
        status: "passed",
        durationMs: 90,
        assertionLog: "ASSERT line_item_sum == order.subtotal across all historical orders"
      }
    ]
  },

  // --- REGRESSION AUTOMATION SUITE ---
  {
    id: "AUTO-REG-01",
    name: "test_regression_postal_code_regex_validation",
    suiteType: "Regression",
    file: "tests/ui/test_regression.py",
    durationMs: 490,
    status: "failed", // Highlight deliberate bug reproduction DEF-002!
    errorTrace: "AssertionError: Expected validation error for invalid postal code 'ABCDE', but checkout form submitted successfully. (DEF-002)",
    steps: [
      {
        stepNumber: 1,
        description: "Navigate to checkout with items",
        action: "goto_checkout_with_active_cart()",
        target: "Checkout View",
        expected: "Checkout form ready",
        status: "passed",
        durationMs: 140,
        assertionLog: "ASSERT page.url.endswith('/checkout')"
      },
      {
        stepNumber: 2,
        description: "Input invalid alphanumeric postal code 'ABCDE'",
        action: "page.fill('[data-testid=\"input-zip\"]', 'ABCDE')",
        target: "[data-testid=\"input-zip\"]",
        expected: "Input populated with 'ABCDE'",
        status: "passed",
        durationMs: 120,
        assertionLog: "ASSERT zip_input.value == 'ABCDE'"
      },
      {
        stepNumber: 3,
        description: "Click Place Order and assert validation message displays",
        action: "page.click('[data-testid=\"btn-place-order\"]')",
        target: "[data-testid=\"btn-place-order\"]",
        expected: "Error element '[data-testid=\"err-zip\"]' is visible",
        status: "failed",
        durationMs: 230,
        assertionLog: "FAIL: Expected postal validation error, but form submitted without rejection. Linked to Defect DEF-002."
      }
    ]
  },
  {
    id: "AUTO-REG-02",
    name: "test_regression_logout_clears_protected_tokens",
    suiteType: "Regression",
    file: "tests/ui/test_auth_regression.py",
    durationMs: 410,
    status: "passed",
    steps: [
      {
        stepNumber: 1,
        description: "Log in user and verify local storage auth token",
        action: "authenticate_user_session()",
        target: "Browser LocalStorage",
        expected: "Auth token present in storage",
        status: "passed",
        durationMs: 150,
        assertionLog: "ASSERT localStorage.getItem('auth_token') is not None"
      },
      {
        stepNumber: 2,
        description: "Click Sign Out button",
        action: "page.click('[data-testid=\"btn-sign-out\"]')",
        target: "[data-testid=\"btn-sign-out\"]",
        expected: "Sign Out clears session and switches header state",
        status: "passed",
        durationMs: 120,
        assertionLog: "ASSERT localStorage.getItem('auth_token') is None"
      },
      {
        stepNumber: 3,
        description: "Attempt direct navigation to protected /orders tab",
        action: "page.click('[data-testid=\"nav-orders\"]')",
        target: "[data-testid=\"nav-orders\"]",
        expected: "Protected view redirects to login prompt modal",
        status: "passed",
        durationMs: 140,
        assertionLog: "ASSERT locator('[data-testid=\"modal-auth\"]').is_visible() is True"
      }
    ]
  }
];

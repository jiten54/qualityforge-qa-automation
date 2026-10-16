import { ManualTestCase } from '../types/qa';

export const MANUAL_TEST_CASES: ManualTestCase[] = [
  // --- SMOKE TESTS (TC-SMK) ---
  {
    id: "TC-SMK-001",
    requirementId: "REQ-GEN-01",
    category: "Smoke",
    scenario: "Verify application homepage loads with core navigation and branding",
    preconditions: "Application server is up and accessible via browser",
    steps: [
      "1. Navigate to application URL",
      "2. Verify top navigation bar displays brand logo",
      "3. Verify primary links (Store, Cart, Account) are visible"
    ],
    testData: "URL: /",
    expectedResult: "Homepage renders within 1.5s with zero console errors. Brand and navigation links are interactive.",
    actualResult: "Homepage loaded cleanly. All primary navigation links visible and interactive.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-SMK-01.png"
  },
  {
    id: "TC-SMK-002",
    requirementId: "REQ-AUTH-01",
    category: "Smoke",
    scenario: "Verify valid user can successfully authenticate and establish session",
    preconditions: "User record exists in database (sarah.qa@strivelogic.com)",
    steps: [
      "1. Click 'Sign In' button",
      "2. Enter valid email and password",
      "3. Click 'Log In' submit button"
    ],
    testData: "Email: sarah.qa@strivelogic.com, Password: Password123!",
    expectedResult: "User is redirected to authenticated view, greeting badge displays user name, session token stored.",
    actualResult: "Authenticated session established. User name 'Sarah Jenkins' displayed in header.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-SMK-02.png"
  },
  {
    id: "TC-SMK-003",
    requirementId: "REQ-CAT-01",
    category: "Smoke",
    scenario: "Verify product catalog renders all active inventory items with prices",
    preconditions: "Database contains active product catalog",
    steps: [
      "1. Open Store catalog view",
      "2. Inspect product cards for SKU, Title, Price, and Image",
      "3. Verify 'Add to Cart' button is present on each item"
    ],
    testData: "Catalog: 4 active demo products",
    expectedResult: "All 4 inventory items displayed with accurate pricing, rating, stock status, and add-to-cart controls.",
    actualResult: "Catalog rendered 4 products with valid images, pricing ($79.99 - $249.00), and buttons.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-SMK-03.png"
  },
  {
    id: "TC-SMK-004",
    requirementId: "REQ-CRT-01",
    category: "Smoke",
    scenario: "Verify single product addition to shopping cart updates badge count",
    preconditions: "User has active session and empty cart",
    steps: [
      "1. On catalog page, click 'Add to Cart' on 'Aura ANC Studio Wireless Headphones'",
      "2. Observe cart badge icon in header",
      "3. Open cart drawer"
    ],
    testData: "Product ID: 1, Quantity: 1",
    expectedResult: "Cart badge updates to '1'. Cart drawer opens displaying Aura ANC item at $199.99.",
    actualResult: "Cart badge incremented to 1; item correctly populated in drawer.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-SMK-04.png"
  },
  {
    id: "TC-SMK-005",
    requirementId: "REQ-CHK-01",
    category: "Smoke",
    scenario: "Verify checkout form loads with populated order summary",
    preconditions: "At least 1 item in cart",
    steps: [
      "1. Open Cart view",
      "2. Click 'Proceed to Checkout'",
      "3. Verify checkout form fields and order summary display"
    ],
    testData: "Cart containing 1 item ($199.99)",
    expectedResult: "Checkout screen displays customer details form, payment method inputs, and itemized subtotal.",
    actualResult: "Checkout screen loaded with all required form controls and accurate $199.99 subtotal.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-SMK-05.png"
  },
  {
    id: "TC-SMK-006",
    requirementId: "REQ-AUTH-04",
    category: "Smoke",
    scenario: "Verify user logout terminates session and restricts access to protected views",
    preconditions: "User is currently authenticated",
    steps: [
      "1. Click user account menu in top right",
      "2. Click 'Sign Out'",
      "3. Attempt to navigate to /orders directly"
    ],
    testData: "Authenticated session for Sarah Jenkins",
    expectedResult: "Session token cleared. Header switches back to 'Sign In' state. Protected pages redirect to login.",
    actualResult: "User logged out cleanly. Protected page redirected to login with notice.",
    status: "Passed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-SMK-06.png"
  },

  // --- FUNCTIONAL TESTS (TC-FNC) ---
  {
    id: "TC-FNC-001",
    requirementId: "REQ-AUTH-02",
    category: "Functional",
    scenario: "Verify new user registration with valid details creates account in database",
    preconditions: "User is on Registration modal",
    steps: [
      "1. Enter valid Full Name: 'Marcus Vance'",
      "2. Enter unique Email: 'marcus.v@example.com'",
      "3. Enter valid Password: 'SecurePass987!'",
      "4. Click 'Create Account'"
    ],
    testData: "Name: Marcus Vance, Email: marcus.v@example.com, Pass: SecurePass987!",
    expectedResult: "Account successfully created, user automatically logged in, database record created in users table.",
    actualResult: "Registration succeeded. User session established and account ID assigned.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-01.png"
  },
  {
    id: "TC-FNC-002",
    requirementId: "REQ-CAT-02",
    category: "Functional",
    scenario: "Verify search bar filters products dynamically by keyword matching name and description",
    preconditions: "Catalog view is open",
    steps: [
      "1. Click into search input",
      "2. Type search query 'keyboard'",
      "3. Inspect filtered results list"
    ],
    testData: "Query: 'keyboard'",
    expectedResult: "Catalog filters to display only Vanguard Tenkeyless Mechanical Keyboard (1 result).",
    actualResult: "Search accurately displayed 1 product matching keyword 'keyboard'.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-02.png"
  },
  {
    id: "TC-FNC-003",
    requirementId: "REQ-CAT-03",
    category: "Functional",
    scenario: "Verify category filter tabs restrict catalog view to selected segment",
    preconditions: "Catalog view contains items across Audio, Peripherals, Wearables",
    steps: [
      "1. Click 'Peripherals' category button",
      "2. Verify displayed products",
      "3. Click 'All Products' to reset"
    ],
    testData: "Category: 'Peripherals'",
    expectedResult: "Displays only Keyboard and Mouse (2 items). All category resets to all 4 items.",
    actualResult: "Category filter correctly isolated Peripherals items and reset properly.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-03.png"
  },
  {
    id: "TC-FNC-004",
    requirementId: "REQ-CAT-04",
    category: "Functional",
    scenario: "Verify clicking product card opens detail modal with full specs and review count",
    preconditions: "Product catalog displayed",
    steps: [
      "1. Click on 'Chronos Titanium GPS Smartwatch' card",
      "2. Verify modal opens with high-res photo, rating, reviews count, specs, and price",
      "3. Click close button or backdrop"
    ],
    testData: "Product ID: 4",
    expectedResult: "Modal renders with accurate title, description, SKU, stock count (12), and $249.00 price.",
    actualResult: "Detail modal opened with complete specification sheet and stock telemetry.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-04.png"
  },
  {
    id: "TC-FNC-005",
    requirementId: "REQ-CRT-02",
    category: "Functional",
    scenario: "Verify removing an item from the cart removes row and adjusts total",
    preconditions: "Cart contains 2 distinct items (Headphones $199.99 and Mouse $79.99)",
    steps: [
      "1. Open cart drawer",
      "2. Click trash/remove icon on 'Precision Ergonomic Wireless Mouse'",
      "3. Verify item is removed from list and subtotal updates to $199.99"
    ],
    testData: "Remove Product ID 3",
    expectedResult: "Row is deleted, cart count decrements by 1, subtotal recalculates to $199.99.",
    actualResult: "Item removed immediately, subtotal recalculated from $279.98 to $199.99.",
    status: "Passed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-05.png"
  },
  {
    id: "TC-FNC-006",
    requirementId: "REQ-CRT-03",
    category: "Functional",
    scenario: "Verify cart item quantity increment updates line total and overall subtotal",
    preconditions: "Cart contains 1 unit of Headphones ($199.99)",
    steps: [
      "1. Open cart drawer",
      "2. Click '+' button on quantity selector to increase quantity from 1 to 2",
      "3. Inspect item line total and overall cart subtotal"
    ],
    testData: "Product ID: 1, Old Qty: 1, New Qty: 2",
    expectedResult: "Line total shows $399.98, and cart subtotal updates to $399.98.",
    actualResult: "BUG DETECTED (DEF-001): Quantity increased to 2, but subtotal remained stuck at $199.99 until page reload.",
    status: "Failed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "BUG-DEF-001-evidence.png",
    notes: "Reproduces Defect DEF-001: Cart subtotal fails to recompute upon quantity mutation."
  },
  {
    id: "TC-FNC-007",
    requirementId: "REQ-CHK-02",
    category: "Functional",
    scenario: "Verify complete valid checkout submits order and returns confirmation number",
    preconditions: "User logged in with 1 item in cart",
    steps: [
      "1. Navigate to Checkout",
      "2. Fill valid shipping address (Name, Street, City, State: OR, Zip: 97477)",
      "3. Select Credit Card payment",
      "4. Click 'Place Order'"
    ],
    testData: "Address: 742 Evergreen Terr, Springfield, OR 97477",
    expectedResult: "Order submitted successfully. Confirmation screen shows order number (QFG-2026-XXXX) and delivery estimate.",
    actualResult: "Order confirmation screen displayed with unique order number and clear receipt breakdown.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-07.png"
  },
  {
    id: "TC-FNC-008",
    requirementId: "REQ-ORD-01",
    category: "Functional",
    scenario: "Verify newly created order appears in user Order History with exact item breakdown",
    preconditions: "Order placed in previous step",
    steps: [
      "1. Navigate to 'Order History' tab",
      "2. Locate most recent order record",
      "3. Verify order total, date, status, and itemized rows match placed order"
    ],
    testData: "User ID: 101, Order: QFG-2026-9021",
    expectedResult: "Order is listed with status 'Delivered' / 'Processing', accurate total, and item row.",
    actualResult: "Order displayed with accurate subtotal, tax calculation, and date timestamp.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-08.png"
  },
  {
    id: "TC-FNC-009",
    requirementId: "REQ-CHK-03",
    category: "Functional",
    scenario: "Verify tax computation applies standard 8% rate to taxable subtotal",
    preconditions: "Cart with known subtotal ($100.00 base test)",
    steps: [
      "1. Add item with $100.00 subtotal to cart",
      "2. Proceed to checkout",
      "3. Verify tax line item equals subtotal * 0.08"
    ],
    testData: "Subtotal: $129.50 -> Expected Tax: $10.36",
    expectedResult: "Tax line displays exactly $10.36 (8% of $129.50) rounded to two decimals.",
    actualResult: "Tax displayed $10.36, total formula equals subtotal + tax + shipping.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-09.png"
  },
  {
    id: "TC-FNC-010",
    requirementId: "REQ-CHK-04",
    category: "Functional",
    scenario: "Verify free shipping threshold applies when subtotal reaches or exceeds $150.00",
    preconditions: "Cart is empty",
    steps: [
      "1. Add Headphones ($199.99) to cart",
      "2. Proceed to checkout",
      "3. Inspect shipping fee in order summary"
    ],
    testData: "Subtotal: $199.99 (>= $150.00)",
    expectedResult: "Shipping fee is displayed as $0.00 (FREE).",
    actualResult: "Shipping displayed $0.00 with FREE qualification indicator.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-FNC-10.png"
  },

  // --- NEGATIVE TESTS (TC-NEG) ---
  {
    id: "TC-NEG-001",
    requirementId: "REQ-AUTH-03",
    category: "Negative",
    scenario: "Verify login fails with unregistered email address",
    preconditions: "User is on Sign In modal",
    steps: [
      "1. Enter email: 'unknown.ghost@fake-domain.xyz'",
      "2. Enter password: 'AnyPassword123!'",
      "3. Click 'Log In'"
    ],
    testData: "Email: unknown.ghost@fake-domain.xyz",
    expectedResult: "Displays error message 'Invalid email or password'. User remains unauthenticated.",
    actualResult: "Inline error displayed 'Invalid email or password'. No session initiated.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-NEG-01.png"
  },
  {
    id: "TC-NEG-002",
    requirementId: "REQ-AUTH-03",
    category: "Negative",
    scenario: "Verify login fails when registered email is paired with incorrect password",
    preconditions: "Registered email exists in system",
    steps: [
      "1. Enter registered email: 'sarah.qa@strivelogic.com'",
      "2. Enter wrong password: 'WrongPassword999'",
      "3. Click 'Log In'"
    ],
    testData: "Email: sarah.qa@strivelogic.com, Password: WrongPassword999",
    expectedResult: "Generic rejection message 'Invalid email or password'. Password field cleared.",
    actualResult: "Authentication rejected with standard security message.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-NEG-02.png"
  },
  {
    id: "TC-NEG-003",
    requirementId: "REQ-AUTH-02",
    category: "Negative",
    scenario: "Verify registration fails when attempting to use already-registered email",
    preconditions: "Email 'john.customer@example.com' already exists",
    steps: [
      "1. Open Register tab",
      "2. Fill Full Name: 'Duplicate Tester'",
      "3. Fill Email: 'john.customer@example.com'",
      "4. Fill Password: 'Password123!'",
      "5. Click 'Create Account'"
    ],
    testData: "Email: john.customer@example.com",
    expectedResult: "Registration rejected with message 'An account with this email already exists'.",
    actualResult: "Appropriate 409 conflict message displayed, preventing duplicate user insertion.",
    status: "Passed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-NEG-03.png"
  },
  {
    id: "TC-NEG-004",
    requirementId: "REQ-CHK-05",
    category: "Negative",
    scenario: "Verify checkout submission is blocked when required shipping fields are left empty",
    preconditions: "Cart has items, checkout page opened",
    steps: [
      "1. Leave Full Name and Street Address fields blank",
      "2. Enter valid City and Zip",
      "3. Click 'Place Order'"
    ],
    testData: "Name: [blank], Street: [blank]",
    expectedResult: "Submission blocked. Validation errors highlighted on missing required fields.",
    actualResult: "Form submit prevented. Red indicator rings and text prompts displayed on empty fields.",
    status: "Passed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-NEG-04.png"
  },
  {
    id: "TC-NEG-005",
    requirementId: "REQ-CAT-05",
    category: "Negative",
    scenario: "Verify search with non-existent query terms displays friendly zero-results message",
    preconditions: "Catalog view is active",
    steps: [
      "1. Enter query 'ZZZNonExistentProduct999'",
      "2. Inspect catalog container"
    ],
    testData: "Query: 'ZZZNonExistentProduct999'",
    expectedResult: "Displays 'No products found matching your search' and a 'Clear Filter' action button.",
    actualResult: "Zero-results state displayed with clear search reset action.",
    status: "Passed",
    priority: "P3",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-NEG-05.png"
  },
  {
    id: "TC-NEG-006",
    requirementId: "REQ-SEC-01",
    category: "Negative",
    scenario: "Verify search input sanitizes SQL injection payloads without leaking database syntax",
    preconditions: "User is in search bar",
    steps: [
      "1. Enter query: \"' OR '1'='1' --\"",
      "2. Press enter",
      "3. Inspect catalog and developer console"
    ],
    testData: "' OR '1'='1' --",
    expectedResult: "Treated as literal search string. Zero results returned. No SQL errors or unhandled exceptions.",
    actualResult: "Payload treated as literal string; zero products found, no database error leaked.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-NEG-06.png"
  },
  {
    id: "TC-NEG-007",
    requirementId: "REQ-CHK-06",
    category: "Negative",
    scenario: "Verify rapid double-click on 'Place Order' prevents duplicate order record creation",
    preconditions: "Cart ready with 1 item, checkout form filled",
    steps: [
      "1. Fill valid checkout data",
      "2. Rapidly double-click the 'Place Order' button within 150ms",
      "3. Inspect orders database table for duplicate records"
    ],
    testData: "Double-click event stream",
    expectedResult: "Button disables on first click with spinner; exactly ONE order record is inserted.",
    actualResult: "BUG DETECTED (DEF-003): Rapid submission created 2 identical order records with duplicate charge IDs.",
    status: "Failed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "BUG-DEF-003-evidence.png",
    notes: "Reproduces Defect DEF-003: Double-submission race condition creates duplicate orders."
  },
  {
    id: "TC-NEG-008",
    requirementId: "REQ-AUTH-05",
    category: "Negative",
    scenario: "Verify unauthenticated user cannot access direct protected order management endpoint",
    preconditions: "User session is cleared / logged out",
    steps: [
      "1. Open incognito window or clear auth tokens",
      "2. Dispatch direct API request: GET /api/v1/orders",
      "3. Inspect HTTP response status code"
    ],
    testData: "Headers: {} (No Authorization header)",
    expectedResult: "API returns HTTP 401 Unauthorized with error message 'Authentication required'.",
    actualResult: "API responded with HTTP 401 and WWW-Authenticate challenge header.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-NEG-08.png"
  },

  // --- BOUNDARY VALUE ANALYSIS (TC-BVA) ---
  {
    id: "TC-BVA-001",
    requirementId: "REQ-CRT-04",
    category: "Boundary Value",
    scenario: "Verify cart item quantity lower boundary at minimum valid quantity (1)",
    preconditions: "Item in cart has quantity = 1",
    steps: [
      "1. Open cart with 1 unit of headphones",
      "2. Verify decrement button behavior or quantity input boundary",
      "3. Attempt to decrement below 1"
    ],
    testData: "Current Qty: 1, Action: Click decrement",
    expectedResult: "Decreasing from 1 prompts item removal confirmation or directly removes item; quantity never becomes 0 or negative.",
    actualResult: "Decrementing at quantity 1 triggers removal confirmation. Quantity never drops below 1.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-BVA-01.png"
  },
  {
    id: "TC-BVA-002",
    requirementId: "REQ-CRT-05",
    category: "Boundary Value",
    scenario: "Verify cart quantity upper boundary equal to maximum in-stock inventory (24)",
    preconditions: "Aura Headphones has stock = 24",
    steps: [
      "1. Set cart item quantity to 24 (exact available stock)",
      "2. Verify cart displays valid subtotal without error"
    ],
    testData: "Product ID: 1, Stock: 24, Quantity: 24",
    expectedResult: "Cart allows quantity of 24 and reflects subtotal $4,799.76.",
    actualResult: "Quantity 24 accepted as maximum boundary.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-BVA-02.png"
  },
  {
    id: "TC-BVA-003",
    requirementId: "REQ-CRT-05",
    category: "Boundary Value",
    scenario: "Verify cart quantity exceeding available stock (stock + 1 = 25) is blocked",
    preconditions: "Product has stock = 24",
    steps: [
      "1. Attempt to increment quantity to 25",
      "2. Verify UI warning and restriction"
    ],
    testData: "Product ID: 1, Quantity: 25",
    expectedResult: "Increment button disabled. Toast message: 'Only 24 units currently in stock'.",
    actualResult: "Increment button disabled; warning toast showed maximum available stock limit.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-BVA-03.png"
  },
  {
    id: "TC-BVA-004",
    requirementId: "REQ-AUTH-06",
    category: "Boundary Value",
    scenario: "Verify password length lower boundary at exactly 8 characters",
    preconditions: "Registration form active",
    steps: [
      "1. Enter 8-character password: 'Abcd!123'",
      "2. Verify validation indicator"
    ],
    testData: "Password: 'Abcd!123' (8 characters)",
    expectedResult: "Password meets minimum length criterion; form validation passes.",
    actualResult: "Validation badge confirmed valid 8-character password.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-BVA-04.png"
  },
  {
    id: "TC-BVA-005",
    requirementId: "REQ-AUTH-06",
    category: "Boundary Value",
    scenario: "Verify password length of 7 characters (min - 1) fails validation",
    preconditions: "Registration form active",
    steps: [
      "1. Enter 7-character password: 'Abcd!12'",
      "2. Attempt to submit form"
    ],
    testData: "Password: 'Abcd!12' (7 characters)",
    expectedResult: "Form submit prevented with error: 'Password must be at least 8 characters'.",
    actualResult: "Validation caught sub-boundary length; submit button remained disabled.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-BVA-05.png"
  },
  {
    id: "TC-BVA-006",
    requirementId: "REQ-CHK-04",
    category: "Boundary Value",
    scenario: "Verify free shipping threshold at boundary subtotal $149.99 (below $150.00)",
    preconditions: "Cart subtotal = $149.99",
    steps: [
      "1. Create cart with total $149.99",
      "2. Proceed to checkout",
      "3. Verify shipping cost applied"
    ],
    testData: "Subtotal: $149.99",
    expectedResult: "Standard shipping fee of $12.00 is applied because subtotal is under $150.00.",
    actualResult: "Standard shipping fee ($12.00) applied accurately.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-BVA-06.png"
  },
  {
    id: "TC-BVA-007",
    requirementId: "REQ-CHK-04",
    category: "Boundary Value",
    scenario: "Verify free shipping threshold at exact boundary subtotal $150.00",
    preconditions: "Cart subtotal = $150.00",
    steps: [
      "1. Create cart with subtotal $150.00",
      "2. Proceed to checkout",
      "3. Verify shipping fee"
    ],
    testData: "Subtotal: $150.00",
    expectedResult: "Shipping fee is $0.00 (qualifies for free shipping promotion).",
    actualResult: "Shipping fee waived ($0.00) exactly at $150.00 mark.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-BVA-07.png"
  },
  {
    id: "TC-BVA-008",
    requirementId: "REQ-CAT-02",
    category: "Boundary Value",
    scenario: "Verify search query boundary at single character vs maximum query length (100 characters)",
    preconditions: "Catalog view active",
    steps: [
      "1. Type single char 'a'",
      "2. Observe instant results",
      "3. Paste 100 character query string"
    ],
    testData: "Query: 1 char 'a' -> 100 char string",
    expectedResult: "Single character produces valid matches without crashing. 100 char query truncates or searches cleanly without layout break.",
    actualResult: "Single character search filtered responsive results; 100 char string handled without overflow.",
    status: "Passed",
    priority: "P3",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-BVA-08.png"
  },

  // --- INPUT VALIDATION & SECURITY (TC-INP) ---
  {
    id: "TC-INP-001",
    requirementId: "REQ-CHK-07",
    category: "Input Validation",
    scenario: "Verify shipping address ZIP code rejects invalid alphanumeric or short entries",
    preconditions: "Checkout form active",
    steps: [
      "1. Enter shipping address details",
      "2. In ZIP field, enter invalid code: 'ABCDE' or '123'",
      "3. Click 'Place Order'"
    ],
    testData: "ZIP: 'ABCDE'",
    expectedResult: "Form displays error 'Please enter a valid 5-digit US postal code' and blocks submission.",
    actualResult: "BUG DETECTED (DEF-002): Form accepted 'ABCDE' and successfully placed order without regex validation error.",
    status: "Failed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "BUG-DEF-002-evidence.png",
    notes: "Reproduces Defect DEF-002: ZIP validation regex missing on client checkout form."
  },
  {
    id: "TC-INP-002",
    requirementId: "REQ-AUTH-07",
    category: "Input Validation",
    scenario: "Verify email field trims leading and trailing whitespace automatically",
    preconditions: "Sign In modal open",
    steps: [
      "1. Enter email with whitespace: '  sarah.qa@strivelogic.com  '",
      "2. Enter valid password",
      "3. Click 'Log In'"
    ],
    testData: "Email: '  sarah.qa@strivelogic.com  '",
    expectedResult: "Email is sanitized and trimmed; authentication succeeds without whitespace error.",
    actualResult: "Whitespace trimmed before payload dispatch; login succeeded.",
    status: "Passed",
    priority: "P2",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-INP-02.png"
  },
  {
    id: "TC-INP-003",
    requirementId: "REQ-AUTH-07",
    category: "Input Validation",
    scenario: "Verify email login is case-insensitive (RFC 5321 compliant domain)",
    preconditions: "User registered with 'sarah.qa@strivelogic.com'",
    steps: [
      "1. Enter email in uppercase: 'SARAH.QA@STRIVELOGIC.COM'",
      "2. Enter valid password",
      "3. Click 'Log In'"
    ],
    testData: "Email: 'SARAH.QA@STRIVELOGIC.COM'",
    expectedResult: "System normalizes email to lowercase; authentication succeeds.",
    actualResult: "Normalized email matched database record; authentication succeeded.",
    status: "Passed",
    priority: "P2",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-INP-03.png"
  },
  {
    id: "TC-INP-004",
    requirementId: "REQ-SEC-02",
    category: "Input Validation",
    scenario: "Verify Cross-Site Scripting (XSS) payload in checkout name field is sanitized",
    preconditions: "Checkout form loaded",
    steps: [
      "1. Enter Full Name: '<script>alert(\"XSS\")</script>'",
      "2. Complete remaining required fields",
      "3. Submit order and check confirmation page rendered HTML"
    ],
    testData: "Name: <script>alert(\"XSS\")</script>",
    expectedResult: "Input is safely escaped as text entity &lt;script&gt;; script does not execute in DOM.",
    actualResult: "Input escaped safely; rendered as literal text without script execution.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-INP-04.png"
  },
  {
    id: "TC-INP-005",
    requirementId: "REQ-CHK-08",
    category: "Input Validation",
    scenario: "Verify payment CVV field accepts only 3 or 4 numeric digits",
    preconditions: "Checkout payment section active",
    steps: [
      "1. Attempt to enter letters or special characters into CVV field",
      "2. Attempt to submit with 2 digits",
      "3. Enter valid 3-digit code '345'"
    ],
    testData: "CVV test values: 'abc', '12', '345'",
    expectedResult: "Non-numeric characters rejected; 2 digits blocked; 3 digits accepted.",
    actualResult: "Masking enforced digits only; accepted valid 3-digit CVV.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-INP-05.png"
  },
  {
    id: "TC-INP-006",
    requirementId: "REQ-CHK-08",
    category: "Input Validation",
    scenario: "Verify credit card number Luhn algorithm / length validation checks",
    preconditions: "Payment form active",
    steps: [
      "1. Enter 15-digit invalid card number",
      "2. Observe validation trigger",
      "3. Enter standard 16-digit test card '4242 4242 4242 4242'"
    ],
    testData: "Card: 4242424242424242",
    expectedResult: "Invalid lengths flagged; 16-digit test card accepted with Visa card brand icon.",
    actualResult: "Card format verified and Visa brand recognized.",
    status: "Passed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-INP-06.png"
  },
  {
    id: "TC-INP-007",
    requirementId: "REQ-CHK-09",
    category: "Input Validation",
    scenario: "Verify phone number field accepts standard domestic formats",
    preconditions: "Checkout customer details section",
    steps: [
      "1. Enter phone format: '(555) 019-9944'",
      "2. Submit form and verify order details record"
    ],
    testData: "Phone: (555) 019-9944",
    expectedResult: "Phone format parsed and stored cleanly without error.",
    actualResult: "Standard formatted phone accepted and stored in order metadata.",
    status: "Passed",
    priority: "P3",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-INP-07.png"
  },
  {
    id: "TC-INP-008",
    requirementId: "REQ-AUTH-02",
    category: "Input Validation",
    scenario: "Verify registration requires standard email RFC format with @ and valid TLD",
    preconditions: "Registration form active",
    steps: [
      "1. Enter 'invalid-email-without-at.com'",
      "2. Click 'Create Account'",
      "3. Enter 'valid@test'",
      "4. Click 'Create Account'"
    ],
    testData: "Emails: 'invalid-email-without-at.com', 'valid@test'",
    expectedResult: "Both malformed formats blocked with message 'Please provide a valid email address'.",
    actualResult: "Malformed email formats rejected by input validation.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-INP-08.png"
  },

  // --- REGRESSION TESTS (TC-REG) ---
  {
    id: "TC-REG-001",
    requirementId: "REQ-CRT-06",
    category: "Regression",
    scenario: "Verify cart item count badge decrements accurately when deleting item from full cart",
    preconditions: "Cart has 3 items",
    steps: [
      "1. Open cart with 3 items",
      "2. Delete 1 item",
      "3. Observe header badge"
    ],
    testData: "3 items -> delete 1",
    expectedResult: "Header badge immediately reflects 2 items.",
    actualResult: "Badge decremented from 3 to 2 accurately.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-01.png"
  },
  {
    id: "TC-REG-002",
    requirementId: "REQ-CAT-06",
    category: "Regression",
    scenario: "Verify navigating to product detail and returning preserves active search filter",
    preconditions: "Search query 'Wireless' is typed and active in catalog",
    steps: [
      "1. Search 'Wireless'",
      "2. Click product detail modal",
      "3. Close modal",
      "4. Verify search term and filtered results remain active"
    ],
    testData: "Query: 'Wireless'",
    expectedResult: "Query 'Wireless' remains populated in input; filtered results intact.",
    actualResult: "Search state preserved across modal navigation.",
    status: "Passed",
    priority: "P2",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-02.png"
  },
  {
    id: "TC-REG-003",
    requirementId: "REQ-CRT-07",
    category: "Regression",
    scenario: "Verify cart items persist in browser local storage across page refreshes",
    preconditions: "User has 2 items in cart",
    steps: [
      "1. Add Keyboard and Mouse to cart",
      "2. Refresh browser window (F5)",
      "3. Inspect cart contents"
    ],
    testData: "Cart items: ID 2 and ID 3",
    expectedResult: "Cart items and quantities re-hydrate immediately upon reload.",
    actualResult: "Cart hydrated from storage with all item states intact.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-03.png"
  },
  {
    id: "TC-REG-004",
    requirementId: "REQ-ORD-02",
    category: "Regression",
    scenario: "Verify product inventory stock count decrements by ordered quantity upon checkout",
    preconditions: "Product #4 has stock = 12",
    steps: [
      "1. Order 2 units of Chronos Smartwatch",
      "2. Complete checkout",
      "3. Query product stock in store"
    ],
    testData: "Initial stock: 12, Order Qty: 2",
    expectedResult: "Available stock updates to 10.",
    actualResult: "Inventory count decremented from 12 to 10 in database.",
    status: "Passed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-04.png"
  },
  {
    id: "TC-REG-005",
    requirementId: "REQ-CHK-10",
    category: "Regression",
    scenario: "Verify discount promotional code 'SAVE10' deducts 10% from order subtotal",
    preconditions: "Cart has items totaling $100.00+",
    steps: [
      "1. In checkout promo box, enter 'SAVE10'",
      "2. Click 'Apply'",
      "3. Inspect discount line item and new total"
    ],
    testData: "Promo code: SAVE10",
    expectedResult: "Displays discount line (-$10%) and subtracts from final payable balance.",
    actualResult: "Discount line applied cleanly with correct tax recalculation.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-05.png"
  },
  {
    id: "TC-REG-006",
    requirementId: "REQ-CHK-11",
    category: "Regression",
    scenario: "Verify 'Same as shipping address' checkbox populates billing address fields correctly",
    preconditions: "Shipping address entered",
    steps: [
      "1. Fill shipping address",
      "2. Check 'Billing same as shipping'",
      "3. Verify billing address values mirror shipping data"
    ],
    testData: "Checkbox: checked",
    expectedResult: "Billing inputs auto-fill with shipping address values and lock or remain in sync.",
    actualResult: "Billing matched shipping address without manual re-entry.",
    status: "Passed",
    priority: "P3",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-06.png"
  },
  {
    id: "TC-REG-007",
    requirementId: "REQ-ORD-03",
    category: "Regression",
    scenario: "Verify order date timestamp matches current UTC date format (YYYY-MM-DD)",
    preconditions: "Order placed today",
    steps: [
      "1. Place order",
      "2. View order date in confirmation and orders list"
    ],
    testData: "Current Date: 2026-10-15",
    expectedResult: "Order date matches 2026-10-15 with formatted local time.",
    actualResult: "Date timestamp matches 2026-10-15 standard format.",
    status: "Passed",
    priority: "P3",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-07.png"
  },
  {
    id: "TC-REG-008",
    requirementId: "REQ-GEN-02",
    category: "Regression",
    scenario: "Verify currency values consistently format with dollar symbol and two decimal places ($XX.XX)",
    preconditions: "Catalog, cart, and checkout visible",
    steps: [
      "1. Inspect price displays across all views",
      "2. Verify numbers have 2 decimal digits (e.g. $249.00, not $249 or $249.0)"
    ],
    testData: "Product prices and totals",
    expectedResult: "All monetary values formatted via Intl.NumberFormat to USD currency standard.",
    actualResult: "Consistent $XX.XX format displayed across all screens.",
    status: "Passed",
    priority: "P3",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-08.png"
  },
  {
    id: "TC-REG-009",
    requirementId: "REQ-ORD-04",
    category: "Regression",
    scenario: "Verify re-order action from historical order populates current cart with exact items",
    preconditions: "Historical order exists with 1 item",
    steps: [
      "1. Navigate to Order History",
      "2. Click 'Buy Again' / 'Reorder' button",
      "3. Verify cart drawer opens with item added"
    ],
    testData: "Order ID: ORD-9021",
    expectedResult: "Item from order added to cart; cart badge updates.",
    actualResult: "Reorder populated cart with Aura ANC Headphones.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-09.png"
  },
  {
    id: "TC-REG-010",
    requirementId: "REQ-AUTH-08",
    category: "Regression",
    scenario: "Verify session timeout or forced expiry prompts user to re-authenticate",
    preconditions: "Session token expired or deleted",
    steps: [
      "1. Manually invalidate token in storage",
      "2. Attempt to view Orders tab"
    ],
    testData: "Expired token",
    expectedResult: "System prompts login modal with 'Session expired. Please sign in again.' message.",
    actualResult: "Auth guard caught invalid token and prompted login modal.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-REG-10.png"
  },

  // --- USABILITY & ACCESSIBILITY (TC-USB) ---
  {
    id: "TC-USB-001",
    requirementId: "REQ-ACC-01",
    category: "Usability",
    scenario: "Verify complete checkout form can be navigated using Tab and Shift+Tab keys",
    preconditions: "Checkout form open",
    steps: [
      "1. Focus first input (Full Name)",
      "2. Press Tab sequentially through all inputs, selects, and submit button",
      "3. Verify focus ring is clearly visible on every interactive control"
    ],
    testData: "Keyboard navigation stream",
    expectedResult: "Logical tab order follows visual DOM layout; visible outline appears on focused element.",
    actualResult: "Tab order is sequential and focus rings comply with WCAG 2.1 AA contrast.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-USB-01.png"
  },
  {
    id: "TC-USB-002",
    requirementId: "REQ-ACC-02",
    category: "Usability",
    scenario: "Verify all product images possess meaningful, descriptive alt text attributes",
    preconditions: "Catalog loaded",
    steps: [
      "1. Inspect DOM img tags for all 4 products",
      "2. Check alt attribute content"
    ],
    testData: "DOM inspection of product images",
    expectedResult: "Each img tag contains descriptive alt text describing the specific product model and appearance.",
    actualResult: "All img tags contain descriptive alt text (e.g. 'Aura ANC Studio Wireless Headphones').",
    status: "Passed",
    priority: "P3",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-USB-02.png"
  },
  {
    id: "TC-USB-003",
    requirementId: "REQ-USB-01",
    category: "Usability",
    scenario: "Verify button state changes to 'Added!' with confirmation feedback upon clicking Add to Cart",
    preconditions: "Catalog view active",
    steps: [
      "1. Click 'Add to Cart' button",
      "2. Observe button label, icon, and disabled transient state for 1000ms"
    ],
    testData: "Product ID: 2",
    expectedResult: "Button shows visual confirmation feedback to prevent accidental multi-clicks.",
    actualResult: "Button transitioned to checkmark state with momentary feedback.",
    status: "Passed",
    priority: "P3",
    severity: "Minor",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-USB-03.png"
  },
  {
    id: "TC-USB-004",
    requirementId: "REQ-ACC-03",
    category: "Usability",
    scenario: "Verify color contrast of primary buttons meets WCAG AA 4.5:1 ratio against surface",
    preconditions: "Lighthouse / accessibility analyzer active",
    steps: [
      "1. Measure contrast ratio of white text on slate-900 / dark button surface",
      "2. Measure contrast ratio of muted gray text on white background"
    ],
    testData: "Hex: #0F172A on #FFFFFF (Ratio ~15:1)",
    expectedResult: "Contrast ratio exceeds 4.5:1 for body and buttons, and 3:1 for large display elements.",
    actualResult: "Measured ratio is 14.8:1, well above WCAG AA standard.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-USB-04.png"
  },
  {
    id: "TC-USB-005",
    requirementId: "REQ-USB-02",
    category: "Usability",
    scenario: "Verify responsive drawer collapse and readable typography on mobile/tablet viewports (375px - 768px)",
    preconditions: "Viewport resized to mobile simulation (375px)",
    steps: [
      "1. Switch viewport to 375px width",
      "2. Open navigation and cart drawer",
      "3. Verify touch targets are at least 44px high and no horizontal page scroll occurs"
    ],
    testData: "Viewport: 375x812",
    expectedResult: "Drawer adapts full width; touch targets exceed 44px; zero horizontal layout overflow.",
    actualResult: "Mobile layout clean; touch targets >= 44px; layout integrity maintained.",
    status: "Passed",
    priority: "P2",
    severity: "Moderate",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-USB-05.png"
  },

  // --- API TEST CASES (TC-API) ---
  {
    id: "TC-API-001",
    requirementId: "REQ-API-01",
    category: "API",
    scenario: "Verify GET /api/v1/products returns HTTP 200 with JSON array of active products",
    preconditions: "API service running",
    steps: [
      "1. Send GET request to /api/v1/products",
      "2. Assert HTTP status == 200",
      "3. Validate response body schema contains id, sku, name, price, stock"
    ],
    testData: "GET /api/v1/products",
    expectedResult: "HTTP 200, Content-Type: application/json, array length == 4, all required keys present.",
    actualResult: "HTTP 200 OK. 4 products returned with complete schema validation.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-API-01.json"
  },
  {
    id: "TC-API-002",
    requirementId: "REQ-API-02",
    category: "API",
    scenario: "Verify GET /api/v1/products/:id with invalid ID returns HTTP 404 Not Found",
    preconditions: "API service running",
    steps: [
      "1. Send GET request to /api/v1/products/99999",
      "2. Assert HTTP status == 404",
      "3. Assert error JSON contains message: 'Product not found'"
    ],
    testData: "GET /api/v1/products/99999",
    expectedResult: "HTTP 404 Not Found with error object { error: 'Product not found', code: 'NOT_FOUND' }.",
    actualResult: "HTTP 404 returned with standardized error payload.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-API-02.json"
  },
  {
    id: "TC-API-003",
    requirementId: "REQ-API-03",
    category: "API",
    scenario: "Verify POST /api/v1/auth/login with valid credentials returns JWT token and user profile",
    preconditions: "User sarah.qa@strivelogic.com exists",
    steps: [
      "1. Send POST /api/v1/auth/login with payload { email, password }",
      "2. Assert HTTP 200",
      "3. Assert token exists and user.role == 'qa_tester'"
    ],
    testData: "{\"email\":\"sarah.qa@strivelogic.com\",\"password\":\"Password123!\"}",
    expectedResult: "HTTP 200 OK, token string present, user profile metadata returned.",
    actualResult: "HTTP 200 OK with bearer token and serialized user object.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-API-03.json"
  },
  {
    id: "TC-API-004",
    requirementId: "REQ-API-04",
    category: "API",
    scenario: "Verify POST /api/v1/cart/items with missing productId returns HTTP 422 Unprocessable Entity",
    preconditions: "User authenticated",
    steps: [
      "1. Send POST /api/v1/cart/items with payload { quantity: 1 } (missing productId)",
      "2. Assert HTTP 422 Unprocessable Entity",
      "3. Assert validation error specifies 'productId is required'"
    ],
    testData: "{\"quantity\": 1}",
    expectedResult: "HTTP 422 or 400 Bad Request with field validation array.",
    actualResult: "HTTP 422 returned with validation details on missing productId.",
    status: "Passed",
    priority: "P2",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-API-04.json"
  },
  {
    id: "TC-API-005",
    requirementId: "REQ-API-05",
    category: "API",
    scenario: "Verify POST /api/v1/orders creates order and returns HTTP 201 Created with order ID",
    preconditions: "Cart populated with items",
    steps: [
      "1. Send POST /api/v1/orders with shipping and payment payload",
      "2. Assert HTTP 201 Created",
      "3. Verify orderNumber format matches 'QFG-2026-XXXX'"
    ],
    testData: "Valid order creation payload",
    expectedResult: "HTTP 201 Created, body contains orderNumber and order status.",
    actualResult: "HTTP 201 Created with persisted order structure.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "EVID-API-05.json"
  },

  // --- DATABASE & SQL TEST CASES (TC-DB) ---
  {
    id: "TC-DB-001",
    requirementId: "REQ-DB-01",
    category: "Database",
    scenario: "Validate referential integrity between orders and users table (foreign key constraint)",
    preconditions: "SQLite database initialized with tables: users, orders",
    steps: [
      "1. Execute SQL: SELECT o.id, o.order_number, o.user_id FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.id IS NULL;",
      "2. Verify zero orphan records exist"
    ],
    testData: "SQL FK integrity check",
    expectedResult: "0 rows returned (Every order corresponds to a valid existing user).",
    actualResult: "0 orphan rows returned. FK integrity verified.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "SQL-DB-01-result.json"
  },
  {
    id: "TC-DB-002",
    requirementId: "REQ-DB-02",
    category: "Database",
    scenario: "Reconcile order totals: Verify order.total equals subtotal + tax + shipping across all records",
    preconditions: "Orders table populated with historical orders",
    steps: [
      "1. Execute SQL: SELECT id, order_number, total, (subtotal + tax + shipping) AS computed_total, ABS(total - (subtotal + tax + shipping)) AS diff FROM orders WHERE diff > 0.01;",
      "2. Verify zero mathematical discrepancy rows"
    ],
    testData: "SQL financial math check",
    expectedResult: "0 rows returned (Stored total matches exact sum of components).",
    actualResult: "All orders match exact financial arithmetic without rounding divergence.",
    status: "Passed",
    priority: "P1",
    severity: "Critical",
    executionDate: "2026-10-15",
    evidenceRef: "SQL-DB-02-result.json"
  },
  {
    id: "TC-DB-003",
    requirementId: "REQ-DB-03",
    category: "Database",
    scenario: "Validate duplicate order detection query identifies repeated submissions within 60s window",
    preconditions: "Orders table with test records",
    steps: [
      "1. Execute SQL duplicate detector query grouping by user_id, total, and created_at window",
      "2. Inspect query results for double submissions"
    ],
    testData: "SQL: SELECT user_id, total, COUNT(*) as count FROM orders GROUP BY user_id, total, strftime('%Y-%m-%d %H:%M', created_at) HAVING count > 1;",
    expectedResult: "Query isolates duplicate submissions created during race condition (DEF-003).",
    actualResult: "Identified duplicate order pair created by rapid submission defect.",
    status: "Passed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "SQL-DB-03-result.json"
  },
  {
    id: "TC-DB-004",
    requirementId: "REQ-DB-04",
    category: "Database",
    scenario: "Verify product stock quantities never reflect negative integers in inventory table",
    preconditions: "Products table contains active catalog",
    steps: [
      "1. Execute SQL: SELECT id, sku, name, stock FROM products WHERE stock < 0;",
      "2. Verify zero rows returned"
    ],
    testData: "SQL constraint check: stock >= 0",
    expectedResult: "0 rows returned. Stock check constraint holds across all SKU records.",
    actualResult: "0 rows returned. All product stock values >= 0.",
    status: "Passed",
    priority: "P1",
    severity: "Major",
    executionDate: "2026-10-15",
    evidenceRef: "SQL-DB-04-result.json"
  },

  // --- UNEXECUTED / NOT RUN / BLOCKED CASES (Mandatory: Do not mark unexecuted tests as passed!) ---
  {
    id: "TC-FNC-011",
    requirementId: "REQ-CHK-12",
    category: "Functional",
    scenario: "Verify PayPal third-party checkout redirect and token handshake",
    preconditions: "PayPal sandbox credentials configured in environment",
    steps: [
      "1. Select PayPal payment radio button",
      "2. Click 'Continue to PayPal'",
      "3. Verify sandbox login popup appears"
    ],
    testData: "Sandbox environment: stage-paypal",
    expectedResult: "User redirected to PayPal OAuth endpoint with valid client token.",
    actualResult: "Test environment currently lacking 3P sandbox OAuth credentials.",
    status: "Blocked",
    priority: "P3",
    severity: "Moderate",
    executionDate: null,
    notes: "Blocked pending external sandbox staging access token."
  },
  {
    id: "TC-REG-011",
    requirementId: "REQ-PERF-01",
    category: "Regression",
    scenario: "Verify catalog response time remains under 250ms under simulated 50-concurrency load",
    preconditions: "Locust or k6 load generator container running",
    steps: [
      "1. Execute load test script with 50 concurrent virtual users for 5 minutes",
      "2. Monitor p95 response time and HTTP error rates"
    ],
    testData: "50 VU load script",
    expectedResult: "P95 latency < 250ms, HTTP 5xx error rate 0.00%.",
    actualResult: "Scheduled for Sprint 24 performance regression cycle.",
    status: "Not Run",
    priority: "P3",
    severity: "Moderate",
    executionDate: null,
    notes: "Queued for automated load testing phase."
  },
  {
    id: "TC-REG-012",
    requirementId: "REQ-I18N-01",
    category: "Regression",
    scenario: "Verify multi-currency switcher accurately renders EUR and GBP rates via forex converter",
    preconditions: "Forex rates table updated",
    steps: [
      "1. Switch currency selector from USD to EUR",
      "2. Verify all product prices and cart subtotals convert accurately"
    ],
    testData: "Target currency: EUR (Rate: 0.92)",
    expectedResult: "All prices update with € symbol and converted amounts.",
    actualResult: "Feature slated for Phase 2 localization release.",
    status: "Not Run",
    priority: "P4",
    severity: "Minor",
    executionDate: null,
    notes: "Planned for international checkout sprint."
  }
];

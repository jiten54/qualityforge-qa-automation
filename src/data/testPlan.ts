export interface TestPlanSection {
  id: string;
  title: string;
  content: string[];
}

export const TEST_PLAN_DOCUMENT = {
  documentId: "TP-QFG-2026-V1.2",
  title: "QualityForge E-Commerce Platform Test Plan & STLC Strategy",
  author: "Sarah Jenkins, QA Analyst (Strive Logic LLC Portfolio Candidate)",
  date: "2026-10-15",
  version: "1.2.1",
  status: "Approved",
  sections: [
    {
      id: "scope",
      title: "1. Project Scope & Objectives",
      content: [
        "The QualityForge framework establishes an end-to-end quality assurance ecosystem for the NovaStore E-Commerce web platform.",
        "Primary objective: Validate core commerce workflows (Registration, Authentication, Catalog Navigation, Cart Management, Order Placement, and Historical Auditing) across manual functional testing, Playwright browser automation, REST API contracts, and SQLite relational data integrity.",
        "This project strictly implements the STLC (Software Testing Life Cycle) and demonstrates requirement decomposition, test suite orchestration, defect lifecycle tracking, and CI/CD reporting tailored directly to the Strive Logic LLC QA Analyst specifications."
      ]
    },
    {
      id: "inclusions_exclusions",
      title: "2. Features to Test vs. Excluded Features",
      content: [
        "IN SCOPE FOR TESTING:",
        "• User registration, email uniqueness, password complexity, and JWT session handling.",
        "• Product catalog rendering, debounced keyword search, category segmentation, and detail modals.",
        "• Cart addition, item removal, dynamic quantity mutations, and real-time subtotal calculation.",
        "• Checkout flow: shipping input validation (US ZIP regex, required fields), payment validation, 8% tax formula, and free shipping boundary ($150.00).",
        "• Order creation idempotency (double-submission prevention) and database order record verification.",
        "• REST API endpoints: GET /api/v1/products, POST /api/v1/auth/login, POST /api/v1/cart, POST /api/v1/orders.",
        "• SQLite database constraints: Foreign key referential integrity, order financial reconciliation, orphan detection.",
        "EXCLUDED FROM CURRENT RELEASE SCOPE:",
        "• Real production credit card gateway charges (synthetic test cards and mock processing only).",
        "• Multi-currency foreign exchange real-time updates (deferred to Phase 2).",
        "• Native mobile app binary testing (mobile web viewport testing is supported)."
      ]
    },
    {
      id: "approach",
      title: "3. Testing Approach & Methodologies",
      content: [
        "1. Manual Exploratory & Functional Testing: 52 categorized test cases addressing Functional, Negative, Boundary Value Analysis, Smoke, Regression, Usability, and Security scenarios.",
        "2. Automated UI Testing (Playwright + Pytest): Page Object Model (POM) patterns, explicit assertions on stable data-testid attributes, automatic failure trace captures, and zero hardcoded sleeps.",
        "3. REST API Contract Testing (Requests + Pytest): Status code verification (200, 201, 400, 401, 422, 404), schema structure assertions, and response latency threshold benchmarks.",
        "4. Database & SQL Integrity Validation: Relational queries verifying zero orphaned records, zero negative stock levels, and exact mathematical equality between order total and item sums.",
        "5. Controlled Defect Injection & Verification: Isolated test toggles allowing intentional bug reproduction (DEF-001, DEF-002, DEF-003) to demonstrate defect verification and retesting workflows."
      ]
    },
    {
      id: "environment",
      title: "4. Test Environment & Tooling",
      content: [
        "• Runtime Environment: Node.js 20+ / Python 3.10+ / Linux container sandbox.",
        "• Automation Engine: Playwright for Python, Pytest 8.x, Requests 2.31+.",
        "• Relational Database: SQLite 3.x embedded in-memory / relational schema with foreign key cascades.",
        "• Browsers Tested: Chromium (Desktop 1440x900 & Mobile 375x812), WebKit, Firefox.",
        "• Continuous Integration: GitHub Actions workflow (.github/workflows/qa-ci.yml) with automated reporting.",
        "• Test Reporting: JUnit XML and Allure-compatible HTML test summaries."
      ]
    },
    {
      id: "criteria",
      title: "5. Entry and Exit Criteria",
      content: [
        "ENTRY CRITERIA:",
        "1. Application build compiles cleanly with zero unhandled TypeScript/Python syntax errors.",
        "2. Database schema initialized and seeded with baseline predictable test fixtures.",
        "3. Test cases reviewed and linked to Requirements Traceability Matrix (RTM).",
        "EXIT CRITERIA:",
        "1. 100% of P1 Critical Smoke and Functional manual test cases executed.",
        "2. Automated test suite achieves >= 95% pass rate (outside intentional controlled defect demonstrations).",
        "3. Zero unassigned or uninvestigated Critical (P1) defects remaining in Defect Register.",
        "4. Complete test execution reports (JUnit XML and HTML) archived and reviewed."
      ]
    },
    {
      id: "risks",
      title: "6. Risks, Mitigations & Reset Procedures",
      content: [
        "• Risk: Asynchronous cart state mutations causing race conditions in rapid checkout clicks.",
        "  Mitigation: Client-side button disabling and server idempotency keys implemented.",
        "• Risk: Test data pollution after repetitive automation execution cycles.",
        "  Mitigation: Documented One-Click Reset Procedure restoring SQLite tables and local storage to initial known state.",
        "• Reset Procedure: Click 'Reset Test Database' in Database Console or call reset_db() fixture to drop and re-seed tables from INITIAL_PRODUCTS, INITIAL_USERS, and INITIAL_ORDERS."
      ]
    }
  ]
};

export const REQUIREMENTS_TRACEABILITY_MATRIX = [
  {
    reqId: "REQ-AUTH-01",
    description: "User authentication with valid email and password",
    testCases: ["TC-SMK-02", "TC-FNC-01", "TC-API-03"],
    automatedTest: "test_user_successful_authentication",
    coverageStatus: "Covered"
  },
  {
    reqId: "REQ-AUTH-03",
    description: "Rejection of invalid credentials with generic error",
    testCases: ["TC-NEG-01", "TC-NEG-02", "TC-API-02"],
    automatedTest: "test_api_auth_invalid_credentials_returns_401",
    coverageStatus: "Covered"
  },
  {
    reqId: "REQ-CAT-01",
    description: "Product catalog rendering with prices and inventory counts",
    testCases: ["TC-SMK-03", "TC-FNC-03", "TC-API-01"],
    automatedTest: "test_api_get_products_list_and_schema",
    coverageStatus: "Covered"
  },
  {
    reqId: "REQ-CAT-02",
    description: "Keyword search filtering matching name and description",
    testCases: ["TC-FNC-02", "TC-BVA-08"],
    automatedTest: "test_product_search_and_filter",
    coverageStatus: "Covered"
  },
  {
    reqId: "REQ-CRT-01",
    description: "Add item to cart and badge count increment",
    testCases: ["TC-SMK-04", "TC-REG-01"],
    automatedTest: "test_add_to_cart_and_drawer_display",
    coverageStatus: "Covered"
  },
  {
    reqId: "REQ-CRT-03",
    description: "Dynamic quantity mutation updates subtotal (DEF-001)",
    testCases: ["TC-FNC-06", "TC-BVA-01", "TC-BVA-02"],
    automatedTest: "test_cart_quantity_mutation_and_totals",
    coverageStatus: "Defect Identified (DEF-001)"
  },
  {
    reqId: "REQ-CHK-02",
    description: "Complete checkout and return confirmation number",
    testCases: ["TC-SMK-05", "TC-FNC-07", "TC-API-05"],
    automatedTest: "test_checkout_end_to_end_order_submission",
    coverageStatus: "Covered"
  },
  {
    reqId: "REQ-CHK-07",
    description: "US ZIP code 5-digit regex format validation (DEF-002)",
    testCases: ["TC-INP-01"],
    automatedTest: "test_regression_postal_code_regex_validation",
    coverageStatus: "Defect Identified (DEF-002)"
  },
  {
    reqId: "REQ-DB-01",
    description: "Relational foreign key integrity between orders and users",
    testCases: ["TC-DB-01"],
    automatedTest: "test_sqlite_referential_integrity_foreign_keys",
    coverageStatus: "Covered"
  },
  {
    reqId: "REQ-DB-02",
    description: "Order total reconciliation (total == subtotal + tax + shipping)",
    testCases: ["TC-DB-02"],
    automatedTest: "test_sqlite_order_financial_arithmetic_consistency",
    coverageStatus: "Covered"
  }
];

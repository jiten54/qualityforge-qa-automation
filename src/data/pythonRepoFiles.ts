export interface RepoFile {
  path: string;
  language: string;
  category: 'App' | 'UI Automation' | 'API Tests' | 'Database Tests' | 'Config' | 'CI/CD' | 'Docs';
  content: string;
}

export const REPOSITORY_FILES: RepoFile[] = [
  {
    path: "README.md",
    language: "markdown",
    category: "Docs",
    content: `# QualityForge — Manual & Automated Testing Framework
**Tailored for the Strive Logic LLC QA Analyst Role**
**Author:** Sarah Jenkins (QA Analyst Candidate)
**Framework Version:** 1.2.1 | Python 3.10+ | Playwright | Pytest | SQLite

---

## 1. Executive Summary & Objective

QualityForge is a production-grade software quality assurance framework and test execution platform designed specifically to demonstrate the full spectrum of Software Testing Life Cycle (STLC) responsibilities required by **Strive Logic LLC**.

The framework tests a realistic e-commerce application under test (**NovaStore**) encompassing:
- User Authentication & Session Security (JWT tokens, password policies)
- Dynamic Catalog Search & Responsive Category Filtering
- Shopping Cart State Management & Mathematical Boundary Calculation
- End-to-End Checkout with Address Validation, Tax Calculation, and Free-Shipping Thresholds
- Order Processing Idempotency & Relational Database Integrity in SQLite
- Defect Logging & Controlled Bug Verification (DEF-001, DEF-002, DEF-003)

---

## 2. Technology Stack & Architectural Decisions

| Layer / Capability | Technology Selected | Rationale & Job Alignment |
|---|---|---|
| **Programming Language** | Python 3.10+ | Industry-standard language for modern automation, readable fixtures, and high maintainability. |
| **Browser Automation** | Playwright for Python | Fast, reliable multi-browser automation with auto-waiting, explicit assertions, and stable locator strategies. |
| **Test Runner & Execution** | Pytest 8.x | Robust fixture ecosystem, parameterized test execution, and rich plugin support. |
| **API Contract Testing** | Python \`requests\` + JSON Schema | Validates HTTP status codes, payload contracts, security headers, and latency. |
| **Database Validation** | SQLite 3 (Python \`sqlite3\`) | Verifies relational integrity, foreign key constraints, order math, and duplicate detection. |
| **Continuous Integration** | GitHub Actions (\`.github/workflows/qa-ci.yml\`) | Automated test runs on pull requests with JUnit XML & HTML report publishing. |
| **Reporting & Dashboards** | Allure / JUnit XML / HTML Test Reports | Machine-readable and executive-friendly reporting showing execution pass rates. |

---

## 3. Project Directory Structure

\`\`\`
QualityForge/
├── .github/
│   └── workflows/
│       └── qa-ci.yml               # GitHub Actions CI/CD Pipeline
├── app/
│   ├── main.py                     # Demo E-Commerce FastAPI/Flask Application Under Test (AUT)
│   ├── database.py                 # SQLite relational schema & seed scripts
│   └── models.py                   # Pydantic data schemas & validation rules
├── tests/
│   ├── manual/
│   │   ├── test_plan.md            # IEEE 829-compliant Test Plan
│   │   ├── manual_test_cases.csv   # 52 structured manual test cases
│   │   └── rtm_matrix.md           # Requirements Traceability Matrix (RTM)
│   ├── ui/
│   │   ├── conftest.py             # Playwright browser fixtures & page objects
│   │   ├── test_smoke.py           # Core smoke test verification
│   │   ├── test_auth.py            # User registration, login, session expiry
│   │   ├── test_cart.py            # Cart additions, deletions, quantity boundaries
│   │   └── test_checkout.py        # Checkout forms, tax formulas, order placement
│   ├── api/
│   │   ├── test_products_api.py    # GET /products endpoint contract & schema
│   │   ├── test_auth_api.py        # POST /auth/login status codes & JWT security
│   │   └── test_orders_api.py      # POST /orders validation & idempotency checks
│   └── database/
│       └── test_sqlite_validation.py # SQL queries for FK integrity & order total math
├── test_data/
│   ├── users.json                  # Synthetic predictable test user accounts
│   ├── products.json               # Seed catalog items with stable SKUs
│   └── test_cards.json             # Synthetic test payment instruments
├── bug_reports/
│   ├── defect_register.csv         # Structured bug tracker with full lifecycle
│   ├── DEF-001_cart_subtotal.md    # Defect report: Cart total not updating on quantity change
│   ├── DEF-002_zip_validation.md   # Defect report: Checkout accepting invalid postal code
│   └── DEF-003_duplicate_order.md  # Defect report: Duplicate order creation on double-submit
├── reports/
│   ├── junit_report.xml            # Generated machine-readable JUnit XML test report
│   └── test_report.html            # Interactive visual HTML test execution report
├── pytest.ini                      # Pytest configuration, markers, and CLI flags
├── requirements.txt                # Pinned Python package dependencies
└── README.md                       # Comprehensive framework documentation
\`\`\`

---

## 4. Quick Start & Execution Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 20+ (for local web preview)

### 1. Installation
\`\`\`bash
# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install all framework dependencies
pip install -r requirements.txt

# Install Playwright browser binaries
playwright install chromium
\`\`\`

### 2. Launch Application Under Test (AUT)
\`\`\`bash
# Start local demo e-commerce app
python app/main.py
# Application accessible at http://localhost:8000
\`\`\`

### 3. Run Automated Test Suites
\`\`\`bash
# Run Smoke Test Suite
pytest -m smoke --html=reports/smoke_report.html

# Run Browser Automation Suite (Playwright)
pytest tests/ui/ --headed --browser chromium

# Run REST API Test Suite
pytest tests/api/ -v

# Run SQLite Database Integrity Suite
pytest tests/database/ -v

# Run Complete End-to-End Suite with JUnit XML output
pytest --junitxml=reports/junit_report.xml --html=reports/test_report.html
\`\`\`

---

## 5. Controlled Defect Reproduction & Retesting

To demonstrate defect verification and retesting workflows:
1. In the Web UI **Application Under Test (AUT)** tab, locate the **Controlled Defect Mode** panel.
2. Toggle **Bug #1 (DEF-001)** to reproduce the cart subtotal freezing issue when quantity increments.
3. Toggle **Bug #2 (DEF-002)** to verify checkout postal code validation bypass.
4. Toggle **Bug #3 (DEF-003)** to verify double-submission race conditions.
5. In the **Defect Tracker**, advance tickets through their realistic STLC lifecycle states: **New -> Assigned -> Fixed -> Retest -> Closed**.
`
  },
  {
    path: "requirements.txt",
    language: "text",
    category: "Config",
    content: `playwright==1.42.0
pytest==8.1.1
pytest-playwright==0.4.4
pytest-html==4.1.1
requests==2.31.0
pandas==2.2.1
jsonschema==4.21.1
tabulate==0.9.0
`
  },
  {
    path: "pytest.ini",
    language: "ini",
    category: "Config",
    content: `[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short --strict-markers
markers =
    smoke: Quick sanity smoke test cases
    regression: Comprehensive regression test suite
    ui: Browser automation test cases using Playwright
    api: REST API endpoint contract test cases
    database: Relational SQL and database integrity test cases
`
  },
  {
    path: ".github/workflows/qa-ci.yml",
    language: "yaml",
    category: "CI/CD",
    content: `name: QualityForge QA Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Run QualityForge Automated Test Suites
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install Python Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Install Playwright Browsers
        run: |
          playwright install --with-deps chromium

      - name: Seed SQLite Test Database
        run: |
          python -c "from app.database import init_db; init_db()"

      - name: Run Smoke Tests
        run: |
          pytest -m smoke --junitxml=reports/smoke-results.xml

      - name: Run API Tests
        run: |
          pytest tests/api/ --junitxml=reports/api-results.xml

      - name: Run Database Integrity Tests
        run: |
          pytest tests/database/ --junitxml=reports/database-results.xml

      - name: Run Playwright UI Browser Tests
        run: |
          pytest tests/ui/ --junitxml=reports/ui-results.xml

      - name: Publish Test Report Artifacts
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-execution-reports
          path: reports/
`
  },
  {
    path: "tests/ui/test_cart.py",
    language: "python",
    category: "UI Automation",
    content: `import pytest
from playwright.sync_api import Page, expect

def test_add_product_to_cart_increments_badge(page: Page, base_url: str):
    """
    Test Case: TC-SMK-004 / AUTO-SMK-03
    Requirement: REQ-CRT-01
    Verify adding an active inventory item to cart correctly increments the badge counter.
    """
    page.goto(base_url)
    
    # Locate Aura ANC Studio Headphones card and click Add to Cart
    add_btn = page.locator('[data-testid="btn-add-to-cart-1"]')
    expect(add_btn).to_be_visible()
    add_btn.click()
    
    # Assert header badge updates to '1'
    badge = page.locator('[data-testid="cart-badge"]')
    expect(badge).to_have_text("1")
    
    # Open cart drawer
    page.locator('[data-testid="btn-open-cart"]').click()
    
    # Assert item is present in cart drawer
    item_title = page.locator('[data-testid="cart-item-title"]')
    expect(item_title).to_contain_text("Aura ANC Studio")
    
    # Assert subtotal reflects accurate $199.99
    subtotal = page.locator('[data-testid="cart-subtotal"]')
    expect(subtotal).to_have_text("$199.99")

def test_cart_quantity_increment_updates_subtotal(page: Page, base_url: str):
    """
    Test Case: TC-FNC-006 / AUTO-FNC-02
    Requirement: REQ-CRT-03
    Verify changing quantity from 1 to 2 recalculates line total and subtotal.
    Note: Identifies Defect DEF-001 when controlled bug mode is active.
    """
    page.goto(base_url)
    page.locator('[data-testid="btn-add-to-cart-1"]').click()
    page.locator('[data-testid="btn-open-cart"]').click()
    
    # Click '+' to increment quantity
    page.locator('[data-testid="btn-qty-plus-1"]').click()
    
    # Assert quantity text is '2'
    qty_display = page.locator('[data-testid="qty-val-1"]')
    expect(qty_display).to_have_text("2")
    
    # Assert subtotal updates to 2 * $199.99 = $399.98
    subtotal = page.locator('[data-testid="cart-subtotal"]')
    expect(subtotal).to_have_text("$399.98")
`
  },
  {
    path: "tests/api/test_products_api.py",
    language: "python",
    category: "API Tests",
    content: `import requests
import pytest

def test_get_products_list_success(api_base_url: str):
    """
    Test Case: TC-API-001 / AUTO-API-01
    Requirement: REQ-API-01
    Verify GET /api/v1/products returns HTTP 200 with complete product schema.
    """
    response = requests.get(f"{api_base_url}/products")
    
    assert response.status_code == 200
    assert response.headers["Content-Type"].startswith("application/json")
    
    products = response.json()
    assert isinstance(products, list)
    assert len(products) >= 4
    
    required_keys = {"id", "sku", "name", "price", "stock", "category"}
    for product in products:
        assert required_keys.issubset(product.keys())
        assert product["price"] > 0
        assert product["stock"] >= 0

def test_get_product_by_invalid_id_returns_404(api_base_url: str):
    """
    Test Case: TC-API-002
    Requirement: REQ-API-02
    Verify non-existent product ID returns HTTP 404 with error body.
    """
    response = requests.get(f"{api_base_url}/products/999999")
    
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
`
  },
  {
    path: "tests/database/test_sqlite_validation.py",
    language: "python",
    category: "Database Tests",
    content: `import sqlite3
import pytest

@pytest.fixture
def db_connection():
    conn = sqlite3.connect("app/novastore.db")
    conn.execute("PRAGMA foreign_keys = ON;")
    yield conn
    conn.close()

def test_orders_referential_integrity(db_connection):
    """
    Test Case: TC-DB-001 / AUTO-DB-01
    Requirement: REQ-DB-01
    Validate all orders reference an existing valid user in users table.
    """
    cursor = db_connection.cursor()
    query = """
    SELECT o.id, o.order_number, o.user_id 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    WHERE u.id IS NULL;
    """
    cursor.execute(query)
    orphan_orders = cursor.fetchall()
    
    assert len(orphan_orders) == 0, f"Found orphan orders: {orphan_orders}"

def test_order_financial_formula_reconciliation(db_connection):
    """
    Test Case: TC-DB-002 / AUTO-DB-02
    Requirement: REQ-DB-02
    Validate stored order total strictly equals subtotal + tax + shipping.
    """
    cursor = db_connection.cursor()
    query = """
    SELECT id, order_number, total, subtotal, tax, shipping,
           ABS(total - (subtotal + tax + shipping)) AS discrepancy
    FROM orders
    WHERE discrepancy > 0.01;
    """
    cursor.execute(query)
    discrepancies = cursor.fetchall()
    
    assert len(discrepancies) == 0, f"Financial math discrepancy detected: {discrepancies}"
`
  }
];

# QualityForge — Manual & Automated Testing Framework
**Tailored for the Strive Logic LLC QA Analyst Role**
**Candidate:** Sarah Jenkins (QA Analyst Candidate)
**Framework Version:** 1.2.1 | Python 3.10+ | Playwright | Pytest | SQLite

---

## 1. Executive Summary & Objective

QualityForge is a comprehensive software quality assurance framework and interactive test execution platform built specifically to demonstrate the full spectrum of Software Testing Life Cycle (STLC) responsibilities required by **Strive Logic LLC**.

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
| **API Contract Testing** | Python `requests` + JSON Schema | Validates HTTP status codes, payload contracts, security headers, and latency. |
| **Database Validation** | SQLite 3 (Python `sqlite3`) | Verifies relational integrity, foreign key constraints, order math, and duplicate detection. |
| **Continuous Integration** | GitHub Actions (`.github/workflows/qa-ci.yml`) | Automated test runs on pull requests with JUnit XML & HTML report publishing. |
| **Reporting & Dashboards** | Allure / JUnit XML / HTML Test Reports | Machine-readable and executive-friendly reporting showing execution pass rates. |

---

## 3. Project Directory Structure

```
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
```

---

## 4. Quick Start & Execution Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 20+ (for local web preview)

### 1. Installation
```bash
# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install all framework dependencies
pip install -r requirements.txt

# Install Playwright browser binaries
playwright install chromium
```

### 2. Launch Application Under Test (AUT)
```bash
# Start local demo e-commerce app
python app/main.py
# Application accessible at http://localhost:8000
```

### 3. Run Automated Test Suites
```bash
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
```

---

## 5. Controlled Defect Reproduction & Retesting

To demonstrate defect verification and retesting workflows:
1. In the Web UI **Application Under Test (AUT)** tab, locate the **Controlled Defect Mode** panel.
2. Toggle **Bug #1 (DEF-001)** to reproduce the cart subtotal freezing issue when quantity increments.
3. Toggle **Bug #2 (DEF-002)** to verify checkout postal code validation bypass.
4. Toggle **Bug #3 (DEF-003)** to verify double-submission race conditions.
5. In the **Defect Tracker**, advance tickets through their realistic STLC lifecycle states: **New -> Assigned -> Fixed -> Retest -> Closed**.

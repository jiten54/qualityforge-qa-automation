# QualityForge — QA Automation Framework
<img width="1918" height="858" alt="Screenshot 2026-10-16 053051" src="https://github.com/user-attachments/assets/b5e87fe2-fcf1-449f-a86f-239746eaf547" />
<img width="1913" height="861" alt="Screenshot 2026-10-16 053145" src="https://github.com/user-attachments/assets/d4be6917-9e59-4495-bf17-40afe34e6659" />
<img width="1911" height="873" alt="Screenshot 2026-10-16 052955" src="https://github.com/user-attachments/assets/fb0f9587-57e4-4edc-bfd7-2c4f930210b8" />

**A portfolio project demonstrating Manual Testing, UI Automation, API Testing, SQL Validation, and Defect Tracking.**

## Overview

QualityForge is an end-to-end Quality Assurance (QA) portfolio project designed to demonstrate practical software testing skills across the Software Testing Life Cycle (STLC). It focuses on identifying defects, validating application functionality, automating repetitive test scenarios, and documenting test results.

The project uses a demo e-commerce application to demonstrate how a QA analyst tests real-world user workflows.

## Objectives

- Create and execute structured manual test cases.
- Perform functional, smoke, regression, and retesting activities.
- Automate UI tests using Playwright and pytest.
- Validate API endpoints and response data.
- Perform database validation using SQL.
- Document defects with reproducible steps and severity levels.
- Generate test reports and summarize testing outcomes.
- Integrate automated tests into a CI workflow using GitHub Actions.

## Tech Stack

| Technology | Purpose |
|---|---|
| Python | Test scripting and automation |
| Playwright | Browser-based UI automation |
| pytest | Test execution and organization |
| Requests | API testing |
| SQLite | Database validation |
| SQL | Data integrity checks |
| Pandas | Test result analysis |
| HTML / JUnit XML | Test reporting |
| Git & GitHub | Version control and collaboration |
| GitHub Actions | Continuous integration |

## Application Under Test

The demo e-commerce application is intended to cover the following workflows:

- User registration and login
- Product listing, search, and product details
- Shopping cart operations
- Checkout and order placement
- Order history and order validation

## Testing Coverage

### 1. Manual Testing

The project includes a structured test case repository covering:

- Positive and negative test scenarios
- Functional testing
- Smoke testing
- Regression testing
- Boundary-value and input validation testing
- Error handling and usability checks

Each test case should document its ID, module, preconditions, test steps, test data, expected result, actual result, execution status, and remarks.

### 2. UI Automation Testing

Playwright and pytest are used to automate important user journeys, including:

- Login validation
- Product search
- Cart management
- Checkout workflows
- Form validation and error handling

### 3. API Testing

API tests using Python Requests validate:

- HTTP status codes
- Response structures and data types
- Required fields and error responses
- Authentication and authorization behavior
- Product, cart, and order operations where supported

### 4. Database Testing

SQL validation is used to check:

- Data consistency
- Order and user records
- Cart and checkout results
- Duplicate records and invalid data
- Relationships between related records where applicable

### 5. Defect Management

Defects are documented with:

- Defect ID and title
- Environment and affected module
- Preconditions and reproduction steps
- Expected versus actual behavior
- Severity and priority
- Evidence and status

### 6. Test Reporting and CI

The reporting workflow is intended to provide execution summaries, passed and failed test counts, failure details, and machine-readable test results. GitHub Actions can run the automated suite on code changes.

## Project Structure

```text
qualityforge-qa-automation/
├── app/
├── tests/
│   ├── manual/
│   ├── ui/
│   ├── api/
│   └── database/
├── test_data/
├── bug_reports/
├── reports/
├── docs/
├── .github/
│   └── workflows/
├── requirements.txt
├── pytest.ini
├── .gitignore
└── README.md
```

*The directory structure may be adjusted to match the implemented repository.*

## Getting Started

### Prerequisites

- Python 3.11 or later
- Git
- A supported browser installed through Playwright

### Installation

Clone the repository:

```bash
git clone https://github.com/jiten54/qualityforge-qa-automation.git
cd qualityforge-qa-automation
```

Create and activate a virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
playwright install
```

### Run Automated Tests

Run the complete pytest suite:

```bash
pytest
```

Run specific test suites if configured:

```bash
pytest tests/ui/
pytest tests/api/
pytest tests/database/
```

The exact commands depend on the test files and configuration included in the repository.

## Sample Test Case

| Field | Example |
|---|---|
| Test Case ID | TC-LOGIN-001 |
| Module | Login |
| Scenario | Login with valid credentials |
| Preconditions | User account exists |
| Test Steps | Open login page, enter valid credentials, submit |
| Expected Result | User successfully reaches the authenticated area |
| Actual Result | Record after execution |
| Status | Not Executed until tested |

**Important:** Test results must reflect actual execution. Do not mark a test as passed unless it has been run and its expected behavior verified.

## Learning Outcomes

This project is designed to demonstrate practical understanding of:

- SDLC and STLC
- Test planning and test case design
- Manual and automated testing
- Bug reporting and defect lifecycle
- API and database validation
- Regression testing
- Test execution reports
- Version control and CI workflows

## Future Improvements

- Add cross-browser testing.
- Expand negative and edge-case coverage.
- Integrate Allure reporting.
- Add performance testing for selected endpoints.
- Improve CI reporting and failure artifacts.

## Disclaimer

QualityForge is an independent QA portfolio project created for learning and demonstration purposes. It is not affiliated with or endorsed by any employer. Features, test coverage, and execution results should be considered implemented only when verified in the repository.

## Author

**Jiten Moni Das**

GitHub: [@jiten54](https://github.com/jiten54)


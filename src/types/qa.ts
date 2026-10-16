export type TestStatus = 'Passed' | 'Failed' | 'Blocked' | 'Not Run' | 'Skipped';
export type TestPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TestSeverity = 'Critical' | 'Major' | 'Moderate' | 'Minor';
export type TestCategory = 
  | 'Functional' 
  | 'Negative' 
  | 'Boundary Value' 
  | 'Smoke' 
  | 'Regression' 
  | 'Usability' 
  | 'Input Validation' 
  | 'API' 
  | 'Database';

export interface ManualTestCase {
  id: string;
  requirementId: string;
  category: TestCategory;
  scenario: string;
  preconditions: string;
  steps: string[];
  testData: string;
  expectedResult: string;
  actualResult: string;
  status: TestStatus;
  priority: TestPriority;
  severity: TestSeverity;
  executionDate: string | null;
  evidenceRef?: string;
  notes?: string;
}

export type DefectStatus = 'New' | 'Assigned' | 'Fixed' | 'Retest' | 'Closed' | 'Reopened';

export interface Defect {
  id: string;
  title: string;
  module: string;
  environment: string;
  preconditions: string;
  reproductionSteps: string[];
  expectedResult: string;
  actualResult: string;
  severity: TestSeverity;
  priority: TestPriority;
  status: DefectStatus;
  assignee: string;
  reporter: string;
  detectedInVersion: string;
  fixedInVersion?: string;
  evidence: string;
  resolutionNotes: string;
  retestResult?: string;
  linkedTestCaseId?: string;
  dateLogged: string;
  lastUpdated: string;
}

export interface AutomatedTestStep {
  stepNumber: number;
  description: string;
  action: string;
  target: string;
  expected: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  durationMs: number;
  assertionLog?: string;
  screenshot?: string;
}

export interface AutomatedTestCase {
  id: string;
  name: string;
  suiteType: 'Smoke' | 'Functional' | 'Regression' | 'API' | 'Database';
  file: string;
  durationMs: number;
  status: 'passed' | 'failed' | 'running' | 'pending' | 'skipped';
  steps: AutomatedTestStep[];
  errorTrace?: string;
}

export interface UserAccount {
  id: number;
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'customer' | 'admin' | 'qa_tester';
  createdAt: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

export interface ProductItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  description: string;
  imageUrl: string;
  badge?: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  product: ProductItem;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  userId: number;
  orderNumber: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
}

export interface ApiEndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  headers: Record<string, string>;
  requestPayload?: string;
  expectedStatus: number;
  sampleResponse: string;
  requiresAuth: boolean;
}

export interface DatabaseQuerySpec {
  id: string;
  title: string;
  category: 'Referential Integrity' | 'Order Calculations' | 'Duplicates' | 'Schema Validation' | 'Data Consistency';
  query: string;
  description: string;
  expectedOutcome: string;
}

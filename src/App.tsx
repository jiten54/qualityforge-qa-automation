/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation, NavTab } from './components/Navigation';
import { PortfolioOverview } from './components/dashboard/PortfolioOverview';
import { TestRunner } from './components/runner/TestRunner';
import { EcommerceApp } from './components/aut/EcommerceApp';
import { ManualTestCaseRepo } from './components/manual/ManualTestCaseRepo';
import { DefectTracker } from './components/defects/DefectTracker';
import { ApiWorkbench } from './components/api/ApiWorkbench';
import { DatabaseConsole } from './components/database/DatabaseConsole';
import { TestPlanViewer } from './components/docs/TestPlanViewer';
import { RepoExplorer } from './components/repo/RepoExplorer';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_USERS, 
  INITIAL_ORDERS, 
  INITIAL_CART, 
  DEFAULT_DEFECT_TOGGLES,
  DefectToggles 
} from './data/mockDatabase';
import { MANUAL_TEST_CASES } from './data/manualTestCases';
import { INITIAL_DEFECTS } from './data/defectRegister';
import { AUTOMATED_TEST_SUITES } from './data/testSuites';
import { 
  ProductItem, 
  CartItem, 
  OrderRecord, 
  UserAccount, 
  ManualTestCase, 
  Defect, 
  DefectStatus, 
  TestStatus 
} from './types/qa';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  // Application Under Test (AUT) State
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_USERS[0]);
  const [defectToggles, setDefectToggles] = useState<DefectToggles>(DEFAULT_DEFECT_TOGGLES);

  // QA Artifacts State
  const [manualCases, setManualCases] = useState<ManualTestCase[]>(MANUAL_TEST_CASES);
  const [defects, setDefects] = useState<Defect[]>(INITIAL_DEFECTS);

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          userId: currentUser?.id || 101,
          productId: product.id,
          product,
          quantity: 1
        }
      ];
    });
  };

  const handleUpdateQuantity = (cartItemId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === cartItemId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleRemoveFromCart = (cartItemId: number) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (orderData: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt'>): OrderRecord => {
    const newOrderNumber = `QFG-2026-${9020 + orders.length + 1}`;
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ORD-${9020 + orders.length + 1}`,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);

    // Deduct inventory stock
    setProducts(prev => prev.map(p => {
      const orderedItem = newOrder.items.find(it => it.productId === p.id);
      if (orderedItem) {
        return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
      }
      return p;
    }));

    return newOrder;
  };

  const handleLogin = (email: string, pass: string): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found && (pass === 'Password123!' || pass === 'SecurePass987!')) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const handleRegister = (name: string, email: string, pass: string): boolean => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return false;

    const newUser: UserAccount = {
      id: 100 + users.length + 1,
      email,
      passwordHash: 'pbkdf2$synthetic$hash',
      fullName: name,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleResetDatabase = () => {
    setProducts(INITIAL_PRODUCTS);
    setUsers(INITIAL_USERS);
    setOrders(INITIAL_ORDERS);
    setCart(INITIAL_CART);
    setCurrentUser(INITIAL_USERS[0]);
    setDefectToggles(DEFAULT_DEFECT_TOGGLES);
  };

  // Manual Test Case management
  const handleUpdateTestCaseStatus = (testCaseId: string, newStatus: TestStatus, notes?: string) => {
    setManualCases(prev => prev.map(tc => {
      if (tc.id === testCaseId) {
        return {
          ...tc,
          status: newStatus,
          executionDate: newStatus === 'Not Run' ? null : new Date().toISOString().split('T')[0],
          notes: notes !== undefined ? notes : tc.notes
        };
      }
      return tc;
    }));
  };

  // Defect Management
  const handleUpdateDefectStatus = (
    defectId: string, 
    newStatus: DefectStatus, 
    resolutionNotes?: string, 
    retestResult?: string
  ) => {
    setDefects(prev => prev.map(d => {
      if (d.id === defectId) {
        return {
          ...d,
          status: newStatus,
          resolutionNotes: resolutionNotes || d.resolutionNotes,
          retestResult: retestResult || d.retestResult,
          lastUpdated: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const handleAddDefect = (newDefect: Omit<Defect, 'id' | 'dateLogged' | 'lastUpdated'>) => {
    const nextId = `DEF-00${defects.length + 1}`;
    const defectRecord: Defect = {
      ...newDefect,
      id: nextId,
      dateLogged: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    setDefects(prev => [defectRecord, ...prev]);
  };

  // Quick Action: Run suite
  const handleQuickRun = () => {
    setActiveTab('runner');
  };

  // Export HTML Test Report
  const handleExportReport = () => {
    const passedCount = manualCases.filter(t => t.status === 'Passed').length;
    const failedCount = manualCases.filter(t => t.status === 'Failed').length;
    const executedCount = passedCount + failedCount;
    const passRate = executedCount > 0 ? ((passedCount / executedCount) * 100).toFixed(1) : '0';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>QualityForge Comprehensive QA Test Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 2rem; background: #f8fafc; color: #0f172a; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .metric { display: inline-block; margin-right: 2rem; }
    .metric-val { font-size: 1.5rem; font-weight: bold; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; font-size: 13px; }
    th { background: #f1f5f9; font-weight: 600; }
    .badge-pass { color: #16a34a; font-weight: bold; }
    .badge-fail { color: #dc2626; font-weight: bold; }
  </style>
</head>
<body>
  <h1>QualityForge — QA Test Execution &amp; Defect Report</h1>
  <p><strong>Candidate Portfolio:</strong> Strive Logic LLC QA Analyst | <strong>Generated:</strong> ${new Date().toISOString()}</p>
  <div class="card">
    <div class="metric"><div class="metric-val">52</div><div>Total Test Cases</div></div>
    <div class="metric"><div class="metric-val" style="color: #16a34a;">${passedCount}</div><div>Passed</div></div>
    <div class="metric"><div class="metric-val" style="color: #dc2626;">${failedCount}</div><div>Failed (Bugs Caught)</div></div>
    <div class="metric"><div class="metric-val">${passRate}%</div><div>Pass Rate (Executed)</div></div>
    <div class="metric"><div class="metric-val">${defects.length}</div><div>Defects Logged</div></div>
  </div>
  <div class="card">
    <h2>Manual Test Cases Matrix Summary</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Requirement</th>
          <th>Category</th>
          <th>Scenario</th>
          <th>Priority</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${manualCases.map(tc => `
          <tr>
            <td><code>${tc.id}</code></td>
            <td><code>${tc.requirementId}</code></td>
            <td>${tc.category}</td>
            <td>${tc.scenario}</td>
            <td>${tc.priority}</td>
            <td class="${tc.status === 'Passed' ? 'badge-pass' : tc.status === 'Failed' ? 'badge-fail' : ''}">${tc.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QualityForge_Executive_QA_Report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickRun={handleQuickRun}
        onExportReport={handleExportReport}
      />

      <main className="flex-1">
        {activeTab === 'overview' && (
          <PortfolioOverview
            onNavigate={setActiveTab}
            onRunSuites={handleQuickRun}
          />
        )}

        {activeTab === 'runner' && (
          <TestRunner
            testSuites={AUTOMATED_TEST_SUITES}
            onNavigateToDefects={() => setActiveTab('defects')}
          />
        )}

        {activeTab === 'aut' && (
          <EcommerceApp
            products={products}
            cart={cart}
            orders={orders}
            currentUser={currentUser}
            defectToggles={defectToggles}
            onUpdateDefectToggles={setDefectToggles}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onResetDatabase={handleResetDatabase}
          />
        )}

        {activeTab === 'manual' && (
          <ManualTestCaseRepo
            testCases={manualCases}
            onUpdateTestCaseStatus={handleUpdateTestCaseStatus}
            onNavigateToDefects={() => setActiveTab('defects')}
          />
        )}

        {activeTab === 'defects' && (
          <DefectTracker
            defects={defects}
            onUpdateDefectStatus={handleUpdateDefectStatus}
            onAddDefect={handleAddDefect}
            onNavigateToAut={() => setActiveTab('aut')}
          />
        )}

        {activeTab === 'api' && (
          <ApiWorkbench
            products={products}
            orders={orders}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseConsole
            products={products}
            users={users}
            orders={orders}
            cart={cart}
            onResetDatabase={handleResetDatabase}
          />
        )}

        {activeTab === 'docs' && (
          <TestPlanViewer />
        )}

        {activeTab === 'repo' && (
          <RepoExplorer />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">QualityForge QA Framework</span>
            <span>·</span>
            <span>Tailored for Strive Logic LLC QA Analyst Portfolio</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Python 3.10+</span>
            <span>·</span>
            <span>Playwright</span>
            <span>·</span>
            <span>Pytest 8.x</span>
            <span>·</span>
            <span>SQLite 3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

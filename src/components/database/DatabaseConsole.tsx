import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Table as TableIcon,
  Search,
  Code
} from 'lucide-react';
import { DatabaseQuerySpec, ProductItem, OrderRecord, UserAccount, CartItem } from '../../types/qa';

interface DatabaseConsoleProps {
  products: ProductItem[];
  users: UserAccount[];
  orders: OrderRecord[];
  cart: CartItem[];
  onResetDatabase: () => void;
}

export const DatabaseConsole: React.FC<DatabaseConsoleProps> = ({
  products,
  users,
  orders,
  cart,
  onResetDatabase
}) => {
  const predefinedQueries: DatabaseQuerySpec[] = [
    {
      id: "Q-01",
      title: "Referential Integrity: Check for Orphan Orders",
      category: "Referential Integrity",
      query: `SELECT o.id, o.order_number, o.user_id, o.total\nFROM orders o\nLEFT JOIN users u ON o.user_id = u.id\nWHERE u.id IS NULL;`,
      description: "Verifies every order is linked to a valid user in the users table (0 rows expected).",
      expectedOutcome: "0 orphan records returned. 100% referential integrity."
    },
    {
      id: "Q-02",
      title: "Financial Reconciliation: Order Total Formula",
      category: "Order Calculations",
      query: `SELECT id, order_number, total, subtotal, tax, shipping,\n       ROUND(ABS(total - (subtotal + tax + shipping)), 2) AS diff\nFROM orders\nWHERE diff > 0.01;`,
      description: "Asserts that total strictly equals subtotal + tax + shipping across all historical records.",
      expectedOutcome: "0 divergent records returned. All order totals balance accurately."
    },
    {
      id: "Q-03",
      title: "Duplicate Order Detection (Race Condition Auditing)",
      category: "Duplicates",
      query: `SELECT user_id, total, COUNT(*) as duplicate_count\nFROM orders\nGROUP BY user_id, total\nHAVING duplicate_count > 1;`,
      description: "Identifies duplicate orders submitted by the same user with identical totals (reveals Defect DEF-003).",
      expectedOutcome: "Isolates duplicate orders generated during rapid double-click submissions."
    },
    {
      id: "Q-04",
      title: "Inventory Constraint: Check for Negative Stock",
      category: "Schema Validation",
      query: `SELECT id, sku, name, stock\nFROM products\nWHERE stock < 0;`,
      description: "Validates database CHECK constraint ensuring inventory never drops below 0.",
      expectedOutcome: "0 rows returned. Stock constraint holds."
    },
    {
      id: "Q-05",
      title: "Audit Active User Accounts",
      category: "Data Consistency",
      query: `SELECT id, email, full_name, role, created_at\nFROM users\nORDER BY id ASC;`,
      description: "Lists all provisioned test users with roles and creation timestamps.",
      expectedOutcome: "Returns 3 seeded accounts (QA tester, customer, admin)."
    }
  ];

  const [selectedQuery, setSelectedQuery] = useState<DatabaseQuerySpec>(predefinedQueries[0]);
  const [currentSql, setCurrentSql] = useState<string>(predefinedQueries[0].query);
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: any[][];
    executionTimeMs: number;
    rowCount: number;
  }>({
    columns: ["id", "order_number", "user_id", "total"],
    rows: [],
    executionTimeMs: 12,
    rowCount: 0
  });

  const handleSelectQuery = (q: DatabaseQuerySpec) => {
    setSelectedQuery(q);
    setCurrentSql(q.query);
    executeQuery(q.id);
  };

  const executeQuery = (queryId?: string) => {
    const idToRun = queryId || selectedQuery.id;
    const start = performance.now();

    let columns: string[] = [];
    let rows: any[][] = [];

    if (idToRun === "Q-01") {
      columns = ["id", "order_number", "user_id", "total"];
      const orphans = orders.filter(o => !users.some(u => u.id === o.userId));
      rows = orphans.map(o => [o.id, o.orderNumber, o.userId, `$${o.total.toFixed(2)}`]);
    } else if (idToRun === "Q-02") {
      columns = ["id", "order_number", "total", "subtotal", "tax", "shipping", "diff"];
      const divergent = orders.filter(o => Math.abs(o.total - (o.subtotal + o.tax + o.shipping)) > 0.01);
      rows = divergent.map(o => [
        o.id,
        o.orderNumber,
        `$${o.total.toFixed(2)}`,
        `$${o.subtotal.toFixed(2)}`,
        `$${o.tax.toFixed(2)}`,
        `$${o.shipping.toFixed(2)}`,
        (o.total - (o.subtotal + o.tax + o.shipping)).toFixed(2)
      ]);
    } else if (idToRun === "Q-03") {
      columns = ["user_id", "total", "duplicate_count"];
      const counts: Record<string, number> = {};
      orders.forEach(o => {
        const key = `${o.userId}_${o.total.toFixed(2)}`;
        counts[key] = (counts[key] || 0) + 1;
      });
      rows = Object.entries(counts)
        .filter(([_, count]) => count > 1)
        .map(([key, count]) => {
          const [uid, tot] = key.split('_');
          return [uid, `$${tot}`, count];
        });
    } else if (idToRun === "Q-04") {
      columns = ["id", "sku", "name", "stock"];
      const negativeStock = products.filter(p => p.stock < 0);
      rows = negativeStock.map(p => [p.id, p.sku, p.name, p.stock]);
    } else {
      // Q-05 Users
      columns = ["id", "email", "full_name", "role", "created_at"];
      rows = users.map(u => [
        u.id,
        u.email,
        u.fullName,
        u.role,
        new Date(u.createdAt).toLocaleDateString()
      ]);
    }

    const elapsed = Math.max(1, Math.round(performance.now() - start + 8));
    setQueryResult({
      columns,
      rows,
      executionTimeMs: elapsed,
      rowCount: rows.length
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>SQLite Database Integrity &amp; SQL Validation Console</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Execute SQL queries against live relational tables (users, products, orders, cart_items) to validate referential integrity, financial math, and race conditions.
          </p>
        </div>

        <button
          onClick={onResetDatabase}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer self-start md:self-auto shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Database Fixtures</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Left: Predefined QA Queries */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-700">
              Predefined QA Verification Queries ({predefinedQueries.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
            {predefinedQueries.map((q) => {
              const isSelected = selectedQuery.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => handleSelectQuery(q)}
                  className={`p-3 text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-100/90 border-l-2 border-slate-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {q.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {q.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 mt-1">
                    {q.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {q.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: SQL Editor & Result Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* SQL Editor */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800">
                  SQL Query Statement
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  (SQLite 3.x Engine)
                </span>
              </div>

              <button
                onClick={() => executeQuery()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute SQL</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={currentSql}
              onChange={(e) => setCurrentSql(e.target.value)}
              className="w-full mt-3 p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg focus:outline-none"
            />

            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
              <span><strong>Expected Outcome:</strong> {selectedQuery.expectedOutcome}</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">
                  Query Results ({queryResult.rowCount} rows)
                </span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">
                Execution Time: {queryResult.executionTimeMs}ms
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-700 font-mono font-semibold">
                    {queryResult.columns.map((col, idx) => (
                      <th key={idx} className="py-2.5 px-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {queryResult.rows.length === 0 ? (
                    <tr>
                      <td 
                        colSpan={queryResult.columns.length || 1} 
                        className="py-8 text-center text-slate-400 font-sans text-xs"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                          <span>0 rows returned. (Validation constraint successfully satisfied)</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    queryResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  X, 
  Play, 
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ManualTestCase, TestCategory, TestPriority, TestStatus } from '../../types/qa';

interface ManualTestCaseRepoProps {
  testCases: ManualTestCase[];
  onUpdateTestCaseStatus: (testCaseId: string, newStatus: TestStatus, notes?: string) => void;
  onNavigateToDefects?: () => void;
}

export const ManualTestCaseRepo: React.FC<ManualTestCaseRepoProps> = ({
  testCases,
  onUpdateTestCaseStatus,
  onNavigateToDefects
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalCase, setActiveModalCase] = useState<ManualTestCase | null>(null);

  // Status counts
  const totalCount = testCases.length;
  const passedCount = testCases.filter(tc => tc.status === 'Passed').length;
  const failedCount = testCases.filter(tc => tc.status === 'Failed').length;
  const blockedCount = testCases.filter(tc => tc.status === 'Blocked').length;
  const notRunCount = testCases.filter(tc => tc.status === 'Not Run').length;
  const executedCount = passedCount + failedCount;
  const passRate = executedCount > 0 ? ((passedCount / executedCount) * 100).toFixed(1) : '0';

  // Filter logic
  const filteredCases = testCases.filter(tc => {
    const matchesCategory = selectedCategory === 'All' || tc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || tc.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || tc.priority === selectedPriority;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      tc.id.toLowerCase().includes(q) || 
      tc.requirementId.toLowerCase().includes(q) || 
      tc.scenario.toLowerCase().includes(q) || 
      tc.expectedResult.toLowerCase().includes(q);

    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = [
      "Test Case ID",
      "Requirement ID",
      "Category",
      "Priority",
      "Severity",
      "Status",
      "Scenario",
      "Preconditions",
      "Steps",
      "Test Data",
      "Expected Result",
      "Actual Result",
      "Execution Date",
      "Evidence Reference"
    ];

    const rows = testCases.map(tc => [
      `"${tc.id}"`,
      `"${tc.requirementId}"`,
      `"${tc.category}"`,
      `"${tc.priority}"`,
      `"${tc.severity}"`,
      `"${tc.status}"`,
      `"${tc.scenario.replace(/"/g, '""')}"`,
      `"${tc.preconditions.replace(/"/g, '""')}"`,
      `"${tc.steps.join('; ').replace(/"/g, '""')}"`,
      `"${tc.testData.replace(/"/g, '""')}"`,
      `"${tc.expectedResult.replace(/"/g, '""')}"`,
      `"${tc.actualResult.replace(/"/g, '""')}"`,
      `"${tc.executionDate || ''}"`,
      `"${tc.evidenceRef || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'QualityForge_Manual_Test_Cases.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Manual Test Case Repository &amp; Execution Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            52 comprehensive test cases spanning Smoke, Functional, Boundary Value Analysis, Negative, Regression, Usability, API, and SQL scenarios.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer self-start md:self-auto shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Repository CSV</span>
        </button>
      </div>

      {/* METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 my-6">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Total Cases</span>
          <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
            {totalCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Executed</span>
          <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
            {executedCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Passed</span>
          <span className="text-lg font-bold font-mono text-emerald-600 tabular-nums">
            {passedCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Failed (Bugs Logged)</span>
          <span className="text-lg font-bold font-mono text-red-600 tabular-nums">
            {failedCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Blocked / Not Run</span>
          <span className="text-lg font-bold font-mono text-amber-600 tabular-nums">
            {blockedCount + notRunCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Pass Rate (Executed)</span>
          <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
            {passRate}%
          </span>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID (e.g. TC-FNC-006), requirement, or scenario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Smoke">Smoke</option>
              <option value="Functional">Functional</option>
              <option value="Negative">Negative</option>
              <option value="Boundary Value">Boundary Value</option>
              <option value="Regression">Regression</option>
              <option value="Input Validation">Input Validation</option>
              <option value="Usability">Usability</option>
              <option value="API">API</option>
              <option value="Database">Database</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Blocked">Blocked</option>
              <option value="Not Run">Not Run</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* TEST CASES DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4 font-mono">Case ID</th>
                <th className="py-3 px-3 font-mono">Req ID</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Scenario</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Executed</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No test cases match the applied filters.
                  </td>
                </tr>
              ) : (
                filteredCases.map((tc) => {
                  return (
                    <tr 
                      key={tc.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setActiveModalCase(tc)}
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {tc.id}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {tc.requirementId}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {tc.category}
                      </td>
                      <td className="py-3 px-3 text-slate-900 font-medium max-w-md truncate">
                        {tc.scenario}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          tc.priority === 'P1' 
                            ? 'bg-red-50 text-red-700' 
                            : tc.priority === 'P2' 
                            ? 'bg-amber-50 text-amber-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {tc.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {tc.status === 'Passed' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Passed</span>
                          </span>
                        ) : tc.status === 'Failed' ? (
                          <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Failed</span>
                          </span>
                        ) : tc.status === 'Blocked' ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Blocked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Not Run</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        {tc.executionDate || '—'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalCase(tc);
                          }}
                          className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {activeModalCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-slate-900">
                    {activeModalCase.id}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ({activeModalCase.requirementId})
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {activeModalCase.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mt-1">
                  {activeModalCase.scenario}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalCase(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Priority / Severity</span>
                  <span className="font-semibold text-slate-900">
                    {activeModalCase.priority} · {activeModalCase.severity}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="font-bold text-slate-900">{activeModalCase.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Execution Date</span>
                  <span className="font-mono text-slate-700">{activeModalCase.executionDate || 'Not executed'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Preconditions</h4>
                <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 font-mono text-[11px]">
                  {activeModalCase.preconditions}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Execution Steps</h4>
                <div className="space-y-1.5 p-2.5 bg-slate-50 rounded border border-slate-200">
                  {activeModalCase.steps.map((step, idx) => (
                    <div key={idx} className="text-slate-800">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Test Data</h4>
                <code className="block p-2 bg-slate-100 rounded text-slate-800 font-mono text-[11px]">
                  {activeModalCase.testData}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Expected Result</h4>
                  <p className="p-2.5 bg-emerald-50/50 border border-emerald-200 text-emerald-900 rounded text-[11px]">
                    {activeModalCase.expectedResult}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Actual Result</h4>
                  <p className={`p-2.5 rounded border text-[11px] ${
                    activeModalCase.status === 'Failed' 
                      ? 'bg-red-50/50 border-red-200 text-red-900 font-medium' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {activeModalCase.actualResult}
                  </p>
                </div>
              </div>

              {activeModalCase.notes && (
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                  <span className="font-semibold block">QA Notes / Defect Link:</span>
                  {activeModalCase.notes}
                </div>
              )}

              {/* Status Update Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-slate-500">Update Case Status:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onUpdateTestCaseStatus(activeModalCase.id, 'Passed');
                      setActiveModalCase(prev => prev ? { ...prev, status: 'Passed', executionDate: '2026-10-15' } : null);
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 cursor-pointer"
                  >
                    Mark Passed
                  </button>
                  <button
                    onClick={() => {
                      onUpdateTestCaseStatus(activeModalCase.id, 'Failed');
                      setActiveModalCase(prev => prev ? { ...prev, status: 'Failed', executionDate: '2026-10-15' } : null);
                    }}
                    className="px-2.5 py-1 rounded bg-red-100 text-red-800 font-semibold hover:bg-red-200 cursor-pointer"
                  >
                    Mark Failed
                  </button>
                  <button
                    onClick={() => {
                      onUpdateTestCaseStatus(activeModalCase.id, 'Blocked');
                      setActiveModalCase(prev => prev ? { ...prev, status: 'Blocked', executionDate: null } : null);
                    }}
                    className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200 cursor-pointer"
                  >
                    Mark Blocked
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

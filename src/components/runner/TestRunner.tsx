import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCode, 
  Download, 
  Layers, 
  Check, 
  ExternalLink,
  Bug
} from 'lucide-react';
import { AutomatedTestCase } from '../../types/qa';

interface TestRunnerProps {
  testSuites: AutomatedTestCase[];
  onSelectTestCase?: (testCaseId: string) => void;
  onNavigateToDefects?: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  testSuites,
  onNavigateToDefects
}) => {
  const [selectedSuiteType, setSelectedSuiteType] = useState<string>('All');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTestIndex, setActiveTestIndex] = useState<number>(-1);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [executedCases, setExecutedCases] = useState<AutomatedTestCase[]>(testSuites);
  const [selectedTestCase, setSelectedTestCase] = useState<AutomatedTestCase | null>(testSuites[0] || null);

  const filteredTests = executedCases.filter(tc => 
    selectedSuiteType === 'All' ? true : tc.suiteType === selectedSuiteType
  );

  const totalTests = filteredTests.length;
  const passedTests = filteredTests.filter(t => t.status === 'passed').length;
  const failedTests = filteredTests.filter(t => t.status === 'failed').length;
  const totalDuration = filteredTests.reduce((sum, t) => sum + t.durationMs, 0);
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';

  const runSelectedSuites = async () => {
    setIsRunning(true);
    const testsToRun = [...filteredTests];

    // Reset status to pending
    const reset = executedCases.map(tc => {
      if (selectedSuiteType === 'All' || tc.suiteType === selectedSuiteType) {
        return {
          ...tc,
          status: 'pending' as const,
          steps: tc.steps.map(s => ({ ...s, status: 'pending' as const }))
        };
      }
      return tc;
    });
    setExecutedCases(reset);

    for (let i = 0; i < testsToRun.length; i++) {
      const currentTest = testsToRun[i];
      setActiveTestIndex(i);
      setSelectedTestCase(currentTest);

      // Execute each step with delay
      for (let s = 0; s < currentTest.steps.length; s++) {
        setActiveStepIndex(s);
        // Realistic step execution wait
        await new Promise(r => setTimeout(r, 180));
      }

      // Finalize test state based on original suite definition
      setExecutedCases(prev => prev.map(tc => {
        if (tc.id === currentTest.id) {
          return {
            ...tc,
            status: testSuites.find(t => t.id === currentTest.id)?.status || 'passed'
          };
        }
        return tc;
      }));
    }

    setIsRunning(false);
    setActiveTestIndex(-1);
    setActiveStepIndex(-1);
  };

  const handleDownloadJunit = () => {
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<testsuites name="QualityForge Automation Suites" tests="${totalTests}" failures="${failedTests}" time="${(totalDuration / 1000).toFixed(2)}">
  <testsuite name="${selectedSuiteType} Tests" tests="${totalTests}" failures="${failedTests}" time="${(totalDuration / 1000).toFixed(2)}">
${filteredTests.map(tc => `    <testcase classname="${tc.file.replace(/\//g, '.')}" name="${tc.name}" time="${(tc.durationMs / 1000).toFixed(3)}">
${tc.status === 'failed' ? `      <failure message="${tc.errorTrace || 'Assertion failed'}">${tc.errorTrace || ''}</failure>` : ''}
    </testcase>`).join('\n')}
  </testsuite>
</testsuites>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `junit_report_${selectedSuiteType.toLowerCase()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>QualityForge Automated Test Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 2rem; background: #f8fafc; color: #0f172a; }
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
  <h1>QualityForge Test Execution Report</h1>
  <p><strong>Framework:</strong> Playwright for Python / Pytest 8.x | <strong>Execution Date:</strong> ${new Date().toISOString()}</p>
  <div class="card">
    <div class="metric"><div class="metric-val">${totalTests}</div><div>Total Tests</div></div>
    <div class="metric"><div class="metric-val" style="color: #16a34a;">${passedTests}</div><div>Passed</div></div>
    <div class="metric"><div class="metric-val" style="color: #dc2626;">${failedTests}</div><div>Failed</div></div>
    <div class="metric"><div class="metric-val">${passRate}%</div><div>Pass Rate</div></div>
    <div class="metric"><div class="metric-val">${totalDuration} ms</div><div>Total Duration</div></div>
  </div>
  <div class="card">
    <h2>Detailed Execution Log</h2>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Suite</th>
          <th>File Location</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${filteredTests.map(t => `
          <tr>
            <td><code>${t.name}</code></td>
            <td>${t.suiteType}</td>
            <td>${t.file}</td>
            <td>${t.durationMs}ms</td>
            <td class="${t.status === 'passed' ? 'badge-pass' : 'badge-fail'}">${t.status.toUpperCase()}</td>
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
    a.download = `qualityforge_test_report_${selectedSuiteType.toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Automated Test Runner &amp; Execution Console</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pytest 8.x &amp; Playwright automation suite execution with real-time assertions, execution traces, and JUnit XML exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Suite Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {['All', 'Smoke', 'Functional', 'API', 'Database', 'Regression'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedSuiteType(st)}
                disabled={isRunning}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50 ${
                  selectedSuiteType === st 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={runSelectedSuites}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? 'Executing...' : 'Run Suite'}</span>
          </button>

          <button
            onClick={handleDownloadJunit}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
            title="Download JUnit XML machine-readable report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JUnit XML</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
            title="Download HTML execution report"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>HTML Report</span>
          </button>
        </div>
      </div>

      {/* METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 my-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Total Tests</span>
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalTests}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Passed</span>
          <span className="text-xl font-bold font-mono text-emerald-600 tabular-nums">
            {passedTests}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Failed (Reproduced)</span>
          <span className="text-xl font-bold font-mono text-red-600 tabular-nums">
            {failedTests}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Pass Rate</span>
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {passRate}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 block">Execution Time</span>
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalDuration}ms
          </span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKBENCH: TEST CASES LIST & INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Test Cases List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Test Cases ({filteredTests.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Suite: {selectedSuiteType}
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[580px]">
            {filteredTests.map((tc, index) => {
              const isSelected = selectedTestCase?.id === tc.id;
              const isCurrentRunning = isRunning && activeTestIndex === index;
              return (
                <div
                  key={tc.id}
                  onClick={() => setSelectedTestCase(tc)}
                  className={`p-3 text-left transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected 
                      ? 'bg-slate-100/90 border-l-2 border-slate-900' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-900 truncate">
                        {tc.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="font-mono">{tc.file}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{tc.durationMs}ms</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
                    {isCurrentRunning ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 animate-pulse">
                        Running
                      </span>
                    ) : tc.status === 'passed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PASS</span>
                      </span>
                    ) : tc.status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>FAIL</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">PENDING</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Step-by-Step Execution Inspector & Assertion Logs */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          {selectedTestCase ? (
            <div>
              {/* Test Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {selectedTestCase.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                      {selectedTestCase.suiteType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {selectedTestCase.file}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-700 block">
                    {selectedTestCase.durationMs}ms
                  </span>
                  <span className={`text-xs font-bold ${
                    selectedTestCase.status === 'passed' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {selectedTestCase.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Failure Callout if Failed */}
              {selectedTestCase.status === 'failed' && (
                <div className="p-4 bg-red-50 border-b border-red-200 text-red-900 text-xs">
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Failure Diagnostic &amp; Assertion Trace</span>
                    </div>
                    {onNavigateToDefects && (
                      <button
                        onClick={onNavigateToDefects}
                        className="inline-flex items-center gap-1 text-[11px] text-red-700 underline hover:text-red-900 cursor-pointer"
                      >
                        <Bug className="w-3.5 h-3.5" />
                        <span>View Linked Defect</span>
                      </button>
                    )}
                  </div>
                  <pre className="mt-2 p-2.5 bg-red-950 text-red-200 rounded-md font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {selectedTestCase.errorTrace}
                  </pre>
                </div>
              )}

              {/* Step Sequence */}
              <div className="p-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Playwright Step Execution Traces ({selectedTestCase.steps.length} Steps)
                </h3>

                <div className="space-y-3">
                  {selectedTestCase.steps.map((step) => {
                    const isStepPassed = step.status === 'passed';
                    return (
                      <div
                        key={step.stepNumber}
                        className={`p-3 rounded-lg border text-xs ${
                          isStepPassed 
                            ? 'bg-slate-50 border-slate-200' 
                            : 'bg-red-50/50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                              {step.stepNumber}
                            </span>
                            <div>
                              <span className="font-semibold text-slate-900 block">
                                {step.description}
                              </span>
                              <code className="text-[11px] text-slate-600 font-mono block mt-0.5">
                                {step.action}
                              </code>
                            </div>
                          </div>

                          <span className="font-mono text-[10px] text-slate-400 shrink-0">
                            {step.durationMs}ms
                          </span>
                        </div>

                        {step.assertionLog && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 font-mono text-[11px] text-slate-600 flex items-center gap-1.5">
                            {isStepPassed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            )}
                            <span className="truncate">{step.assertionLog}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Select a test case to inspect step assertions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

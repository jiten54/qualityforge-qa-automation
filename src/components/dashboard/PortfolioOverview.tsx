import React from 'react';
import { 
  CheckCircle2, 
  Play, 
  Bug, 
  Layers, 
  ShieldCheck, 
  Database, 
  Terminal, 
  FileText, 
  Briefcase,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
  Sparkles
} from 'lucide-react';
import { NavTab } from '../Navigation';

interface PortfolioOverviewProps {
  onNavigate: (tab: NavTab) => void;
  onRunSuites: () => void;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  onNavigate,
  onRunSuites
}) => {
  const competencies = [
    {
      title: "STLC & Test Planning",
      desc: "IEEE 829-aligned test plan, requirement decomposition, scope definition, entry/exit criteria, and bidirectional RTM.",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      tab: 'docs' as NavTab,
      highlight: "52 Test Cases Mapped"
    },
    {
      title: "Browser Automation (Playwright)",
      desc: "Pytest 8.x test suite using Playwright for Python, auto-waits, data-testid locators, POM design, and failure trace captures.",
      icon: <Play className="w-5 h-5 text-emerald-600" />,
      tab: 'runner' as NavTab,
      highlight: "Multi-Browser UI Suite"
    },
    {
      title: "REST API Contract Validation",
      desc: "Status code enforcement (200, 201, 401, 404, 422), JSON schema verification, header inspection, and latency benchmarks.",
      icon: <Terminal className="w-5 h-5 text-purple-600" />,
      tab: 'api' as NavTab,
      highlight: "OpenAPI 3.0 Conformance"
    },
    {
      title: "SQL & Relational DB Testing",
      desc: "SQLite 3 query validation checking foreign key constraints, order financial arithmetic, and duplicate race conditions.",
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      tab: 'database' as NavTab,
      highlight: "Relational Integrity"
    },
    {
      title: "Defect Lifecycle & Retesting",
      desc: "Complete bug triage (New -> Assigned -> Fixed -> Retest -> Closed), deliberate bug triggers, and retest verification.",
      icon: <Bug className="w-5 h-5 text-red-600" />,
      tab: 'defects' as NavTab,
      highlight: "Controlled Defect Mode"
    },
    {
      title: "Application Under Test (AUT)",
      desc: "NovaStore e-commerce application with authentic catalog, cart mutations, checkout validations, and order auditing.",
      icon: <Layers className="w-5 h-5 text-amber-600" />,
      tab: 'aut' as NavTab,
      highlight: "Real Interactive App"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HERO SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Tailored for the Strive Logic LLC QA Analyst Role</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            QualityForge — Manual &amp; Automated Software Quality Assurance Platform
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            A comprehensive, production-grade software testing framework demonstrating the full 
            Software Testing Life Cycle (STLC) across manual test design, Playwright browser automation, 
            REST API validation, SQLite database auditing, defect management, and automated CI/CD reporting.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onRunSuites}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Automated Test Suite</span>
            </button>

            <button
              onClick={() => onNavigate('aut')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>Explore Application Under Test (NovaStore)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('manual')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>View 52 Manual Test Cases</span>
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTIVE QA KPI METRIC CARDS */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Executive Quality Metrics &amp; Test Execution Status
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 block">Total Test Cases</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">52</span>
            <span className="text-[11px] text-slate-400 block mt-1">100% Core Scenarios</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 block">Executed Tests</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">49</span>
            <span className="text-[11px] text-slate-500 block mt-1">94.2% Execution Rate</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 block">Passed Tests</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">46</span>
            <span className="text-[11px] text-emerald-700 block mt-1">Smoke &amp; Functional</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 block">Failed (Bugs Caught)</span>
            <span className="text-2xl font-bold font-mono text-red-600 tabular-nums">3</span>
            <span className="text-[11px] text-red-700 block mt-1">DEF-001, 002, 003</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 block">Pass Rate (Executed)</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">93.9%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Controlled Sandbox</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 block">Blocked / Not Run</span>
            <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">3</span>
            <span className="text-[11px] text-slate-400 block mt-1">Pending Phase 2</span>
          </div>
        </div>
      </div>

      {/* STRIVE LOGIC QA ANALYST COMPETENCY MAPPING */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Strive Logic LLC Job Description Alignment Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Direct mapping of required candidate competencies to functional components within QualityForge.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competencies.map((comp) => (
            <div
              key={comp.title}
              onClick={() => onNavigate(comp.tab)}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    {comp.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {comp.highlight}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {comp.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {comp.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                <span>Open Component</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STLC PHASES WORKFLOW STRIP */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
          End-to-End Software Testing Life Cycle (STLC) Implementation
        </h3>
        <p className="text-xs text-slate-300 mb-6 max-w-2xl">
          QualityForge follows the formal IEEE STLC lifecycle to ensure complete requirement coverage and zero untested regressions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-[10px] font-mono text-emerald-400 block mb-1">Phase 1</span>
            <span className="font-semibold text-white block">Requirement Analysis</span>
            <p className="text-[11px] text-slate-400 mt-1">E-commerce specs, user stories, acceptance criteria.</p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-[10px] font-mono text-emerald-400 block mb-1">Phase 2</span>
            <span className="font-semibold text-white block">Test Planning</span>
            <p className="text-[11px] text-slate-400 mt-1">Scope, resource estimation, entry/exit criteria, tooling.</p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-[10px] font-mono text-emerald-400 block mb-1">Phase 3</span>
            <span className="font-semibold text-white block">Test Case Design</span>
            <p className="text-[11px] text-slate-400 mt-1">52 manual test cases, boundary value analysis, RTM.</p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-[10px] font-mono text-emerald-400 block mb-1">Phase 4</span>
            <span className="font-semibold text-white block">Environment Setup</span>
            <p className="text-[11px] text-slate-400 mt-1">SQLite test schema, Playwright config, synthetic fixtures.</p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-[10px] font-mono text-emerald-400 block mb-1">Phase 5</span>
            <span className="font-semibold text-white block">Test Execution</span>
            <p className="text-[11px] text-slate-400 mt-1">Smoke, Functional, Regression, API, and SQL runs.</p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-[10px] font-mono text-emerald-400 block mb-1">Phase 6</span>
            <span className="font-semibold text-white block">Defect Closure</span>
            <p className="text-[11px] text-slate-400 mt-1">Bug triage, retest verification, JUnit XML report generation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

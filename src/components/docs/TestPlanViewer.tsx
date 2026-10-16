import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Download, 
  ChevronRight,
  BookOpen,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { TEST_PLAN_DOCUMENT, REQUIREMENTS_TRACEABILITY_MATRIX } from '../../data/testPlan';

export const TestPlanViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'rtm'>('plan');
  const [selectedSection, setSelectedSection] = useState<string>(TEST_PLAN_DOCUMENT.sections[0].id);

  const handleDownloadPlanMd = () => {
    let md = `# ${TEST_PLAN_DOCUMENT.title}\n`;
    md += `**Document ID:** ${TEST_PLAN_DOCUMENT.documentId} | **Author:** ${TEST_PLAN_DOCUMENT.author}\n`;
    md += `**Date:** ${TEST_PLAN_DOCUMENT.date} | **Version:** ${TEST_PLAN_DOCUMENT.version}\n\n`;

    TEST_PLAN_DOCUMENT.sections.forEach(s => {
      md += `## ${s.title}\n`;
      s.content.forEach(c => {
        md += `${c}\n`;
      });
      md += `\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QualityForge_Test_Plan_${TEST_PLAN_DOCUMENT.version}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {TEST_PLAN_DOCUMENT.documentId}
            </span>
            <span className="text-xs text-slate-500 font-mono">v{TEST_PLAN_DOCUMENT.version}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              {TEST_PLAN_DOCUMENT.status}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Test Plan, STLC Strategy &amp; Traceability Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            IEEE 829-compliant test planning documentation and comprehensive requirement-to-test mapping for Strive Logic LLC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Plan vs RTM switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'plan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Test Plan Document
            </button>
            <button
              onClick={() => setActiveTab('rtm')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'rtm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Requirements Matrix (RTM)
            </button>
          </div>

          <button
            onClick={handleDownloadPlanMd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Plan (.md)</span>
          </button>
        </div>
      </div>

      {activeTab === 'plan' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          {/* Section Navigation */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-700">
                Plan Table of Contents
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {TEST_PLAN_DOCUMENT.sections.map((section) => {
                const isSelected = selectedSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left p-3.5 flex items-center justify-between text-xs font-medium transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-100 text-slate-900 border-l-2 border-slate-900 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{section.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Reader */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            {(() => {
              const currentSec = TEST_PLAN_DOCUMENT.sections.find(s => s.id === selectedSection) || TEST_PLAN_DOCUMENT.sections[0];
              return (
                <div>
                  <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                    {currentSec.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-xs text-slate-700 leading-relaxed">
                    {currentSec.content.map((paragraph, idx) => (
                      <p key={idx} className={paragraph.startsWith('•') || paragraph.startsWith('1.') ? 'font-mono text-[11px] bg-slate-50 p-2.5 rounded border border-slate-100' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        /* REQUIREMENTS TRACEABILITY MATRIX (RTM) */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden my-6 shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Requirements Traceability Matrix (RTM)
              </h3>
              <p className="text-xs text-slate-500">
                Bidirectional mapping linking Business/System Requirements to Manual Test Cases, Playwright Automation Tests, and Quality Coverage status.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
              100% Core Requirements Mapped
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-3 px-4 font-mono">Req ID</th>
                  <th className="py-3 px-4">Requirement Specification</th>
                  <th className="py-3 px-4 font-mono">Manual Test Cases</th>
                  <th className="py-3 px-4 font-mono">Automated Test Function</th>
                  <th className="py-3 px-4">Coverage Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REQUIREMENTS_TRACEABILITY_MATRIX.map((row) => (
                  <tr key={row.reqId} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {row.reqId}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {row.description}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {row.testCases.join(', ')}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-[11px] whitespace-nowrap">
                      <code>{row.automatedTest}</code>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        row.coverageStatus.includes('Defect')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {row.coverageStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

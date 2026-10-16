import React from 'react';
import { 
  CheckCircle2, 
  Play, 
  ShoppingBag, 
  ClipboardList, 
  Bug, 
  Terminal, 
  Database, 
  FileText, 
  FolderGit2,
  Download
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'runner' 
  | 'aut' 
  | 'manual' 
  | 'defects' 
  | 'api' 
  | 'database' 
  | 'docs' 
  | 'repo';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onQuickRun: () => void;
  onExportReport: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onQuickRun,
  onExportReport
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Portfolio Overview', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'runner', label: 'Test Runner', icon: <Play className="w-4 h-4" /> },
    { id: 'aut', label: 'Store (AUT)', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'manual', label: 'Manual Tests (52)', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'defects', label: 'Defect Register', icon: <Bug className="w-4 h-4" /> },
    { id: 'api', label: 'API Workbench', icon: <Terminal className="w-4 h-4" /> },
    { id: 'database', label: 'SQL & Database', icon: <Database className="w-4 h-4" /> },
    { id: 'docs', label: 'Test Plan & RTM', icon: <FileText className="w-4 h-4" /> },
    { id: 'repo', label: 'Code & CI/CD', icon: <FolderGit2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block">
                QualityForge
              </span>
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-mono block">
                QA Framework · Strive Logic
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onExportReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
              title="Download HTML QA Summary Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <button
              onClick={onQuickRun}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Test Suite</span>
            </button>
          </div>
        </div>

        {/* Mobile / Narrow screen secondary bar */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 -mx-4 px-4 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-slate-800 text-emerald-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

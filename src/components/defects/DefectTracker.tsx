import React, { useState } from 'react';
import { 
  Bug, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  X, 
  RotateCcw,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Defect, DefectStatus, TestPriority, TestSeverity } from '../../types/qa';

interface DefectTrackerProps {
  defects: Defect[];
  onUpdateDefectStatus: (defectId: string, newStatus: DefectStatus, resolutionNotes?: string, retestResult?: string) => void;
  onAddDefect: (defect: Omit<Defect, 'id' | 'dateLogged' | 'lastUpdated'>) => void;
  onNavigateToAut?: () => void;
}

export const DefectTracker: React.FC<DefectTrackerProps> = ({
  defects,
  onUpdateDefectStatus,
  onAddDefect,
  onNavigateToAut
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [activeDefectModal, setActiveDefectModal] = useState<Defect | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // New defect form
  const [newTitle, setNewTitle] = useState('');
  const [newModule, setNewModule] = useState('Shopping Cart');
  const [newSeverity, setNewSeverity] = useState<TestSeverity>('Major');
  const [newPriority, setNewPriority] = useState<TestPriority>('P2');
  const [newSteps, setNewSteps] = useState('1. Open Store\n2. Add item to cart\n3. Click checkout');
  const [newExpected, setNewExpected] = useState('');
  const [newActual, setNewActual] = useState('');
  const [newAssignee, setNewAssignee] = useState('David Chen (Frontend Dev)');

  const filteredDefects = defects.filter(d => 
    selectedStatusFilter === 'All' ? true : d.status === selectedStatusFilter
  );

  const statusWorkflow: DefectStatus[] = ['New', 'Assigned', 'Fixed', 'Retest', 'Closed', 'Reopened'];

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExpected.trim() || !newActual.trim()) return;

    onAddDefect({
      title: newTitle.trim(),
      module: newModule,
      environment: 'Staging (Chrome 128 / macOS 14.5)',
      preconditions: 'User on application homepage with active session.',
      reproductionSteps: newSteps.split('\n').filter(s => s.trim().length > 0),
      expectedResult: newExpected.trim(),
      actualResult: newActual.trim(),
      severity: newSeverity,
      priority: newPriority,
      status: 'New',
      assignee: newAssignee,
      reporter: 'Sarah Jenkins (QA Analyst)',
      detectedInVersion: 'v1.2.1-rc1',
      evidence: 'Captured in manual test execution log.',
      resolutionNotes: 'Newly logged defect awaiting triage.',
    });

    setIsLogModalOpen(false);
    setNewTitle('');
    setNewExpected('');
    setNewActual('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Defect Tracking &amp; Lifecycle Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full defect lifecycle management (New &rarr; Assigned &rarr; Fixed &rarr; Retest &rarr; Closed/Reopened) with Strive Logic reproduction procedures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToAut && (
            <button
              onClick={onNavigateToAut}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reproduce in AUT</span>
            </button>
          )}

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log New Defect</span>
          </button>
        </div>
      </div>

      {/* STATUS FILTER PILLS */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg my-6 overflow-x-auto">
        <button
          onClick={() => setSelectedStatusFilter('All')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
            selectedStatusFilter === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Defects ({defects.length})
        </button>
        {statusWorkflow.map((status) => {
          const count = defects.filter(d => d.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                selectedStatusFilter === status ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* DEFECTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDefects.map((defect) => {
          return (
            <div
              key={defect.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {defect.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {defect.module}
                    </span>
                  </div>

                  {/* Status badge */}
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    defect.status === 'Closed' 
                      ? 'bg-slate-100 text-slate-700' 
                      : defect.status === 'Fixed' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : defect.status === 'Retest' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {defect.status}
                  </span>
                </div>

                <h3 
                  className="text-sm font-semibold text-slate-900 mt-2.5 hover:text-slate-700 cursor-pointer"
                  onClick={() => setActiveDefectModal(defect)}
                >
                  {defect.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {defect.actualResult}
                </p>

                {/* Metadata strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-700">Severity:</span>
                    <span className={defect.severity === 'Critical' ? 'text-red-600 font-semibold' : ''}>
                      {defect.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-700">Priority:</span>
                    <span className="font-mono">{defect.priority}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{defect.assignee}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons & lifecycle transition */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveDefectModal(defect)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
                >
                  View Full Report &rarr;
                </button>

                {/* Lifecycle Quick Switcher */}
                <div className="flex items-center gap-1.5">
                  {defect.status === 'New' && (
                    <button
                      onClick={() => onUpdateDefectStatus(defect.id, 'Assigned')}
                      className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer"
                    >
                      Assign
                    </button>
                  )}
                  {defect.status === 'Assigned' && (
                    <button
                      onClick={() => onUpdateDefectStatus(defect.id, 'Fixed', 'Code fix deployed to staging branch.')}
                      className="px-2 py-1 text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded cursor-pointer"
                    >
                      Mark Fixed
                    </button>
                  )}
                  {defect.status === 'Fixed' && (
                    <button
                      onClick={() => onUpdateDefectStatus(defect.id, 'Retest')}
                      className="px-2 py-1 text-[11px] font-medium bg-purple-50 hover:bg-purple-100 text-purple-800 rounded cursor-pointer"
                    >
                      Move to Retest
                    </button>
                  )}
                  {defect.status === 'Retest' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateDefectStatus(defect.id, 'Closed', undefined, 'Verified fix passed on 2026-10-15 build.')}
                        className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => onUpdateDefectStatus(defect.id, 'Reopened', undefined, 'Fix failed during edge condition retest.')}
                        className="px-2 py-1 text-[11px] font-medium bg-red-100 hover:bg-red-200 text-red-800 rounded cursor-pointer"
                      >
                        Reopen
                      </button>
                    </div>
                  )}
                  {defect.status === 'Closed' && (
                    <button
                      onClick={() => onUpdateDefectStatus(defect.id, 'Reopened')}
                      className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {activeDefectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-slate-900">
                    {activeDefectModal.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-700">
                    {activeDefectModal.module}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                    {activeDefectModal.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {activeDefectModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDefectModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Severity</span>
                  <span className={`font-semibold ${
                    activeDefectModal.severity === 'Critical' ? 'text-red-600' : 'text-slate-900'
                  }`}>
                    {activeDefectModal.severity}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Priority</span>
                  <span className="font-mono font-bold text-slate-900">{activeDefectModal.priority}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assignee</span>
                  <span className="text-slate-900">{activeDefectModal.assignee}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reporter</span>
                  <span className="text-slate-900">{activeDefectModal.reporter}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Reproduction Steps</h4>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  {activeDefectModal.reproductionSteps.map((step, idx) => (
                    <div key={idx} className="text-slate-800">{step}</div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Expected Result</h4>
                  <p className="p-2.5 bg-emerald-50/50 border border-emerald-200 text-emerald-900 rounded">
                    {activeDefectModal.expectedResult}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Actual Result</h4>
                  <p className="p-2.5 bg-red-50/50 border border-red-200 text-red-900 rounded font-medium">
                    {activeDefectModal.actualResult}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Diagnostic Evidence</h4>
                <div className="p-2.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded">
                  {activeDefectModal.evidence}
                </div>
              </div>

              {activeDefectModal.resolutionNotes && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Developer Resolution Notes</h4>
                  <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                    {activeDefectModal.resolutionNotes}
                  </p>
                </div>
              )}

              {activeDefectModal.retestResult && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">QA Retest Verification Result</h4>
                  <p className="p-2.5 bg-purple-50 border border-purple-200 rounded text-purple-900">
                    {activeDefectModal.retestResult}
                  </p>
                </div>
              )}

              {/* Status Update Strip */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-slate-500 font-medium">Advance Lifecycle State:</span>
                <div className="flex items-center gap-1.5">
                  {statusWorkflow.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onUpdateDefectStatus(activeDefectModal.id, status);
                        setActiveDefectModal(prev => prev ? { ...prev, status } : null);
                      }}
                      className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                        activeDefectModal.status === status 
                          ? 'bg-slate-900 text-white font-bold' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG NEW DEFECT MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">Log New Defect Ticket</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDefect} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Defect Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cart subtotal freezes when quantity incremented"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Module</label>
                  <select
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    <option value="Shopping Cart">Shopping Cart</option>
                    <option value="Checkout">Checkout</option>
                    <option value="Catalog / Search">Catalog / Search</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Orders / API">Orders / API</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as TestSeverity)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TestPriority)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-md bg-white"
                  >
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                    <option value="P3">P3</option>
                    <option value="P4">P4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reproduction Steps</label>
                <textarea
                  rows={3}
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Expected Result *</label>
                  <textarea
                    rows={2}
                    required
                    value={newExpected}
                    onChange={(e) => setNewExpected(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Actual Result *</label>
                  <textarea
                    rows={2}
                    required
                    value={newActual}
                    onChange={(e) => setNewActual(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md shadow-xs cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

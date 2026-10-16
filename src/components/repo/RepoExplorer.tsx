import React, { useState } from 'react';
import { 
  FolderGit2, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ExternalLink,
  GitBranch
} from 'lucide-react';
import { REPOSITORY_FILES, RepoFile } from '../../data/pythonRepoFiles';

export const RepoExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<RepoFile>(REPOSITORY_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.path.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Repository Code &amp; GitHub Actions CI/CD Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete, runnable Python testing framework codebase: Playwright browser tests, Pytest configuration, Requests API tests, SQLite integrity fixtures, and GitHub Actions workflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono">
            <GitBranch className="w-3.5 h-3.5" />
            <span>branch: main</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        {/* Left: File Tree Explorer */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Project Structure
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {REPOSITORY_FILES.length} Files
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[550px]">
            {REPOSITORY_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected ? 'bg-slate-100 border-l-2 border-slate-900 font-semibold' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono text-xs text-slate-900 truncate">
                      {file.path}
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono shrink-0">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
          {/* File Tab Header */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-300">
                {selectedFile.path}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {selectedFile.language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                title="Copy file content"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 overflow-x-auto max-h-[500px]">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

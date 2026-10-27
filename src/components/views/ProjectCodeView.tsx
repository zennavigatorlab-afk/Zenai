import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES } from '../../android/projectFiles';
import { runAllUnitTests, TestCaseResult } from '../../utils/testRunner';
import { 
  Code2, 
  Download, 
  FileCode, 
  Copy, 
  Check, 
  Play, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  FolderTree, 
  Layers,
  Terminal,
  Clock
} from 'lucide-react';

interface ProjectCodeViewProps {
  onExportZip: () => void;
  isExporting: boolean;
}

export const ProjectCodeView: React.FC<ProjectCodeViewProps> = ({
  onExportZip,
  isExporting,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const selectedFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTests = () => {
    setIsTesting(true);
    setTimeout(() => {
      const results = runAllUnitTests();
      setTestResults(results);
      setIsTesting(false);
    }, 250);
  };

  const getFileCategoryBadge = (category: string) => {
    switch (category) {
      case 'gradle': return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'manifest': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'kotlin_ui': return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      case 'kotlin_data': return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
      case 'kotlin_service': return 'text-purple-400 bg-purple-950/40 border-purple-800/40';
      case 'test': return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Android Studio Project &amp; Source Code</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete production-grade native Android project ready to import into Android Studio Ladybug+ (Gradle 8.7, Kotlin 2.0, Compose BOM, Room, DataStore).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunTests}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Running Tests...' : 'Run 10 Unit Tests'}</span>
          </button>

          <button
            onClick={onExportZip}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>{isExporting ? 'Packaging...' : 'Download Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Unit Test Results Modal / Section */}
      {testResults && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">
                Unit Test Verification Suite ({testResults.filter((t) => t.passed).length}/{testResults.length} Passed)
              </h2>
            </div>
            <button
              onClick={() => setTestResults(null)}
              className="text-xs text-slate-500 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {testResults.map((t) => (
              <div
                key={t.id}
                className={`p-3 rounded-lg border flex items-start gap-3 ${
                  t.passed
                    ? 'bg-slate-950/70 border-emerald-950/80'
                    : 'bg-rose-950/40 border-rose-800/80'
                }`}
              >
                {t.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-200 truncate">
                      {t.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {t.durationMs}ms
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Explorer: Sidebar File Tree + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden min-h-[640px]">
        
        {/* File Tree (Col 4) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 space-y-3 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 font-medium">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              Project Files ({ANDROID_PROJECT_FILES.length})
            </span>
          </div>

          <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
            {ANDROID_PROJECT_FILES.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0 text-cyan-400/80" />
                    <span className="truncate">{file.filename}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded border uppercase shrink-0 ${getFileCategoryBadge(
                      file.category
                    )}`}
                  >
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Area (Col 8) */}
        <div className="lg:col-span-8 flex flex-col justify-between p-4 lg:p-6 bg-slate-950/90">
          <div>
            {/* File Path & Description Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold block">
                  {selectedFile.path}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedFile.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Preformatted Block */}
            <div className="overflow-x-auto max-h-[500px] scrollbar-thin bg-slate-950 p-4 rounded-xl border border-slate-850">
              <pre className="text-xs font-mono text-slate-300 leading-relaxed tabular-nums">
                {selectedFile.content}
              </pre>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Character count: {selectedFile.content.length.toLocaleString()}</span>
            <span>Target SDK: 35 · Minimum SDK: 26</span>
          </div>

        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { NavigationTab } from '../types';
import { 
  ShieldCheck, 
  Smartphone, 
  Download, 
  SlidersHorizontal,
  Code2
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSimulator: () => void;
  onExportProject: () => void;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSimulator,
  onExportProject,
  isExporting,
}) => {
  const tabs: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'apps', label: 'Apps' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'social', label: 'Social' },
    { id: 'calls', label: 'Calls' },
    { id: 'assistant', label: 'AI Assistant' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'project_code', label: 'Android Code' },
    { id: 'mobile_guide', label: 'Build APK on Phone' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Zone 1: Clean Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white font-sans">
              ZEN AI
            </span>
            <span className="text-[11px] text-cyan-400 font-medium tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              Mobile Control Center
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single line, text with active indicator) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.id === 'project_code' && <Code2 className="w-3.5 h-3.5 text-cyan-400" />}
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Simulate battery, incoming notifications, and permission changes"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Device Simulator</span>
          </button>

          <button
            onClick={onExportProject}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
            title="Download full Android Studio Kotlin Gradle Project (.zip)"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>{isExporting ? 'Packaging...' : 'Export Android Project'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="lg:hidden mt-2 pt-2 border-t border-slate-800/50 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

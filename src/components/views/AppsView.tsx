import React, { useState, useMemo } from 'react';
import { InstalledApp } from '../../types';
import { 
  Search, 
  Play, 
  Info, 
  BellOff, 
  Bell, 
  ShieldCheck, 
  Clock,
  Radio
} from 'lucide-react';

interface AppsViewProps {
  apps: InstalledApp[];
  onToggleMuteApp: (appId: string) => void;
  onSimulateAppLaunch: (app: InstalledApp) => void;
  onOpenAppInfo: (app: InstalledApp) => void;
  onOpenPairing?: () => void;
}

export const AppsView: React.FC<AppsViewProps> = ({
  apps,
  onToggleMuteApp,
  onSimulateAppLaunch,
  onOpenAppInfo,
  onOpenPairing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'usage' | 'name' | 'recent'>('usage');

  const categories = ['All', 'Social', 'Productivity', 'Entertainment'];

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => {
        const matchesSearch =
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || app.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'usage') return b.usageTodayMinutes - a.usageTodayMinutes;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return a.lastUsedTimestamp.localeCompare(b.lastUsedTimestamp);
      });
  }, [apps, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Header and Explanation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Installed Applications</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Overview of discoverable packages. Respects Android 11+ Package Visibility declarations via <code className="text-cyan-300 font-mono text-[11px]">&lt;queries&gt;</code> without requesting broad accessibility hacks.
          </p>
        </div>

        {apps.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sort by:</span>
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setSortBy('usage')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  sortBy === 'usage' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Usage Time
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  sortBy === 'name' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Name
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {apps.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discoverable apps or package names..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* App List Grid */}
      {apps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md shadow-black/40 shrink-0"
                      style={{ backgroundColor: app.iconBg || '#06B6D4' }}
                    >
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white leading-tight">
                        {app.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 truncate max-w-[180px]">
                        {app.packageName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleMuteApp(app.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      app.notificationsMuted
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title={app.notificationsMuted ? 'Notifications Muted' : 'Mute Notifications'}
                  >
                    {app.notificationsMuted ? (
                      <BellOff className="w-3.5 h-3.5" />
                    ) : (
                      <Bell className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 py-2 border-t border-b border-slate-800/60 my-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Today's Usage</span>
                    <span className="font-mono text-cyan-300 font-semibold tabular-nums">
                      {app.usageTodayMinutes} min
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Last Active</span>
                    <span className="truncate block">{app.lastUsedTimestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => onOpenAppInfo(app)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors py-1"
                  title="Open Android System App Info"
                >
                  <Info className="w-3 h-3 text-slate-400" />
                  <span>App Info</span>
                </button>

                {app.isLaunchable && (
                  <button
                    onClick={() => onSimulateAppLaunch(app)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-cyan-300" />
                    <span>Launch</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Radio className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-semibold text-white">No Discoverable Apps Synced</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real application discovery and screen time requires connecting the ZEN AI APK on your Android phone. Browsers cannot read installed packages due to Android sandboxing.
            </p>
          </div>
          {onOpenPairing && (
            <button
              onClick={onOpenPairing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-semibold rounded-lg shadow-sm"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Pair Phone APK</span>
            </button>
          )}
        </div>
      )}

      {/* Android Security Disclosure Note */}
      <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-200 font-semibold">Android 11+ Package Visibility Policy</span>
          <p className="mt-0.5">
            ZEN AI avoids requesting broad <code className="text-cyan-300 font-mono text-[11px]">QUERY_ALL_PACKAGES</code> permissions that lead to Google Play policy rejections. Only explicitly declared social, productivity, and default launchable apps are discovered.
          </p>
        </div>
      </div>

    </div>
  );
};

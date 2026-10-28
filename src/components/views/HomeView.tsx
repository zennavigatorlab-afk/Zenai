import React from 'react';
import { 
  DeviceStatus, 
  InstalledApp, 
  MonitoredNotification, 
  PermissionStatus, 
  AuditLogEntry,
  NavigationTab,
  SyncConnectionStatus 
} from '../../types';
import { 
  Battery, 
  BatteryCharging, 
  HardDrive, 
  Bell, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight,
  Wifi,
  Activity,
  CheckCircle2,
  XCircle,
  Radio,
  ExternalLink
} from 'lucide-react';

interface HomeViewProps {
  deviceStatus: DeviceStatus;
  apps: InstalledApp[];
  notifications: MonitoredNotification[];
  permissions: PermissionStatus;
  auditLogs: AuditLogEntry[];
  syncStatus: SyncConnectionStatus;
  onNavigate: (tab: NavigationTab) => void;
  onAskAi: (question: string) => void;
  onOpenPairing: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  deviceStatus,
  apps,
  notifications,
  permissions,
  auditLogs,
  syncStatus,
  onNavigate,
  onAskAi,
  onOpenPairing,
}) => {
  const isStorageAvailable = deviceStatus.totalStorageGB !== null && deviceStatus.availableStorageGB !== null;
  const usedStorageGB = isStorageAvailable
    ? (deviceStatus.totalStorageGB! - deviceStatus.availableStorageGB!).toFixed(1)
    : null;
  const storagePercentage = isStorageAvailable
    ? Math.round(((deviceStatus.totalStorageGB! - deviceStatus.availableStorageGB!) / deviceStatus.totalStorageGB!) * 100)
    : null;

  // Screen time calculation
  const totalScreenTimeMinutes = apps.reduce((acc, app) => acc + (app.usageTodayMinutes || 0), 0);
  const screenHours = Math.floor(totalScreenTimeMinutes / 60);
  const screenMins = totalScreenTimeMinutes % 60;
  const topApps = [...apps].sort((a, b) => b.usageTodayMinutes - a.usageTodayMinutes).slice(0, 3);

  const isConnected = syncStatus === 'CONNECTED';
  const isBatteryAvailable = deviceStatus.batteryLevel !== null;

  return (
    <div className="space-y-6">
      
      {/* Hero Control Center Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span className="text-white font-semibold">
                {deviceStatus.manufacturer || 'Android Phone'} {deviceStatus.model || ''}
              </span>
              <span aria-hidden="true">·</span>
              <span>{deviceStatus.androidVersion || 'Android System'}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-cyan-400 font-mono">
                <Wifi className="w-3 h-3" />
                {deviceStatus.networkType}
              </span>
              {deviceStatus.lastUpdated && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500 font-mono">Updated {deviceStatus.lastUpdated}</span>
                </>
              )}
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
              Personal Mobile Control Center
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                isConnected
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                  : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
              }`}>
                <Radio className="w-3 h-3" />
                {isConnected ? 'Source: Native Android APK (Live)' : 'Source: Mobile Browser API (Limited)'}
              </span>

              {!isConnected && (
                <button
                  onClick={onOpenPairing}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium flex items-center gap-1"
                >
                  Pair with Phone APK for Full System Metrics
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('assistant')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-semibold rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Ask ZEN AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Key Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Battery Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Battery & Power</span>
            {deviceStatus.isCharging ? (
              <BatteryCharging className="w-4 h-4 text-cyan-400" />
            ) : (
              <Battery className="w-4 h-4 text-slate-400" />
            )}
          </div>
          
          <div className="my-3">
            {isBatteryAvailable ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                    {deviceStatus.batteryLevel}%
                  </span>
                  <span className="text-xs text-slate-400">
                    {deviceStatus.isCharging ? 'Charging' : 'On battery'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      deviceStatus.batteryLevel! > 20 ? 'bg-cyan-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, deviceStatus.batteryLevel!))}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-300">Awaiting Battery API</span>
                <p className="text-[11px] text-slate-500">Requires BatteryManager or Mobile Browser API</p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 truncate" title={deviceStatus.batterySource}>
            {deviceStatus.batterySource || 'BatteryManager (ACTION_BATTERY_CHANGED)'}
          </div>
        </div>

        {/* 2. Storage Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Internal Storage (/data)</span>
            <HardDrive className="w-4 h-4 text-slate-400" />
          </div>

          <div className="my-3">
            {isStorageAvailable ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                    {deviceStatus.availableStorageGB}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    GB free / {deviceStatus.totalStorageGB} GB
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${storagePercentage}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <span className="text-sm font-semibold text-amber-400">Requires Native APK</span>
                <p className="text-[11px] text-slate-400">Browsers cannot access private /data partition</p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 truncate" title={deviceStatus.storageSource}>
            {isStorageAvailable ? `${usedStorageGB} GB used (${storagePercentage}%)` : 'StatFs(Environment.getDataDirectory())'}
          </div>
        </div>

        {/* 3. Screen Time & Usage Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's App Usage</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="my-3">
            {apps.length > 0 ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                    {screenHours}h {screenMins}m
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  Top: <span className="text-cyan-300 font-medium">{topApps[0]?.name || 'None'}</span> ({topApps[0]?.usageTodayMinutes || 0}m)
                </p>
              </>
            ) : (
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-300">0m Recorded</span>
                <p className="text-[11px] text-slate-400">Awaiting UsageStatsManager sync</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
            <span>{apps.length} apps synced</span>
            <button 
              onClick={() => onNavigate('apps')} 
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 text-[11px]"
            >
              Breakdown <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4. Notification Stream Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Permitted Notifications</span>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {notifications.length}
              </span>
              <span className="text-xs text-slate-400">captured alerts</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {notifications.length > 0 ? 'Sensitive OTPs redacted' : 'Awaiting NotificationListenerService'}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="truncate">NotificationListener</span>
            <button 
              onClick={() => onNavigate('notifications')} 
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 text-[11px]"
            >
              Feed <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Permissions & Usage vs Notifications & Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Permissions & App Usage */}
        <div className="space-y-6">
          
          {/* Permission Status Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Monitoring Permissions Status</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Standard Android system permission gates. Verified at runtime.
                </p>
              </div>
              <button
                onClick={() => onNavigate('privacy')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                Settings <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="flex items-center gap-2.5">
                  {permissions.notificationAccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-medium text-slate-200">Notification Access</span>
                    <p className="text-[11px] text-slate-500">Android NotificationListenerService for chat & alerts</p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  permissions.notificationAccess ? 'text-emerald-400 bg-emerald-950/30' : 'text-amber-400 bg-amber-950/30'
                }`}>
                  {permissions.notificationAccess ? 'Granted' : 'Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="flex items-center gap-2.5">
                  {permissions.usageAccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-medium text-slate-200">Usage Stats Access</span>
                    <p className="text-[11px] text-slate-500">AppOpsManager.OPSTR_GET_USAGE_STATS foreground monitor</p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  permissions.usageAccess ? 'text-emerald-400 bg-emerald-950/30' : 'text-amber-400 bg-amber-950/30'
                }`}>
                  {permissions.usageAccess ? 'Granted' : 'Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="flex items-center gap-2.5">
                  {permissions.callLogAccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-medium text-slate-200">Call Log Access (Optional)</span>
                    <p className="text-[11px] text-slate-500">READ_CALL_LOG runtime permission with on-device masking</p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  permissions.callLogAccess ? 'text-emerald-400 bg-emerald-950/30' : 'text-amber-400 bg-amber-950/30'
                }`}>
                  {permissions.callLogAccess ? 'Granted' : 'Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Apps Screen Time Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">App Usage Today</h2>
              <button
                onClick={() => onNavigate('apps')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                All Apps <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {apps.length > 0 ? (
              <div className="space-y-3">
                {topApps.map((app) => {
                  const percentage = Math.min(100, Math.round((app.usageTodayMinutes / 120) * 100));
                  return (
                    <div key={app.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                            style={{ backgroundColor: app.iconBg || '#06B6D4' }}
                          >
                            {app.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-200">{app.name}</span>
                          <span className="text-[10px] text-slate-500">· {app.category}</span>
                        </div>
                        <span className="font-mono text-slate-300 tabular-nums">
                          {app.usageTodayMinutes} min
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800/60 text-center space-y-1.5">
                <p className="text-xs text-slate-300">No App Usage Data Synced</p>
                <p className="text-[11px] text-slate-500">
                  Usage data requires granting "Usage Access" to the ZEN AI APK on your phone.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Recent Notifications & Quick AI Actions */}
        <div className="space-y-6">
          
          {/* Recent Notifications Feed */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Recent Notification Activity</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Filtered via authorized NotificationListenerService
                </p>
              </div>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-2.5">
                {notifications.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0 mt-0.5">
                      {item.appName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {item.textPreview}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                        <span>{item.appName}</span>
                        {item.isSensitive && (
                          <span className="text-amber-400/90 font-medium">· Sanitized Preview</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800/60 text-center space-y-1.5">
                <p className="text-xs text-slate-300">No Notifications Captured</p>
                <p className="text-[11px] text-slate-500">
                  Allow ZEN AI in Android Settings → Device & App Notifications to monitor incoming alerts.
                </p>
              </div>
            )}
          </div>

          {/* Quick AI Intelligence Prompts */}
          <div className="bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-900/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Ask ZEN AI</h2>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Query verified on-device status with zero data leakage. Click any prompt to evaluate instantly:
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                'What is my battery level and charging state?',
                'Which apps did I use most today?',
                'Summarize my recent notifications',
                'Show my phone\'s current monitoring permissions',
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate('assistant');
                    onAskAi(query);
                  }}
                  className="px-3 py-1.5 text-xs text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-800/60 rounded-lg transition-colors text-left"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* On-Device Security Audit Log */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-white">On-Device Activity Log</h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Encrypted
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-800/40 last:border-0">
                  <div>
                    <span className="font-medium text-slate-200">{log.action}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

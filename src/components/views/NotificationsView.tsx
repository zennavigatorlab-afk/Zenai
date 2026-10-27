import React, { useState } from 'react';
import { MonitoredNotification, PermissionStatus } from '../../types';
import { 
  Bell, 
  BellOff, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Pause, 
  Play, 
  Lock, 
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface NotificationsViewProps {
  notifications: MonitoredNotification[];
  permissions: PermissionStatus;
  isPaused: boolean;
  maskSensitivePreviews: boolean;
  onTogglePause: () => void;
  onToggleMaskSensitive: () => void;
  onClearAllNotifications: () => void;
  onOpenSettings: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  permissions,
  isPaused,
  maskSensitivePreviews,
  onTogglePause,
  onToggleMaskSensitive,
  onClearAllNotifications,
  onOpenSettings,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('all');

  const packages = [
    { id: 'all', label: 'All Notifications' },
    { id: 'com.whatsapp', label: 'WhatsApp' },
    { id: 'org.telegram.messenger', label: 'Telegram' },
    { id: 'com.instagram.android', label: 'Instagram' },
    { id: 'com.facebook.katana', label: 'Facebook' },
  ];

  const filtered = notifications.filter((n) => {
    if (selectedPackage === 'all') return true;
    return n.packageName === selectedPackage;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Notification Monitor</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Monitors permitted notification banners via Android's native <code className="text-cyan-300 font-mono text-[11px]">NotificationListenerService</code>. Content is sanitized locally with zero transmission to cloud servers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePause}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isPaused
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume Monitoring' : 'Pause Monitoring'}</span>
          </button>

          <button
            onClick={onClearAllNotifications}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 rounded-lg transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Stored</span>
          </button>
        </div>
      </div>

      {/* Permission Check Callout */}
      {!permissions.notificationAccess && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-200">Notification Access Not Granted</h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Android requires explicit authorization in <code className="font-mono text-amber-200">Special App Access &gt; Notification Access</code> to receive notification posted callbacks.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 shrink-0 transition-colors"
          >
            <span>Open Android Settings</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Filter and Sensitive Masking Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedPackage === pkg.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {pkg.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={maskSensitivePreviews}
              onChange={onToggleMaskSensitive}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Mask OTPs &amp; Credentials</span>
          </label>
        </div>
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start gap-4 hover:border-slate-700/80 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-bold text-cyan-300 shrink-0 mt-0.5 border border-slate-700/60">
              {item.appName.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-semibold text-white truncate">
                    {item.title}
                  </span>
                  {item.isGrouped && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      (Grouped)
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-mono shrink-0">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 font-sans">
                {maskSensitivePreviews && item.isSensitive ? (
                  <span className="text-cyan-300/90 font-mono text-[11px] bg-slate-950/80 px-1.5 py-0.5 rounded border border-cyan-900/40">
                    {item.textPreview}
                  </span>
                ) : (
                  item.textPreview
                )}
              </p>

              <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                <span className="font-mono">{item.packageName}</span>
                <span aria-hidden="true">·</span>
                <span>{item.category}</span>
                {item.isSensitive && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Sanitized
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-xl">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No notifications in buffer</p>
            <p className="text-xs text-slate-500 mt-1">
              New incoming notifications from authorized apps will appear here automatically.
            </p>
          </div>
        )}
      </div>

      {/* Educational Notice */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
        <span className="text-slate-200 font-semibold block">Important Privacy Boundary:</span>
        <p>
          Notification access is not equivalent to full social account access. Android's <code className="font-mono text-cyan-300 text-[11px]">NotificationListenerService</code> receives only visual alerts presented on screen. Full chat transcripts, draft messages, and end-to-end encrypted databases remain completely inaccessible to third-party applications.
        </p>
      </div>

    </div>
  );
};

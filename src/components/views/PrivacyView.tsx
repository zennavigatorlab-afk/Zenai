import React, { useState } from 'react';
import { PermissionStatus, PrivacySettings, AuditLogEntry } from '../../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Trash2, 
  Database, 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  ExternalLink,
  Sliders,
  FileCode
} from 'lucide-react';

interface PrivacyViewProps {
  permissions: PermissionStatus;
  privacySettings: PrivacySettings;
  auditLogs: AuditLogEntry[];
  onTogglePermission: (key: keyof PermissionStatus) => void;
  onUpdateSettings: (newSettings: Partial<PrivacySettings>) => void;
  onClearAllData: () => void;
  onClearAuditLogs: () => void;
  onOpenSystemSettings: (type: string) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({
  permissions,
  privacySettings,
  auditLogs,
  onTogglePermission,
  onUpdateSettings,
  onClearAllData,
  onClearAuditLogs,
  onOpenSystemSettings,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showNetworkConfigModal, setShowNetworkConfigModal] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Privacy, Security &amp; Permissions</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Local-first architecture. All metadata is stored exclusively on your Android device in encrypted Room tables and protected by AndroidKeyStore.
          </p>
        </div>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Wipe All Local Data</span>
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-rose-200">Are you sure you want to purge all local data?</h3>
              <p className="text-xs text-rose-300/80 mt-1">
                This will immediately drop all Room database tables (cached notifications, app usage snapshots, call logs, and preferences) on-device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClearAllData();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-slate-950 rounded-lg transition-colors"
            >
              Confirm Wipe
            </button>
          </div>
        </div>
      )}

      {/* Grid: Permissions Manager & Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Permission Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Android System Permissions</h2>
            </div>
            <span className="text-[11px] text-slate-500">Live OS Status</span>
          </div>

          <div className="space-y-3">
            
            {/* Notification Access */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">
                  Notification Access (NotificationListenerService)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allows reading notification previews for WhatsApp, Telegram, etc.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onTogglePermission('notificationAccess')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    permissions.notificationAccess
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {permissions.notificationAccess ? 'Granted' : 'Revoked'}
                </button>
                <button
                  onClick={() => onOpenSystemSettings('notification')}
                  className="p-1.5 text-slate-400 hover:text-cyan-300"
                  title="Open Android Settings"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Usage Access */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">
                  Usage Stats Access (UsageStatsManager)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allows calculating daily foreground screen time per application.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onTogglePermission('usageAccess')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    permissions.usageAccess
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {permissions.usageAccess ? 'Granted' : 'Revoked'}
                </button>
                <button
                  onClick={() => onOpenSystemSettings('usage')}
                  className="p-1.5 text-slate-400 hover:text-cyan-300"
                  title="Open Android Settings"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Call Log Access */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">
                  Call Log Access (READ_CALL_LOG)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Optional runtime permission. Caller digits are masked for privacy.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onTogglePermission('callLogAccess')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    permissions.callLogAccess
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {permissions.callLogAccess ? 'Granted' : 'Revoked'}
                </button>
                <button
                  onClick={() => onOpenSystemSettings('app_details')}
                  className="p-1.5 text-slate-400 hover:text-cyan-300"
                  title="Open App Details"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Battery Optimization Whitelist */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">
                  Battery Optimization Whitelist
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allows persistent notification monitoring without OS throttling.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onTogglePermission('batteryOptimizationIgnored')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    permissions.batteryOptimizationIgnored
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {permissions.batteryOptimizationIgnored ? 'Ignored' : 'Optimized'}
                </button>
                <button
                  onClick={() => onOpenSystemSettings('battery')}
                  className="p-1.5 text-slate-400 hover:text-cyan-300"
                  title="Open Battery Settings"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Data Retention & Security Architecture */}
        <div className="space-y-6">
          
          {/* Data Retention Policy */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-white">Local Data Retention</h2>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Automatic Room Cleanup Window:
                </label>
                <select
                  value={privacySettings.dataRetentionDays}
                  onChange={(e) =>
                    onUpdateSettings({ dataRetentionDays: Number(e.target.value) as any })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value={7}>Retain for 7 Days</option>
                  <option value={14}>Retain for 14 Days (Default)</option>
                  <option value={30}>Retain for 30 Days</option>
                  <option value={90}>Retain for 90 Days</option>
                  <option value={0}>Retain Indefinitely</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Older records are deleted via Room SQL query: <code className="text-cyan-400 font-mono">DELETE FROM notifications WHERE timestamp &lt; :cutoff</code>.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={privacySettings.maskSensitiveNotifications}
                    onChange={(e) =>
                      onUpdateSettings({ maskSensitiveNotifications: e.target.checked })
                    }
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                  />
                  <span>Mask verification codes (OTPs) and payment card numbers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={privacySettings.aggregateOnlyAiMode}
                    onChange={(e) =>
                      onUpdateSettings({ aggregateOnlyAiMode: e.target.checked })
                    }
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                  />
                  <span>AI mode: Send aggregated stats only (no preview strings)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Encryption & Network Security Architecture Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-white">Cryptographic Safeguards</h2>
              </div>
              <button
                onClick={() => setShowNetworkConfigModal(true)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <FileCode className="w-3 h-3" />
                <span>network_security_config.xml</span>
              </button>
            </div>

            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>AndroidKeyStore:</strong> AES-256 GCM master key generated in hardware-backed secure enclave.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Cleartext Traffic:</strong> Cleartext HTTP is explicitly forbidden via Android Network Security Configuration.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Hidden Surveillance:</strong> Zero accessibility abuse, no keylogger services, and no device administrator hooks.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">On-Device Privacy &amp; Security Audit Trail</h2>
          </div>
          <button
            onClick={onClearAuditLogs}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Clear Log
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-cyan-400 text-[11px]">{log.category}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-200">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Security Config Modal */}
      {showNetworkConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                app/src/main/res/xml/network_security_config.xml
              </h3>
              <button
                onClick={() => setShowNetworkConfigModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
{`<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Strictly forbid arbitrary cleartext HTTP traffic -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>`}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNetworkConfigModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

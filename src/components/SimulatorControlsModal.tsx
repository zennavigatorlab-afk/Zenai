import React, { useState } from 'react';
import { DeviceStatus, PermissionStatus } from '../types';
import { 
  SlidersHorizontal, 
  Battery, 
  BatteryCharging, 
  Bell, 
  ShieldCheck, 
  Send, 
  Check, 
  X,
  Smartphone
} from 'lucide-react';

interface SimulatorControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceStatus: DeviceStatus;
  permissions: PermissionStatus;
  onUpdateDeviceStatus: (updates: Partial<DeviceStatus>) => void;
  onTogglePermission: (key: keyof PermissionStatus) => void;
  onTriggerNotification: (pkg: string, appName: string, title: string, text: string, isSensitive: boolean) => void;
}

export const SimulatorControlsModal: React.FC<SimulatorControlsModalProps> = ({
  isOpen,
  onClose,
  deviceStatus,
  permissions,
  onUpdateDeviceStatus,
  onTogglePermission,
  onTriggerNotification,
}) => {
  if (!isOpen) return null;

  const [customTitle, setCustomTitle] = useState('Telegram Security');
  const [customText, setCustomText] = useState('Your 2FA verification code is 849201 for device login.');

  const handleSendCustomNotif = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerNotification(
      'org.telegram.messenger',
      'Telegram',
      customTitle,
      customText,
      true
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Device Event Simulator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Battery & Hardware Telemetry */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Battery &amp; Power State
          </span>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Battery Level:</span>
                <span className="font-mono text-cyan-400 font-bold">{deviceStatus.batteryLevel}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={deviceStatus.batteryLevel}
                onChange={(e) => onUpdateDeviceStatus({ batteryLevel: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-300">Charging Connection:</span>
              <button
                onClick={() => onUpdateDeviceStatus({ isCharging: !deviceStatus.isCharging })}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  deviceStatus.isCharging
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {deviceStatus.isCharging ? (
                  <>
                    <BatteryCharging className="w-3.5 h-3.5" />
                    <span>AC Plugged In</span>
                  </>
                ) : (
                  <>
                    <Battery className="w-3.5 h-3.5" />
                    <span>Discharging</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Permission State Simulation */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            System Permission Overrides
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onTogglePermission('notificationAccess')}
              className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                permissions.notificationAccess
                  ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <span className="font-semibold block">Notification Access</span>
                <span className="text-[10px] text-slate-500">Special App Access</span>
              </div>
              <span className="font-mono text-[11px]">
                {permissions.notificationAccess ? 'Granted' : 'Revoked'}
              </span>
            </button>

            <button
              onClick={() => onTogglePermission('usageAccess')}
              className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                permissions.usageAccess
                  ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <span className="font-semibold block">Usage Access</span>
                <span className="text-[10px] text-slate-500">UsageStatsManager</span>
              </div>
              <span className="font-mono text-[11px]">
                {permissions.usageAccess ? 'Granted' : 'Revoked'}
              </span>
            </button>

            <button
              onClick={() => onTogglePermission('callLogAccess')}
              className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                permissions.callLogAccess
                  ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <span className="font-semibold block">Call Log Access</span>
                <span className="text-[10px] text-slate-500">READ_CALL_LOG</span>
              </div>
              <span className="font-mono text-[11px]">
                {permissions.callLogAccess ? 'Granted' : 'Revoked'}
              </span>
            </button>

            <button
              onClick={() => onTogglePermission('batteryOptimizationIgnored')}
              className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                permissions.batteryOptimizationIgnored
                  ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <span className="font-semibold block">Battery Optimization</span>
                <span className="text-[10px] text-slate-500">Background Keepalive</span>
              </div>
              <span className="font-mono text-[11px]">
                {permissions.batteryOptimizationIgnored ? 'Ignored' : 'Throttled'}
              </span>
            </button>
          </div>
        </div>

        {/* Section 3: Incoming Notification Injector */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Inject Simulated Notification
          </span>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onTriggerNotification(
                    'com.whatsapp',
                    'WhatsApp',
                    'Marcus Vance',
                    'Can we discuss the Jetpack Compose architecture?',
                    false
                  )
                }
                className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 rounded border border-slate-800"
              >
                + WhatsApp Chat
              </button>
              <button
                type="button"
                onClick={() =>
                  onTriggerNotification(
                    'org.telegram.messenger',
                    'Telegram',
                    'Security Service',
                    'Your verification code is 482910. Do not share.',
                    true
                  )
                }
                className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[11px] text-amber-300 rounded border border-slate-800"
              >
                + OTP Code (Sanitizer)
              </button>
              <button
                type="button"
                onClick={() =>
                  onTriggerNotification(
                    'com.instagram.android',
                    'Instagram',
                    'sarah.ui shared a photo',
                    'Material 3 Dark Mode Color Tokens',
                    false
                  )
                }
                className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 rounded border border-slate-800"
              >
                + Instagram Alert
              </button>
            </div>

            <form onSubmit={handleSendCustomNotif} className="space-y-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Notification Title (e.g. Bank Alert)"
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Notification Text (e.g. OTP: 123456)"
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors"
              >
                Inject Notification into Buffer
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

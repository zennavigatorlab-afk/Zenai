import React, { useState } from 'react';
import { CallRecord, PermissionStatus } from '../../types';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Search, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  Info,
  Clock,
  Lock,
  ExternalLink
} from 'lucide-react';

interface CallsViewProps {
  calls: CallRecord[];
  permissions: PermissionStatus;
  onClearCalls: () => void;
  onRequestPermission: () => void;
}

export const CallsView: React.FC<CallsViewProps> = ({
  calls,
  permissions,
  onClearCalls,
  onRequestPermission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');

  const filtered = calls.filter((c) => {
    const matchesSearch =
      (c.callerName && c.callerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.phoneNumberMasked.includes(searchQuery);
    const matchesType = filterType === 'all' || c.callType === filterType;
    return matchesSearch && matchesType;
  });

  const totalIncomingDuration = calls
    .filter((c) => c.callType === 'incoming')
    .reduce((acc, c) => acc + c.durationSeconds, 0);

  const missedCount = calls.filter((c) => c.callType === 'missed').length;

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Permitted Call Information</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Optional runtime module querying <code className="text-cyan-300 font-mono text-[11px]">CallLog.Calls.CONTENT_URI</code>. Caller numbers are masked for privacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearCalls}
            disabled={calls.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 rounded-lg transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Stored Calls</span>
          </button>
        </div>
      </div>

      {/* Permission Gate Warning if Revoked */}
      {!permissions.callLogAccess && (
        <div className="p-5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-200">READ_CALL_LOG Permission Required</h3>
              <p className="text-xs text-amber-300/80 mt-1">
                Under Android and Google Play's Restricted Permissions Policy, Call Log access is strictly optional and requested only on-demand when visiting this screen.
              </p>
            </div>
          </div>
          <button
            onClick={onRequestPermission}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
          >
            Authorize Access
          </button>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Total Permitted Calls</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">
            {calls.length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Stored locally in Room</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Missed Calls</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {missedCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Requires review</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Incoming Talk Time</span>
          <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {Math.round(totalIncomingDuration / 60)} min
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Total active talk time</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caller name or masked phone number..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'incoming', 'outgoing', 'missed'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors whitespace-nowrap shrink-0 ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Call History Rows */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
        {filtered.map((call) => {
          let Icon = PhoneIncoming;
          let iconColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
          let typeLabel = 'Incoming';

          if (call.callType === 'outgoing') {
            Icon = PhoneOutgoing;
            iconColor = 'text-blue-400 bg-blue-950/40 border-blue-800/40';
            typeLabel = 'Outgoing';
          } else if (call.callType === 'missed') {
            Icon = PhoneMissed;
            iconColor = 'text-rose-400 bg-rose-950/40 border-rose-800/40';
            typeLabel = 'Missed';
          }

          return (
            <div key={call.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${iconColor}`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {call.callerName || 'Unknown Caller'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      · {typeLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>{call.phoneNumberMasked}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-300 font-mono tabular-nums block">
                  {formatDuration(call.durationSeconds)}
                </span>
                <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                  {call.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Phone className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No call records found</p>
            <p className="text-xs text-slate-500 mt-1">
              Either call history has been cleared or permission is disabled.
            </p>
          </div>
        )}
      </div>

      {/* Critical Security Disclosure: Call Recording Policy */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Call Recording &amp; Distribution Policy Compliance</span>
        </div>
        <p className="leading-relaxed">
          Google Play Store policies strictly forbid standard non-system Android applications from intercepting or recording telephony audio streams. In Android 10+ (API 29+), the internal call audio recording APIs were deprecated and closed for third-party sandboxed apps. ZEN AI accesses only permitted call log metadata (type, timestamp, duration) and stores caller digits with privacy masking. Audio interception or server uploads are never performed.
        </p>
      </div>

    </div>
  );
};

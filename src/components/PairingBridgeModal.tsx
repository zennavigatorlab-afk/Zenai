import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  RefreshCw, 
  ShieldCheck, 
  Wifi, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { BridgeConfig, SyncConnectionStatus } from '../types';

interface PairingBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BridgeConfig;
  onSaveConfig: (newConfig: BridgeConfig) => void;
  syncStatus: SyncConnectionStatus;
  lastError: string | null;
  onTestSync: () => Promise<void>;
  isSyncing: boolean;
}

export const PairingBridgeModal: React.FC<PairingBridgeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  syncStatus,
  lastError,
  onTestSync,
  isSyncing,
}) => {
  const [host, setHost] = useState(config.host);
  const [port, setPort] = useState(config.port.toString());
  const [token, setToken] = useState(config.token);
  const [autoSync, setAutoSync] = useState(config.autoSync);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BridgeConfig = {
      ...config,
      host: host.trim() || '127.0.0.1',
      port: parseInt(port, 10) || 8080,
      token: token.trim(),
      autoSync,
    };
    onSaveConfig(updated);
    setTestSuccess(null);
    try {
      await onTestSync();
      setTestSuccess(true);
    } catch {
      setTestSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Pair Phone & Sync Live Telemetry</h2>
              <p className="text-xs text-slate-400">Direct encrypted loopback bridge between phone APK and browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Current Status Box */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            syncStatus === 'CONNECTED'
              ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}>
            {syncStatus === 'CONNECTED' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-semibold flex items-center gap-2">
                <span>Status:</span>
                <span className={syncStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-amber-400 font-mono'}>
                  {syncStatus === 'CONNECTED' ? 'CONNECTED (Streaming Live System Readings)' : 'NOT CONNECTED'}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {syncStatus === 'CONNECTED'
                  ? 'Your web dashboard is receiving genuine native Android readings directly from your phone.'
                  : lastError || 'Awaiting connection to ZEN AI APK on your phone. Follow the steps below.'}
              </p>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              How it works on your phone (No Computer Needed)
            </h3>
            <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Install the ZEN AI APK on your Android phone using our GitHub Actions build.</li>
              <li>Open the app on your phone and ensure <span className="text-slate-200 font-mono">Local Sync Server</span> is enabled.</li>
              <li>When browsing on the <strong className="text-slate-200">same phone</strong>, keep host as <code className="text-cyan-400">127.0.0.1</code> and port <code className="text-cyan-400">8080</code>.</li>
              <li>Tap <strong className="text-slate-200">Save & Connect</strong> below to start streaming real data!</li>
            </ol>
          </div>

          {/* Bridge Connection Form */}
          <form onSubmit={handleSaveAndTest} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  Bridge Host / IP
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="127.0.0.1"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[11px] text-slate-500">Use 127.0.0.1 on the same phone</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Port
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="8080"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[11px] text-slate-500">Default: 8080</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Security PIN / Token (Optional)
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Leave blank for local loopback"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/30 border border-slate-800/80">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-200">Auto-poll Telemetry</div>
                <div className="text-[11px] text-slate-400">Regularly query phone every 3 seconds while active</div>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 border-slate-700 bg-slate-950"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSyncing}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg transition-all shadow-sm shadow-cyan-500/20 disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Save & Connect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

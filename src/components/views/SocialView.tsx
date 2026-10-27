import React, { useState } from 'react';
import { SocialIntegration, SocialPlatform } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  Lock,
  Layers,
  KeyRound
} from 'lucide-react';

interface SocialViewProps {
  integrations: SocialIntegration[];
  onToggleConnect: (platform: SocialPlatform) => void;
}

export const SocialView: React.FC<SocialViewProps> = ({
  integrations,
  onToggleConnect,
}) => {
  const [activeModalPlatform, setActiveModalPlatform] = useState<SocialIntegration | null>(null);

  const getPlatformBrandColor = (id: SocialPlatform) => {
    switch (id) {
      case 'whatsapp': return '#25D366';
      case 'telegram': return '#229ED9';
      case 'instagram': return '#E1306C';
      case 'facebook': return '#1877F2';
      default: return '#06B6D4';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Social Integrations &amp; Permissions</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Authorized platform bridges for WhatsApp, Telegram, Instagram, and Facebook. Follows official API terms and respects cryptographic sandboxes.
          </p>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => {
          const brandColor = getPlatformBrandColor(item.id);
          return (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700/80 transition-all"
            >
              <div>
                {/* Platform Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold text-white shadow-lg shrink-0"
                      style={{ backgroundColor: brandColor }}
                    >
                      {item.displayName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">
                        {item.displayName}
                      </h2>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.authMethod}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      item.isConnected
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.isConnected ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-400" />
                        <span>Not Connected</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Supported Capabilities */}
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block mb-1.5">
                      Authorized Capabilities:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {item.supportedFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Unavailable / Restricted Features */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Platform Limitations (Security Boundary):
                    </span>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {item.unavailableFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Security Disclosure */}
                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-[11px] text-slate-400 leading-relaxed mb-4">
                  <span className="text-slate-300 font-medium block mb-0.5">Policy Note:</span>
                  {item.securityNote}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-500 font-mono">
                  {item.isConnected ? (
                    <span>Last sync: {item.lastSyncTimestamp || 'Active'}</span>
                  ) : (
                    <span>No active session</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalPlatform(item)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    API Details
                  </button>
                  <button
                    onClick={() => onToggleConnect(item.id)}
                    className={`px-3.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                      item.isConnected
                        ? 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-800/50'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold'
                    }`}
                  >
                    {item.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Platform API Details Modal */}
      {activeModalPlatform && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: getPlatformBrandColor(activeModalPlatform.id) }}
                >
                  {activeModalPlatform.displayName.charAt(0)}
                </div>
                <h3 className="text-base font-bold text-white">
                  {activeModalPlatform.displayName} Integration Architecture
                </h3>
              </div>
              <button
                onClick={() => setActiveModalPlatform(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                <strong>Authentication Flow:</strong> {activeModalPlatform.authMethod}
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300">
                Package: {activeModalPlatform.packageName}<br />
                Target API Level: 35 (Android 15)<br />
                Token Storage: AndroidKeyStore (AES-256 GCM)
              </div>
              <p className="text-slate-400 leading-relaxed">
                ZEN AI guarantees that zero session tokens or personal chats are uploaded. Where official platform APIs restrict personal access (e.g., personal WhatsApp chats or Instagram DMs), ZEN AI uses Android's native NotificationListenerService to show permitted on-device alert previews only.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModalPlatform(null)}
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

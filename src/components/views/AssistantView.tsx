import React, { useState, useRef, useEffect } from 'react';
import { 
  DeviceStatus, 
  InstalledApp, 
  MonitoredNotification, 
  CallRecord, 
  PermissionStatus 
} from '../../types';
import { evaluateLocalRule } from '../../utils/localAiEngine';
import { 
  Sparkles, 
  Send, 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  Info, 
  CornerDownLeft, 
  Lock,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface AssistantViewProps {
  deviceStatus: DeviceStatus;
  apps: InstalledApp[];
  notifications: MonitoredNotification[];
  calls: CallRecord[];
  permissions: PermissionStatus;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'local_deterministic_engine' | 'gemini-3.8-flash';
  suggestedActions?: string[];
  settingsShortcut?: string;
  isError?: boolean;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  deviceStatus,
  apps,
  notifications,
  calls,
  permissions,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [aiMode, setAiMode] = useState<'local' | 'online'>('local');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello, I am ZEN AI. I can answer questions about your device battery, application screen time, notification volume, and phone permissions using strictly authorized on-device data.',
      timestamp: 'Just now',
      source: 'local_deterministic_engine',
      suggestedActions: [
        'What is my battery level?',
        'Which apps did I use most today?',
        'Summarize my recent notifications',
        'Show my phone\'s current monitoring permissions',
      ],
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContextInspector, setShowContextInspector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle passed initial question from other tabs
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  // Top app by usage
  const topApp = [...apps].sort((a, b) => b.usageTodayMinutes - a.usageTodayMinutes)[0];
  const missedCallsCount = calls.filter((c) => c.callType === 'missed').length;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputPrompt('');
    setIsLoading(true);

    if (aiMode === 'local') {
      // Offline Deterministic Rule Engine
      setTimeout(() => {
        const localAnswer = evaluateLocalRule(textToSend, {
          batteryLevel: deviceStatus.batteryLevel,
          isCharging: deviceStatus.isCharging,
          batteryHealth: deviceStatus.batteryHealth,
          availableStorageGB: deviceStatus.availableStorageGB,
          totalStorageGB: deviceStatus.totalStorageGB,
          topAppName: topApp?.name,
          topAppMinutes: topApp?.usageTodayMinutes,
          totalNotificationsToday: notifications.length,
          missedCallsCount,
          hasNotificationAccess: permissions.notificationAccess,
          hasUsageAccess: permissions.usageAccess,
          hasCallLogAccess: permissions.callLogAccess,
        });

        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: localAnswer.reply,
          timestamp: 'Just now',
          source: 'local_deterministic_engine',
          suggestedActions: localAnswer.suggestedActions,
          settingsShortcut: localAnswer.settingsShortcut,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 150);
    } else {
      // Online Mode via secure backend proxy (/api/ai-assistant)
      try {
        const payload = {
          prompt: textToSend,
          deviceContext: {
            batteryLevel: `${deviceStatus.batteryLevel}%`,
            chargingState: deviceStatus.isCharging ? 'Charging' : 'Discharging',
            availableStorageGB: `${deviceStatus.availableStorageGB} GB`,
            topAppsByUsage: apps.slice(0, 5).map((a) => ({ name: a.name, minutes: a.usageTodayMinutes })),
            notificationSummary: {
              totalLast24h: notifications.length,
              mutedAppsCount: apps.filter((a) => a.notificationsMuted).length,
              topSenderApps: Array.from(new Set(notifications.map((n) => n.appName))),
            },
            callSummary: {
              missedCallsCount,
              totalIncomingDurationMinutes: Math.round(
                calls.filter((c) => c.callType === 'incoming').reduce((acc, c) => acc + c.durationSeconds, 0) / 60
              ),
            },
            activePermissions: Object.entries(permissions)
              .filter(([_, v]) => v)
              .map(([k]) => k),
          },
        };

        const res = await fetch('/api/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok && data.reply) {
          const assistantMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: 'Just now',
            source: 'gemini-3.8-flash',
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          // Fallback to local with explanation
          const localFallback = evaluateLocalRule(textToSend, {
            batteryLevel: deviceStatus.batteryLevel,
            isCharging: deviceStatus.isCharging,
            batteryHealth: deviceStatus.batteryHealth,
            availableStorageGB: deviceStatus.availableStorageGB,
            totalStorageGB: deviceStatus.totalStorageGB,
            topAppName: topApp?.name,
            topAppMinutes: topApp?.usageTodayMinutes,
            totalNotificationsToday: notifications.length,
            missedCallsCount,
            hasNotificationAccess: permissions.notificationAccess,
            hasUsageAccess: permissions.usageAccess,
            hasCallLogAccess: permissions.callLogAccess,
          });

          const assistantMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: `${localFallback.reply}\n\n(Note: Online AI backend returned notice: ${data.message || data.error || 'Switched to local engine'})`,
            timestamp: 'Just now',
            source: 'local_deterministic_engine',
            suggestedActions: localFallback.suggestedActions,
            isError: true,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (err: any) {
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Online request failed (${err.message}). Using local fallback engine:\n\n${
            evaluateLocalRule(textToSend, {
              batteryLevel: deviceStatus.batteryLevel,
              isCharging: deviceStatus.isCharging,
              batteryHealth: deviceStatus.batteryHealth,
              availableStorageGB: deviceStatus.availableStorageGB,
              totalStorageGB: deviceStatus.totalStorageGB,
              topAppName: topApp?.name,
              topAppMinutes: topApp?.usageTodayMinutes,
              totalNotificationsToday: notifications.length,
              missedCallsCount,
              hasNotificationAccess: permissions.notificationAccess,
              hasUsageAccess: permissions.usageAccess,
              hasCallLogAccess: permissions.callLogAccess,
            }).reply
          }`,
          timestamp: 'Just now',
          source: 'local_deterministic_engine',
          isError: true,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const samplePrompts = [
    'What is my battery level?',
    'Which apps did I use most today?',
    'Summarize my recent notifications',
    'How many missed calls are in the permitted call history?',
    'Show my phone\'s current monitoring permissions',
    'Help me reduce unnecessary notifications',
  ];

  return (
    <div className="space-y-6">
      
      {/* Header and Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">ZEN AI Assistant</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Inspects authorized device data with privacy boundaries. Never uploads private chat text or personal identifiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Dual AI Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setAiMode('local')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                aiMode === 'local'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Runs on-device deterministic logic with zero network packets"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Local Mode (Offline)</span>
            </button>
            <button
              onClick={() => setAiMode('online')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                aiMode === 'online'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Queries Gemini 3.8 Flash via secure server proxy with sanitized context"
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Online Mode (Gemini)</span>
            </button>
          </div>

          <button
            onClick={() => setShowContextInspector(!showContextInspector)}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-cyan-300 transition-colors"
            title="Inspect Data Context sent to AI"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context Inspector Drawer */}
      {showContextInspector && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Sanitized Device Context (Zero Private Egress)
            </span>
            <button
              onClick={() => setShowContextInspector(false)}
              className="text-slate-500 hover:text-white"
            >
              Close
            </button>
          </div>
          <pre className="text-[11px] text-slate-300 overflow-x-auto p-3 bg-slate-900 rounded-lg max-h-48">
{JSON.stringify(
  {
    batteryLevel: `${deviceStatus.batteryLevel}%`,
    chargingState: deviceStatus.isCharging ? 'Charging' : 'On battery',
    topAppToday: topApp ? `${topApp.name} (${topApp.usageTodayMinutes} min)` : 'None',
    totalNotificationsBuffered: notifications.length,
    missedCallsCount,
    permissionsGranted: Object.entries(permissions).filter(([_, v]) => v).map(([k]) => k),
    aiMode: aiMode === 'local' ? 'On-Device Rule Engine (0 bytes sent)' : 'Gemini 3.8 Flash Server Proxy',
  },
  null,
  2
)}
          </pre>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 min-h-[420px] max-h-[560px] flex flex-col justify-between overflow-hidden shadow-inner">
        
        <div className="space-y-4 overflow-y-auto pr-2 mb-4 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] lg:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-sm shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/80 border border-slate-800/90 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Suggested Actions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(action)}
                            className="px-2.5 py-1 text-[11px] text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 rounded-md transition-colors text-left"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.settingsShortcut && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <span>Intent:</span>
                      <span className="text-cyan-400 font-semibold">{msg.settingsShortcut}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
                  <span>{msg.timestamp}</span>
                  {msg.source && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-cyan-400/80">
                        {msg.source === 'local_deterministic_engine' ? 'Local Engine' : 'Gemini 3.8 Flash'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Evaluating on-device device state...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form and Suggestions */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          
          {/* Quick Prompts Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {samplePrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-cyan-300 bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 rounded-lg whitespace-nowrap shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                aiMode === 'local'
                  ? 'Ask about battery, screen time, notifications, or permissions (Offline)...'
                  : 'Ask ZEN AI via secure backend proxy (Gemini 3.8 Flash)...'
              }
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

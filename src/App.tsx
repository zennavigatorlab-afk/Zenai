import React, { useState } from 'react';
import { 
  NavigationTab, 
  DeviceStatus, 
  InstalledApp, 
  MonitoredNotification, 
  SocialIntegration, 
  SocialPlatform, 
  CallRecord, 
  PermissionStatus, 
  PrivacySettings, 
  AuditLogEntry 
} from './types';
import { 
  INITIAL_DEVICE_STATUS, 
  INITIAL_APPS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_SOCIAL_INTEGRATIONS, 
  INITIAL_CALLS, 
  INITIAL_PERMISSIONS, 
  INITIAL_PRIVACY_SETTINGS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { sanitizeNotificationText } from './utils/sanitizer';
import { exportAndroidStudioProjectZip, triggerDownload } from './utils/zipExporter';

import { Header } from './components/Header';
import { HomeView } from './components/views/HomeView';
import { AppsView } from './components/views/AppsView';
import { NotificationsView } from './components/views/NotificationsView';
import { SocialView } from './components/views/SocialView';
import { CallsView } from './components/views/CallsView';
import { AssistantView } from './components/views/AssistantView';
import { PrivacyView } from './components/views/PrivacyView';
import { ProjectCodeView } from './components/views/ProjectCodeView';
import { MobileGuideView } from './components/views/MobileGuideView';
import { SimulatorControlsModal } from './components/SimulatorControlsModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(INITIAL_DEVICE_STATUS);
  const [apps, setApps] = useState<InstalledApp[]>(INITIAL_APPS);
  const [notifications, setNotifications] = useState<MonitoredNotification[]>(INITIAL_NOTIFICATIONS);
  const [socialIntegrations, setSocialIntegrations] = useState<SocialIntegration[]>(INITIAL_SOCIAL_INTEGRATIONS);
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);
  const [permissions, setPermissions] = useState<PermissionStatus>(INITIAL_PERMISSIONS);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(INITIAL_PRIVACY_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [isNotificationPaused, setIsNotificationPaused] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [initialAiQuestion, setInitialAiQuestion] = useState<string | undefined>(undefined);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  };

  const addAuditLog = (category: AuditLogEntry['category'], action: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
      action,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // ZIP Export Handler
  const handleExportZip = async () => {
    try {
      setIsExportingZip(true);
      const blob = await exportAndroidStudioProjectZip();
      triggerDownload(blob, 'zen-ai-android-studio-project.zip');
      showToast('Downloaded complete Android Studio Gradle Project (.zip)!');
      addAuditLog('INTEGRATION', 'Android Project Exported', 'Packaged 20+ native Kotlin, Gradle, and Room files into zip.');
    } catch (err: any) {
      showToast(`Export failed: ${err.message}`);
    } finally {
      setIsExportingZip(false);
    }
  };

  // App Actions
  const handleToggleMuteApp = (appId: string) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const next = !app.notificationsMuted;
          showToast(`${app.name} notifications ${next ? 'muted' : 'unmuted'}`);
          addAuditLog('NOTIFICATION_FILTER', `${app.name} Channel Muted`, `User changed notification filter rule for ${app.packageName}`);
          return { ...app, notificationsMuted: next };
        }
        return app;
      })
    );
  };

  const handleSimulateAppLaunch = (app: InstalledApp) => {
    showToast(`Intent launched: com.android.internal.app.ResolverActivity -> ${app.packageName}`);
    addAuditLog('PERMISSION', 'App Launched', `Explicit Intent fired for ${app.name}`);
  };

  const handleOpenAppInfo = (app: InstalledApp) => {
    showToast(`Intent: Settings.ACTION_APPLICATION_DETAILS_SETTINGS (package:${app.packageName})`);
  };

  // Notification Actions
  const handleTogglePauseNotifications = () => {
    const next = !isNotificationPaused;
    setIsNotificationPaused(next);
    showToast(next ? 'Notification listener paused' : 'Notification listener active');
    addAuditLog('NOTIFICATION_FILTER', next ? 'Monitoring Paused' : 'Monitoring Resumed', 'NotificationListenerService state altered by user');
  };

  const handleToggleMaskSensitive = () => {
    const next = !privacySettings.maskSensitiveNotifications;
    setPrivacySettings((prev) => ({ ...prev, maskSensitiveNotifications: next }));
    showToast(next ? 'Sensitive OTP & credential masking enabled' : 'Sensitive preview masking disabled');
  };

  const handleClearAllNotifications = () => {
    const count = notifications.length;
    setNotifications([]);
    showToast(`Purged ${count} notifications from local Room database`);
    addAuditLog('DATA_CLEARED', 'Notifications Purged', `Cleared ${count} buffered notification records.`);
  };

  // Social Integrations
  const handleToggleSocialConnect = (platformId: SocialPlatform) => {
    setSocialIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === platformId) {
          const next = !item.isConnected;
          showToast(`${item.displayName} integration ${next ? 'connected' : 'disconnected'}`);
          addAuditLog('INTEGRATION', `${item.displayName} Status Changed`, `Integration set to ${next ? 'Connected' : 'Disconnected'}`);
          return {
            ...item,
            isConnected: next,
            connectionState: next ? 'connected' : 'disconnected',
            lastSyncTimestamp: next ? 'Just now' : undefined,
          };
        }
        return item;
      })
    );
  };

  // Calls
  const handleClearCalls = () => {
    const count = calls.length;
    setCalls([]);
    showToast(`Cleared ${count} call records from local storage`);
    addAuditLog('DATA_CLEARED', 'Call Log Cleared', `Wiped ${count} local call records.`);
  };

  const handleRequestCallLogPermission = () => {
    setPermissions((prev) => ({ ...prev, callLogAccess: true }));
    showToast('Granted READ_CALL_LOG runtime permission');
    addAuditLog('PERMISSION', 'Call Log Granted', 'User authorized READ_CALL_LOG runtime permission.');
  };

  // Permissions & Settings
  const handleTogglePermission = (key: keyof PermissionStatus) => {
    setPermissions((prev) => {
      const nextVal = !prev[key];
      const name = String(key);
      showToast(`${name} set to ${nextVal ? 'Granted' : 'Revoked'}`);
      addAuditLog('PERMISSION', `${name} Toggled`, `Permission value updated to ${nextVal}`);
      return { ...prev, [key]: nextVal };
    });
  };

  const handleWipeAllData = () => {
    setNotifications([]);
    setCalls([]);
    setAuditLogs([]);
    showToast('All local on-device Room tables completely purged');
  };

  const handleOpenSystemSettings = (type: string) => {
    switch (type) {
      case 'notification':
        showToast('Intent: Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS');
        break;
      case 'usage':
        showToast('Intent: Settings.ACTION_USAGE_ACCESS_SETTINGS');
        break;
      case 'battery':
        showToast('Intent: Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS');
        break;
      default:
        showToast('Intent: Settings.ACTION_APPLICATION_DETAILS_SETTINGS');
    }
  };

  // Notification Injector (Simulator)
  const handleTriggerSimulatedNotification = (
    pkg: string,
    appName: string,
    title: string,
    text: string,
    isSensitive: boolean
  ) => {
    if (isNotificationPaused) {
      showToast('Notification dropped: Monitoring is currently paused.');
      return;
    }

    if (!permissions.notificationAccess) {
      showToast('Notification dropped: Notification Access permission is not granted.');
      return;
    }

    const preview = privacySettings.maskSensitiveNotifications && isSensitive
      ? sanitizeNotificationText(text)
      : text;

    const newNotif: MonitoredNotification = {
      id: `notif-${Date.now()}`,
      packageName: pkg,
      appName,
      title,
      textPreview: preview,
      timestamp: 'Just now',
      isSensitive,
      isGrouped: false,
      category: 'Social',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Incoming notification from ${appName}: "${title}"`);
    addAuditLog('NOTIFICATION_FILTER', `Captured from ${appName}`, `Title: ${title} · Sanitized: ${isSensitive ? 'Yes' : 'No'}`);
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onExportProject={handleExportZip}
        isExporting={isExportingZip}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {currentTab === 'home' && (
          <HomeView
            deviceStatus={deviceStatus}
            apps={apps}
            notifications={notifications}
            permissions={permissions}
            auditLogs={auditLogs}
            onNavigate={setCurrentTab}
            onAskAi={(q) => {
              setInitialAiQuestion(q);
              setCurrentTab('assistant');
            }}
          />
        )}

        {currentTab === 'apps' && (
          <AppsView
            apps={apps}
            onToggleMuteApp={handleToggleMuteApp}
            onSimulateAppLaunch={handleSimulateAppLaunch}
            onOpenAppInfo={handleOpenAppInfo}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            permissions={permissions}
            isPaused={isNotificationPaused}
            maskSensitivePreviews={privacySettings.maskSensitiveNotifications}
            onTogglePause={handleTogglePauseNotifications}
            onToggleMaskSensitive={handleToggleMaskSensitive}
            onClearAllNotifications={handleClearAllNotifications}
            onOpenSettings={() => handleOpenSystemSettings('notification')}
          />
        )}

        {currentTab === 'social' && (
          <SocialView
            integrations={socialIntegrations}
            onToggleConnect={handleToggleSocialConnect}
          />
        )}

        {currentTab === 'calls' && (
          <CallsView
            calls={calls}
            permissions={permissions}
            onClearCalls={handleClearCalls}
            onRequestPermission={handleRequestCallLogPermission}
          />
        )}

        {currentTab === 'assistant' && (
          <AssistantView
            deviceStatus={deviceStatus}
            apps={apps}
            notifications={notifications}
            calls={calls}
            permissions={permissions}
            initialQuestion={initialAiQuestion}
            onClearInitialQuestion={() => setInitialAiQuestion(undefined)}
          />
        )}

        {currentTab === 'privacy' && (
          <PrivacyView
            permissions={permissions}
            privacySettings={privacySettings}
            auditLogs={auditLogs}
            onTogglePermission={handleTogglePermission}
            onUpdateSettings={(newVals) => setPrivacySettings((prev) => ({ ...prev, ...newVals }))}
            onClearAllData={handleWipeAllData}
            onClearAuditLogs={() => setAuditLogs([])}
            onOpenSystemSettings={handleOpenSystemSettings}
          />
        )}

        {currentTab === 'project_code' && (
          <ProjectCodeView
            onExportZip={handleExportZip}
            isExporting={isExportingZip}
          />
        )}

        {currentTab === 'mobile_guide' && (
          <MobileGuideView
            onExportZip={handleExportZip}
            isExporting={isExportingZip}
          />
        )}

      </main>

      {/* Simulated Android Intent / Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-cyan-500/40 text-slate-100 px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Device Event Simulator Modal */}
      <SimulatorControlsModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        deviceStatus={deviceStatus}
        permissions={permissions}
        onUpdateDeviceStatus={(updates) => setDeviceStatus((prev) => ({ ...prev, ...updates }))}
        onTogglePermission={handleTogglePermission}
        onTriggerNotification={handleTriggerSimulatedNotification}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <span>ZEN AI · Kotlin SDK 35 · Jetpack Compose · Room DB · Zero Background Telemetry</span>
      </footer>

    </div>
  );
}

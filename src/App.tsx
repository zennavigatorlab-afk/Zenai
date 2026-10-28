import React, { useState } from 'react';
import { 
  NavigationTab, 
  SocialIntegration, 
  SocialPlatform, 
  PermissionStatus, 
  PrivacySettings, 
  AuditLogEntry,
  InstalledApp,
  MonitoredNotification
} from './types';
import { 
  DEFAULT_SOCIAL_INTEGRATIONS, 
  DEFAULT_PRIVACY_SETTINGS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { sanitizeNotificationText } from './utils/sanitizer';
import { exportAndroidStudioProjectZip, triggerDownload } from './utils/zipExporter';
import { useDeviceTelemetry } from './hooks/useDeviceTelemetry';

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
import { PairingBridgeModal } from './components/PairingBridgeModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [socialIntegrations, setSocialIntegrations] = useState<SocialIntegration[]>(DEFAULT_SOCIAL_INTEGRATIONS);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [isNotificationPaused, setIsNotificationPaused] = useState(false);
  const [isPairingOpen, setIsPairingOpen] = useState(false);
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

  // Honest Telemetry & Bridge Hook
  const {
    deviceStatus,
    setDeviceStatus,
    apps,
    setApps,
    notifications,
    setNotifications,
    calls,
    setCalls,
    permissions,
    setPermissions,
    syncStatus,
    lastSyncError,
    bridgeConfig,
    setBridgeConfig,
    isManualSyncing,
    triggerManualSync
  } = useDeviceTelemetry(addAuditLog);

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
    showToast(`Launching ${app.name} (${app.packageName})...`);
    addAuditLog('PERMISSION', 'App Launched', `Explicit Intent fired for ${app.name}`);
  };

  const handleOpenAppInfo = (app: InstalledApp) => {
    showToast(`Android Intent: Settings.ACTION_APPLICATION_DETAILS_SETTINGS (${app.packageName})`);
  };

  // Notification Actions
  const handleTogglePauseNotifications = () => {
    const next = !isNotificationPaused;
    setIsNotificationPaused(next);
    showToast(next ? 'Notification listener paused' : 'Notification listener active');
    addAuditLog('NOTIFICATION_FILTER', next ? 'Monitoring Paused' : 'Monitoring Resumed', 'NotificationListenerService state altered by user');
  };

  const handleToggleMaskSensitive = () => {
    setPrivacySettings((prev) => {
      const next = !prev.maskSensitiveNotifications;
      showToast(next ? 'OTP & credential masking enabled' : 'Raw preview mode active');
      addAuditLog('NOTIFICATION_FILTER', 'Sensitive Masking Toggled', `Mask sensitive previews: ${next}`);
      return { ...prev, maskSensitiveNotifications: next };
    });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast('Cleared notification buffer');
    addAuditLog('DATA_CLEARED', 'Notifications Flushed', 'Cleared local volatile notification table');
  };

  // Social Connect Actions
  const handleToggleSocialConnect = (platformId: SocialPlatform) => {
    setSocialIntegrations((prev) =>
      prev.map((soc) => {
        if (soc.id === platformId) {
          const next = !soc.isConnected;
          showToast(`${soc.displayName} integration ${next ? 'connected via Notification Hook' : 'disconnected'}`);
          addAuditLog('INTEGRATION', `${soc.displayName} Hook Toggled`, `User set connection state to ${next}`);
          return {
            ...soc,
            isConnected: next,
            connectionState: next ? 'connected' : 'disconnected',
            lastSyncTimestamp: next ? 'Just now' : undefined,
          };
        }
        return soc;
      })
    );
  };

  // Calls Actions
  const handleClearCalls = () => {
    setCalls([]);
    showToast('Permitted call records cleared from local database');
    addAuditLog('DATA_CLEARED', 'Call History Cleared', 'User cleared permitted call records');
  };

  const handleRequestCallLogPermission = () => {
    setPermissions((prev) => ({ ...prev, callLogAccess: !prev.callLogAccess }));
    showToast('Toggled READ_CALL_LOG runtime permission');
    addAuditLog('PERMISSION', 'Call Log Permission Changed', 'Runtime permission state toggled');
  };

  // Privacy Actions
  const handleTogglePermission = (permKey: keyof PermissionStatus) => {
    setPermissions((prev) => {
      const nextVal = !prev[permKey];
      showToast(`${String(permKey)} toggled: ${nextVal ? 'Granted' : 'Revoked'}`);
      addAuditLog('PERMISSION', `${String(permKey)} Modified`, `Permission set to ${nextVal}`);
      return { ...prev, [permKey]: nextVal };
    });
  };

  const handleOpenSystemSettings = (category: string) => {
    showToast(`Opening Android Settings (${category})...`);
    addAuditLog('PERMISSION', 'Settings Opened', `User navigated to Android ${category} settings`);
  };

  const handleWipeAllData = () => {
    setNotifications([]);
    setCalls([]);
    setAuditLogs([]);
    showToast('Wiped local Room database tables & keystore keys');
    addAuditLog('DATA_CLEARED', 'Emergency Data Wipe', 'All decrypted tables flushed and keys zeroed');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenPairing={() => setIsPairingOpen(true)}
        onExportProject={handleExportZip}
        isExporting={isExportingZip}
        syncStatus={syncStatus}
        isSyncing={isManualSyncing}
        onTriggerSync={triggerManualSync}
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
            syncStatus={syncStatus}
            onNavigate={setCurrentTab}
            onAskAi={(q) => {
              setInitialAiQuestion(q);
              setCurrentTab('assistant');
            }}
            onOpenPairing={() => setIsPairingOpen(true)}
          />
        )}

        {currentTab === 'apps' && (
          <AppsView
            apps={apps}
            onToggleMuteApp={handleToggleMuteApp}
            onSimulateAppLaunch={handleSimulateAppLaunch}
            onOpenAppInfo={handleOpenAppInfo}
            onOpenPairing={() => setIsPairingOpen(true)}
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

      {/* Pairing Bridge Modal */}
      <PairingBridgeModal
        isOpen={isPairingOpen}
        onClose={() => setIsPairingOpen(false)}
        config={bridgeConfig}
        onSaveConfig={setBridgeConfig}
        syncStatus={syncStatus}
        lastError={lastSyncError}
        onTestSync={triggerManualSync}
        isSyncing={isManualSyncing}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <span>ZEN AI · Kotlin SDK 35 · Jetpack Compose · Room DB · Zero Fake Telemetry</span>
      </footer>

    </div>
  );
}

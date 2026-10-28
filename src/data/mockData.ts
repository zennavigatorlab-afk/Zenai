import {
  DeviceStatus,
  InstalledApp,
  MonitoredNotification,
  SocialIntegration,
  CallRecord,
  PermissionStatus,
  PrivacySettings,
  AuditLogEntry,
  BridgeConfig
} from '../types';

/**
 * Honest, zero-mock initial states.
 * No hardcoded metrics, fake battery percentages, or demo chat transcripts.
 * When unpaired, all fields remain null or empty with explicit 'UNPAIRED' state attribution.
 */

export const EMPTY_DEVICE_STATUS: DeviceStatus = {
  batteryLevel: null,
  isCharging: null,
  batteryHealth: 'Unknown',
  temperatureC: null,
  availableStorageGB: null,
  totalStorageGB: null,
  manufacturer: null,
  model: null,
  androidVersion: null,
  apiLevel: null,
  networkType: 'Unknown',
  ipAddress: null,
  uptimeHours: null,
  securityPatchDate: null,
  source: 'UNPAIRED',
  state: 'IDLE',
  batterySource: 'Android BatteryManager (ACTION_BATTERY_CHANGED) / Browser Battery API',
  storageSource: 'Android StatFs (/data partition)',
  networkSource: 'Android ConnectivityManager / NetworkCapabilities',
  deviceSource: 'Android Build.MANUFACTURER & Build.MODEL',
  lastUpdated: null,
  pairingMessage: 'Native Android APK not connected. Launch ZEN AI APK on this phone to stream live system telemetry.',
};

export const EMPTY_APPS: InstalledApp[] = [];
export const EMPTY_NOTIFICATIONS: MonitoredNotification[] = [];
export const EMPTY_CALLS: CallRecord[] = [];

export const DEFAULT_PERMISSIONS: PermissionStatus = {
  notificationAccess: false,
  usageAccess: false,
  callLogAccess: false,
  batteryOptimizationIgnored: false,
  storageAccess: false,
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  dataRetentionDays: 14,
  maskSensitiveNotifications: true,
  aggregateOnlyAiMode: true,
  enableLocalAuditLog: true,
  allowOnlineAiProcessing: false,
};

export const DEFAULT_SOCIAL_INTEGRATIONS: SocialIntegration[] = [
  {
    id: 'whatsapp',
    displayName: 'WhatsApp',
    packageName: 'com.whatsapp',
    isConnected: false,
    authMethod: 'Notification Hook Only',
    supportedFeatures: [
      'Local notification header parsing',
      'OTP & verification code regex masking',
      'Sender name attribution',
      'Per-app alert muting'
    ],
    unavailableFeatures: [
      'Direct chat message extraction (requires WhatsApp Cloud API)',
      'Background contact sync',
      'End-to-end encrypted payload decryption'
    ],
    securityNote: 'ZEN AI adheres to Android sandboxing. WhatsApp messages are never intercepted without Notification Listener permission.',
    monitoredNotificationCount: 0,
    connectionState: 'disconnected',
  },
  {
    id: 'telegram',
    displayName: 'Telegram',
    packageName: 'org.telegram.messenger',
    isConnected: false,
    authMethod: 'Notification Hook Only',
    supportedFeatures: [
      'Channel notification monitoring',
      'Group message count aggregation',
      'Sender handle redaction'
    ],
    unavailableFeatures: [
      'Secret chats decryption',
      'Media stream interception'
    ],
    securityNote: 'Telegram notifications are processed in-memory and sanitized before writing to local Room database.',
    monitoredNotificationCount: 0,
    connectionState: 'disconnected',
  },
  {
    id: 'instagram',
    displayName: 'Instagram',
    packageName: 'com.instagram.android',
    isConnected: false,
    authMethod: 'Notification Hook Only',
    supportedFeatures: [
      'Direct Message arrival alerts',
      'Activity notification counter'
    ],
    unavailableFeatures: [
      'Direct inbox reading (requires Instagram Graph API business verification)',
      'Story viewer analytics'
    ],
    securityNote: 'Zero token storage. Instagram notifications are sanitized locally.',
    monitoredNotificationCount: 0,
    connectionState: 'disconnected',
  },
  {
    id: 'facebook',
    displayName: 'Facebook',
    packageName: 'com.facebook.katana',
    isConnected: false,
    authMethod: 'Notification Hook Only',
    supportedFeatures: [
      'Notification badge tracking',
      'System alert filtering'
    ],
    unavailableFeatures: [
      'Feed interception',
      'Private messenger content reading'
    ],
    securityNote: 'No Meta Graph OAuth tokens requested or stored.',
    monitoredNotificationCount: 0,
    connectionState: 'disconnected',
  },
];

export const DEFAULT_BRIDGE_CONFIG: BridgeConfig = {
  host: '127.0.0.1',
  port: 8080,
  token: '',
  autoSync: true,
  pollIntervalMs: 3000,
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'init-1',
    timestamp: 'Initial System Setup',
    category: 'INTEGRATION',
    action: 'Zero-Fake Telemetry Active',
    details: 'Initialized honest telemetry pipeline. Waiting for genuine Android phone sync.',
  },
];

// Backwards compatibility aliases
export const INITIAL_DEVICE_STATUS = EMPTY_DEVICE_STATUS;
export const INITIAL_APPS = EMPTY_APPS;
export const INITIAL_NOTIFICATIONS = EMPTY_NOTIFICATIONS;
export const INITIAL_SOCIAL_INTEGRATIONS = DEFAULT_SOCIAL_INTEGRATIONS;
export const INITIAL_CALLS = EMPTY_CALLS;
export const INITIAL_PERMISSIONS = DEFAULT_PERMISSIONS;
export const INITIAL_PRIVACY_SETTINGS = DEFAULT_PRIVACY_SETTINGS;

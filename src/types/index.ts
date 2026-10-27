export type NavigationTab = 
  | 'home'
  | 'apps'
  | 'notifications'
  | 'social'
  | 'calls'
  | 'assistant'
  | 'privacy'
  | 'project_code'
  | 'mobile_guide';

export interface DeviceStatus {
  batteryLevel: number;
  isCharging: boolean;
  batteryHealth: 'Good' | 'Fair' | 'Replace Soon';
  temperatureC: number;
  availableStorageGB: number;
  totalStorageGB: number;
  manufacturer: string;
  model: string;
  androidVersion: string;
  apiLevel: number;
  networkType: 'Wi-Fi 6' | '5G' | 'LTE' | 'Offline';
  ipAddress: string;
  uptimeHours: number;
  securityPatchDate: string;
}

export interface InstalledApp {
  id: string;
  name: string;
  packageName: string;
  category: 'Social' | 'Productivity' | 'System' | 'Entertainment' | 'Tools';
  version: string;
  installedDate: string;
  usageTodayMinutes: number;
  lastUsedTimestamp: string;
  isLaunchable: boolean;
  iconBg: string;
  notificationsMuted: boolean;
}

export interface MonitoredNotification {
  id: string;
  packageName: string;
  appName: string;
  title: string;
  textPreview: string;
  timestamp: string;
  isSensitive: boolean;
  isGrouped: boolean;
  category: string;
}

export type SocialPlatform = 'whatsapp' | 'instagram' | 'telegram' | 'facebook';

export interface SocialIntegration {
  id: SocialPlatform;
  displayName: string;
  packageName: string;
  isConnected: boolean;
  authMethod: 'OAuth 2.0 (Meta Graph)' | 'Telegram Bot API / MTProto' | 'WhatsApp Cloud API' | 'Notification Hook Only';
  supportedFeatures: string[];
  unavailableFeatures: string[];
  securityNote: string;
  lastSyncTimestamp?: string;
  monitoredNotificationCount: number;
  connectionState: 'connected' | 'disconnected' | 'restricted';
}

export type CallType = 'incoming' | 'outgoing' | 'missed';

export interface CallRecord {
  id: string;
  callerName?: string;
  phoneNumberMasked: string; // E.g. "+1 (555) •••-4821" for privacy
  callType: CallType;
  timestamp: string;
  durationSeconds: number;
}

export interface PermissionStatus {
  notificationAccess: boolean;
  usageAccess: boolean;
  callLogAccess: boolean;
  batteryOptimizationIgnored: boolean;
  storageAccess: boolean;
}

export interface PrivacySettings {
  dataRetentionDays: 7 | 14 | 30 | 90 | 0; // 0 = retain indefinitely
  maskSensitiveNotifications: boolean;
  aggregateOnlyAiMode: boolean;
  enableLocalAuditLog: boolean;
  allowOnlineAiProcessing: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'PERMISSION' | 'DATA_CLEARED' | 'AI_QUERY' | 'NOTIFICATION_FILTER' | 'INTEGRATION';
  details: string;
}

export interface AndroidProjectFile {
  path: string;
  filename: string;
  category: 'gradle' | 'manifest' | 'kotlin_ui' | 'kotlin_data' | 'kotlin_service' | 'test' | 'docs';
  description: string;
  content: string;
}

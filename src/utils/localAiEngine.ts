export interface LocalAiAnswer {
  reply: string;
  suggestedActions: string[];
  settingsShortcut?: string;
  source: 'local_deterministic_engine';
}

export function evaluateLocalRule(
  query: string,
  context: {
    batteryLevel: number | null;
    isCharging: boolean | null;
    batteryHealth: string;
    availableStorageGB: number | null;
    totalStorageGB: number | null;
    topAppName?: string;
    topAppMinutes?: number;
    totalNotificationsToday: number;
    missedCallsCount: number;
    hasNotificationAccess: boolean;
    hasUsageAccess: boolean;
    hasCallLogAccess: boolean;
  }
): LocalAiAnswer {
  const q = query.toLowerCase().trim();

  // Battery / Power queries
  if (q.includes('battery') || q.includes('charge') || q.includes('power') || q.includes('percentage')) {
    if (context.batteryLevel === null) {
      return {
        reply: `Battery status is currently unavailable on this session. If using a mobile browser, ensure your browser exposes the Battery API, or launch the ZEN AI native APK on your phone to read directly from Android BatteryManager.`,
        suggestedActions: [
          'Pair with Phone APK',
          'Refresh Browser Sensors',
          'Open Battery Settings',
        ],
        settingsShortcut: 'android.settings.BATTERY_SAVER_SETTINGS',
        source: 'local_deterministic_engine',
      };
    }

    const chargeState = context.isCharging === null
      ? 'operating on battery'
      : context.isCharging
        ? 'currently plugged in and charging'
        : 'discharging on battery';

    return {
      reply: `Your battery is at ${context.batteryLevel}% (${context.batteryHealth} condition) and is ${chargeState}. Readings are retrieved directly from runtime hardware status without interpolation.`,
      suggestedActions: [
        'Open Battery Settings',
        'Enable Adaptive Battery',
        'Inspect Background App Draw',
      ],
      settingsShortcut: 'android.settings.BATTERY_SAVER_SETTINGS',
      source: 'local_deterministic_engine',
    };
  }

  // App Usage / Screen time queries
  if (q.includes('usage') || q.includes('most used') || q.includes('screen time') || q.includes('app time')) {
    if (!context.hasUsageAccess) {
      return {
        reply: `App usage metrics are currently unavailable because 'Usage Access' (PACKAGE_USAGE_STATS) has not been granted in Android Settings, or the native APK is not synced.`,
        suggestedActions: ['Open Usage Access Settings', 'Review App Visibility Scope'],
        settingsShortcut: 'android.settings.USAGE_ACCESS_SETTINGS',
        source: 'local_deterministic_engine',
      };
    }
    
    if (!context.topAppName || context.topAppMinutes === undefined) {
      return {
        reply: `No application usage records have been recorded for today yet. Launch applications on your phone to accumulate foreground stats via UsageStatsManager.`,
        suggestedActions: ['View Full App List', 'Refresh Telemetry'],
        source: 'local_deterministic_engine',
      };
    }

    return {
      reply: `Your most used application today is ${context.topAppName} with ${context.topAppMinutes} minutes of foreground screen time. Calculated via Android UsageStatsManager starting from local midnight.`,
      suggestedActions: ['View Full App List', 'Configure App Timer', 'Check Focus Mode'],
      source: 'local_deterministic_engine',
    };
  }

  // Notifications / Alert noise queries
  if (q.includes('notification') || q.includes('alert') || q.includes('noise') || q.includes('message')) {
    if (!context.hasNotificationAccess) {
      return {
        reply: `Notification summaries cannot be generated because ZEN AI does not have Notification Access authorized in Android Settings.`,
        suggestedActions: ['Authorize Notification Listener', 'Learn About Notification Privacy'],
        settingsShortcut: 'android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS',
        source: 'local_deterministic_engine',
      };
    }

    return {
      reply: `You have ${context.totalNotificationsToday} notifications in the active buffer. Incoming alerts are intercepted via Android NotificationListenerService with client-side OTP and credential redaction before local storage.`,
      suggestedActions: [
        'Mute Non-Essential Apps',
        'Pause Monitoring',
        'Toggle Sensitive Masking',
      ],
      source: 'local_deterministic_engine',
    };
  }

  // Calls / Missed calls queries
  if (q.includes('call') || q.includes('missed') || q.includes('phone')) {
    if (!context.hasCallLogAccess) {
      return {
        reply: `Call history is optional and requires explicit runtime permission (READ_CALL_LOG). Currently, access is not granted.`,
        suggestedActions: ['Grant Call Log Access', 'Read Google Play Policy Guide'],
        source: 'local_deterministic_engine',
      };
    }
    return {
      reply: `You have ${context.missedCallsCount} missed calls recorded in your permitted local call log. Caller phone numbers are stored with on-device privacy masking.`,
      suggestedActions: ['Inspect Call Log', 'Clear Stored History'],
      source: 'local_deterministic_engine',
    };
  }

  // Permission / Privacy queries
  if (q.includes('permission') || q.includes('privacy') || q.includes('monitoring') || q.includes('status')) {
    const notifStatus = context.hasNotificationAccess ? 'Granted' : 'Missing';
    const usageStatus = context.hasUsageAccess ? 'Granted' : 'Missing';
    const callStatus = context.hasCallLogAccess ? 'Granted' : 'Missing';

    return {
      reply: `ZEN AI Privacy & Permission State:
• Notification Access: ${notifStatus}
• Usage Stats Access: ${usageStatus}
• Call Log Access: ${callStatus}
• Database Encryption: SQLCipher 256-bit AES backed by hardware Android KeyStore
• Data Egress: Local on-device storage only. Zero remote tracking or telemetry egress.`,
      suggestedActions: ['Manage Permissions', 'Clear Local Database', 'Change Data Retention'],
      settingsShortcut: 'android.settings.PRIVACY_SETTINGS',
      source: 'local_deterministic_engine',
    };
  }

  // Storage / Device status queries
  if (q.includes('storage') || q.includes('space') || q.includes('memory') || q.includes('device')) {
    if (context.availableStorageGB === null || context.totalStorageGB === null) {
      return {
        reply: `Internal storage details (/data partition) require running the native ZEN AI APK via StatFs, as browser sandboxes restrict filesystem partition interrogation.`,
        suggestedActions: ['Pair Phone APK', 'Download Android Project'],
        source: 'local_deterministic_engine',
      };
    }

    const used = (context.totalStorageGB - context.availableStorageGB).toFixed(1);
    return {
      reply: `Storage Breakdown: ${context.availableStorageGB} GB available out of ${context.totalStorageGB} GB total (${used} GB used). Calculated using Android StatFs(Environment.getDataDirectory()).`,
      suggestedActions: ['Open Storage Settings', 'Review Cached Apps'],
      settingsShortcut: 'android.settings.INTERNAL_STORAGE_SETTINGS',
      source: 'local_deterministic_engine',
    };
  }

  // Default fallback
  return {
    reply: `I can answer queries regarding your genuine battery level, screen time & most used apps, recent notification volume, missed calls, or phone permissions. Try one of the suggested prompts:`,
    suggestedActions: [
      'What is my battery level?',
      'Which apps did I use most today?',
      'Summarize my recent notifications',
      'Show my phone\'s current monitoring permissions',
      'How many missed calls are in the permitted call history?',
    ],
    source: 'local_deterministic_engine',
  };
}

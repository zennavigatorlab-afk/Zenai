import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DeviceStatus,
  InstalledApp,
  MonitoredNotification,
  CallRecord,
  PermissionStatus,
  SyncConnectionStatus,
  BridgeConfig,
  AuditLogEntry
} from '../types';
import {
  EMPTY_DEVICE_STATUS,
  EMPTY_APPS,
  EMPTY_NOTIFICATIONS,
  EMPTY_CALLS,
  DEFAULT_PERMISSIONS,
  DEFAULT_BRIDGE_CONFIG
} from '../data/mockData';

export function useDeviceTelemetry(onAddAuditLog?: (category: AuditLogEntry['category'], action: string, details: string) => void) {
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(EMPTY_DEVICE_STATUS);
  const [apps, setApps] = useState<InstalledApp[]>(EMPTY_APPS);
  const [notifications, setNotifications] = useState<MonitoredNotification[]>(EMPTY_NOTIFICATIONS);
  const [calls, setCalls] = useState<CallRecord[]>(EMPTY_CALLS);
  const [permissions, setPermissions] = useState<PermissionStatus>(DEFAULT_PERMISSIONS);

  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfig>(() => {
    try {
      const saved = localStorage.getItem('zen_bridge_config');
      return saved ? JSON.parse(saved) : DEFAULT_BRIDGE_CONFIG;
    } catch {
      return DEFAULT_BRIDGE_CONFIG;
    }
  });

  const [syncStatus, setSyncStatus] = useState<SyncConnectionStatus>('DISCONNECTED');
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const prevSyncStatusRef = useRef<SyncConnectionStatus>('DISCONNECTED');

  // Save config changes
  useEffect(() => {
    try {
      localStorage.setItem('zen_bridge_config', JSON.stringify(bridgeConfig));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [bridgeConfig]);

  // 1. Genuine Browser-level Sensor Integration (when native app is not yet connected)
  const readBrowserSensors = useCallback(async () => {
    let batteryLevel: number | null = null;
    let isCharging: boolean | null = null;
    let batterySource = 'Android BatteryManager (ACTION_BATTERY_CHANGED)';

    // Query real browser battery API if available
    try {
      const nav = navigator as any;
      if (typeof nav.getBattery === 'function') {
        const battery = await nav.getBattery();
        batteryLevel = Math.round(battery.level * 100);
        isCharging = Boolean(battery.charging);
        batterySource = 'Browser Battery API (navigator.getBattery)';
      }
    } catch {
      // Battery API not exposed by browser
    }

    // Query real browser network info
    const nav = navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    let networkType: DeviceStatus['networkType'] = 'Unknown';
    if (conn) {
      if (conn.type === 'wifi' || conn.effectiveType === '4g') {
        networkType = 'Wi-Fi';
      } else if (conn.effectiveType === '3g' || conn.effectiveType === '2g') {
        networkType = 'Cellular';
      } else {
        networkType = 'Cellular';
      }
    } else if (navigator.onLine) {
      networkType = 'Wi-Fi';
    } else {
      networkType = 'Offline';
    }

    // Extract device/model hints from userAgent without inventing fake hardware
    const ua = navigator.userAgent;
    let manufacturer: string | null = null;
    let model: string | null = null;
    let androidVersion: string | null = null;

    if (/Android/i.test(ua)) {
      const match = ua.match(/Android\s([0-9\.]+)/i);
      if (match) androidVersion = `Android ${match[1]}`;
      
      const modelMatch = ua.match(/;\s([^;]+)\sBuild\//);
      if (modelMatch) {
        model = modelMatch[1].trim();
      } else {
        model = 'Android Device';
      }
    }

    setDeviceStatus((prev) => {
      // If we already have native telemetry, keep native
      if (prev.source === 'NATIVE_ANDROID') return prev;

      return {
        ...prev,
        batteryLevel,
        isCharging,
        batteryHealth: batteryLevel !== null ? 'Good' : 'Unknown',
        temperatureC: null, // Browsers do not expose battery temperature
        availableStorageGB: null, // Browsers cannot read /data partition
        totalStorageGB: null,
        manufacturer: manufacturer || (androidVersion ? 'Android' : 'Host Device'),
        model: model || (androidVersion ? 'Mobile Browser' : 'Web Client'),
        androidVersion: androidVersion || 'Browser Session',
        apiLevel: null,
        networkType,
        ipAddress: null,
        uptimeHours: null,
        securityPatchDate: null,
        source: 'BROWSER_API',
        state: batteryLevel !== null ? 'AVAILABLE' : 'IDLE',
        batterySource,
        storageSource: 'Unavailable in browser (Requires ZEN AI Android APK)',
        networkSource: 'Browser Network Information API',
        deviceSource: 'Browser Navigator User-Agent',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        pairingMessage: 'Displaying genuine browser-level readings. Launch ZEN AI APK on this phone for full system metrics.',
      };
    });
  }, []);

  // 2. Poll Native APK Loopback Bridge
  const fetchNativeTelemetry = useCallback(async () => {
    const url = `http://${bridgeConfig.host}:${bridgeConfig.port}/api/v1/telemetry`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      if (bridgeConfig.token.trim()) {
        headers['X-Zen-Token'] = bridgeConfig.token.trim();
      }

      const res = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Sync bridge responded with HTTP ${res.status}`);
      }

      const payload = await res.json();

      // Successfully received genuine phone readings!
      setSyncStatus('CONNECTED');
      setLastSyncError(null);

      if (payload.deviceStatus) {
        setDeviceStatus({
          ...payload.deviceStatus,
          source: 'NATIVE_ANDROID',
          state: 'AVAILABLE',
          batterySource: 'Android BatteryManager (ACTION_BATTERY_CHANGED)',
          storageSource: 'Android StatFs (/data partition)',
          networkSource: 'Android ConnectivityManager',
          deviceSource: 'Android Build.MANUFACTURER & Build.MODEL',
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          pairingMessage: `Live connection verified via ${bridgeConfig.host}:${bridgeConfig.port}`,
        });
      }

      if (Array.isArray(payload.apps)) {
        setApps(payload.apps);
      }
      if (Array.isArray(payload.notifications)) {
        setNotifications(payload.notifications);
      }
      if (Array.isArray(payload.calls)) {
        setCalls(payload.calls);
      }
      if (payload.permissions) {
        setPermissions(payload.permissions);
      }

      if (prevSyncStatusRef.current !== 'CONNECTED') {
        onAddAuditLog?.('INTEGRATION', 'Native Phone Paired', `Established live local sync with ZEN AI Android APK at ${bridgeConfig.host}:${bridgeConfig.port}`);
        prevSyncStatusRef.current = 'CONNECTED';
      }

      return true;
    } catch (err: any) {
      if (prevSyncStatusRef.current === 'CONNECTED') {
        onAddAuditLog?.('INTEGRATION', 'Native Phone Disconnected', `Sync connection lost: ${err.message || 'Connection refused'}`);
        prevSyncStatusRef.current = 'DISCONNECTED';
      }

      setSyncStatus('DISCONNECTED');
      setLastSyncError(err.message === 'The user aborted a request.' ? 'Connection timed out' : 'Native APK bridge not detected on ' + bridgeConfig.host + ':' + bridgeConfig.port);
      
      // Fallback to real browser sensors
      readBrowserSensors();
      return false;
    }
  }, [bridgeConfig, onAddAuditLog, readBrowserSensors]);

  // Initial load
  useEffect(() => {
    readBrowserSensors();

    // Listen to browser battery change events if supported
    let batteryInstance: any = null;
    const nav = navigator as any;
    if (typeof nav.getBattery === 'function') {
      nav.getBattery().then((battery: any) => {
        batteryInstance = battery;
        battery.addEventListener('levelchange', readBrowserSensors);
        battery.addEventListener('chargingchange', readBrowserSensors);
      }).catch(() => {});
    }

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener('levelchange', readBrowserSensors);
        batteryInstance.removeEventListener('chargingchange', readBrowserSensors);
      }
    };
  }, [readBrowserSensors]);

  // Interval polling
  useEffect(() => {
    if (!bridgeConfig.autoSync) return;

    fetchNativeTelemetry();
    const interval = setInterval(fetchNativeTelemetry, bridgeConfig.pollIntervalMs || 4000);
    return () => clearInterval(interval);
  }, [bridgeConfig.autoSync, bridgeConfig.pollIntervalMs, fetchNativeTelemetry]);

  // Manual Trigger
  const triggerManualSync = async () => {
    setIsManualSyncing(true);
    await fetchNativeTelemetry();
    setIsManualSyncing(false);
  };

  return {
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
    triggerManualSync,
    readBrowserSensors
  };
}

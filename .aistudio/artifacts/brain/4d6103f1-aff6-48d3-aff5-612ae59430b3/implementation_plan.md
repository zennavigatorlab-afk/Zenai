# ZEN AI — Real Android Device Data Implementation Plan

> A privacy-centric mobile control center and responsive web dashboard that reads genuine Android system telemetry (battery, storage, network, app usage, sanitized notifications, and call logs) via native Android APIs and pairs securely with the web application via a local encrypted bridge, completely eradicating fake and hardcoded placeholder metrics.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been confirmed and will guide the implementation across both the native Android APK and the web application:

- **Confirmed Decision 1 (Sync Architecture)**: **Local encrypted bridge via phone-to-browser sync**. Protected system data remains local to your device. The native Android app exposes a local loopback/Wi-Fi secure sync endpoint with pairing token authentication, eliminating the need for unvetted third-party cloud servers to ingest your sensitive personal device telemetry.
- **Confirmed Decision 2 (Zero-Fake Disconnected State)**: **Show disconnected status and pairing prompt**. The web dashboard will never show hardcoded numbers (no fake 78% battery, no fake 31.2°C, no sample chat records). When unpaired or disconnected, the dashboard displays explicit "Waiting for Native App Pairing" states, granular permission warnings, and one-tap connection tools.
- **Confirmed Decision 3 (Unified Deployment)**: **Unified codebase deployable to both Vercel domains** (`zenai01.vercel.app` and `zen.eng.ai.vercel.app`). The repository serves both as the full web companion and as the cloud source repository for GitHub Actions automated APK builds.
- **Confirmed Decision 4 (Browser Web API Progressive Enhancement)**: When opened in a mobile browser without the native APK running, the app utilizes genuine standard browser APIs (`navigator.getBattery()`, `navigator.connection`, `performance.memory`) where supported, clearly flagged as `Data Source: Mobile Browser API (Limited)`. When paired with the native APK, it seamlessly upgrades to `Data Source: Native Android System (Full)`.

---

## 1. Overview & Core Concept

### What It Does
ZEN AI is a personal mobile control center designed for your Android phone. It bridges deep, protected native Android system telemetry (real battery health/temperature, `/data` storage allocation, actual app screen-time via `UsageStatsManager`, sanitized notifications via `NotificationListenerService`, and call metadata via `CallLog`) directly into an accessible, high-contrast Material 3 dark-navy dashboard.

### Target Audience & Persona
Built for Android phone owners who want honest, real-time control over their device health, notification privacy, and app habits without needing a desktop computer or Android Studio to compile source code.

### Key Value
- **Zero Hallucinated Telemetry**: Every number, string, and state is verified against an active API. If permission is missing or hardware is absent, it displays `"Permission required"` or `"Unavailable on this device"`.
- **Phone-Only Cloud Build**: Full GitHub Actions CI/CD workflow that compiles a verified debug APK on Ubuntu runners using Temurin JDK 17 and Gradle 8.7 in under 3 minutes directly from a mobile browser.
- **Local Privacy & KeyStore Encryption**: Real AES-GCM 256-bit database encryption backed by hardware `AndroidKeyStore` with on-device regex redaction for OTPs and sensitive credentials.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Zero-State Web Launch**: User visits the website on their phone. The header displays an explicit `DISCONNECTED` status badge with a `Pair Native App` button. Metric cards display clear empty/waiting states with hardware sensor attribution.
2. **One-Tap Pairing**: User taps "Pair Native App" on the website, entering their local sync port/PIN or scanning the pairing code from the ZEN AI Android app running on the same phone or Wi-Fi network.
3. **Live Telemetry Stream**: Upon connection, status switches to `CONNECTED (LIVE)`. Battery percentage, temperature, voltage, free storage bytes, and active network interfaces populate with exact timestamps and API source labels.
4. **Permission & Security Management**: If special Android permissions (Usage Access, Notification Listener, Call Log) are pending, dedicated "Grant Access" buttons deep-link into the respective Android Settings pages.
5. **APK Cloud Build on Phone**: User opens the "Build APK on Phone" tab, follows a 4-step guide to push to GitHub or trigger GitHub Actions, and downloads the signed debug APK directly from their mobile browser.

### Visual Identity & Theme
- **Color Palette**:
  - Neutral Canvas: Deep dark navy (`#0B111E` / `bg-slate-950`) ensuring maximum OLED power efficiency and high contrast.
  - Structural Surfaces: Subtle dark slate containers (`#111C2E` / `border-slate-800/80`) with soft hairline dividers.
  - Accent Budget: Pure Cyan (`#06B6D4` / `text-cyan-400`) and Electric Blue (`#3B82F6`) strictly reserved for primary actions, active navigation tabs, and live connection indicators.
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans`, clean modern geometric typography with strict containment (`text-wrap: balance`).
  - Telemetry & Numbers: `JetBrains Mono` / tabular numerals (`tabular-nums`) ensuring vertical data alignment.
- **Strict Anti-Slop Discipline**:
  - No decorative pulsing dots or ungrounded green indicator pills.
  - No fake AI scores or arbitrary percentages.
  - Every metric has an explicit source label (`BatteryManager`, `StatFs`, `UsageStatsManager`, or `Browser Web API`).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Eradicating Mock Data Files in Favor of Explicit Nullable Sensor Models
- **Chosen Approach**: Replace `INITIAL_DEVICE_STATUS`, `INITIAL_APPS`, `INITIAL_NOTIFICATIONS`, etc. in `mockData.ts` with `EMPTY_DEVICE_STATUS` containing `null` for unread metrics and an explicit `StatusState` enum (`IDLE`, `CONNECTING`, `LIVE`, `PERMISSION_REQUIRED`, `UNAVAILABLE`, `ERROR`).
- **Why**: Displaying hardcoded defaults (e.g. 78% battery, 31.2°C, 84.6 GB storage) deceives the user and violates the core requirement of genuine phone readings.
- **Alternatives Considered**: Keeping sample data behind a "Demo Mode" toggle was rejected because the user explicitly instructed to remove fake and sample values from production flows.

### Decision 2: Local Secure Sync Bridge vs Cloud Relay Database
- **Chosen Approach**: Direct local HTTPS/WSS or localhost loopback bridge between the native Android foreground service and the browser tab.
- **Why**: Zero risk of leaking notification text, app usage records, or phone numbers to external servers. High privacy and zero recurring cloud costs.
- **Alternatives Considered**: Firebase Firestore or Supabase backend relay was evaluated but user explicitly selected the local encrypted bridge option.

### Decision 3: Progressive Hybrid Web Telemetry
- **Chosen Approach**: When the native APK is not active, the web application queries available browser APIs (`navigator.getBattery()`, `navigator.connection`, `navigator.deviceMemory`, `navigator.hardwareConcurrency`) and labels them explicitly as `Browser Web API (Limited)`. Protected metrics (Notifications, Call Log, Full Usage) clearly display `Requires Native APK`.
- **Why**: Provides immediate utility and honest insight when opened in Chrome on Android while demonstrating why the native APK is required for protected system data.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANDROID MOBILE PHONE                            │
│                                                                        │
│  ┌─────────────────────────────────┐   ┌────────────────────────────┐  │
│  │     ZEN AI Native Android App   │   │     Mobile Web Browser     │  │
│  │                                 │   │  (Chrome / Firefox / Edge) │  │
│  │  • BatteryManager               │   │                            │  │
│  │  • StatFs (/data partition)     │   │  • Browser Web APIs:       │  │
│  │  • UsageStatsManager            │   │    - navigator.getBattery  │  │
│  │  • NotificationListenerService  │   │    - navigator.connection  │  │
│  │  • CallLog.Calls Provider       │   │    - deviceMemory / cores  │  │
│  │  • SQLCipher (AES-256 Room DB)  │   │                            │  │
│  │  • Hardware KeyStore Master Key │   │  • Explicit States:        │  │
│  │  • Local Sync Bridge Server     │   │    - LIVE / DISCONNECTED   │  │
│  │    (Port 8080 / Localhost Token)│   │    - PERMISSION_REQUIRED   │  │
│  └────────────────┬────────────────┘   └─────────────▲──────────────┘  │
│                   │                                 │                  │
│                   └───── Local Loopback / Wi-Fi ────┘                  │
│                          (AES-GCM Authenticated)                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CLOUD BUILD PIPELINE (GITHUB ACTIONS)                │
│                                                                        │
│  • Runner: Ubuntu Latest                                               │
│  • JDK: Eclipse Temurin 17                                             │
│  • Gradle: 8.7 (AGP 8.7.2, Kotlin 2.0.21, Jetpack Compose BOM)         │
│  • Command: ./gradlew assembleDebug --no-daemon --stacktrace           │
│  • Artifact: app-debug.apk (Direct mobile browser download)            │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Strategy
- **`DeviceMetric<T>` generic type**:
  ```typescript
  interface DeviceMetric<T> {
    value: T | null;
    state: 'LOADING' | 'AVAILABLE' | 'PERMISSION_REQUIRED' | 'UNAVAILABLE' | 'ERROR';
    source: 'NATIVE_ANDROID' | 'BROWSER_API' | 'NONE';
    apiName?: string;
    lastUpdated?: number;
    errorMessage?: string;
  }
  ```
- **Local Bridge Protocol**:
  - Handshake: Browser queries `GET http://localhost:8080/api/v1/status` with `X-Zen-Token`.
  - Telemetry Payload: JSON snapshot containing battery, storage, memory, apps, notifications, and calls.
  - Validation: Browser verifies schema, updates timestamps, and transitions UI from `DISCONNECTED` to `LIVE`.

### Step-by-Step Implementation Sequence
1. **Audit & Remove Fake Data**:
   - Refactor `src/data/mockData.ts` to export zero-fake, nullable default states.
   - Refactor `src/types/index.ts` to introduce explicit sensor states (`state`, `source`, `apiName`, `lastUpdated`).
2. **Implement Browser Native Sensor Hooks**:
   - Create `src/hooks/useDeviceTelemetry.ts` to query `navigator.getBattery()`, `navigator.connection`, and handle the local sync bridge.
   - Provide genuine browser readings with explicit attribution.
3. **Enhance Native Kotlin Local Sync Server**:
   - Add `LocalSyncServer.kt` to the Android project files in `src/android/projectFiles.ts` (using standard embedded `HttpServer` with token authentication on port 8080).
   - Ensure `AndroidManifest.xml` includes `INTERNET` and `ACCESS_NETWORK_STATE` permissions.
4. **Update Views to Support Explicit States**:
   - Update `HomeView.tsx`, `AppsView.tsx`, `NotificationsView.tsx`, and `CallsView.tsx` with dedicated empty/disconnected states and "Pair Native App" prompts.
5. **Add Local Pairing Modal**:
   - Create `src/components/PairingBridgeModal.tsx` allowing the user to configure port, PIN, or check local loopback connection.
6. **Cloud Build & Deployment Guide**:
   - Update `MobileGuideView.tsx` with clear Vercel deployment instructions and GitHub Actions APK build steps.
7. **Verification**:
   - Run `compile_applet` and `lint_applet` to guarantee error-free compilation.

import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal,
  Settings,
  Bell,
  Clock,
  BatteryCharging,
  Globe,
  Radio,
  Lock,
  Layers
} from 'lucide-react';

interface MobileGuideViewProps {
  onExportZip: () => void;
  isExporting: boolean;
}

export const MobileGuideView: React.FC<MobileGuideViewProps> = ({
  onExportZip,
  isExporting,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      step: '1',
      title: 'Download Complete Android Project (.zip)',
      description: 'Download the prepared native Android Studio Kotlin project files directly to your phone’s storage.',
      action: (
        <button
          onClick={onExportZip}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Packaging Zip...' : 'Download zen-ai-android-project.zip'}</span>
        </button>
      ),
      tip: 'Save this to your phone’s Downloads folder and extract it using your phone’s Files app.',
    },
    {
      step: '2',
      title: 'Create a GitHub Repo in Your Phone Browser',
      description: 'Open Chrome or Firefox on your phone and create a repository to run the free cloud build.',
      action: (
        <a
          href="https://github.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
        >
          <span>Open github.com/new</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ),
      tip: 'Name it "zen-ai-mobile", select Private, and check "Add a README file".',
    },
    {
      step: '3',
      title: 'Upload Project Files to GitHub',
      description: 'Upload the extracted project files into your new GitHub repository.',
      detail: (
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1.5 font-mono">
          <p className="text-cyan-400 font-semibold font-sans">Required file hierarchy:</p>
          <p>• settings.gradle.kts &amp; build.gradle.kts (root)</p>
          <p>• gradle.properties &amp; gradle/libs.versions.toml</p>
          <p>• gradle/wrapper/gradle-wrapper.properties</p>
          <p>• app/build.gradle.kts</p>
          <p>• app/src/main/AndroidManifest.xml</p>
          <p>• app/src/main/java/com/zenai/*.kt</p>
          <p>• .github/workflows/build-apk.yml</p>
        </div>
      ),
      tip: 'You can tap "Add file" > "Upload files" on mobile, or switch your browser to "Desktop site" and press "." to open github.dev web editor.',
    },
    {
      step: '4',
      title: 'Run Free Cloud Build in GitHub Actions',
      description: 'GitHub Actions will automatically launch an Ubuntu runner, install JDK 17, download Gradle 8.7, and compile your native debug APK in ~2-3 minutes.',
      detail: (
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Runs via .github/workflows/build-apk.yml
          </p>
          <p className="text-slate-400">Command executed in cloud: <code className="text-cyan-300 font-mono">./gradlew assembleDebug</code></p>
        </div>
      ),
      tip: 'Tap the "Actions" tab on GitHub to monitor the live build log. Once finished, a green checkmark will appear.',
    },
    {
      step: '5',
      title: 'Download and Install APK on Your Phone',
      description: 'Download the generated artifact directly to your phone and install it with Android Package Installer.',
      detail: (
        <div className="space-y-1.5 text-xs text-slate-300">
          <p>1. Tap the completed GitHub Actions run.</p>
          <p>2. Scroll down to <strong>Artifacts</strong> and tap <strong>ZEN-AI-Mobile-Control-Center-v1.0.0</strong>.</p>
          <p>3. Extract the downloaded ZIP and tap <strong>app-debug.apk</strong>.</p>
          <p>4. When Android prompts <em>"Install unknown apps"</em>, toggle <strong>Allow from this source</strong>.</p>
        </div>
      ),
      tip: 'No computer or ADB cable needed! The APK installs natively on any device running Android 8.0+ (API 26 to 35).',
    },
    {
      step: '6',
      title: 'Grant System Permissions on Your Phone',
      description: 'ZEN AI strictly reads genuine data. To see actual metrics on your phone, authorize the standard Android system gates:',
      detail: (
        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Usage Access (UsageStatsManager)</span>
              <p className="text-[11px] text-slate-400">Settings &gt; Apps &gt; Special app access &gt; Usage access &gt; Enable ZEN AI.</p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-2.5">
            <Bell className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Notification Access (NotificationListenerService)</span>
              <p className="text-[11px] text-slate-400">Settings &gt; Apps &gt; Special app access &gt; Device &amp; app notifications &gt; Enable ZEN AI.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: '7',
      title: 'Pair with Web Dashboard via Localhost Loopback',
      description: 'When running the APK on your phone, open your Vercel website in Chrome on the same phone. The browser connects directly to 127.0.0.1:8080 to stream live readings.',
      detail: (
        <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
          <p className="text-cyan-400 font-semibold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            Local Encrypted Bridge Active
          </p>
          <p className="text-slate-400 text-[11px]">
            No data ever touches remote servers. Loopback traffic stays on your phone’s memory.
          </p>
        </div>
      ),
      tip: 'Tap "Pair Phone" in the top header anytime to test loopback connectivity or change port.',
    },
  ];

  const vercelSteps = [
    {
      title: '1. Push Web Codebase to GitHub',
      desc: 'Use the web codebase repository containing package.json, vite.config.ts, and src/.',
    },
    {
      title: '2. Import Project on Vercel Mobile Browser',
      desc: 'Navigate to vercel.com/new on your phone browser and select your repository.',
    },
    {
      title: '3. Set Framework Preset & Build Settings',
      desc: 'Framework Preset: Vite. Build Command: npm run build. Output Directory: dist.',
    },
    {
      title: '4. Assign Custom Domains',
      desc: 'Under Project Settings > Domains, add both zenai01.vercel.app and zen.eng.ai.vercel.app to deploy the exact same verified zero-fake build to both URLs.',
    },
  ];

  const featureMatrix = [
    { feature: 'Battery Level & Charging State', web: 'Supported (navigator.getBattery)', native: 'Full (BatteryManager ACTION_BATTERY_CHANGED)' },
    { feature: 'Battery Health & Temperature', web: 'Restricted by browser', native: 'Full (BatteryManager EXTRA_TEMPERATURE)' },
    { feature: 'Internal Storage (/data Partition)', web: 'Restricted by browser sandbox', native: 'Full (StatFs Environment.getDataDirectory)' },
    { feature: 'App Screen Time & Foreground Usage', web: 'Restricted by browser sandbox', native: 'Full (UsageStatsManager local day boundary)' },
    { feature: 'Incoming Notification Stream', web: 'Restricted by browser sandbox', native: 'Full (NotificationListenerService with OTP regex)' },
    { feature: 'Call Metadata (Type, Duration, Masked #)', web: 'Restricted by browser sandbox', native: 'Full (CallLog.Calls runtime permission)' },
    { feature: 'Encrypted Database (AES-256 GCM)', web: 'IndexedDB / LocalStorage', native: 'Full (SQLCipher + AndroidKeyStore hardware key)' },
    { feature: 'Offline Rule Engine Q&A', web: 'Supported (In-Memory JS)', native: 'Supported (Local Kotlin Rule Engine)' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
              Mobile Phone APK Build & Vercel Deployment Guide
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              100% executable from an Android phone browser without Android Studio or a computer. Compile the native APK via GitHub Actions and deploy the unified dashboard to Vercel.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Matrix: Web vs Native APK */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Architecture: Web Browser vs Native Android APK
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Due to Android OS security sandboxing, web browsers are restricted from reading protected device partitions and private system services. Here is the exact capability breakdown:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 font-medium">Feature</th>
                <th className="py-2 font-medium">On Website Alone (Browser API)</th>
                <th className="py-2 font-medium text-cyan-300">With ZEN AI Native APK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {featureMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40">
                  <td className="py-2.5 font-medium text-slate-200">{item.feature}</td>
                  <td className="py-2.5 text-slate-400">{item.web}</td>
                  <td className="py-2.5 text-cyan-300 font-mono text-[11px]">{item.native}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step by Step Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Part 1: Build the Native APK on Phone (GitHub Actions)
          </h2>
        </div>

        {steps.map((s, idx) => (
          <div
            key={idx}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700/80 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {s.title}
                </h3>
              </div>
              {s.action && <div className="shrink-0">{s.action}</div>}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pl-10">
              {s.description}
            </p>

            {s.detail && <div className="pl-10">{s.detail}</div>}

            {s.tip && (
              <div className="ml-10 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-[11px] text-slate-400">
                <strong className="text-slate-300">Tip:</strong> {s.tip}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Deploying to Vercel Guide */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Part 2: Deploy Unified Codebase to Both Vercel Websites
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          To update both <strong className="text-cyan-300">zenai01.vercel.app</strong> and <strong className="text-cyan-300">zen.eng.ai.vercel.app</strong> with this zero-fake architecture:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {vercelSteps.map((v, i) => (
            <div key={i} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="font-semibold text-white block">{v.title}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-cyan-950/20 border border-cyan-900/40 rounded-xl text-xs text-cyan-300 space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Zero Secret Leaks &amp; Zero Hardcoded Placeholders
          </p>
          <p className="text-slate-400 text-[11px]">
            The web dashboard contains zero mock telemetry, zero hardcoded battery percentages, and zero fake notifications. Missing readings display explicit states with clear pairing actions.
          </p>
        </div>
      </div>

    </div>
  );
};

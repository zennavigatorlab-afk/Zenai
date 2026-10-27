import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Cloud, 
  ShieldCheck, 
  Terminal,
  Settings,
  Bell,
  Clock,
  BatteryCharging
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
      description: 'Open Chrome or Firefox on your phone and create a private repository to run the free cloud build.',
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
  ];

  const verificationPoints = [
    {
      title: 'BatteryManager Verification',
      test: 'Check battery percentage and health. Plug in your charger; the status should immediately switch to "Charging".',
    },
    {
      title: 'StatFs Storage Verification',
      test: 'Compare internal storage free GB in ZEN AI with Android Settings > Storage. They will match the real /data partition.',
    },
    {
      title: 'UsageStatsManager Verification',
      test: 'Open the Usage tab. ZEN AI reads your actual foreground time per app from midnight to now.',
    },
    {
      title: 'Zero Cloud Telemetry',
      test: 'Turn on Airplane Mode. ZEN AI continues functioning 100% offline because all calculations happen in on-device Kotlin.',
    },
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
              Mobile Phone APK Build Guide (No PC Required)
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Step-by-step workflow designed for an Android phone browser using GitHub's free cloud builders. Build, download, and install the real native ZEN AI APK directly on your phone.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Cards */}
      <div className="space-y-4">
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
                <h2 className="text-sm font-bold text-white">
                  {s.title}
                </h2>
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

      {/* Real Mobile Data Verification Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Real Mobile Data Verification Checklist
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Once installed, verify that ZEN AI accesses genuine Android hardware APIs:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {verificationPoints.map((v, i) => (
            <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="font-semibold text-cyan-300 block">{v.title}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{v.test}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

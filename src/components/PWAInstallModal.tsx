import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  X,
  Share2,
  PlusSquare,
  Sparkles,
  Package,
  FileCode,
  ExternalLink,
  Copy,
  Check,
  Play,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'apk_builder'>('apk_builder');
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = window.location.origin;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        onClose();
      }
    }
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Quicker Laundry & Dry Cleaning',
        text: 'Doorstep laundry & dry cleaning service with live tracking',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="flex flex-col items-center justify-center mb-1">
            <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
              Quicker
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
              Android App &amp; APK Suite
            </span>
          </div>
          <h2 className="font-extrabold text-xl text-slate-900">
            Native Android &amp; Play Store Setup
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Package Name: <code className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded">com.quicker.laundry</code>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('apk_builder')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'apk_builder'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>.APK &amp; Play Store (.AAB)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'install'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
            <span>Install on Phone</span>
          </button>
        </div>

        {/* TAB 1: APK & Play Store (AAB) Generation */}
        {activeTab === 'apk_builder' ? (
          <div className="space-y-4">
            {/* Option A: 1-Click Online Generator (Bubblewrap / PWABuilder) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-950">
                  <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                  Method 1: Instant 2-Min Online APK / AAB Generator
                </span>
                <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  Fastest
                </span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">
                Google's official <strong>Bubblewrap (TWA)</strong> engine builds signed <strong>.APK</strong> and Play Store ready <strong>.AAB</strong> directly from this live URL:
              </p>

              <div className="bg-white p-2.5 rounded-xl border border-blue-200 flex items-center justify-between text-xs font-mono text-slate-700">
                <span className="truncate mr-2 font-semibold text-[11px]">{currentUrl}</span>
                <button
                  type="button"
                  onClick={() => copyCommand(currentUrl, 'url')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-sans text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd === 'url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'url' ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>

              <a
                href={`https://www.pwabuilder.com`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Open PWABuilder &amp; Download APK / AAB</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[10px] text-blue-800">
                1. Open the link above &bull; 2. Paste the copied URL &bull; 3. Click "Package for Android" to download your `.apk` and `.aab` file!
              </p>
            </div>

            {/* Option B: Capacitor Android Native Project (Already generated inside this project!) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                Method 2: Native Android Project (Already Configured)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                The native Android directory (<code>/android</code>) is already generated with Capacitor:
              </p>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    To build debug .APK in Android Studio / Terminal:
                  </span>
                  <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px] flex items-center justify-between">
                    <code>cd android &amp;&amp; ./gradlew assembleDebug</code>
                    <button
                      type="button"
                      onClick={() => copyCommand('cd android && ./gradlew assembleDebug', 'apk')}
                      className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                    >
                      {copiedCmd === 'apk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    To build release .AAB for Google Play Store:
                  </span>
                  <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px] flex items-center justify-between">
                    <code>cd android &amp;&amp; ./gradlew bundleRelease</code>
                    <button
                      type="button"
                      onClick={() => copyCommand('cd android && ./gradlew bundleRelease', 'aab')}
                      className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                    >
                      {copiedCmd === 'aab' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Option C: GitHub Actions Automated Cloud Build */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Automatic GitHub Actions Builder Included:
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                A workflow file (<code>.github/workflows/build-android-apk.yml</code>) is already added. When you export or push to GitHub, GitHub automatically builds and creates your downloadable <strong>.APK</strong> and <strong>.AAB</strong>!
              </p>
            </div>
          </div>
        ) : (
          /* TAB 2: Direct Install on Device */
          <div className="space-y-4">
            {/* 3 Supported Devices Showcase */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-100">
                <Smartphone className="w-5 h-5 text-cyan-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Mobile</span>
                <span className="text-[10px] text-slate-600 block">Android &amp; iOS</span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                <Tablet className="w-5 h-5 text-blue-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Tablet</span>
                <span className="text-[10px] text-slate-600 block">iPad &amp; Tabs</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <Monitor className="w-5 h-5 text-indigo-700 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Desktop</span>
                <span className="text-[10px] text-slate-600 block">Chrome &amp; Edge</span>
              </div>
            </div>

            {isInstalled ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-emerald-900">
                  App is already installed on this device!
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Launches in full screen without address bar.
                </p>
              </div>
            ) : isInstallable ? (
              <div className="space-y-2">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl text-sm font-extrabold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App to Home Screen (1-Click)</span>
                </button>
                <p className="text-[11px] text-center text-slate-600">
                  Places the Quicker app icon on your device home screen.
                </p>
              </div>
            ) : isIOS ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-600" />
                  Install on iPhone / iPad (Safari):
                </span>
                <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside">
                  <li>Tap the <strong>Share</strong> icon in Safari's bottom toolbar.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> at top right.</li>
                </ol>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">
                  📱 Install on Android Chrome:
                </span>
                <p className="text-xs text-slate-700">
                  Open Chrome menu (⋮ 3 dots) and select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={handleShareLink}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{copied ? 'Link Copied!' : 'Share App Link'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

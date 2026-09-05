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
} from 'lucide-react';
import { QuickerLogo } from './QuickerLogo';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
        title: 'Quicker Laundry & Drycleaning',
        text: 'Order doorstep laundry and dry cleaning quickly with live tracking!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <QuickerLogo className="h-10 w-auto" />
          </div>
          <h2 className="font-black text-xl text-slate-900">
            {isInstalled ? 'App Already Installed!' : 'Install Quicker App'}
          </h2>
          <p className="text-xs text-slate-700 mt-1">
            Works smoothly on <strong>Mobile (Android APK / iOS)</strong>, <strong>Tablets</strong>, and <strong>Laptops</strong>.
          </p>
        </div>

        {/* 3 Supported Devices Showcase */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
          <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-100">
            <Smartphone className="w-6 h-6 text-cyan-700 mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-slate-800 block">Mobile APK</span>
            <span className="text-[10px] text-slate-700 block">Android &amp; iPhone</span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
            <Tablet className="w-6 h-6 text-blue-700 mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-slate-800 block">Tablet / iPad</span>
            <span className="text-[10px] text-slate-700 block">Large Viewport</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <Monitor className="w-6 h-6 text-indigo-700 mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-slate-800 block">Web / Desktop</span>
            <span className="text-[10px] text-slate-700 block">Chrome, Edge, Safari</span>
          </div>
        </div>

        {/* Main Action based on device */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs font-bold text-emerald-900">
              You are currently using the installed Quicker App!
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Instant loading &amp; offline capability active.
            </p>
          </div>
        ) : isInstallable ? (
          <div className="space-y-3 mb-4">
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white rounded-2xl text-sm font-black shadow-md shadow-blue-200 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Install Quicker App (1-Click)</span>
            </button>
            <p className="text-[11px] text-center text-slate-700">
              Installs directly onto your Android device home screen with app icon, just like an APK.
            </p>
          </div>
        ) : isIOS ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 space-y-2">
            <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              How to install on iPhone or iPad (Safari):
            </span>
            <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside">
              <li>Tap the <strong className="inline-flex items-center gap-1 text-slate-800"><Share2 className="w-3.5 h-3.5" /> Share</strong> button in Safari's bottom toolbar.</li>
              <li>Scroll down and tap <strong className="inline-flex items-center gap-1 text-slate-800"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> at top right. The app will launch as a full-screen app!</li>
            </ol>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 space-y-2">
            <span className="text-xs font-bold text-slate-900 block">
              📱 Install on Android / Mobile Chrome:
            </span>
            <p className="text-xs text-slate-700">
              Open the browser menu (⋮ three dots at top right) and tap <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
            </p>
          </div>
        )}

        {/* How to build a true .APK Guide */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1.5">
            <span className="font-extrabold text-amber-900 block">
              📦 Real .APK &amp; Play Store Package
            </span>
            <p className="text-[11px] leading-relaxed text-amber-800">
              This app is PWA-compliant. You can convert the hosted URL into a signed Android <strong>.APK / .AAB</strong> in 2 minutes using <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="font-bold underline text-amber-900">PWABuilder.com</a> or <strong>Capacitor</strong>, ready for Google Play Store upload.
            </p>
          </div>
        </div>

        {/* Share Link button */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleShareLink}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-600" />
            <span>{copied ? 'Link Copied!' : 'Share App Link'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAQ_LIST } from '../data/mockData';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  FileText,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Smartphone,
  Download,
  Tablet,
  Monitor,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenAddresses: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenAddresses }) => {
  const {
    user,
    logout,
    setIsAuthModalOpen,
    addresses,
    deleteAddress,
    setIsInstallModalOpen,
  } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <div className="space-y-5 pb-28 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Customer Profile
        </h1>
        <p className="text-xs text-slate-700 mt-0.5">
          Manage your contact info, saved addresses, and support preferences.
        </p>
      </div>

      {/* 1. Personal Information Card (PRD Section 25) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'Q'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base text-slate-900">{user.name}</h3>
                {user.authProvider === 'google' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Google Verified</span>
                  </span>
                )}
                {user.authProvider === 'phone' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                    <Phone className="w-2.5 h-2.5" />
                    <span>OTP Verified</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-700 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-cyan-600" />
                <span>{user.phone || 'No phone added'}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-700 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email || 'customer@quicker.com'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {user.isGuest ? 'Sign In with Google / OTP' : 'Switch Account'}
            </button>
            {!user.isGuest && (
              <button
                onClick={logout}
                className="px-3 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Saved Addresses Manager (PRD Section 25) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Saved Addresses</h3>
          </div>
          <button
            onClick={onOpenAddresses}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage / Add</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 uppercase px-1.5 py-0.2 bg-white rounded border border-slate-200 text-[10px]">
                    {addr.type}
                  </span>
                  <span className="font-semibold text-slate-800">{addr.name}</span>
                </div>
                <p className="text-slate-700 mt-1">
                  {addr.houseFlat}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                </p>
              </div>

              {addresses.length > 1 && (
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                  title="Delete address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2.5 Multi-Device & Mobile APK / PWA Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              Install App on Mobile &amp; Tablet
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white">
            Use Quicker as an Android APK or iOS App
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-lg">
            Install directly on your phone or tablet for 1-tap ordering, instant notifications, and full-screen experience without opening browser tabs.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install Mobile App (APK / PWA)</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-slate-300" /> Mobile</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Tablet className="w-3.5 h-3.5 text-slate-300" /> Tablet</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5 text-slate-300" /> Web</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Customer Support Channels (PRD Section 26: Call Quicker, WhatsApp, Help Center) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">Customer Support</h3>
        <p className="text-xs text-slate-700">
          Have questions regarding garment care, timing, or pickup changes? Reach out anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <a
            href="tel:+919876543210"
            className="p-3 rounded-xl border border-slate-200 hover:border-cyan-400 bg-slate-50 hover:bg-cyan-50/50 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-bold text-xs text-slate-900 block">Call Quicker</span>
                <span className="text-[11px] text-slate-700">+91 98765 43210</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://wa.me/919876543210?text=Hi%20Quicker,%20I%20have%20a%20question%20regarding%20laundry%20services"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/50 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-bold text-xs text-slate-900 block">WhatsApp Support</span>
                <span className="text-[11px] text-slate-700">Live chat assistance</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

      {/* 5. Help Center / FAQs (PRD Section 26) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-cyan-600" />
          <h3 className="font-extrabold text-sm text-slate-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {FAQ_LIST.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div key={idx} className="py-2.5">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-800 hover:text-cyan-700 transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isExpanded ? 'rotate-180 text-cyan-600' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 animate-in fade-in">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Terms & Guarantee */}
      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-slate-700">100% Quality & Fabric Care Policy</span>
        </div>
        <button
          onClick={() => setShowTermsModal(true)}
          className="font-bold text-cyan-700 hover:underline"
        >
          View Terms
        </button>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 max-h-[80vh] flex flex-col">
            <h3 className="font-extrabold text-base text-slate-900 pb-2 border-b border-slate-100">
              Quicker Quality & Cancellation Terms
            </h3>

            <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>1. Pricing Estimates:</strong> Catalog prices represent estimated costs. Final charges for laundry booked by weight (per KG) or bridal garments requiring physical chemical testing will be confirmed at the processing center.
              </p>
              <p>
                <strong>2. Cancellation Policy:</strong> You may cancel or reschedule free of charge at any moment prior to the pickup partner's arrival. Once collected and logged at the hub, cancellations are not permitted.
              </p>
              <p>
                <strong>3. Garment Care & Liability:</strong> In the rare instance of color bleeding or fabric wear, compensation up to 10x the service charge is guaranteed in accordance with industry standards.
              </p>
            </div>

            <button
              onClick={() => setShowTermsModal(false)}
              className="mt-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

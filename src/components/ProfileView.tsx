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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">{user.name}</h3>
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

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
          >
            {user.isGuest ? 'Sign In / OTP' : 'Switch / Edit'}
          </button>
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

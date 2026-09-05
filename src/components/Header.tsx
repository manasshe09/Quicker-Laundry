import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Bell,
  Phone,
  MessageCircle,
  X,
  ChevronDown,
  LogIn,
  User,
} from 'lucide-react';

interface HeaderProps {
  onOpenAddressModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddressModal }) => {
  const {
    user,
    setIsAuthModalOpen,
    selectedAddress,
    unreadNotifsCount,
    notifications,
    markNotificationRead,
    setActiveTrackingOrder,
    orders,
    setActiveTab,
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Name (Clean Typography, No Graphic Logo) */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setActiveTab('home')}
        >
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
              Quicker
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
              Laundry &amp; Dry Cleaning
            </span>
          </div>
        </div>

        {/* Center: Address Selector Pill */}
        <div
          onClick={onOpenAddressModal}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-xs font-medium text-slate-700 max-w-[200px] truncate"
          title="Change Pickup Address"
        >
          <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
          <span className="font-semibold text-slate-900">{selectedAddress.type}:</span>
          <span className="truncate">{selectedAddress.area || selectedAddress.houseFlat}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
        </div>

        {/* Live Service Availability Indicator */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800"
          title="Quicker Hub Open • Express Doorstep Pickup active in your area"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Open Now • 60-Min Pickup Available</span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Support Phone / WhatsApp */}
          <button
            onClick={() => setShowSupportModal(true)}
            className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
            title="Customer Support"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-lg text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-3 overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    {unreadNotifsCount > 0 && (
                      <span className="text-xs bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded-full font-medium">
                        {unreadNotifsCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-700 text-center py-6">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.orderId) {
                            const order = orders.find((o) => o.id === n.orderId);
                            if (order) {
                              setActiveTrackingOrder(order);
                              setShowNotifs(false);
                            }
                          }
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition ${
                          n.read ? 'hover:bg-slate-50 opacity-80' : 'bg-cyan-50/50 hover:bg-cyan-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-700">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5 leading-snug">{n.message}</p>
                        {n.orderId && (
                          <span className="inline-block mt-1 text-[10px] font-semibold text-cyan-700 hover:underline">
                            Track Order {n.orderId} →
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login Button */}
          {user.isGuest ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Sign in with Google or Phone"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              title={`Logged in as ${user.name}`}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[80px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile address sub-bar */}
      <div
        onClick={onOpenAddressModal}
        className="sm:hidden flex items-center justify-between px-4 py-1.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-700 font-medium cursor-pointer"
      >
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
          <span className="font-bold text-slate-900">{selectedAddress.type}:</span>
          <span className="truncate">{selectedAddress.houseFlat}, {selectedAddress.area}</span>
        </div>
        <span className="text-cyan-700 text-[11px] font-semibold shrink-0">Change</span>
      </div>

      {/* Quick Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Quicker Customer Support</h3>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-700 mt-3 leading-relaxed">
              We are available everyday from 7:00 AM to 10:00 PM to help with pickups, pricing, or garment care questions.
            </p>

            <div className="mt-4 space-y-2.5">
              <a
                href="tel:+919876543210"
                onClick={() => setShowSupportModal(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold text-sm transition shadow-sm shadow-cyan-200"
              >
                <Phone className="w-4 h-4" />
                Call Quicker (+91 98765 43210)
              </a>

              <a
                href="https://wa.me/919876543210?text=Hello%20Quicker,%20I%20need%20help%20with%20my%20laundry%20booking"
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowSupportModal(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition shadow-sm shadow-emerald-200"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Quicker Support
              </a>
            </div>

            <p className="text-[11px] text-center text-slate-700 mt-4">
              Doorstep assistance guaranteed across all serviceable pin codes.
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

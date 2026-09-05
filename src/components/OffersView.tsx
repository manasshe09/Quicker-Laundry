import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Copy, Check, Sparkles, Gift, ArrowRight, Share2 } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { coupons, applyCoupon, setActiveTab } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyAndBook = (code: string) => {
    applyCoupon(code);
    setActiveTab('services');
  };

  return (
    <div className="space-y-5 pb-28 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Special Offers & Coupons
        </h1>
        <p className="text-xs text-slate-700 mt-0.5">
          Save more on laundry, dry cleaning, and bulk doorstep pickups.
        </p>
      </div>

      {/* Coupons List (PRD Section 22) */}
      <div className="space-y-3.5">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-cyan-300 transition relative overflow-hidden"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{coupon.title}</h3>
                  <p className="text-xs text-slate-700 mt-0.5 leading-snug">
                    {coupon.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Coupon Code Pill & Actions */}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs font-black text-slate-900 flex items-center gap-2">
                  <span>{coupon.code}</span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                    title="Copy code"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <span className="text-[11px] text-slate-600">
                  Min order ₹{coupon.minOrder}
                </span>
              </div>

              <button
                onClick={() => handleApplyAndBook(coupon.code)}
                className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <span>Apply & Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Referral Program Card (PRD Section 23: Referral) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-1">
              Refer & Earn
            </div>
            <h3 className="text-base font-extrabold text-white">
              Refer a Friend, Get ₹100 Off
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Share Quicker with neighbors & colleagues. When they complete their first pickup, both of you get ₹100 credited instantly!
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 font-mono text-xs font-bold text-cyan-300">
                QUICK-REF-8921
              </div>
              <button
                onClick={() => handleCopy('QUICK-REF-8921')}
                className="px-3 py-1.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-extrabold flex items-center gap-1 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

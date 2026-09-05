import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Calendar, MapPin, Sparkles, ArrowRight, X } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    lastCreatedOrder,
    setActiveTrackingOrder,
    setActiveTab,
  } = useApp();

  if (!isOrderSuccessOpen || !lastCreatedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 text-center relative overflow-hidden">
        {/* Confetti / celebration badge */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          🎉 Pickup Booked!
        </h2>
        <p className="text-xs text-slate-700 mt-1">
          Your laundry order has been scheduled. Sit back & relax!
        </p>

        {/* Order Details Card (PRD Section 17) */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-700 font-medium">Order Reference:</span>
            <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs">
              #{lastCreatedOrder.id}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-700 uppercase block mb-0.5">
              Pickup Scheduled:
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>
                {lastCreatedOrder.pickupSlot.dayLabel}, {lastCreatedOrder.pickupSlot.timeRange}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-700 uppercase block mb-0.5">
              Doorstep Address:
            </span>
            <div className="flex items-start gap-1.5 text-slate-800">
              <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {lastCreatedOrder.address.houseFlat}, {lastCreatedOrder.address.area}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold">
            <span className="text-slate-700">Estimated Total:</span>
            <span className="text-sm font-black text-slate-900">₹{lastCreatedOrder.total}</span>
          </div>
        </div>

        {/* Action Buttons (PRD Section 17) */}
        <div className="mt-5 space-y-2">
          <button
            onClick={() => {
              setIsOrderSuccessOpen(false);
              setActiveTrackingOrder(lastCreatedOrder);
            }}
            className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-200"
          >
            <span>Track Order Live</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsOrderSuccessOpen(false);
              setActiveTab('orders');
            }}
            className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

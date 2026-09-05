import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Truck,
  Sparkles,
  AlertTriangle,
  Scale,
  ShieldCheck,
  ChevronRight,
  PackageCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    activeTrackingOrder,
    setActiveTrackingOrder,
    updateOrderStatus,
    cancelOrder,
  } = useApp();

  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  if (!activeTrackingOrder) return null;

  const order = activeTrackingOrder;

  // The 8 key milestone stages displayed on the visual tracking timeline (PRD Section 18)
  const timelineMilestones: { status: OrderStatus; label: string; desc: string }[] = [
    {
      status: 'CONFIRMED',
      label: 'Order Placed',
      desc: 'Booking received & scheduled in Quicker system',
    },
    {
      status: 'PICKUP_ASSIGNED',
      label: 'Pickup Scheduled',
      desc: 'Partner assigned and en route for collection',
    },
    {
      status: 'PICKED_UP',
      label: 'Picked Up',
      desc: 'Garments collected from doorstep',
    },
    {
      status: 'PROCESSING',
      label: 'Processing',
      desc: 'Eco-solvent wash, spot removal & steam pressing',
    },
    {
      status: 'QUALITY_CHECK',
      label: 'Quality Check',
      desc: 'Multi-point inspection & crease alignment',
    },
    {
      status: 'READY',
      label: 'Ready',
      desc: 'Neatly hung on hangers & sealed in dust cover',
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Out for Delivery',
      desc: 'Delivery partner on way with clean garments',
    },
    {
      status: 'DELIVERED',
      label: 'Delivered',
      desc: 'Delivered fresh to your doorstep',
    },
  ];

  const statusOrderIndex: Record<OrderStatus, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    PICKUP_ASSIGNED: 1,
    PICKED_UP: 2,
    RECEIVED: 2.5,
    PROCESSING: 3,
    QUALITY_CHECK: 4,
    READY: 5,
    OUT_FOR_DELIVERY: 6,
    DELIVERED: 7,
    CANCELLED: -1,
  };

  const currentIdx = statusOrderIndex[order.status];

  const handleCancelClick = () => {
    const res = cancelOrder(order.id);
    setCancelMessage(res.message);
  };

  // Demo helper to advance order to next status easily
  const getNextStatus = (curr: OrderStatus): OrderStatus | null => {
    switch (curr) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'PICKUP_ASSIGNED';
      case 'PICKUP_ASSIGNED':
        return 'PICKED_UP';
      case 'PICKED_UP':
        return 'PROCESSING';
      case 'PROCESSING':
        return 'QUALITY_CHECK';
      case 'QUALITY_CHECK':
        return 'READY';
      case 'READY':
        return 'OUT_FOR_DELIVERY';
      case 'OUT_FOR_DELIVERY':
        return 'DELIVERED';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Order Tracking
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono font-bold">
                #{order.id}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              {order.status === 'DELIVERED'
                ? 'Delivered Fresh & Clean'
                : order.status === 'CANCELLED'
                ? 'Order Cancelled'
                : order.status === 'PROCESSING'
                ? 'Garments in Processing'
                : `Pickup: ${order.pickupSlot.timeRange}`}
            </h3>
            <p className="text-[11px] text-slate-300">
              Placed on {order.createdAt} • {order.items.length} items • ₹{order.total}
            </p>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Timeline & Details */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Quick Demo Simulator Banner */}
          {nextStatus && order.status !== 'CANCELLED' && (
            <div className="bg-cyan-50/80 border border-cyan-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-extrabold text-cyan-900 block">Live Status Demo</span>
                <span className="text-[11px] text-cyan-700">
                  Advance to: <strong>{nextStatus.replace(/_/g, ' ')}</strong>
                </span>
              </div>
              <button
                onClick={() => updateOrderStatus(order.id, nextStatus)}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition shadow-xs"
              >
                <span>Advance</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Assigned Staff Partner Card (PRD Section 31) */}
          {order.assignedStaff && order.status !== 'CANCELLED' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  {order.assignedStaff.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">
                      {order.assignedStaff.name}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-sm">
                      ★ {order.assignedStaff.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-0.5">
                    Quicker Care Pilot • {order.assignedStaff.vehicle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${order.assignedStaff.phone}`}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-cyan-700 hover:bg-cyan-50 shadow-xs transition"
                  title="Call Partner"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Quicker%20Partner,%20regarding%20Order%20${order.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 shadow-xs transition"
                  title="WhatsApp Partner"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Visual Order Timeline (PRD Section 18) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Order Timeline
            </h4>

            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timelineMilestones.map((m, idx) => {
                const isPassed = currentIdx > idx;
                const isCurrent = Math.floor(currentIdx) === idx;

                return (
                  <div key={m.status} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white font-bold'
                          : isCurrent
                          ? 'bg-cyan-600 text-white ring-4 ring-cyan-100 font-bold animate-pulse'
                          : 'bg-white border-2 border-slate-300 text-transparent'
                      }`}
                    >
                      {isPassed ? '✓' : ''}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-cyan-800 text-sm'
                              : isPassed
                              ? 'text-slate-900'
                              : 'text-slate-600'
                          }`}
                        >
                          {m.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-700 leading-snug mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Garment Verification & Inspection Sheet (PRD Section 33) */}
          {order.verification && order.verification.inspected && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  Hub Garment Verification
                </span>
                <span className="text-[10px] text-slate-700">
                  Verified at {order.verification.verifiedAt || 'Facility'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-700 block">Actual Garments Count</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {order.verification.actualItemCount} Pieces
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-700 block">Measured Weight</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {order.verification.actualWeightKg
                      ? `${order.verification.actualWeightKg} KG`
                      : 'N/A (Per Piece)'}
                  </span>
                </div>
              </div>

              {order.verification.stainsFound && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong className="block font-bold mb-0.5">Pre-wash Spotting Note:</strong>
                  {order.verification.stainNotes || 'Spot treatment applied for fabric safety.'}
                </div>
              )}
            </div>
          )}

          {/* Order Items Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
            <span className="font-extrabold text-slate-900 block pb-1 border-b border-slate-100">
              Items in this Order ({order.items.reduce((s, i) => s + i.quantity, 0)} items)
            </span>

            {order.items.map((it) => (
              <div key={it.service.id} className="flex justify-between items-center text-slate-700">
                <span>
                  {it.quantity}x {it.service.name}
                </span>
                <span className="font-semibold text-slate-900">
                  ₹{it.service.price * it.quantity}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
              <span>Total Paid / Payable</span>
              <span className="text-sm font-black text-cyan-700">₹{order.total}</span>
            </div>
          </div>

          {/* Cancellation section (PRD Section 27) */}
          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Need to cancel?</span>
                  <span className="text-[11px] text-slate-700">
                    Allowed free of charge before pickup partner arrival
                  </span>
                </div>

                <button
                  onClick={handleCancelClick}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold transition"
                >
                  Cancel Order
                </button>
              </div>

              {cancelMessage && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{cancelMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span className="truncate max-w-[220px]">
              {order.address.houseFlat}, {order.address.area}
            </span>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

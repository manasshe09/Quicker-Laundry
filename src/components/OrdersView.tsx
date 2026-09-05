import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList,
  Clock,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Package,
} from 'lucide-react';
import { Order } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, setActiveTrackingOrder, reorder, setActiveTab } = useApp();
  const [selectedTab, setSelectedTab] = useState<'active' | 'previous'>('active');

  const activeOrders = orders.filter(
    (o) => !['DELIVERED', 'CANCELLED'].includes(o.status)
  );
  const previousOrders = orders.filter((o) =>
    ['DELIVERED', 'CANCELLED'].includes(o.status)
  );

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'PROCESSING':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'READY':
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-amber-100 text-amber-900 border-amber-200';
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Title & Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">
          My Laundry Orders
        </h1>
        <p className="text-xs text-slate-700 mt-0.5">
          Track real-time status and repeat previous bookings with 1 tap.
        </p>
      </div>

      {/* Tabs: Active vs Previous (PRD Section 20) */}
      <div className="flex rounded-2xl bg-white border border-slate-200 p-1 text-xs font-bold">
        <button
          onClick={() => setSelectedTab('active')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            selectedTab === 'active'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Active Orders</span>
          {activeOrders.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedTab === 'active' ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSelectedTab('previous')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            selectedTab === 'previous'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Previous Orders</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedTab === 'previous' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {previousOrders.length}
          </span>
        </button>
      </div>

      {/* ACTIVE ORDERS TAB */}
      {selectedTab === 'active' && (
        <div className="space-y-3">
          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">No Active Orders right now</h3>
              <p className="text-xs text-slate-700 mt-1 max-w-xs mx-auto">
                Schedule a pickup anytime to experience effortless doorstep laundry.
              </p>
              <button
                onClick={() => setActiveTab('services')}
                className="mt-4 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded-xl transition"
              >
                Book a Pickup
              </button>
            </div>
          ) : (
            activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border-2 border-cyan-500/30 p-4 sm:p-5 shadow-xs relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">Order #{order.id}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">₹{order.total}</span>
                </div>

                <div className="mt-3 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>
                      Pickup: {order.pickupSlot.dayLabel}, {order.pickupSlot.timeRange}
                    </span>
                  </div>
                  <p className="text-slate-700 truncate">
                    {order.items.map((it) => `${it.quantity}x ${it.service.name}`).join(', ')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-700 font-medium">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} garments
                  </span>

                  <button
                    onClick={() => setActiveTrackingOrder(order)}
                    className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Track Order</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* PREVIOUS ORDERS TAB (PRD Section 20 & 21: Reorder Feature) */}
      {selectedTab === 'previous' && (
        <div className="space-y-3">
          {previousOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <p className="text-xs text-slate-700 font-medium">No previous orders found.</p>
            </div>
          ) : (
            previousOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 transition shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">Order #{order.id}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">₹{order.total}</span>
                </div>

                <p className="text-xs text-slate-700 mt-2 font-medium">
                  {order.items.map((it) => `${it.quantity}x ${it.service.name}`).join(', ')}
                </p>

                <div className="text-[11px] text-slate-700 mt-1 flex items-center gap-2">
                  <span>Delivered to {order.address.type}</span>
                  <span>•</span>
                  <span>{order.createdAt}</span>
                </div>

                {/* Reorder & View Details Buttons (PRD Section 20 & 21) */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveTrackingOrder(order)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => reorder(order)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    title="Recreate this order with same garments and choose pickup"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

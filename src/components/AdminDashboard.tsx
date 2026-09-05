import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuickerLogo } from './QuickerLogo';
import {
  ShieldAlert,
  Package,
  Users,
  Tag,
  Settings,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Scale,
  Shirt,
  Phone,
  ArrowRight,
  Sparkles,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { OrderStatus, ServiceItem, ServiceCategoryId } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    services,
    updateService,
    addService,
    coupons,
    setIsAdminMode,
    firebaseConnected,
    firebaseProjectId,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'services' | 'customers' | 'offers'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Verification modal state for a specific order
  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);
  const [verifyCount, setVerifyCount] = useState<number>(0);
  const [verifyWeight, setVerifyWeight] = useState<number>(0);
  const [verifyStainNotes, setVerifyStainNotes] = useState('');

  // Editing service state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState<Partial<ServiceItem>>({
    name: '',
    categoryId: 'wash',
    categoryName: '1. Wash',
    price: 100,
    unitLabel: 'kg',
    pricingType: 'per_kg',
    turnaroundHours: 24,
    active: true,
    audience: 'general',
    description: '',
    iconName: 'Shirt',
  });

  const allStatuses: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PICKUP_ASSIGNED',
    'PICKED_UP',
    'RECEIVED',
    'PROCESSING',
    'QUALITY_CHECK',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  // Calculate quick metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const handleOpenVerification = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;
    setVerifyingOrderId(orderId);
    setVerifyCount(ord.verification?.actualItemCount || ord.items.reduce((s, i) => s + i.quantity, 0));
    setVerifyWeight(ord.verification?.actualWeightKg || 2.5);
    setVerifyStainNotes(ord.verification?.stainNotes || '');
  };

  const handleSaveVerification = (newStatus?: OrderStatus) => {
    if (!verifyingOrderId) return;
    const ord = orders.find((o) => o.id === verifyingOrderId);
    if (!ord) return;

    updateOrderStatus(verifyingOrderId, newStatus || ord.status, {
      inspected: true,
      actualItemCount: Number(verifyCount),
      actualWeightKg: Number(verifyWeight),
      stainsFound: Boolean(verifyStainNotes.trim()),
      stainNotes: verifyStainNotes.trim() || 'No major stains observed.',
    });
    setVerifyingOrderId(null);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceForm.name || !newServiceForm.price) return;

    const catNameMap: Record<ServiceCategoryId, string> = {
      all: 'All Services',
      wash: '1. Wash',
      mens_wear: "2. Men's Wear",
      ladies_wear: "3. Ladies' Wear",
      home_furnishings: '4. Home & Furnishings',
      shoes: '5. Shoes',
      soft_toys: '6. Soft Toys',
      special_services: 'Special Services',
      wash_iron: 'Wash & Iron',
      dry_cleaning: 'Dry Cleaning',
      wash_fold: 'Wash & Fold',
      ironing: 'Steam Ironing',
      special_care: 'Special Care',
      laundry: 'Laundry',
    };

    const created: ServiceItem = {
      id: `svc-${Date.now()}`,
      name: newServiceForm.name,
      categoryId: (newServiceForm.categoryId as ServiceCategoryId) || 'wash',
      categoryName: catNameMap[(newServiceForm.categoryId as ServiceCategoryId) || 'wash'],
      price: Number(newServiceForm.price),
      unitLabel: newServiceForm.unitLabel || 'piece',
      pricingType: newServiceForm.pricingType || 'per_piece',
      turnaroundHours: Number(newServiceForm.turnaroundHours) || 36,
      audience: newServiceForm.audience || 'general',
      description: newServiceForm.description || 'Professional garment care with fabric-safe detergent.',
      active: true,
      iconName: 'Shirt',
    };

    addService(created);
    setShowAddService(false);
    setNewServiceForm({
      name: '',
      categoryId: 'wash_iron',
      price: 49,
      unitLabel: 'piece',
      pricingType: 'per_piece',
      turnaroundHours: 36,
      active: true,
      audience: 'general',
      description: '',
    });
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      {/* Admin Top Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/95 px-2.5 py-1 rounded-xl shadow-xs">
              <QuickerLogo className="h-6 w-auto" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Operations Hub</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Admin Management Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1">
            Control order workflow, doorstep pickup dispatch, services pricing, and garment verification.
          </p>
        </div>

        <button
          onClick={() => setIsAdminMode(false)}
          className="px-4 py-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-bold transition shadow-xs"
        >
          ← Return to Customer App
        </button>
      </div>

      {/* Firebase Database Live Sync Banner */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">Firebase Cloud Database Connected</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Syncing
              </span>
            </div>
            <p className="text-slate-700 text-[11px] mt-0.5">
              Project: <code className="font-mono font-bold text-slate-800">{firebaseProjectId}</code> • Firestore & Realtime Database Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-700">
          <span>Real-time Orders, Status Transitions & Pricing Sync</span>
        </div>
      </div>

      {/* KPI Stats Row (PRD Section 45 & 46) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Total Orders</span>
          <span className="text-2xl font-black text-slate-900">{orders.length}</span>
          <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
            {orders.filter((o) => o.status === 'DELIVERED').length} delivered
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Total Revenue</span>
          <span className="text-2xl font-black text-cyan-700">₹{totalRevenue}</span>
          <span className="text-[10px] text-slate-700 font-semibold block mt-0.5">
            Avg order: ₹{orders.length ? Math.round(totalRevenue / orders.length) : 0}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Active Pickups</span>
          <span className="text-2xl font-black text-amber-800">
            {orders.filter((o) => ['CONFIRMED', 'PICKUP_ASSIGNED'].includes(o.status)).length}
          </span>
          <span className="text-[10px] text-slate-700 font-semibold block mt-0.5">In dispatch</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Active Services</span>
          <span className="text-2xl font-black text-slate-900">
            {services.filter((s) => s.active).length}
          </span>
          <span className="text-[10px] text-slate-700 font-semibold block mt-0.5">Catalog items</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex rounded-2xl bg-white border border-slate-200 p-1 text-xs font-bold overflow-x-auto">
        {[
          { id: 'orders', label: 'Manage Orders', icon: Package },
          { id: 'services', label: 'Services & Pricing', icon: Shirt },
          { id: 'customers', label: 'Customers Database', icon: Users },
          { id: 'offers', label: 'Offers & Coupons', icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MANAGE ORDERS (PRD Section 29, 30, 31, 33) */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          {/* Status filter bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-700 font-medium text-[11px] mr-1 shrink-0">Filter Status:</span>
            {['ALL', 'CONFIRMED', 'PICKUP_ASSIGNED', 'PICKED_UP', 'PROCESSING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
                    statusFilter === st
                      ? 'bg-cyan-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              )
            )}
          </div>

          {/* Orders Table / Cards */}
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">Order #{order.id}</span>
                    <span className="text-xs text-slate-700 font-medium">• {order.createdAt}</span>
                    <span className="text-xs font-bold text-slate-900">({order.customerName})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">₹{order.total}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.paymentMethod} • {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 block mb-1">
                      Garments ({order.items.reduce((s, i) => s + i.quantity, 0)} pcs):
                    </strong>
                    <p className="text-slate-700 leading-snug">
                      {order.items.map((it) => `${it.quantity}x ${it.service.name}`).join(', ')}
                    </p>
                    {order.specialInstructions && (
                      <p className="mt-1 text-amber-900 font-semibold bg-amber-50 p-1.5 rounded-md">
                        Note: "{order.specialInstructions}"
                      </p>
                    )}
                  </div>

                  <div>
                    <strong className="text-slate-900 block mb-1">Pickup Schedule & Address:</strong>
                    <p className="text-slate-700">
                      {order.pickupSlot.dayLabel}, {order.pickupSlot.timeRange}
                    </p>
                    <p className="text-slate-700 mt-0.5">
                      {order.address.houseFlat}, {order.address.area} • Ph: {order.address.phone}
                    </p>
                  </div>
                </div>

                {/* Order Status Controller & Garment Verification */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`order-status-${order.id}`} className="text-xs font-bold text-slate-700">Change Status:</label>
                    <select
                      id={`order-status-${order.id}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                    >
                      {allStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Garment verification button (PRD Section 33) */}
                    <button
                      onClick={() => handleOpenVerification(order.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Scale className="w-3.5 h-3.5 text-cyan-600" />
                      <span>
                        {order.verification?.inspected ? 'Edit Inspection Sheet' : 'Verify Garments & Weight'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES & PRICING (PRD Section 29) */}
      {activeAdminTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Service Catalog & Pricing</h3>
              <p className="text-xs text-slate-700">Edit rates per piece, per KG, or add new garment care categories.</p>
            </div>

            <button
              onClick={() => setShowAddService(!showAddService)}
              className="px-3 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddService ? 'Cancel' : 'Add New Garment'}</span>
            </button>
          </div>

          {/* Add New Service Form */}
          {showAddService && (
            <form
              onSubmit={handleCreateService}
              className="bg-white border-2 border-cyan-500/30 rounded-2xl p-4 sm:p-5 space-y-3 text-xs"
            >
              <h4 className="font-bold text-sm text-slate-900">Create New Service Item</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Item / Garment Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Woolen Cardigan"
                    value={newServiceForm.name}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newServiceForm.categoryId}
                    onChange={(e) =>
                      setNewServiceForm({
                        ...newServiceForm,
                        categoryId: e.target.value as ServiceCategoryId,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="wash">1. Wash</option>
                    <option value="mens_wear">2. Men's Wear</option>
                    <option value="ladies_wear">3. Ladies' Wear</option>
                    <option value="home_furnishings">4. Home & Furnishings</option>
                    <option value="shoes">5. Shoes</option>
                    <option value="soft_toys">6. Soft Toys</option>
                    <option value="special_services">Special Services</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newServiceForm.price}
                    onChange={(e) =>
                      setNewServiceForm({ ...newServiceForm, price: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Label</label>
                  <input
                    type="text"
                    placeholder="piece, kg, set"
                    value={newServiceForm.unitLabel}
                    onChange={(e) =>
                      setNewServiceForm({ ...newServiceForm, unitLabel: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pricing Model</label>
                  <select
                    value={newServiceForm.pricingType}
                    onChange={(e) =>
                      setNewServiceForm({ ...newServiceForm, pricingType: e.target.value as any })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="per_piece">Per Piece</option>
                    <option value="per_kg">Per KG</option>
                    <option value="fixed">Fixed</option>
                    <option value="inspection_based">Inspection-Based</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold shadow-xs transition"
              >
                Save to Catalog
              </button>
            </form>
          )}

          {/* Services List with inline editing */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {services.map((svc) => {
              const isEditing = editingService?.id === svc.id;

              return (
                <div key={svc.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{svc.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-700">
                        {svc.categoryName}
                      </span>
                      {!svc.active && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-800">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 mt-0.5 truncate max-w-md">{svc.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">₹</span>
                        <input
                          type="number"
                          value={editingService.price}
                          onChange={(e) =>
                            setEditingService({ ...editingService, price: Number(e.target.value) })
                          }
                          className="w-16 bg-slate-50 border border-slate-300 rounded-lg p-1 text-xs font-bold"
                        />
                        <button
                          onClick={() => {
                            updateService(editingService);
                            setEditingService(null);
                          }}
                          className="p-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          ₹{svc.price}/{svc.unitLabel}
                        </span>
                        <button
                          onClick={() => setEditingService({ ...svc })}
                          className="p-1 text-slate-400 hover:text-cyan-700"
                          title="Edit price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Enable/disable toggle */}
                    <button
                      onClick={() => updateService({ ...svc, active: !svc.active })}
                      className={`px-2 py-1 rounded-lg font-bold text-[10px] transition ${
                        svc.active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {svc.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMERS DATABASE (PRD Section 29) */}
      {activeAdminTab === 'customers' && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-slate-900">Customer Records</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">Rahul Sharma</span>
                <span className="text-slate-700">+91 98765 43210 • rahul.sharma@example.com</span>
                <span className="text-[11px] text-slate-700 block mt-0.5">
                  Primary Address: Flat 402, Sai Residency, HSR Layout, Bengaluru
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 block">Total Lifetime Spent</span>
                <span className="text-base font-black text-cyan-700">₹{totalRevenue}</span>
                <span className="text-[10px] text-slate-700 block mt-0.5">
                  {orders.length} orders placed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OFFERS & COUPONS (PRD Section 29) */}
      {activeAdminTab === 'offers' && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-slate-900">Coupon Configurations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-4 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-sm text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md">
                    {c.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    {c.active ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 pt-1">{c.title}</h4>
                <p className="text-slate-700">{c.description}</p>
                <div className="pt-2 text-[11px] text-slate-700 flex justify-between">
                  <span>Min Order: ₹{c.minOrder}</span>
                  <span>Expires: {c.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Garment Verification Dialog (PRD Section 33) */}
      {verifyingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">
                  Garment Verification & Inspection
                </span>
                <span className="text-[11px] text-slate-700">Order #{verifyingOrderId}</span>
              </div>
              <button
                onClick={() => setVerifyingOrderId(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label htmlFor="admin-verified-count" className="font-bold text-slate-700 block mb-1">
                Verified Garment Count (Pieces)
              </label>
              <input
                id="admin-verified-count"
                type="number"
                value={verifyCount}
                onChange={(e) => setVerifyCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="admin-weighed-weight" className="font-bold text-slate-700 block mb-1">
                Actual Measured Weight (KG)
              </label>
              <input
                id="admin-weighed-weight"
                type="number"
                step="0.1"
                value={verifyWeight}
                onChange={(e) => setVerifyWeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="admin-stains-note" className="font-bold text-slate-700 block mb-1">
                Stain / Fabric Condition Inspection Notes
              </label>
              <textarea
                id="admin-stains-note"
                rows={2}
                placeholder="e.g. Pre-treated minor coffee spot on shirt collar."
                value={verifyStainNotes}
                onChange={(e) => setVerifyStainNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSaveVerification('PROCESSING')}
                className="flex-1 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold shadow-xs transition"
              >
                Save & Move to Processing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

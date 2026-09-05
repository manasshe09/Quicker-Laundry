import React from 'react';
import { useApp } from '../context/AppContext';
import { QuickerLogo } from './QuickerLogo';
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
  Tag,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  Shirt,
  Scissors,
  Layers,
  Flame,
  Scale,
  Footprints,
  Smile,
  Home,
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { ServiceItem } from '../types';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    setSelectedCategory,
    orders,
    setActiveTrackingOrder,
    services,
    cart,
    addToCart,
    updateQuantity,
    applyCoupon,
    setIsCartOpen,
  } = useApp();

  // Find active in-progress order
  const activeOrder = orders.find(
    (o) => !['DELIVERED', 'CANCELLED'].includes(o.status)
  );

  // Popular items
  const popularServices = services.filter((s) => s.popular).slice(0, 6);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setActiveTab('services');
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'wash':
        return Layers;
      case 'mens_wear':
        return Shirt;
      case 'ladies_wear':
        return Sparkles;
      case 'home_furnishings':
        return Home;
      case 'shoes':
        return Footprints;
      case 'soft_toys':
        return Smile;
      case 'special_services':
        return ShieldCheck;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. Top Hero Section with Main CTA */}
      <section className="bg-gradient-to-br from-cyan-700 via-sky-800 to-blue-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-400/10 pointer-events-none blur-xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-400/10 pointer-events-none blur-lg" />

        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-xs">
              <QuickerLogo className="h-6 sm:h-7 w-auto" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-cyan-200 text-xs font-semibold border border-white/10">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Quick 24-48 Hr Doorstep Turnaround</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Laundry & Dry Cleaning, <br />
            <span className="text-cyan-300">As Simple As Ordering Food.</span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm mt-2 max-w-md font-normal leading-relaxed">
            No complicated laundry jargon. Select your everyday clothes or delicate silks, choose a pickup slot, and we handle the rest.
          </p>

          {/* Large Primary CTA Button (PRD Section 7) */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveTab('services');
              }}
              className="px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm sm:text-base transition-all transform active:scale-95 shadow-lg shadow-cyan-900/30 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              <span>Book a Pickup Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <span className="text-[11px] text-cyan-200/90 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Free pickup on ₹299+
            </span>
          </div>
        </div>
      </section>

      {/* 2. Current Active Order Alert Card (PRD Section 7) */}
      {activeOrder && (
        <section className="bg-white rounded-2xl border-2 border-cyan-500/30 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                Active Order
              </span>
            </div>
            <span className="text-xs font-extrabold text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md">
              #{activeOrder.id}
            </span>
          </div>

          <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>
                  {activeOrder.status === 'PROCESSING'
                    ? 'Garments Being Processed'
                    : activeOrder.status === 'READY'
                    ? 'Order Ready for Delivery'
                    : activeOrder.status === 'OUT_FOR_DELIVERY'
                    ? 'Out for Delivery'
                    : `Pickup Scheduled: ${activeOrder.pickupSlot.timeRange}`}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                {activeOrder.items.length} services • {activeOrder.items.reduce((s, i) => s + i.quantity, 0)} garments • Total ₹{activeOrder.total}
              </p>
            </div>

            <button
              onClick={() => setActiveTrackingOrder(activeOrder)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-xl text-xs font-bold transition self-start sm:self-center"
            >
              <span>Track Order</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* 3. Service Categories Grid (PRD Section 7 & 8) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Explore Services
            </h2>
            <p className="text-xs text-slate-700">
              Transparent rates & professional care
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('services');
            }}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((category) => {
            const Icon = getCategoryIcon(category.id);
            const catServices = services.filter((s) => s.categoryId === category.id);
            const count = catServices.length;
            const prices = catServices.map((s) => s.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left transition-all hover:shadow-md hover:border-cyan-300 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${category.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {category.name}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Starts ₹{minPrice}</span>
                  <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                    {count} items
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Promotional Offer Card (PRD Section 7: Offers) */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-200">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-block px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1">
              New Customer Special
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              20% OFF Your First Laundry Order
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Use code <strong className="text-amber-800 font-black">QUICK20</strong> on orders above ₹199.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            applyCoupon('QUICK20');
            setSelectedCategory('all');
            setActiveTab('services');
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0 shadow-sm"
        >
          Apply & Book Now
        </button>
      </section>

      {/* 5. Quick Add Popular Garments Carousel / Grid (PRD Section 9 & 11) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Most Ordered Garments
            </h2>
            <p className="text-xs text-slate-700">
              One-tap quick add to schedule your pickup
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularServices.map((item) => {
            const inCart = cart.find((c) => c.service.id === item.id);
            const qty = inCart ? inCart.quantity : 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3 hover:border-slate-300 transition-shadow hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 shrink-0">
                    {item.categoryId === 'wash_fold' && item.pricingType === 'per_kg' ? (
                      <Scale className="w-5 h-5" />
                    ) : item.categoryId === 'dry_cleaning' ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <Shirt className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-slate-900">
                        ₹{item.price}
                        <span className="text-[11px] font-normal text-slate-700">/{item.unitLabel}</span>
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                        {item.categoryName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Add Button (PRD Section 11) */}
                <div>
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-xl text-xs font-bold transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-900 text-white rounded-xl px-2 py-1 shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, qty - 1)}
                        className="p-1 text-slate-300 hover:text-white transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-extrabold w-4 text-center">{qty}</span>
                      <button
                        onClick={() => updateQuantity(item.id, qty + 1)}
                        className="p-1 text-slate-300 hover:text-white transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Why Quicker? Trust Section (PRD Section 7) */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5">
        <h2 className="text-base font-extrabold text-slate-900 mb-1">
          Why Quicker Laundry?
        </h2>
        <p className="text-xs text-slate-700 mb-4">
          Designed for speed, fabric safety, and complete peace of mind.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <Zap className="w-5 h-5 text-amber-500 mb-1.5" />
            <div className="text-xs font-bold text-slate-900">Fast Turnaround</div>
            <p className="text-[11px] text-slate-700 mt-0.5">Ready in 24–48 hours</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <ShieldCheck className="w-5 h-5 text-cyan-600 mb-1.5" />
            <div className="text-xs font-bold text-slate-900">Professional Care</div>
            <p className="text-[11px] text-slate-700 mt-0.5">Eco-friendly solvents</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <Truck className="w-5 h-5 text-emerald-600 mb-1.5" />
            <div className="text-xs font-bold text-slate-900">Doorstep Pickup</div>
            <p className="text-[11px] text-slate-700 mt-0.5">Punctual time slots</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mb-1.5" />
            <div className="text-xs font-bold text-slate-900">Quality Assured</div>
            <p className="text-[11px] text-slate-700 mt-0.5">Stain inspection notes</p>
          </div>
        </div>
      </section>

      {/* 7. UX Guarantee Note (PRD Section 36: <= 60 seconds) */}
      <section className="text-center py-2 text-xs text-slate-600 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
        <span>Average Quicker booking time: <strong>under 60 seconds</strong></span>
      </section>
    </div>
  );
};

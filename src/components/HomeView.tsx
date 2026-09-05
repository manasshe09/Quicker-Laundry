import React from 'react';
import { useApp } from '../context/AppContext';
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
  Star,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { SERVICE_CATEGORIES, getServiceImageUrl } from '../data/mockData';

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

  const reviews = [
    {
      name: 'Priya Varma',
      area: 'Banjara Hills',
      text: 'Handled my Banarasi silk sarees and designer blouses with incredible care. The roll polishing and steam finish were completely spotless.',
      rating: 5,
      date: 'Yesterday',
    },
    {
      name: 'Karthik Reddy',
      area: 'Gachibowli',
      text: 'The per-kg wash & fold is a lifesaver for my weekly office shirts and trousers. They arrive neatly packed and on-time every single time.',
      rating: 5,
      date: '3 days ago',
    },
    {
      name: 'Sunita Sharma',
      area: 'Jubilee Hills',
      text: 'My heavy double mink blankets came back fresh, clean, and completely odor-free. The pickup executive weighed everything right at my doorstep.',
      rating: 5,
      date: 'This week',
    },
  ];

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      {/* 1. Apple-level Hero Banner */}
      <section className="relative rounded-[32px] overflow-hidden bg-slate-900 text-white shadow-xl">
        {/* Real photo backdrop with dark optical gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80"
            alt="Laundry service"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs font-semibold border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Express Doorstep Service Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Care for Your Clothes, <br />
            <span className="text-cyan-400">Crafted with Precision.</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
            Professional wash, dry cleaning, steam pressing & silk saree rolling. Handled by fabric experts, delivered fresh to your door.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveTab('services');
              }}
              className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all transform active:scale-95 shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Pickup Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Free pickup on orders ₹299+
            </span>
          </div>
        </div>
      </section>

      {/* 2. Active Order Live Tracker (if active) */}
      {activeOrder && (
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Live Order #{activeOrder.id}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 px-2.5 py-0.5 bg-slate-100 rounded-full">
              Estimated: {activeOrder.pickupSlot.date}
            </span>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {activeOrder.status === 'PROCESSING'
                    ? 'Garments Being Cleaned & Pressed'
                    : activeOrder.status === 'READY'
                    ? 'Order Packaged & Ready for Dispatch'
                    : activeOrder.status === 'OUT_FOR_DELIVERY'
                    ? 'Delivery Executive on the Way'
                    : `Pickup Scheduled: ${activeOrder.pickupSlot.timeRange}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeOrder.items.length} items • ₹{activeOrder.total}
              </p>
            </div>

            <button
              onClick={() => setActiveTrackingOrder(activeOrder)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-bold transition self-start sm:self-center cursor-pointer"
            >
              <span>Track Live Status</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* 3. Service Categories with Real Photos */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Service Categories
            </h2>
            <p className="text-xs text-slate-500">
              Clear upfront rates with specialized fabric handling
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('services');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((category) => {
            const catServices = services.filter((s) => s.categoryId === category.id);
            const count = catServices.length;
            const prices = catServices.map((s) => s.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                {/* Photo Header */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-[11px] font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    Starts ₹{minPrice}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3.5">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {category.tagline}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{count} options</span>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Explore &rarr;
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Promotional First-Order Card */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-block px-2 py-0.5 rounded-md bg-blue-200/60 text-blue-900 text-[10px] font-bold uppercase tracking-wider mb-1">
              Welcome Privilege
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Flat 20% OFF Your First Doorstep Order
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Apply promo code <strong className="text-blue-700 font-extrabold">QUICK20</strong> at checkout on orders above ₹199.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            applyCoupon('QUICK20');
            setSelectedCategory('all');
            setActiveTab('services');
          }}
          className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
        >
          Apply Coupon & Book
        </button>
      </section>

      {/* 5. Most Ordered Garments with Photos */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Most Ordered Garments
            </h2>
            <p className="text-xs text-slate-500">
              One-tap quick add for everyday laundry routines
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {popularServices.map((item) => {
            const inCart = cart.find((c) => c.service.id === item.id);
            const qty = inCart ? inCart.quantity : 0;
            const imageUrl = getServiceImageUrl(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-3.5 flex items-center justify-between gap-3.5 hover:border-slate-300 transition-all hover:shadow-xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug truncate group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-slate-900">
                        ₹{item.price}
                        <span className="text-[11px] font-normal text-slate-500"> / {item.unitLabel}</span>
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.categoryName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stepper / Add button */}
                <div className="shrink-0">
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-900 text-white rounded-full px-2.5 py-1 shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, qty - 1)}
                        className="p-0.5 text-slate-300 hover:text-white transition cursor-pointer"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold min-w-[14px] text-center">{qty}</span>
                      <button
                        onClick={() => updateQuantity(item.id, qty + 1)}
                        className="p-0.5 text-slate-300 hover:text-white transition cursor-pointer"
                        aria-label="Increase"
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

      {/* 6. Authentic Customer Reviews (100% Human Touch) */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Customer Feedback
            </h2>
            <p className="text-xs text-slate-500">
              Trusted by households across our service areas
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-900">4.9 / 5</span>
            <span className="text-[11px] text-slate-400">(850+ reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-900">{rev.name}</span>
                <span className="text-slate-400">{rev.area}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Need Help or Custom Garments? WhatsApp / Call Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-base text-white">Have special fabric or wedding wear?</h3>
          <p className="text-xs text-slate-300 mt-1">
            Chat directly with our master fabric expert for custom care instructions.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Hub</span>
          </a>
          <a
            href="https://wa.me/919876543210?text=Hello%20Quicker,%20I%20have%20an%20inquiry%20regarding%20laundry%20pickup"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};

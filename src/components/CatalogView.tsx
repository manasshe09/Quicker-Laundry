import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES, getServiceImageUrl } from '../data/mockData';
import { ServiceItem } from '../types';
import {
  Search,
  Plus,
  Minus,
  Info,
  X,
  Sparkles,
  Clock,
  Shirt,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    services,
    cart,
    addToCart,
    updateQuantity,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [activeInfoItem, setActiveInfoItem] = useState<ServiceItem | null>(null);

  // Audience filters
  const audiences = [
    { id: 'all', label: 'All Garments' },
    { id: 'men', label: "Men's Wear" },
    { id: 'women', label: "Ladies' Wear" },
    { id: 'household', label: 'Home & Bedding' },
    { id: 'kids', label: 'Shoes & Plush' },
  ];

  // Filtering services based on category, audience, and search query
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      if (!item.active) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Audience filter
      if (selectedAudience !== 'all' && item.audience !== selectedAudience && item.audience !== 'general') {
        return false;
      }

      // Search query (matches name, categoryName, or description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.categoryName.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [services, selectedCategory, selectedAudience, searchQuery]);

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* 1. Global Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search garments (Shirt, Saree, Suit, Blanket, Shoes)..."
          className="w-full bg-slate-50/90 border border-slate-200/90 pl-11 pr-10 py-3.5 rounded-2xl text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Category Selector Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {SERVICE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 3. Sub-filter: Audience / Wear Type */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mr-1 shrink-0">Filter:</span>
        {audiences.map((aud) => (
          <button
            key={aud.id}
            onClick={() => setSelectedAudience(aud.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              selectedAudience === aud.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            {aud.label}
          </button>
        ))}
      </div>

      {/* 4. Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-xs">
          <p className="text-sm font-bold text-slate-800">No matching garments found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for &quot;Shirt&quot;, &quot;Saree&quot;, &quot;Suit&quot;, or &quot;Blanket&quot;
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedAudience('all');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 rounded-xl transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredServices.map((item) => {
            const inCart = cart.find((c) => c.service.id === item.id);
            const qty = inCart ? inCart.quantity : 0;
            const imageUrl = getServiceImageUrl(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-4 flex flex-col justify-between gap-3.5 hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3.5">
                  {/* Product Photograph */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100/90">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-white flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {item.turnaroundHours}h
                    </span>
                  </div>

                  {/* Garment Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition-colors truncate">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => setActiveInfoItem(item)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition shrink-0 cursor-pointer"
                        title="Care details"
                        aria-label="Care details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 mt-1">
                      {item.categoryName}
                    </span>

                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Price and Stepper */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-slate-900 tracking-tight">
                      ₹{item.price}
                      <span className="text-xs font-normal text-slate-500"> / {item.unitLabel}</span>
                    </div>
                    {item.pricingType === 'per_kg' && (
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Weighed at Doorstep
                      </span>
                    )}
                  </div>

                  {/* Quick Add Pill Stepper */}
                  <div>
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2.5 bg-slate-900 text-white rounded-full px-3 py-1.5 shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.id, qty - 1)}
                          className="p-0.5 text-slate-300 hover:text-white transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold min-w-[16px] text-center">{qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, qty + 1)}
                          className="p-0.5 text-slate-300 hover:text-white transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Detail / Care Info Modal */}
      {activeInfoItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Image Header */}
            <div className="relative -mx-6 -mt-6 mb-4 h-40 bg-slate-100 overflow-hidden">
              <img
                src={getServiceImageUrl(activeInfoItem)}
                alt={activeInfoItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <button
                onClick={() => setActiveInfoItem(null)}
                className="absolute right-3.5 top-3.5 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {activeInfoItem.categoryName}
                </span>
                <h3 className="font-bold text-lg text-white mt-1 leading-snug">
                  {activeInfoItem.name}
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Service Process
                </span>
                <p className="text-slate-700 leading-relaxed">{activeInfoItem.description}</p>
              </div>

              {activeInfoItem.careNotes && (
                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-blue-900 leading-relaxed">
                  <strong className="block font-semibold mb-0.5 text-blue-950">Garment Care Protection:</strong>
                  {activeInfoItem.careNotes}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wider">Pricing Type</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block capitalize">
                    {activeInfoItem.pricingType.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wider">Delivery Time</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                    {activeInfoItem.turnaroundHours} Hours
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Standard Rate</span>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  ₹{activeInfoItem.price}
                  <span className="text-xs font-normal text-slate-500"> / {activeInfoItem.unitLabel}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  addToCart(activeInfoItem);
                  setActiveInfoItem(null);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition shadow-sm cursor-pointer"
              >
                Add to Laundry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

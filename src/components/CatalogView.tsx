import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { ServiceItem } from '../types';
import {
  Search,
  Plus,
  Minus,
  Info,
  X,
  Sparkles,
  Scale,
  Shirt,
  Scissors,
  Layers,
  Flame,
  ShieldCheck,
  Check,
  Clock,
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
    setIsCartOpen,
    cartItemCount,
  } = useApp();

  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [activeInfoItem, setActiveInfoItem] = useState<ServiceItem | null>(null);

  // Audience filters
  const audiences = [
    { id: 'all', label: 'All' },
    { id: 'men', label: "Men's" },
    { id: 'women', label: "Women's" },
    { id: 'household', label: 'Household & Linen' },
  ];

  // Filtering services based on category, audience, and search query (PRD Section 10: Smart search)
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

  const getItemIcon = (item: ServiceItem) => {
    if (item.pricingType === 'per_kg') return Scale;
    if (item.categoryId === 'dry_cleaning') return Sparkles;
    if (item.categoryId === 'ironing') return Flame;
    if (item.categoryId === 'special_care') return ShieldCheck;
    if (item.categoryId === 'wash_fold') return Layers;
    return Shirt;
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* 1. Global Search Bar (PRD Section 10 & 41) */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search garments (e.g. Shirt, Saree, Suit, Bedsheet, Blanket)..."
          className="w-full bg-white border border-slate-200 pl-10 pr-10 py-3 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Category Selector Horizontal Pills (PRD Section 8 & 10) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {SERVICE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 3. Sub-filter: Audience / Gender */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-600 text-[11px] font-medium mr-1 shrink-0">Filter by:</span>
        {audiences.map((aud) => (
          <button
            key={aud.id}
            onClick={() => setSelectedAudience(aud.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedAudience === aud.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {aud.label}
          </button>
        ))}
      </div>

      {/* 4. Important Pricing Notice Banner (PRD Section 12 & 49: Dark Side / Risks) */}
      <div className="bg-cyan-50/80 border border-cyan-200/80 rounded-xl p-2.5 text-xs text-cyan-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Transparent Estimate:</strong> Final amount may vary slightly after actual weight measurement (for per-KG laundry) or garment inspection (for bridal/specialty items).
        </p>
      </div>

      {/* 5. Services Grid / List */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">No matching garments found</p>
          <p className="text-xs text-slate-700 mt-1">
            Try searching for something else like "Shirt", "Saree", or "Suit"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedAudience('all');
            }}
            className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredServices.map((item) => {
            const inCart = cart.find((c) => c.service.id === item.id);
            const qty = inCart ? inCart.quantity : 0;
            const Icon = getItemIcon(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between gap-3 hover:border-cyan-300 hover:shadow-xs transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-cyan-700 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-sm text-slate-900 leading-snug">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-cyan-100 text-cyan-800">
                            {item.categoryName}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600 flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.turnaroundHours}h
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveInfoItem(item)}
                      className="text-slate-400 hover:text-cyan-700 p-1 rounded-lg transition"
                      title="Care details & info"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price and Quick Add */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">
                      ₹{item.price}
                      <span className="text-xs font-normal text-slate-700">/{item.unitLabel}</span>
                    </div>
                    {item.pricingType === 'per_kg' && (
                      <span className="text-[10px] text-emerald-800 font-bold block">
                        Weighed at Doorstep
                      </span>
                    )}
                    {item.pricingType === 'inspection_based' && (
                      <span className="text-[10px] text-amber-800 font-bold block">
                        Est. Inspection Price
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button (PRD Section 11: '+ Add' -> '[-] 2 [+]') */}
                  <div>
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2.5 bg-slate-900 text-white rounded-xl px-2.5 py-1 shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.id, qty - 1)}
                          className="p-0.5 text-slate-300 hover:text-white transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black min-w-[14px] text-center">{qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, qty + 1)}
                          className="p-0.5 text-slate-300 hover:text-white transition"
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

      {/* Service Detail / Care Info Modal (PRD Section 9: Optional Information) */}
      {activeInfoItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-sm">
                  {activeInfoItem.categoryName}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {activeInfoItem.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveInfoItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900 block mb-0.5">Service Description:</strong>
                <p className="leading-relaxed">{activeInfoItem.description}</p>
              </div>

              {activeInfoItem.careNotes && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong className="block font-bold mb-0.5">Special Care:</strong>
                  {activeInfoItem.careNotes}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-700 block">Pricing Model</span>
                  <span className="font-bold text-slate-900 capitalize">
                    {activeInfoItem.pricingType.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-700 block">Turnaround Time</span>
                  <span className="font-bold text-slate-900">
                    {activeInfoItem.turnaroundHours} Hours
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-lg font-black text-slate-900">
                ₹{activeInfoItem.price}
                <span className="text-xs font-normal text-slate-700">/{activeInfoItem.unitLabel}</span>
              </div>
              <button
                onClick={() => {
                  addToCart(activeInfoItem);
                  setActiveInfoItem(null);
                }}
                className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
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

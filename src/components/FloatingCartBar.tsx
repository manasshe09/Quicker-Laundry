import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { cartItemCount, cartSubtotal, setIsCartOpen, isCartOpen } = useApp();

  if (cartItemCount === 0 || isCartOpen) return null;

  return (
    <aside aria-label="Order summary" className="fixed bottom-16 left-0 right-0 z-30 px-4 pointer-events-none pb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-3.5 shadow-xl shadow-slate-900/20 flex items-center justify-between transition-all active:scale-[0.99] border border-slate-700/40"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold relative">
              <ShoppingBag className="w-5 h-5 text-cyan-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs">
                {cartItemCount}
              </span>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-300">
                {cartItemCount} {cartItemCount === 1 ? 'Garment' : 'Garments'} selected
              </div>
              <div className="text-base font-extrabold text-white flex items-baseline gap-1.5">
                <span>₹{cartSubtotal}</span>
                <span className="text-[11px] font-normal text-slate-400">(Est. Price)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs">
            <span>Book Pickup</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getServiceImageUrl } from '../data/mockData';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Address } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    specialInstructions,
    setSpecialInstructions,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    pickupSlots,
    selectedSlot,
    setSelectedSlot,
    createOrder,
    coupons,
    user,
    setUser,
  } = useApp();

  // Checkout step tracking: 1 = Review, 2 = Address, 3 = Pickup Slot, 4 = Payment
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);

  // Coupon input
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Address creation form modal/inline
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    type: 'Home' as 'Home' | 'Work' | 'Other',
    name: user.name || 'Rahul Sharma',
    phone: user.phone || '+91 98765 43210',
    houseFlat: '',
    street: '',
    landmark: '',
    area: '',
    city: 'Bengaluru',
    pincode: '560102',
  });

  // Selected payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'PayOnDelivery'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.houseFlat || !newAddrForm.street || !newAddrForm.area) {
      alert('Please fill in House/Flat, Street, and Area');
      return;
    }

    const saved = addAddress({
      customerId: user.id,
      type: newAddrForm.type,
      name: newAddrForm.name,
      phone: newAddrForm.phone,
      houseFlat: newAddrForm.houseFlat,
      street: newAddrForm.street,
      landmark: newAddrForm.landmark,
      area: newAddrForm.area,
      city: newAddrForm.city,
      pincode: newAddrForm.pincode,
    });
    setSelectedAddress(saved);
    setShowAddAddressForm(false);
  };

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      createOrder(paymentMethod);
      setIsPlacingOrder(false);
      setCheckoutStep(1);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-50 flex flex-col shadow-2xl relative">
          {/* Header */}
          <div className="bg-white px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                {checkoutStep === 1 && 'Your Laundry Cart'}
                {checkoutStep === 2 && 'Select Pickup Address'}
                {checkoutStep === 3 && 'Choose Pickup Slot'}
                {checkoutStep === 4 && 'Payment & Confirm'}
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Step {checkoutStep} of 4
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="bg-white px-5 pb-3 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
            {[
              { step: 1, label: 'Items' },
              { step: 2, label: 'Address' },
              { step: 3, label: 'Slot' },
              { step: 4, label: 'Pay' },
            ].map((s, idx) => (
              <div
                key={s.step}
                onClick={() => cart.length > 0 && setCheckoutStep(s.step as any)}
                className={`flex items-center gap-1 cursor-pointer transition ${
                  checkoutStep >= s.step ? 'text-cyan-700 font-bold' : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    checkoutStep === s.step
                      ? 'bg-cyan-700 text-white font-black'
                      : checkoutStep > s.step
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {checkoutStep > s.step ? '✓' : s.step}
                </div>
                <span>{s.label}</span>
                {idx < 3 && <div className="w-3 sm:w-5 h-px bg-slate-200 ml-1" />}
              </div>
            ))}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* STEP 1: REVIEW ITEMS (PRD Section 12 & 15) */}
            {checkoutStep === 1 && (
              <>
                {cart.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 my-8">
                    <div className="w-16 h-16 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Your laundry cart is empty</h3>
                    <p className="text-xs text-slate-700 mt-1 max-w-xs mx-auto">
                      Explore our wash & iron, dry cleaning, and everyday laundry services.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded-xl transition"
                    >
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Garment Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                      </span>
                      <button
                        onClick={clearCart}
                        className="text-xs text-rose-700 hover:text-rose-800 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All
                      </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                      {cart.map((item) => (
                        <div key={item.service.id} className="p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={getServiceImageUrl(item.service)}
                              alt={item.service.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-sm text-slate-900 truncate">
                                {item.service.name}
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                                  {item.service.categoryName}
                                </span>
                                <span>•</span>
                                <span className="font-semibold text-slate-700">₹{item.service.price}/{item.service.unitLabel}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-slate-900 text-white rounded-xl px-2 py-1 shadow-xs">
                              <button
                                onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                                className="p-0.5 text-slate-300 hover:text-white"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black min-w-[14px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                                className="p-0.5 text-slate-300 hover:text-white"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="text-sm font-extrabold text-slate-900 min-w-[50px] text-right">
                              ₹{item.service.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special Instructions (PRD Section 34) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-3.5">
                      <label htmlFor="special-instructions" className="text-xs font-bold text-slate-900 block mb-1">
                        Add Special Instructions (Optional)
                      </label>
                      <p className="text-[11px] text-slate-700 mb-2">
                        e.g., "Please don't use strong fragrance", "Handle silk saree border with care"
                      </p>
                      <textarea
                        id="special-instructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Type any garment care instructions for our master laundry team..."
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Offers & Coupons (PRD Section 22) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-700" />
                          Apply Coupon
                        </span>
                        {appliedCoupon && (
                          <button
                            onClick={removeCoupon}
                            className="text-xs font-bold text-rose-700 hover:text-rose-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {appliedCoupon ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-extrabold text-emerald-800">
                              '{appliedCoupon.code}' Applied!
                            </span>
                            <p className="text-[11px] text-emerald-700 mt-0.5">
                              Saving ₹{couponDiscount} on this order
                            </p>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value)}
                            placeholder="Enter coupon (e.g. QUICK20)"
                            className="flex-1 uppercase bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                          />
                          <button
                            onClick={() => handleApplyCoupon(couponCodeInput)}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                          >
                            Apply
                          </button>
                        </div>
                      )}

                      {couponMessage && (
                        <p
                          className={`text-[11px] mt-1.5 font-medium ${
                            couponMessage.isError ? 'text-rose-700' : 'text-emerald-700'
                          }`}
                        >
                          {couponMessage.text}
                        </p>
                      )}

                      {/* Quick coupon suggestions */}
                      {!appliedCoupon && (
                        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-[11px]">
                          {coupons.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleApplyCoupon(c.code)}
                              className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold shrink-0 transition"
                            >
                              {c.code}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Order Cost Breakdown (PRD Section 12) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-700">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                      </div>

                      <div className="flex justify-between text-slate-700">
                        <span className="flex items-center gap-1">
                          Doorstep Pickup & Delivery
                          {cartDeliveryFee === 0 && (
                            <span className="text-[10px] text-emerald-800 font-bold px-1.5 py-0.2 bg-emerald-50 rounded-sm">
                              FREE
                            </span>
                          )}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {cartDeliveryFee === 0 ? '₹0' : `₹${cartDeliveryFee}`}
                        </span>
                      </div>

                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-emerald-800 font-semibold">
                          <span>Discount ({appliedCoupon?.code})</span>
                          <span>-₹{couponDiscount}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                        <div>
                          <span className="text-sm font-extrabold text-slate-900 block">
                            Estimated Total
                          </span>
                          <span className="text-[10px] text-slate-600">Inclusive of all taxes</span>
                        </div>
                        <span className="text-lg font-black text-slate-900">₹{cartTotal}</span>
                      </div>
                    </div>

                    {/* Mandatory Disclaimer Note (PRD Section 12 & 49) */}
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        <strong>Note:</strong> Final amount may vary after garment inspection or actual weight measurement at pickup.
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            {/* STEP 2: CONFIRM ADDRESS (PRD Section 13 & 14) */}
            {checkoutStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Saved Addresses
                  </span>
                  <button
                    onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                    className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddAddressForm ? 'Cancel' : 'Add New'}</span>
                  </button>
                </div>

                {/* Add New Address Form (PRD Section 14: manual fast entry without mandatory map) */}
                {showAddAddressForm ? (
                  <form
                    onSubmit={handleSaveNewAddress}
                    className="bg-white rounded-2xl border-2 border-cyan-500/30 p-4 space-y-3 animate-in fade-in"
                  >
                    <h4 className="font-bold text-sm text-slate-900">New Pickup Address</h4>

                    <div className="flex gap-2">
                      {(['Home', 'Work', 'Other'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewAddrForm({ ...newAddrForm, type: t })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                            newAddrForm.type === t
                              ? 'bg-cyan-700 text-white border-cyan-700'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrForm.name}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddrForm.phone}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-700 uppercase">
                        House / Flat / Door No.
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Flat 302, Green Glen Towers"
                        value={newAddrForm.houseFlat}
                        onChange={(e) =>
                          setNewAddrForm({ ...newAddrForm, houseFlat: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-700 uppercase">
                        Street / Building Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5th Cross, 14th Main"
                        value={newAddrForm.street}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">
                          Area / Locality
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. HSR Layout"
                          value={newAddrForm.area}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, area: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">
                          Landmark
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near BDA Complex"
                          value={newAddrForm.landmark}
                          onChange={(e) =>
                            setNewAddrForm({ ...newAddrForm, landmark: e.target.value })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrForm.city}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase">
                          Pincode
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrForm.pincode}
                          onChange={(e) =>
                            setNewAddrForm({ ...newAddrForm, pincode: e.target.value })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      Save & Use This Address
                    </button>
                  </form>
                ) : null}

                {/* Saved addresses cards */}
                <div className="space-y-2.5">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white ${
                          isSelected
                            ? 'border-cyan-600 ring-2 ring-cyan-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                addr.type === 'Home'
                                  ? 'bg-blue-100 text-blue-800'
                                  : addr.type === 'Work'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {addr.type}
                            </span>
                            <span className="font-bold text-xs text-slate-900">{addr.name}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-cyan-700" />
                          )}
                        </div>

                        <p className="text-xs text-slate-700 mt-2 font-medium">
                          {addr.houseFlat}, {addr.street}
                        </p>
                        <p className="text-[11px] text-slate-700">
                          {addr.landmark && `Near ${addr.landmark}, `}
                          {addr.area}, {addr.city} - {addr.pincode}
                        </p>
                        <p className="text-[11px] text-slate-700 mt-1">Phone: {addr.phone}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: PICKUP SLOT (PRD Section 13 & 49: controlled slot capacity) */}
            {checkoutStep === 3 && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Pickup Timing
                  </span>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Our verified Quicker pickup partner will arrive at your door during this window.
                  </p>
                </div>

                {/* Day selector tabs */}
                <div className="grid grid-cols-2 gap-2">
                  {(['Today', 'Tomorrow'] as const).map((day) => {
                    const isDaySelected = selectedSlot.dayLabel === day;
                    return (
                      <div
                        key={day}
                        className={`p-3 rounded-xl border text-center font-bold text-xs ${
                          isDaySelected
                            ? 'bg-cyan-50 border-cyan-600 text-cyan-900'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="block">{day}</span>
                        <span className="text-[10px] font-normal text-slate-600">
                          {day === 'Today' ? 'Evening Pickup' : 'Morning & Evening'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Slots list */}
                <div className="space-y-2">
                  {pickupSlots.map((slot) => {
                    const isSelected = selectedSlot.id === slot.id;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => slot.available && setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-white border-cyan-600 ring-2 ring-cyan-500/20 shadow-xs'
                            : slot.available
                            ? 'bg-white border-slate-200 hover:border-slate-300'
                            : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-cyan-700' : 'text-slate-400'}`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-900">
                                {slot.dayLabel}: {slot.timeRange}
                              </span>
                              {slot.capacityLabel && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-900">
                                  {slot.capacityLabel}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-700">
                              Estimated delivery: 24–48 hours after pickup
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pickup address verification summary */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-700 block">
                    Pickup Location:
                  </span>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {selectedAddress.name} • {selectedAddress.houseFlat}, {selectedAddress.area}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT (PRD Section 16) */}
            {checkoutStep === 4 && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Payment Method
                  </span>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Pay securely online or choose Pay on Delivery.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white ${
                      paymentMethod === 'UPI'
                        ? 'border-cyan-600 ring-2 ring-cyan-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs">
                          UPI
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">
                            UPI (Google Pay, PhonePe, Paytm, QR)
                          </span>
                          <span className="text-[10px] text-slate-700">Instant verification</span>
                        </div>
                      </div>
                      {paymentMethod === 'UPI' && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-700" />
                      )}
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                        {[
                          { id: 'gpay', label: 'GPay' },
                          { id: 'phonepe', label: 'PhonePe' },
                          { id: 'paytm', label: 'Paytm' },
                          { id: 'qr', label: 'Scan QR' },
                        ].map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUpiApp(u.id as any);
                            }}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition ${
                              selectedUpiApp === u.id
                                ? 'bg-cyan-700 text-white border-cyan-700'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cards Option */}
                  <div
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white ${
                      paymentMethod === 'Card'
                        ? 'border-cyan-600 ring-2 ring-cyan-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">
                            Credit / Debit Cards
                          </span>
                          <span className="text-[10px] text-slate-700">Visa, Mastercard, RuPay</span>
                        </div>
                      </div>
                      {paymentMethod === 'Card' && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-700" />
                      )}
                    </div>
                  </div>

                  {/* Pay on Delivery Option (COD) */}
                  <div
                    onClick={() => setPaymentMethod('PayOnDelivery')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white ${
                      paymentMethod === 'PayOnDelivery'
                        ? 'border-cyan-600 ring-2 ring-cyan-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                          ₹
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">
                            Pay on Delivery / Pickup
                          </span>
                          <span className="text-[10px] text-slate-700">
                            Cash or UPI after garment count verification
                          </span>
                        </div>
                      </div>
                      {paymentMethod === 'PayOnDelivery' && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-700" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Final Checkout Summary Sheet */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Pickup Window:</span>
                    <span className="font-bold text-slate-900">
                      {selectedSlot.dayLabel}, {selectedSlot.timeRange}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Address:</span>
                    <span className="font-medium text-slate-900 truncate max-w-[200px]">
                      {selectedAddress.houseFlat}, {selectedAddress.area}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Garments Count:</span>
                    <span className="font-bold text-slate-900">
                      {cart.reduce((s, i) => s + i.quantity, 0)} pieces
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-sm font-extrabold text-slate-900">Amount to Pay</span>
                    <span className="text-xl font-black text-cyan-700">₹{cartTotal}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-700 justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Quality Care & Fabric Protection Guarantee</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions Bar */}
          {cart.length > 0 && (
            <div className="bg-white p-4 border-t border-slate-200 flex items-center gap-3">
              {checkoutStep > 1 && (
                <button
                  onClick={() => setCheckoutStep((checkoutStep - 1) as any)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Back
                </button>
              )}

              {checkoutStep < 4 ? (
                <button
                  onClick={() => setCheckoutStep((checkoutStep + 1) as any)}
                  className="flex-1 py-3.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-200"
                >
                  <span>
                    {checkoutStep === 1 && 'Select Address'}
                    {checkoutStep === 2 && 'Choose Pickup Slot'}
                    {checkoutStep === 3 && 'Proceed to Payment'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <span className="animate-pulse">Confirming Pickup...</span>
                  ) : (
                    <>
                      <span>Confirm & Book (₹{cartTotal})</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

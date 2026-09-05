import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, MapPin, CheckCircle2, Trash2 } from 'lucide-react';
import { Address } from '../types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    deleteAddress,
    user,
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    type: 'Home' as 'Home' | 'Work' | 'Other',
    name: user.name || '',
    phone: user.phone || '',
    houseFlat: '',
    street: '',
    landmark: '',
    area: '',
    city: '',
    pincode: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.houseFlat || !form.street || !form.area) {
      alert('Please fill in House/Flat, Street, and Area.');
      return;
    }

    const created = addAddress({
      customerId: user.id,
      type: form.type,
      name: form.name,
      phone: form.phone,
      houseFlat: form.houseFlat,
      street: form.street,
      landmark: form.landmark,
      area: form.area,
      city: form.city,
      pincode: form.pincode,
    });
    setSelectedAddress(created);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-600" />
            <h3 className="font-extrabold text-base text-slate-900">Manage Pickup Addresses</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Saved Locations
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel' : 'Add New'}</span>
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 animate-in fade-in text-xs"
            >
              <h4 className="font-bold text-slate-900 text-xs">Add New Address</h4>

              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`flex-1 py-1.5 rounded-lg font-bold border transition ${
                      form.type === t
                        ? 'bg-cyan-700 text-white border-cyan-700'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase text-[10px]">
                  Flat / Door No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Green Glen"
                  value={form.houseFlat}
                  onChange={(e) => setForm({ ...form, houseFlat: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase text-[10px]">
                  Street / Road
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14th Main Road"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HSR Layout"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Pincode</label>
                  <input
                    type="text"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold shadow-xs transition"
              >
                Save Address
              </button>
            </form>
          )}

          {/* List */}
          <div className="space-y-2">
            {addresses.length === 0 && !showAddForm ? (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 font-medium">
                  No saved addresses yet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="mt-2.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  + Add Pickup Address
                </button>
              </div>
            ) : (
              addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer bg-white text-xs ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black px-1.5 py-0.2 bg-slate-100 rounded uppercase text-[10px]">
                          {addr.type}
                        </span>
                        <span className="font-bold text-slate-900">{addr.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        )}
                        {addresses.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(addr.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-700 mt-1 font-medium">
                      {addr.houseFlat}, {addr.street}, {addr.area}
                    </p>
                    <p className="text-[11px] text-slate-700">
                      {addr.city} - {addr.pincode} • Phone: {addr.phone}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

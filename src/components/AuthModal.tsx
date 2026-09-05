import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuickerLogo } from './QuickerLogo';
import { X, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithOtp } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [simulatedOtp, setSimulatedOtp] = useState('1234');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setSimulatedOtp('1234');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) {
      alert('Please enter the 4-digit OTP code.');
      return;
    }
    loginWithOtp(mobileNumber, name);
    setStep('phone');
    setMobileNumber('');
    setOtp(['', '', '', '']);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <QuickerLogo className="h-10 w-auto" />
          </div>
          <h2 className="font-black text-lg text-slate-900">
            {step === 'phone' ? 'Welcome to Quicker' : 'Verify Mobile Number'}
          </h2>
          <p className="text-xs text-slate-700 mt-0.5">
            {step === 'phone'
              ? 'Enter your mobile number to sign in or register instantly.'
              : `Code sent to +91 ${mobileNumber}. (Test OTP: ${simulatedOtp})`}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div>
              <label htmlFor="auth-full-name" className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Your Name
              </label>
              <input
                id="auth-full-name"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label htmlFor="auth-mobile-number" className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                10-Digit Mobile Number
              </label>
              <div className="flex">
                <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-bold text-slate-600 flex items-center">
                  +91
                </span>
                <input
                  id="auth-mobile-number"
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold tracking-wider focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-200 mt-4"
            >
              <span>Get OTP Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-center gap-2.5 my-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-black bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-900">
              Auto-filled demo OTP: <strong>1234</strong>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition shadow-xs"
            >
              Verify & Proceed
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs text-slate-700 hover:underline font-semibold"
            >
              Change Mobile Number
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>OTP-based secure sign in • No passwords</span>
        </div>
      </div>
    </div>
  );
};

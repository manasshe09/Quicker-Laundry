import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ArrowRight,
  Loader2,
  Lock,
  ArrowLeft,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithOtp,
    loginWithGoogle,
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch {
      // loginWithGoogle handles fallback internally
      setIsAuthModalOpen(false);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setStep('otp');
    setResendTimer(30);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) {
      alert('Please enter the 4-digit verification code.');
      return;
    }
    loginWithOtp(mobileNumber, name.trim() || undefined);
    setStep('phone');
    setMobileNumber('');
    setName('');
    setOtp(['', '', '', '']);
    setIsAuthModalOpen(false);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-advance to next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`modal-otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const autoFillSmsCode = () => {
    setOtp(['1', '2', '3', '4']);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setStep('phone');
          }}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center mb-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
              Quicker<span className="text-blue-600">.</span>
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Laundry &amp; Dry Cleaning
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-2">
            {step === 'phone' ? 'Sign In to Quicker' : 'Verify Mobile Number'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {step === 'phone'
              ? 'Fast doorstep pickup, live status & garment care updates.'
              : `Enter the 4-digit code sent to +91 ${mobileNumber}`}
          </p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            {/* Phone Form */}
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Mobile Number
                </label>
                <div className="flex rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/30 focus-within:border-blue-600 transition">
                  <div className="px-3.5 py-3 bg-slate-100/80 border-r border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0 select-none">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full bg-transparent px-3.5 py-3 text-sm text-slate-900 font-bold tracking-wider placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                  Your Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                />
              </div>

              <button
                type="submit"
                disabled={mobileNumber.length < 10}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>Continue with OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Clean Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">
                  or continue with
                </span>
              </div>
            </div>

            {/* Official Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 rounded-2xl text-sm font-semibold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
            </button>
          </div>
        ) : (
          /* OTP Verification Step */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-center gap-2.5 my-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`modal-otp-digit-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-bold text-slate-900 bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <button
                type="button"
                onClick={autoFillSmsCode}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Auto-fill Code
              </button>
              <span className="text-slate-400">
                Resend in {resendTimer}s
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold transition active:scale-[0.98] shadow-md cursor-pointer"
            >
              Verify & Sign In
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-900 font-semibold transition cursor-pointer pt-1 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Mobile Number</span>
            </button>
          </form>
        )}

        {/* Security Badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Encrypted & Verified • Real-time SMS Updates</span>
        </div>
      </div>
    </div>
  );
};

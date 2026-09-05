import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

interface LoginViewProps {
  onSkip: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSkip }) => {
  const { loginWithOtp, loginWithGoogle } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState<{
    message: string;
    domain?: string;
    isUnauthorizedDomain?: boolean;
    isConfigMissing?: boolean;
  } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [showDirectGoogleForm, setShowDirectGoogleForm] = useState(false);
  const [directGoogleName, setDirectGoogleName] = useState('');
  const [directGoogleEmail, setDirectGoogleEmail] = useState('');

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const cleanPhone = mobileNumber.replace(/\D/g, '');
  const isPhoneValid = cleanPhone.length === 10;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 150);
    }, 350);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) return;

    loginWithOtp(cleanPhone, name.trim() || undefined);
  };

  const handleOtpChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (val && !/^\d+$/.test(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pastedData) return;

    const newOtp = ['', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const focusIdx = Math.min(pastedData.length, 3);
    otpInputRefs[focusIdx].current?.focus();
  };

  const handleAutoFillCode = () => {
    setOtp(['1', '2', '3', '4']);
    setTimeout(() => {
      otpInputRefs[3].current?.focus();
    }, 50);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleAuthError(null);

    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setGoogleAuthError({
          message: res.error || 'Google Sign-In could not be completed.',
          domain: res.currentDomain || window.location.hostname,
          isUnauthorizedDomain: res.isUnauthorizedDomain,
          isConfigMissing: res.isConfigMissing,
        });
      }
    } catch (err: any) {
      setGoogleAuthError({
        message: err?.message || 'Google Sign-In failed',
        domain: window.location.hostname,
        isUnauthorizedDomain: true,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDirectGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directGoogleEmail) return;

    loginWithGoogle({
      name: directGoogleName.trim() || 'Customer',
      email: directGoogleEmail.trim(),
    });
  };

  const copyDomainToClipboard = () => {
    const domain = googleAuthError?.domain || window.location.hostname;
    navigator.clipboard.writeText(domain);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar with Brand & Skip Action */}
      <header className="w-full max-w-md mx-auto px-5 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
            Quicker<span className="text-blue-600">.</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-200/70 px-2 py-0.5 rounded-full ml-1.5">
            Laundry &amp; Dry Clean
          </span>
        </div>

        <button
          onClick={onSkip}
          type="button"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-full shadow-2xs transition flex items-center gap-1 cursor-pointer"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm p-5 sm:p-7">
          {step === 'phone' ? (
            /* STEP 1: PHONE NUMBER & GOOGLE AUTH */
            <div className="space-y-5">
              {/* Header */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Doorstep Laundry in 24 Hours
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Enter your phone number to sign in or create an account.
                </p>
              </div>

              {/* Service Pillars Mini Bar */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">24h Express</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Fabric Safe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Eco Detergent</span>
                </div>
              </div>

              {/* Phone Form */}
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-3 focus-within:ring-blue-600/15 transition overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-800 shrink-0 select-none">
                      <span className="text-sm leading-none">🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      autoFocus
                      maxLength={10}
                      placeholder="Enter 10-digit number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-3.5 py-3 text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none tracking-wider"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Your Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isPhoneValid || isSubmitting}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    isPhoneValid && !isSubmitting
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-[0.99]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
                className="w-full py-3 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-3 shadow-2xs cursor-pointer disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Google Auth Diagnostic Card (shown if Firebase Authorized Domains / Config is required) */}
              {googleAuthError && (
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-amber-900">
                        {googleAuthError.isUnauthorizedDomain
                          ? 'Firebase Domain Authorization Needed'
                          : 'Google Sign-In Notice'}
                      </span>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        {googleAuthError.isUnauthorizedDomain
                          ? 'In Firebase Console > Authentication > Settings > Authorized domains, add this domain:'
                          : googleAuthError.message}
                      </p>
                    </div>
                  </div>

                  {googleAuthError.domain && (
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-amber-200 font-mono text-[11px] text-slate-800">
                      <span className="truncate mr-2 font-semibold">{googleAuthError.domain}</span>
                      <button
                        type="button"
                        onClick={copyDomainToClipboard}
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-bold font-sans shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedDomain ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {/* Fallback Option */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowDirectGoogleForm(!showDirectGoogleForm)}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                    >
                      {showDirectGoogleForm ? 'Hide Google form' : 'Or enter Google email directly →'}
                    </button>

                    {showDirectGoogleForm && (
                      <form onSubmit={handleDirectGoogleSubmit} className="mt-2 space-y-2 bg-white p-3 rounded-lg border border-amber-200">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={directGoogleName}
                          onChange={(e) => setDirectGoogleName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                        <input
                          type="email"
                          required
                          placeholder="your.email@gmail.com"
                          value={directGoogleEmail}
                          onChange={(e) => setDirectGoogleEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Sign in with Google Account
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Back to Phone
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Verify Mobile Number
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <span>Code sent to <strong>+91 {cleanPhone}</strong></span>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* 4 Digit OTP Inputs */}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex justify-center gap-3 my-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpInputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-13 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 focus:outline-none transition"
                    />
                  ))}
                </div>

                {/* Preview Auto-fill Helper */}
                <div className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-blue-50/60 text-blue-900 border border-blue-100">
                  <span className="text-[11px] text-blue-800">
                    Preview test code: <strong>1234</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillCode}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    Auto-fill 1234
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={otp.join('').length < 4}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    otp.join('').length === 4
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-[0.99]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Verify &amp; Continue</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Resend OTP */}
                <div className="text-center pt-1 text-xs">
                  {resendTimer > 0 ? (
                    <span className="text-slate-400">
                      Resend code in <strong className="text-slate-600">{resendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResendTimer(30)}
                      className="font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                    >
                      Resend SMS OTP
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer Legal Terms (Clean standard English) */}
      <footer className="w-full max-w-md mx-auto px-5 py-4 text-center text-[11px] text-slate-600">
        By continuing, you agree to Quicker's{' '}
        <span className="text-slate-700 underline cursor-pointer">Terms of Service</span> &amp;{' '}
        <span className="text-slate-700 underline cursor-pointer">Privacy Policy</span>.
      </footer>
    </div>
  );
};

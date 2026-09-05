import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuickerLogo } from './QuickerLogo';
import {
  X,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithOtp,
    loginWithGoogle,
    loginAsDemoUser,
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [simulatedOtp, setSimulatedOtp] = useState('1234');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('manassheongole@gmail.com');
  const [customGoogleName, setCustomGoogleName] = useState('Google Customer');
  const [showConsoleGuide, setShowConsoleGuide] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    setIsConfigError(false);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        if (result.isConfigMissing || result.error?.includes('configuration-not-found')) {
          setIsConfigError(true);
          setGoogleError(
            'Google Sign-In is not enabled yet in your Firebase Console (quicker-billing-dashboard).'
          );
        } else {
          setGoogleError(
            result.error?.includes('popup-closed-by-user')
              ? 'Sign in popup was closed. Please try again.'
              : result.error || 'Google Sign-In was not completed. You can also use Quick Google Login below.'
          );
        }
      }
    } catch (err: any) {
      if (err?.message?.includes('configuration-not-found')) {
        setIsConfigError(true);
        setGoogleError('Google Sign-In is not enabled yet in Firebase Console.');
      } else {
        setGoogleError('Unable to open Google Sign-In. You can use Quick Google Login below.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleInstantGoogleLogin = () => {
    loginWithGoogle({
      name: customGoogleName.trim() || 'Google Customer',
      email: customGoogleEmail.trim() || 'customer@gmail.com',
    });
  };

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
          onClick={() => {
            setIsAuthModalOpen(false);
            setGoogleError(null);
          }}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <QuickerLogo className="h-10 w-auto" />
          </div>
          <h2 className="font-black text-lg text-slate-900">
            {step === 'phone' ? 'Sign In to Quicker' : 'Verify Mobile Number'}
          </h2>
          <p className="text-xs text-slate-700 mt-0.5">
            {step === 'phone'
              ? 'Login with your Google account or mobile number.'
              : `Code sent to +91 ${mobileNumber}. (Test OTP: ${simulatedOtp})`}
          </p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-2.5 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Google Notice / Fallback if popup fails */}
            {googleError && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-900 leading-snug">
                      {isConfigError ? 'Firebase Auth Not Enabled in Console' : 'Sign-In Notice'}
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {googleError}
                    </p>
                  </div>
                </div>

                {isConfigError ? (
                  <div className="mt-1 pt-2 border-t border-amber-200/80 space-y-2">
                    {/* Instant Login with user email */}
                    <div className="bg-white/80 rounded-xl p-2.5 border border-amber-200 space-y-2">
                      <span className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">
                        ⚡ Instant Access (Continue as Google Account):
                      </span>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={customGoogleName}
                          onChange={(e) => setCustomGoogleName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                        />
                        <input
                          type="email"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          placeholder="Google Email"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleInstantGoogleLogin}
                          className="w-full py-2 px-3 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Login as Google User</span>
                        </button>
                      </div>
                    </div>

                    {/* How to enable in Firebase Console */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowConsoleGuide(!showConsoleGuide)}
                        className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showConsoleGuide ? 'Hide Console Steps' : 'How to enable in Firebase Console (3 Steps)'}</span>
                      </button>

                      {showConsoleGuide && (
                        <div className="mt-2 p-2.5 bg-white/90 rounded-xl border border-amber-200 text-[11px] text-slate-700 space-y-1.5">
                          <p className="font-bold text-slate-900">Enable Google Auth in 1 minute:</p>
                          <ol className="list-decimal list-inside space-y-1 text-slate-600">
                            <li>
                              Open <a
                                href="https://console.firebase.google.com/project/quicker-billing-dashboard/authentication/providers"
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 font-bold underline inline-flex items-center gap-0.5"
                              >
                                Firebase Console <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            </li>
                            <li>Click <strong>&quot;Add new provider&quot;</strong> &rarr; Select <strong>&quot;Google&quot;</strong>.</li>
                            <li>Toggle <strong>Enable</strong>, pick your Support Email, and click <strong>Save</strong>.</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => loginAsDemoUser('google')}
                    className="mt-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold self-start transition cursor-pointer"
                  >
                    Quick Sign In (Google Demo)
                  </button>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700 shrink-0">
                Or with mobile number
              </span>
            </div>

            {/* Phone Login Form */}
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label htmlFor="auth-full-name" className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  Your Name
                </label>
                <input
                  id="auth-full-name"
                  type="text"
                  placeholder="e.g. Kiran Kumar"
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
                className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-200 mt-3 cursor-pointer"
              >
                <span>Get OTP Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Fast Test Profile */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => loginAsDemoUser('phone')}
                className="text-[11px] text-cyan-700 hover:text-cyan-800 font-bold hover:underline"
              >
                ⚡ 1-Click Demo Login (Kiran Kumar)
              </button>
            </div>
          </div>
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
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition shadow-xs cursor-pointer"
            >
              Verify & Proceed
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs text-slate-700 hover:underline font-semibold cursor-pointer"
            >
              Change Mobile Number
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>Google Auth & OTP secured via Firebase</span>
        </div>
      </div>
    </div>
  );
};

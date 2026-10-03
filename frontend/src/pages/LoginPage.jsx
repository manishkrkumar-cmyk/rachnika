import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, ShieldCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import axios from 'axios';

export default function LoginPage({ onLoginSuccess, onBackToStore }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    if (isRegisterMode) {
      // Validation for Registration
      const cleanPhone = phone.replace(/\D/g, '');
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (cleanPhone.length !== 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long');
        return;
      }

      setLoading(true);
      try {
        const res = await axios.post('http://localhost:8091/api/auth/register', {
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          password: password
        });

        if (res.data?.data) {
          setSuccessNotice('Account registered successfully! Please log in.');
          setIsRegisterMode(false);
          setPassword('');
        } else if (res.data?.message) {
          setErrorMsg(res.data.message);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed. Mobile or Email may already exist.';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    } else {
      // Login validation
      if (!phone.trim()) {
        setErrorMsg('Please enter your registered mobile number or email');
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your password');
        return;
      }

      setLoading(true);
      try {
        const res = await axios.post('http://localhost:8091/api/auth/login', {
          identifier: phone.trim(),
          password: password
        });

        if (res.data?.data) {
          const userSession = res.data.data;
          userSession.isLoggedIn = true;
          localStorage.setItem('rachnika_user_session', JSON.stringify(userSession));
          if (onLoginSuccess) onLoginSuccess(userSession);
        } else if (res.data?.message) {
          setErrorMsg(res.data.message);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Invalid mobile number/email or password';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#edeef2] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-slate-200">
        
        {/* LEFT COLUMN: Input Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Top Brand Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-serif font-black text-xl text-slate-900 tracking-tight">Rachnika</span>
            </div>

            {/* Title & Mode Switcher */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isRegisterMode ? 'Create an Account' : 'Welcome back !'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              {isRegisterMode 
                ? 'Join Rachnika to buy and sell authentic handcrafted goods.' 
                : 'Enter your credentials to access your artisan orders and profile.'}
            </p>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                {errorMsg}
              </div>
            )}
            {successNotice && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                {successNotice}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name (Registration Only) */}
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 bg-slate-50/50 text-xs text-slate-800 outline-none font-medium placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRegisterMode ? 'Mobile Number *' : 'Mobile Number or Email *'}
                </label>
                <div className="flex items-center border border-slate-300 focus-within:border-indigo-600 rounded-xl px-3.5 py-2.5 bg-slate-50/50 transition">
                  {isRegisterMode && (
                    <span className="text-xs font-bold text-slate-500 mr-2 border-r border-slate-200 pr-2">
                      +91
                    </span>
                  )}
                  <input
                    type={isRegisterMode ? 'tel' : 'text'}
                    required
                    placeholder={isRegisterMode ? '10-digit mobile number' : 'Enter mobile number or email'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-800 outline-none font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email (Registration Only) */}
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 bg-slate-50/50 text-xs text-slate-800 outline-none font-medium placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative flex items-center border border-slate-300 focus-within:border-indigo-600 rounded-xl px-3.5 py-2.5 bg-slate-50/50 transition">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-800 outline-none font-medium placeholder:text-slate-400 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : isRegisterMode ? (
                  <>
                    <span>Register Account</span>
                    <UserPlus className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <LogIn className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Switcher */}
            <div className="mt-5 text-center text-xs text-slate-600">
              {isRegisterMode ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setErrorMsg('');
                      setSuccessNotice('');
                    }}
                    className="text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    Log In here
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setErrorMsg('');
                      setSuccessNotice('');
                    }}
                    className="text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    Register here
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="text-center pt-6 text-[11px] text-slate-500">
            Back to{' '}
            <button onClick={onBackToStore} className="text-indigo-600 font-bold hover:underline cursor-pointer">
              Marketplace Store
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentic Geometric Art Illustration Panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#180b4e] via-[#241372] to-[#0c0529] p-8 text-white relative overflow-hidden">
          {/* Abstract Geometric Graphics */}
          <div className="absolute inset-0 pointer-events-none opacity-90">
            <div className="absolute top-6 right-6 w-32 h-32 opacity-30 grid grid-cols-3 gap-1">
              <div className="bg-indigo-400 rotate-45 transform"></div>
              <div className="bg-purple-400 rotate-45 transform"></div>
              <div className="bg-blue-400 rotate-45 transform"></div>
            </div>

            <div className="absolute top-44 left-16 text-amber-400 text-4xl animate-pulse">
              ✹
            </div>

            <div className="absolute top-48 left-12 w-14 h-20 bg-teal-400/90 rounded-md shadow-lg border border-teal-200/40"></div>

            <div className="absolute bottom-16 right-4 w-44 h-44 rounded-full border-8 border-indigo-400/30 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-indigo-600/40 border-4 border-indigo-300/40"></div>
            </div>
          </div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-indigo-200 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Secure BCrypt Authentication
            </span>
          </div>

          <div className="relative z-10 space-y-2 mt-auto pt-40">
            <h3 className="font-serif text-2xl font-bold leading-snug">
              Authentic Indian Artistry, Delivered with Care.
            </h3>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Create your account to save shipping addresses, place custom artisan orders, and track your handcrafted deliveries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
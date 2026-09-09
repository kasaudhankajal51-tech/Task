import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isRegisterMode) {
      if (!name.trim()) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      if (!email.trim() || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }
      result = await register(name.trim(), email.trim(), password);
    } else {
      if (!email.trim() || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }
      result = await login(email.trim(), password);
    }

    setLoading(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-500/10">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-3 shadow-lg shadow-teal-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Task<span className="text-teal-400">Flow</span> Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your private, isolated tasks across all devices.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isRegisterMode
                ? 'bg-slate-800 text-white shadow-md border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isRegisterMode
                ? 'bg-slate-800 text-white shadow-md border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Kajal Kasaudhan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="e.g. user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{isRegisterMode ? 'Create Account' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-5 pt-4 border-t border-slate-800">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          <span>All tasks are end-to-end user isolated</span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

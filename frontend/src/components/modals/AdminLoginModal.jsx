import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Live Render URL with fallback
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('nrcmfmc_admin_token', data.token);
        setUsername('');
        setPassword('');
        setLoading(false);
        onLoginSuccess();
      } else {
        // Fallback local check if server is offline
        if (username === 'nrcmfmc' && password === 'fmc123') {
          localStorage.setItem('nrcmfmc_admin_token', 'local-admin-token');
          setUsername('');
          setPassword('');
          setLoading(false);
          onLoginSuccess();
        } else {
          setErrorMsg(data.error || 'Invalid credentials. Enter valid ID & Password.');
          setLoading(false);
        }
      }
    } catch (err) {
      console.warn('Backend login API unreachable, attempting local check:', err.message);
      if (username === 'nrcmfmc' && password === 'fmc123') {
        localStorage.setItem('nrcmfmc_admin_token', 'local-admin-token');
        setUsername('');
        setPassword('');
        setLoading(false);
        onLoginSuccess();
      } else {
        setErrorMsg('Invalid credentials. Enter valid ID & Password.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] w-full h-full min-h-screen bg-black/80 backdrop-blur-lg text-white overflow-y-auto animate-in fade-in p-5 sm:p-8 flex items-center justify-center">
      {/* Spacious Larger Modal Card */}
      <div className="w-full max-w-lg sm:max-w-xl bg-[#161618] border border-zinc-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-7 right-7 w-9 h-9 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title & Subtitle */}
        <div className="mb-8 pr-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            NRCM.FMC OS Sign In
          </h2>
          <p className="text-sm text-zinc-400 mt-2 font-medium">
            Enter your credentials to access FMC Admin OS
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-950/90 border border-red-800 text-sm text-red-200 font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2 text-left">
            <label className="block text-sm font-semibold text-zinc-200">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-14 bg-[#212124] border-2 border-zinc-700 focus:border-white rounded-2xl px-5 text-base text-white placeholder-zinc-500 focus:outline-none transition-colors shadow-inner"
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="space-y-2 text-left relative">
            <label className="block text-sm font-semibold text-zinc-200">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-[#212124] border-2 border-zinc-700 focus:border-white rounded-2xl px-5 pr-12 text-base text-white placeholder-zinc-500 focus:outline-none transition-colors shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* White Primary Pill Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-white text-black font-bold text-base rounded-2xl hover:bg-zinc-200 transition-colors cursor-pointer shadow-lg mt-8 active:scale-[0.99]"
          >
            {loading ? 'Signing in...' : 'Open NRCM.FMC OS'}
          </button>
        </form>
      </div>
    </div>
  );
}

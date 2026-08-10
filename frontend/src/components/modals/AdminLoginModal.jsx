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
    <div className="fixed inset-0 z-[120] w-full h-full min-h-screen bg-black/75 backdrop-blur-md text-white overflow-y-auto animate-in fade-in p-4 flex items-center justify-center">
      {/* Modal Box */}
      <div className="w-full max-w-md bg-[#161618] border border-zinc-800/90 rounded-3xl p-7 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title & Subtitle */}
        <div className="mb-6 pr-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            NRCM.FMC OS Sign In
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Enter your credentials to access FMC Admin OS
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300 font-medium text-center">
              {errorMsg}
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-zinc-300">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1c1c1f] border border-zinc-700/80 focus:border-white rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="space-y-1.5 text-left relative">
            <label className="block text-xs font-medium text-zinc-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1c1c1f] border border-zinc-700/80 focus:border-white rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* White Primary Pill Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold text-sm py-3 rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer shadow-md mt-6"
          >
            {loading ? 'Signing in...' : 'Open NRCM.FMC OS'}
          </button>
        </form>
      </div>
    </div>
  );
}

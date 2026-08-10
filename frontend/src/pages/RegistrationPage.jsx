import React, { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', branch: 'CSE', mobile: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      await fetch(`${apiUrl}/api/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (_) {}
    const existing = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
    existing.unshift({ _id: `FMC-PASS-${Date.now()}`, passId: `FMC-PASS-${Date.now()}`, ...formData, createdAt: new Date().toISOString() });
    localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(existing));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
        className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-red-600 border-4 border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(229,9,20,0.4)] mb-8">
          <Check className="w-12 h-12 text-white stroke-[3]" />
        </div>
        <span className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase font-bold mb-3 block">
          ✦ PASS GENERATED ✦
        </span>
        <h1 className="font-black text-4xl sm:text-5xl text-white uppercase leading-tight mb-4">
          PASS CONFIRMED,<br />
          <span className="text-red-500">{formData.name}</span>
        </h1>
        <p className="font-mono text-xs sm:text-sm text-white/50 max-w-sm uppercase leading-loose mb-10">
          Your official entry pass for <span className="text-red-500 font-bold">NRCM.FMC Induction 2026</span> has been logged
          for <span className="text-white font-bold">{formData.branch}</span>.
          See you at Main Auditorium!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-10 py-4 rounded-full bg-white text-[#0f0f11] font-mono text-sm font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-xl">
          ← BACK TO SITE
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
      className="min-h-screen bg-[#0f0f11] text-white overflow-x-hidden">

      {/* ── HERO BANNER ── */}
      <div className="relative w-full h-[55vw] min-h-[220px] max-h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
          alt="Junior Induction 2026"
          className="w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.35) contrast(1.1)' }}
        />
        {/* gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f11]/60 to-transparent h-20" />

        {/* Back */}
        <button onClick={() => navigate('/')}
          className="absolute top-5 left-5 font-mono text-[11px] text-white/60 hover:text-white uppercase tracking-widest cursor-pointer transition-colors flex items-center gap-1.5">
          ← NRCM.FMC
        </button>

        {/* Center Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pb-4">
          <span className="font-mono text-[10px] text-red-500 tracking-[0.4em] uppercase font-bold mb-3">
            NRCM.FMC · OFFICIAL EVENT
          </span>
          <h1 className="font-black uppercase leading-none text-white"
            style={{ fontSize: 'clamp(2.2rem, 9vw, 5.5rem)', letterSpacing: '-0.02em' }}>
            JUNIOR<br />INDUCTION
          </h1>
          <div className="font-serif italic text-red-500 mt-1"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)', lineHeight: 1 }}>
            2026
          </div>
        </div>
      </div>

      {/* ── EVENT META BAR ── */}
      <div className="bg-[#17171a] border-y border-white/5">
        <div className="max-w-lg mx-auto grid grid-cols-3 divide-x divide-white/5">
          {[
            { icon: <Calendar className="w-3.5 h-3.5 text-red-500" />, label: 'DATE', val: 'AUG 11, 2026' },
            { icon: <Clock className="w-3.5 h-3.5 text-red-500" />, label: 'TIME', val: '03:30 PM IST' },
            { icon: <MapPin className="w-3.5 h-3.5 text-red-500" />, label: 'VENUE', val: 'MAIN AUDI' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-4 px-3 gap-1.5">
              {item.icon}
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{item.label}</span>
              <span className="font-mono text-[11px] sm:text-xs text-white font-bold tracking-wide text-center leading-tight">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FORM SECTION ── */}
      <div className="max-w-lg mx-auto px-5 sm:px-8 py-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="font-black uppercase text-white leading-none mb-2"
            style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', letterSpacing: '-0.02em' }}>
            REACH OUT
          </h2>
          <p className="font-mono text-[11px] text-white/40 uppercase tracking-[0.2em]">
            Secure your entry pass below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2 font-bold">FULL NAME *</label>
            <input
              type="text" required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/25 font-medium text-sm focus:outline-none focus:border-red-500/60 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2 font-bold">BRANCH / DEPT *</label>
            <div className="relative">
              <select
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-medium text-sm focus:outline-none focus:border-red-500/60 transition-all appearance-none cursor-pointer"
              >
                <option value="CSE" className="bg-[#17171a]">CSE — Computer Science</option>
                <option value="ECE" className="bg-[#17171a]">ECE — Electronics &amp; Comm</option>
                <option value="IT" className="bg-[#17171a]">IT — Information Tech</option>
                <option value="CSM/CSD" className="bg-[#17171a]">CSM / CSD — AI &amp; Data</option>
                <option value="MECH" className="bg-[#17171a]">MECH — Mechanical</option>
                <option value="CIVIL" className="bg-[#17171a]">CIVIL — Civil Engg</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Mobile + Email side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2 font-bold">MOBILE *</label>
              <input
                type="tel" required
                placeholder="+91 98765 43210"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/25 font-medium text-sm focus:outline-none focus:border-red-500/60 transition-all"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2 font-bold">EMAIL *</label>
              <input
                type="email" required
                placeholder="student@nrcm.ac.in"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/25 font-medium text-sm focus:outline-none focus:border-red-500/60 transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-sm uppercase tracking-[0.15em] hover:bg-red-500 active:scale-[0.99] transition-all cursor-pointer shadow-[0_8px_30px_rgba(229,9,20,0.35)] flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-xs tracking-widest">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  GENERATING PASS...
                </span>
              ) : (
                <>SUBMIT <ArrowRight className="w-4 h-4 stroke-[3]" /></>
              )}
            </button>
          </div>
        </form>

        {/* Footer note */}
        <p className="text-center font-mono text-[10px] text-white/25 uppercase tracking-wider mt-8">
          © NRCM FILM MAKING CLUB · Junior Induction 2026
        </p>
      </div>
    </div>
  );
}

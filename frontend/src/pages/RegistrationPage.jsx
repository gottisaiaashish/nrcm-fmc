import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', branch: 'CSE', mobile: '', email: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const existing = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      existing.unshift({ _id: `FMC-PASS-${Date.now()}`, passId: `FMC-PASS-${Date.now()}`, ...formData, createdAt: new Date().toISOString() });
      localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(existing));
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      existing.unshift({ _id: `FMC-PASS-${Date.now()}`, passId: `FMC-PASS-${Date.now()}`, ...formData, createdAt: new Date().toISOString() });
      localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(existing));
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const inputClass = "w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] placeholder-[#17171a]/40 font-mono text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors shadow-sm";

  return (
    <div className="min-h-screen bg-[#F0ECD9] text-[#17171a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-[#F0ECD9]/95 backdrop-blur-sm border-b-2 border-[#17171a]/10 flex items-center justify-between px-5 py-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#17171a]/70 hover:text-[#17171a] font-mono text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">BACK TO SITE</span>
        </button>
        <span className="font-mono text-xs font-black tracking-widest uppercase text-[#17171a]">NRCM.FMC</span>
        <div className="w-20 sm:w-24" /> {/* spacer */}
      </div>

      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        {!submitted ? (
          <>
            {/* Event Header Banner */}
            <div className="bg-[#17171a] text-white rounded-3xl overflow-hidden mb-8 border-4 border-[#17171a] shadow-xl">
              <div className="relative h-40 sm:h-48">
                <img
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
                  alt="Junior Induction 2026"
                  className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="font-mono text-[10px] text-red-400 tracking-[0.3em] uppercase font-bold mb-2">NRCM.FMC OFFICIAL EVENT</span>
                  <h1 className="font-black text-3xl sm:text-4xl uppercase text-white leading-none tracking-tight">
                    JUNIOR INDUCTION
                  </h1>
                  <span className="font-serif italic text-red-500 text-4xl sm:text-5xl mt-1">2026</span>
                </div>
              </div>
              {/* Event Details Row */}
              <div className="grid grid-cols-3 divide-x divide-white/10 bg-[#111] text-center">
                <div className="py-3 px-2">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-0.5">DATE</p>
                  <p className="font-mono text-[11px] text-white font-bold">AUG 11, 2026</p>
                </div>
                <div className="py-3 px-2">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-0.5">TIME</p>
                  <p className="font-mono text-[11px] text-white font-bold">03:30 PM</p>
                </div>
                <div className="py-3 px-2">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-0.5">VENUE</p>
                  <p className="font-mono text-[11px] text-white font-bold">MAIN AUDI</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="mb-6 text-center">
              <h2 className="font-black text-3xl sm:text-4xl uppercase tracking-tight mb-1">REACH OUT</h2>
              <p className="font-mono text-[11px] text-[#17171a]/60 uppercase tracking-widest">
                Fill in your details to secure your entry pass
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">FULL NAME *</label>
                <input type="text" required placeholder="ENTER YOUR FULL NAME" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">BRANCH / DEPT *</label>
                <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] font-mono text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors cursor-pointer shadow-sm">
                  <option value="CSE">CSE — COMPUTER SCIENCE</option>
                  <option value="ECE">ECE — ELECTRONICS &amp; COMM</option>
                  <option value="IT">IT — INFORMATION TECH</option>
                  <option value="CSM/CSD">CSM / CSD — AI &amp; DATA</option>
                  <option value="MECH">MECH — MECHANICAL</option>
                  <option value="CIVIL">CIVIL — CIVIL ENGG</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">MOBILE *</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">EMAIL *</label>
                  <input type="email" required placeholder="STUDENT@NRCM.AC.IN" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="pt-3">
                <button type="submit" disabled={loading}
                  className="w-full h-14 rounded-2xl bg-[#e50914] text-white font-mono text-sm font-bold tracking-widest uppercase hover:bg-red-700 transition-all cursor-pointer border-4 border-[#17171a] shadow-xl flex items-center justify-center gap-3 disabled:opacity-60">
                  <span>{loading ? 'GENERATING PASS...' : 'SUBMIT'}</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Confirmation */
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-5 py-10">
            <div className="w-24 h-24 rounded-full bg-[#e50914] border-4 border-[#17171a] flex items-center justify-center shadow-2xl">
              <Check className="w-12 h-12 text-white stroke-[4]" />
            </div>

            <span className="font-mono text-xs text-red-600 font-bold tracking-[0.3em] uppercase">
              EVENT PASS GENERATED
            </span>

            <h2 className="font-black text-4xl sm:text-5xl uppercase text-[#17171a] leading-tight">
              PASS CONFIRMED,<br />{formData.name}
            </h2>

            <p className="font-mono text-xs font-bold text-[#17171a]/70 max-w-sm mx-auto uppercase leading-relaxed">
              YOUR OFFICIAL ENTRY PASS FOR <span className="text-red-600 font-black">NRCM.FMC INDUCTION 2026</span> HAS BEEN LOGGED FOR <span className="text-red-600 font-black">{formData.branch}</span>. SEE YOU AT MAIN AUDITORIUM!
            </p>

            <button
              onClick={() => navigate('/')}
              className="mt-4 px-10 py-4 rounded-2xl bg-[#17171a] text-[#F0ECD9] font-mono text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors border-4 border-[#17171a] cursor-pointer shadow-lg"
            >
              DONE — BACK TO SITE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

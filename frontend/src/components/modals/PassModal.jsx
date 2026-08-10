import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

export default function PassModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    branch: 'CSE',
    mobile: '',
    email: '',
  });

  if (!isOpen) return null;

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

  const inputClass = "w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] placeholder-[#17171a]/40 font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors shadow-sm";

  return (
    <div className="fixed inset-0 z-[100] bg-[#F0ECD9] text-[#17171a] overflow-y-auto">
      {/* Sticky Top Bar with Close */}
      <div className="sticky top-0 z-10 bg-[#F0ECD9] flex items-center justify-end px-5 py-4 border-b-2 border-[#17171a]/10">
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#17171a] text-[#F0ECD9] hover:bg-red-600 transition-all font-mono text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md"
        >
          <span>CLOSE</span>
          <X className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="px-5 sm:px-8 md:px-12 py-8 max-w-3xl mx-auto">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="font-sans font-black uppercase text-[#17171a] tracking-tight leading-none mb-3 text-4xl sm:text-6xl">
                REACH OUT
              </h1>
              <p className="font-mono text-xs font-bold text-[#17171a]/70 uppercase tracking-widest leading-relaxed">
                JUNIOR INDUCTION 2026 // ENTRY DETAILS FOR NRCM CAMPUS AUDITORIUM
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="flex flex-col text-left">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">FULL NAME *</label>
                  <input
                    type="text" required placeholder="ENTER YOUR FULL NAME"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">BRANCH / DEPT *</label>
                  <select
                    value={formData.branch}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors cursor-pointer shadow-sm"
                  >
                    <option value="CSE">CSE — COMPUTER SCIENCE</option>
                    <option value="ECE">ECE — ELECTRONICS &amp; COMM</option>
                    <option value="IT">IT — INFORMATION TECH</option>
                    <option value="CSM/CSD">CSM / CSD — AI &amp; DATA</option>
                    <option value="MECH">MECH — MECHANICAL</option>
                    <option value="CIVIL">CIVIL — CIVIL ENGG</option>
                  </select>
                </div>

                <div className="flex flex-col text-left">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">MOBILE NUMBER *</label>
                  <input
                    type="tel" required placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">EMAIL ADDRESS *</label>
                  <input
                    type="email" required placeholder="STUDENT@NRCM.AC.IN"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit" disabled={loading}
                  className="w-full h-14 rounded-2xl bg-[#e50914] text-white font-mono text-sm font-bold tracking-widest uppercase hover:bg-red-700 transition-all cursor-pointer border-4 border-[#17171a] shadow-xl flex items-center justify-center gap-3"
                >
                  <span>{loading ? 'GENERATING PASS...' : 'SUBMIT'}</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* ── Confirmation Screen — fully centered ── */
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-10 space-y-5">

            <div className="w-20 h-20 rounded-full bg-[#e50914] text-white border-4 border-[#17171a] flex items-center justify-center shadow-xl">
              <Check className="w-10 h-10 stroke-[4]" />
            </div>

            <span className="font-mono text-xs sm:text-sm text-red-600 font-bold tracking-[0.25em] uppercase block">
              EVENT PASS GENERATED
            </span>

            <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase text-[#17171a] leading-tight">
              PASS CONFIRMED,<br />{formData.name}
            </h2>

            <p className="font-mono text-xs sm:text-sm font-bold text-[#17171a]/80 max-w-xs sm:max-w-md mx-auto uppercase leading-relaxed">
              YOUR OFFICIAL ENTRY PASS FOR <span className="text-red-600 font-black">NRCM.FMC INDUCTION 2026</span> HAS BEEN LOGGED FOR <span className="text-red-600 font-black">{formData.branch}</span>. SEE YOU AT MAIN AUDITORIUM!
            </p>

            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-4 px-10 py-4 rounded-2xl bg-[#17171a] text-[#F0ECD9] font-mono text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors border-4 border-[#17171a] cursor-pointer shadow-lg"
            >
              DONE — CLOSE PASS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

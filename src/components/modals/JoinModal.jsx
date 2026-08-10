import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

export default function JoinModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    branch: 'CSE',
    mobile: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-[#F0ECD9] text-[#17171a] overflow-y-auto animate-in fade-in px-5 sm:px-8 md:px-12 py-6 sm:py-10 flex flex-col justify-between items-center">
      <div className="w-full max-w-5xl mx-auto min-h-full flex flex-col justify-between items-center gap-6 sm:gap-8">
        {/* Top Header Navigation Bar - Clean Close Button Only */}
        <div className="w-full flex items-center justify-end pb-2">
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close page"
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#17171a] text-[#F0ECD9] hover:bg-red-600 transition-all font-mono text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md shrink-0"
          >
            <span>CLOSE</span>
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Main Event Registration Content — Perfectly Centered */}
        <div className="w-full flex-1 flex flex-col justify-center items-center py-4">
          {!submitted ? (
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
              {/* Event Header Section Centered */}
              <div className="mb-8 sm:mb-10 text-center w-full max-w-2xl">
                <h1 className="font-sans font-black uppercase text-[#17171a] tracking-tight leading-none mb-3 text-4xl sm:text-6xl md:text-7xl text-center">
                  REACH OUT
                </h1>
                <p className="font-mono text-xs sm:text-sm font-bold text-[#17171a]/70 uppercase tracking-widest leading-relaxed text-center">
                  JUNIOR INDUCTION 2026 // ENTRY DETAILS FOR NRCM CAMPUS AUDITORIUM
                </p>
              </div>

              {/* Form Grid Centered Container */}
              <form onSubmit={handleSubmit} className="w-full space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-8 w-full">
                  {/* Item 1: Full Name */}
                  <div className="flex flex-col text-left w-full">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ENTER YOUR FULL NAME"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] placeholder-[#17171a]/40 font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors shadow-sm"
                    />
                  </div>

                  {/* Item 2: Branch / Dept */}
                  <div className="flex flex-col text-left w-full">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">
                      BRANCH / DEPT *
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors cursor-pointer shadow-sm"
                    >
                      <option value="CSE">CSE — COMPUTER SCIENCE</option>
                      <option value="ECE">ECE — ELECTRONICS & COMM</option>
                      <option value="IT">IT — INFORMATION TECH</option>
                      <option value="CSM/CSD">CSM / CSD — AI & DATA</option>
                      <option value="MECH">MECH — MECHANICAL</option>
                      <option value="CIVIL">CIVIL — CIVIL ENGG</option>
                    </select>
                  </div>

                  {/* Item 3: Mobile Number */}
                  <div className="flex flex-col text-left w-full">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">
                      MOBILE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] placeholder-[#17171a]/40 font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors shadow-sm"
                    />
                  </div>

                  {/* Item 4: Email Address */}
                  <div className="flex flex-col text-left w-full">
                    <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="STUDENT@NRCM.AC.IN"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] placeholder-[#17171a]/40 font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors shadow-sm"
                    />
                  </div>
                </div>

                {/* Submit Button pushed further down with pt-8 sm:pt-10 */}
                <div className="w-full pt-8 sm:pt-10">
                  <button
                    type="submit"
                    className="w-full h-14 sm:h-16 rounded-2xl bg-[#e50914] text-white font-mono text-sm sm:text-base font-bold tracking-widest uppercase hover:bg-red-700 transition-all cursor-pointer border-4 border-[#17171a] shadow-xl flex items-center justify-center gap-3"
                  >
                    <span>SUBMIT</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Confirmation Screen */
            <div className="py-10 text-center space-y-5 w-full">
              <div className="w-20 h-20 rounded-full bg-[#e50914] text-white border-4 border-[#17171a] flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Check className="w-10 h-10 stroke-[4]" />
              </div>

              <span className="font-mono text-xs sm:text-sm text-red-600 font-bold tracking-[0.25em] uppercase block">
                EVENT PASS GENERATED
              </span>

              <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase text-[#17171a]">
                PASS CONFIRMED, {formData.name}
              </h2>

              <p className="font-mono text-xs sm:text-sm font-bold text-[#17171a]/80 max-w-lg mx-auto mb-8 uppercase leading-relaxed">
                YOUR OFFICIAL ENTRY PASS FOR <span className="text-red-600 font-black">NRCM.FMC INDUCTION 2026</span> HAS BEEN LOGGED FOR <span className="text-red-600 font-black">{formData.branch}</span>. SEE YOU AT MAIN AUDITORIUM!
              </p>

              <button
                onClick={() => { setSubmitted(false); onClose(); }}
                className="px-10 py-4 rounded-2xl bg-[#17171a] text-[#F0ECD9] font-mono text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors border-4 border-[#17171a] cursor-pointer shadow-lg"
              >
                DONE — CLOSE PASS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

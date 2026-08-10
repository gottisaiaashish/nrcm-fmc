import React, { useState } from 'react';
import FilmObjectsCanvas from './3d/FilmObjectsCanvas';
import { Ticket, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TheClub() {
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    branch: 'CSE',
    mobile: '',
    email: '',
  });

  const disciplines = [
    { num: '01', name: 'FILMMAKING' },
    { num: '02', name: 'CINEMATOGRAPHY' },
    { num: '03', name: 'STORYTELLING' },
    { num: '04', name: 'EDITING' },
    { num: '05', name: 'SOUND & DESIGN' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistered(true);
  };

  return (
    <section id="club" className="relative py-24 md:py-36 bg-black text-white overflow-hidden border-b border-zinc-900">
      {/* 3D Floating Props Canvas */}
      <FilmObjectsCanvas />

      {/* Red Ambient Glow */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-[2px] bg-red-600 inline-block" />
          <span className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase">
            SECTION 01 // THE CREATIVE
          </span>
        </div>

        {/* Manifesto Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Column: Typography */}
          <div className="lg:col-span-6">
            <h2 className="font-display text-fluid-hero font-black tracking-tighter uppercase leading-[0.88] text-white mb-8">
              THE <br />
              <span className="font-serif italic font-normal text-red-600 block text-fluid-editorial">
                CLUB
              </span>
            </h2>

            <p className="font-sans text-lg sm:text-2xl text-zinc-300 font-light leading-relaxed tracking-tight border-l-2 border-red-600 pl-6 my-8">
              NRCM Film Making Club is an independent creative collective where students explore filmmaking, cinematography, storytelling, editing, sound, and visual design.
            </p>

            <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest pt-2">
              // CINEMATIC MANIFESTO: STORIES ARE NOT WRITTEN; THEY ARE CAPTURED FRAME BY FRAME.
            </div>
          </div>

          {/* Right Column: Cinematic Media Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80"
                alt="NRCM Film Studio"
                className="w-full h-full object-cover filter contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-red-950/20 mix-blend-color-dodge" />

              {/* Red Corner Accent Lines */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-red-600 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-red-600 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Unique Crew Registration Box integrated cleanly inside Section 01 */}
        <div className="mb-24">
          <div className="relative rounded-3xl bg-zinc-950 border border-red-900/40 p-8 sm:p-12 shadow-[0_0_50px_rgba(229,9,20,0.2)] backdrop-blur-2xl red-frame-border overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

            {!registered ? (
              <div>
                <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 border border-red-600/50 flex items-center justify-center">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-red-500 tracking-[0.25em] uppercase block">
                        INDUCTION RECRUITMENT 2026
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                        REGISTER FOR CREW <span className="text-red-600">PASS</span>
                      </h3>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 border border-zinc-800 px-3 py-1 rounded bg-zinc-900">
                    LIMITED SEATS // NRCM.FMC
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-2">
                        // 01. FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aashish Gotti"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-2">
                        // 02. BRANCH / DEPT *
                      </label>
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 transition-colors"
                      >
                        <option value="CSE">CSE — Computer Science</option>
                        <option value="ECE">ECE — Electronics & Comm</option>
                        <option value="IT">IT — Information Tech</option>
                        <option value="CSM/CSD">CSM / CSD — AI & Data</option>
                        <option value="MECH">MECH — Mechanical</option>
                        <option value="CIVIL">CIVIL — Civil Engg</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-2">
                        // 03. MOBILE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-2">
                        // 04. EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="student@nrcm.ac.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white font-mono text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_35px_#ff1e27] transition-all duration-300 flex items-center justify-center gap-2 border border-red-400/40 cursor-pointer"
                  >
                    CLAIM CREW PASS FOR INDUCTION 2026
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 border border-red-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_#ff1e27]">
                  <Check className="w-8 h-8" />
                </div>

                <span className="font-mono text-xs text-red-500 tracking-widest uppercase block mb-1">
                  APPLICATION RECEIVED
                </span>

                <h4 className="font-display text-2xl sm:text-3xl font-black uppercase text-white mb-2">
                  APPLICATION UNDER REVIEW, {formData.name}
                </h4>

                <p className="font-sans text-xs text-zinc-400 max-w-md mx-auto mb-6">
                  Thank you for applying! Your application for <span className="text-white font-bold">NRCM.FMC Crew</span> has been received for branch <span className="text-red-500 font-bold">{formData.branch}</span>. Our team will review your details and get in touch with you!
                </p>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-red-900/40 max-w-sm mx-auto font-mono text-xs space-y-2 mb-6 text-left">
                  <div className="flex justify-between text-zinc-400">
                    <span>APP ID:</span>
                    <span className="text-red-500 font-bold">FMC-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>MOBILE:</span>
                    <span className="text-white">{formData.mobile}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>STATUS:</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> UNDER REVIEW
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setRegistered(false)}
                  className="px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs hover:border-red-600 hover:text-white transition-colors"
                >
                  REGISTER ANOTHER MEMBER
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Monospace Discipline List */}
        <div className="border-t border-zinc-900 pt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {disciplines.map((item) => (
              <div key={item.name} className="group border-l border-zinc-900 pl-4 hover:border-red-600 transition-colors">
                <span className="font-mono text-[10px] text-red-500 block mb-1">{item.num} // DISCIPLINE</span>
                <span className="font-display text-sm font-bold tracking-wide text-zinc-400 group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

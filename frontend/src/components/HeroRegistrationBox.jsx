import React, { useState } from 'react';
import { Ticket, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HeroRegistrationBox() {
  const [submitted, setSubmitted] = useState(false);
  const [isClosed, setIsClosed] = useState(() => {
    return localStorage.getItem('nrcmfmc_recruitment_open') === 'false';
  });

  React.useEffect(() => {
    const handleStatusChange = () => {
      setIsClosed(localStorage.getItem('nrcmfmc_recruitment_open') === 'false');
    };
    window.addEventListener('storage', handleStatusChange);
    window.addEventListener('recruitment_status_changed', handleStatusChange);
    return () => {
      window.removeEventListener('storage', handleStatusChange);
      window.removeEventListener('recruitment_status_changed', handleStatusChange);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    branch: 'CSE',
    year: '1ST YEAR',
    mobile: '',
    email: '',
  });

  const handleSubmit = (e) => {
    if (isClosed) return;
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative py-12 md:py-20 bg-black text-white overflow-hidden border-b border-zinc-900">
      {/* Subtle Ambient Red Glow behind box */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Unique Red Frame Registration Card */}
        <div className="relative rounded-3xl bg-zinc-950/90 border border-red-900/50 p-8 sm:p-12 shadow-[0_0_60px_rgba(229,9,20,0.25)] backdrop-blur-2xl red-frame-border overflow-hidden">
          
          {/* Subtle Top Red Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_#ff1e27]" />

          {isClosed ? (
            <div className="text-center py-10 px-4">
              <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-red-600 mb-3 tracking-tight">
                SORRY, RECRUITMENT HAS BEEN CLOSED
              </h3>
              <p className="font-mono text-xs sm:text-sm text-zinc-400 uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
                Applications for NRCM Film Making Club Recruitment 2026 are currently closed. Thank you for your interest!
              </p>
            </div>
          ) : !submitted ? (
            <div>
              {/* Box Subhead */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 border border-red-600/50 flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-red-500 tracking-[0.25em] uppercase block">
                      CREW RECRUITMENT 2026
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight uppercase text-white">
                      REGISTER FOR INDUCTION <span className="text-red-600">PASS</span>
                    </h3>
                  </div>
                </div>

                <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 border border-zinc-800 px-3 py-1 rounded bg-zinc-900">
                  LIMITED SEATS // NRCM.FMC
                </span>
              </div>

              {/* Form Grid */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
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
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 transition-colors shadow-inner"
                    />
                  </div>

                  {/* Branch */}
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
                      <option value="ECE">ECE — Electronics &amp; Comm</option>
                      <option value="EEE">EEE — Electrical &amp; Electronics</option>
                      <option value="AIML">AIML — AI &amp; Machine Learning</option>
                      <option value="CYBER SECURITY">Cyber Security</option>

                      <option value="IT">IT — Information Tech</option>
                      <option value="MECH">MECH — Mechanical</option>
                      <option value="CIVIL">CIVIL — Civil Engg</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-2">
                      // 03. YEAR OF STUDY *
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 transition-colors"
                    >
                      <option value="1ST YEAR">1ST YEAR (I YEAR)</option>
                      <option value="2ND YEAR">2ND YEAR (II YEAR)</option>
                      <option value="3RD YEAR">3RD YEAR (III YEAR)</option>
                      <option value="4TH YEAR">4TH YEAR (IV YEAR)</option>
                    </select>
                  </div>

                  {/* Mobile No */}
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
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 transition-colors shadow-inner"
                    />
                  </div>

                  {/* Email */}
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
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 transition-colors shadow-inner"
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white font-mono text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_35px_#ff1e27] transition-all duration-300 flex items-center justify-center gap-2 border border-red-400/40 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  CLAIM CREW PASS FOR INDUCTION 2026
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Success State */
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
                Thank you for applying! Your application for <span className="text-white font-bold">NRCM.FMC Crew</span> has been received for branch <span className="text-red-500 font-bold">{formData.branch}</span>. Our team will review your details and contact you soon!
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
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs hover:border-red-600 hover:text-white transition-colors"
              >
                REGISTER ANOTHER MEMBER
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

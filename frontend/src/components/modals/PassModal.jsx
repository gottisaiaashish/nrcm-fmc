import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

export default function PassModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    branch: 'CSE',
    interestedArea: 'Cinematography / Camera',
    previousExperience: 'No',
    portfolioLink: '',
    whyJoin: '',
    whatYouBring: '',
    instagramId: ''
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
      existing.unshift({ _id: `FMC-APP-${Date.now()}`, passId: `FMC-APP-${Date.now()}`, ...formData, createdAt: new Date().toISOString() });
      localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(existing));
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      existing.unshift({ _id: `FMC-APP-${Date.now()}`, passId: `FMC-APP-${Date.now()}`, ...formData, createdAt: new Date().toISOString() });
      localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(existing));
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const inputClass = "w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] placeholder-[#17171a]/40 font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors shadow-sm";
  const selectClass = "w-full h-14 px-5 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors cursor-pointer shadow-sm";
  const textareaClass = "w-full min-h-[90px] p-4 rounded-2xl bg-[#EBE7D3] border-4 border-[#17171a] text-[#17171a] placeholder-[#17171a]/40 font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:bg-white transition-colors shadow-sm resize-y";

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
                JOIN THE CREW
              </h1>
              <p className="font-mono text-xs font-bold text-[#17171a]/70 uppercase tracking-widest leading-relaxed">
                OFFICIAL NRCM FILM MAKING CLUB RECRUITMENT APPLICATION
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Full Name */}
              <div className="flex flex-col text-left w-full">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">1. FULL NAME *</label>
                <input type="text" required placeholder="ENTER YOUR FULL NAME" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
              </div>

              {/* 2 & 3. Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col text-left w-full">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">2. PHONE NUMBER *</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })} className={inputClass} />
                </div>
                <div className="flex flex-col text-left w-full">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">3. EMAIL ID *</label>
                  <input type="email" required placeholder="STUDENT@NRCM.AC.IN" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                </div>
              </div>

              {/* 4. Branch & Year */}
              <div className="flex flex-col text-left w-full">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">4. BRANCH &amp; YEAR *</label>
                <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} className={selectClass}>
                  <option value="CSE">CSE — COMPUTER SCIENCE</option>
                  <option value="ECE">ECE — ELECTRONICS &amp; COMM</option>
                  <option value="EEE">EEE — ELECTRICAL &amp; ELECTRONICS</option>
                  <option value="AIML">AIML — AI &amp; MACHINE LEARNING</option>
                  <option value="CYBER SECURITY">CYBER SECURITY</option>
                  <option value="CIVIL">CIVIL — CIVIL ENGG</option>
                  <option value="MECH">MECH — MECHANICAL</option>
                  <option value="IT">IT — INFORMATION TECH</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              {/* 5. Interested Area */}
              <div className="flex flex-col text-left w-full">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">5. WHICH AREA ARE YOU INTERESTED IN? *</label>
                <select value={formData.interestedArea} onChange={e => setFormData({ ...formData, interestedArea: e.target.value })} className={selectClass}>
                  <option value="Cinematography / Camera">CINEMATOGRAPHY / CAMERA</option>
                  <option value="Direction">DIRECTION</option>
                  <option value="Story & Screenwriting">STORY &amp; SCREENWRITING</option>
                  <option value="Video Editing">VIDEO EDITING</option>
                  <option value="Photography">PHOTOGRAPHY</option>
                  <option value="Acting">ACTING</option>
                  <option value="Graphic / Poster Design">GRAPHIC / POSTER DESIGN</option>
                  <option value="Content Creation">CONTENT CREATION</option>
                  <option value="Marketing & PR">MARKETING &amp; PR</option>
                  <option value="Production / Event Management">PRODUCTION / EVENT MANAGEMENT</option>
                </select>
              </div>

              {/* 6. Previous Experience */}
              <div className="flex flex-col text-left w-full">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">6. DO YOU HAVE ANY PREVIOUS EXPERIENCE? *</label>
                <select value={formData.previousExperience} onChange={e => setFormData({ ...formData, previousExperience: e.target.value })} className={selectClass}>
                  <option value="No">NO</option>
                  <option value="Yes">YES</option>
                  <option value="A little / Beginner">A LITTLE / BEGINNER</option>
                </select>
              </div>

              {/* 7. Portfolio Link */}
              <div className="flex flex-col text-left w-full">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">
                  7. IF YES, SHARE YOUR WORK / PORTFOLIO <span className="text-[#17171a]/50 text-[10px]">(OPTIONAL)</span>
                </label>
                <input type="text" placeholder="Instagram / YouTube / Drive / Portfolio link" value={formData.portfolioLink}
                  onChange={e => setFormData({ ...formData, portfolioLink: e.target.value })} className={inputClass} />
              </div>

              {/* 8. Why Join FMC */}
              <div className="flex flex-col text-left w-full">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">8. WHY DO YOU WANT TO JOIN FMC?</label>
                <textarea placeholder="Share why you want to be a part of FMC..." value={formData.whyJoin}
                  onChange={e => setFormData({ ...formData, whyJoin: e.target.value })} className={textareaClass} />
              </div>

              {/* 9. What Can You Bring */}
              <div className="flex flex-col text-left w-full">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">9. WHAT CAN YOU BRING TO FMC?</label>
                <textarea placeholder="Examples: Creativity, editing, ideas, leadership, photography, acting, etc." value={formData.whatYouBring}
                  onChange={e => setFormData({ ...formData, whatYouBring: e.target.value })} className={textareaClass} />
              </div>

              {/* 10. Instagram ID */}
              <div className="flex flex-col text-left w-full">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#17171a] mb-2">
                  10. INSTAGRAM ID <span className="text-[#17171a]/50 text-[10px]">(Useful to identify/contact students)</span>
                </label>
                <input type="text" placeholder="@username" value={formData.instagramId}
                  onChange={e => setFormData({ ...formData, instagramId: e.target.value })} className={inputClass} />
              </div>

              <div className="pt-4">
                <button
                  type="submit" disabled={loading}
                  className="w-full h-14 rounded-2xl bg-[#e50914] text-white font-mono text-sm font-bold tracking-widest uppercase hover:bg-red-700 transition-all cursor-pointer border-4 border-[#17171a] shadow-xl flex items-center justify-center gap-3"
                >
                  <span>{loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}</span>
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
              APPLICATION RECEIVED
            </span>

            <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase text-[#17171a] leading-tight">
              APPLICATION UNDER REVIEW,<br />{formData.name}
            </h2>

            <p className="font-mono text-xs sm:text-sm font-bold text-[#17171a]/80 max-w-xs sm:max-w-md mx-auto uppercase leading-relaxed">
              THANK YOU FOR APPLYING! YOUR RECRUITMENT APPLICATION FOR <span className="text-red-600 font-black">NRCM.FMC</span> HAS BEEN RECORDED FOR <span className="text-red-600 font-black">{formData.branch}</span>. OUR TEAM WILL REVIEW YOUR RESPONSE AND CONTACT YOU SOON!
            </p>

            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-4 px-10 py-4 rounded-2xl bg-[#17171a] text-[#F0ECD9] font-mono text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors border-4 border-[#17171a] cursor-pointer shadow-lg"
            >
              DONE — CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

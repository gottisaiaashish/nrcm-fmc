import React, { useState } from 'react';
import { Share2, Globe, Music, Film } from 'lucide-react';

export default function FooterWorkingStiff({ onOpenPassModal }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="relative bg-[#0f0f11] text-[#F0ECD9] pt-24 pb-16 px-6 md:px-12 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Footer Links */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-display text-3xl font-black uppercase text-[#F0ECD9] tracking-tight">
              NRCM.FMC<span className="text-red-600 font-serif italic">.</span>
            </h3>
            <div className="flex flex-wrap gap-8 font-mono text-sm font-semibold tracking-widest uppercase">
              <a href="#work" className="hover:text-red-500 transition-colors">Work</a>
              <a href="#club" className="hover:text-red-500 transition-colors">Club</a>
              <a href="#events" className="hover:text-red-500 transition-colors">Events</a>
              <a href="#join" className="hover:text-red-500 transition-colors">Join</a>
            </div>
            <p className="font-sans text-xs text-zinc-500 max-w-sm">
              NRCM FILM MAKING CLUB — NARSIMHA REDDY COLLEGE OF ENGINEERING & MANAGEMENT
            </p>
          </div>

          {/* Right Column: "Reach Out" Heading + Curved Arrow + 3D Trigger Button */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 bg-zinc-950 p-8 sm:p-12 rounded-3xl border border-zinc-800">
            <div>
              <span className="font-mono text-xs text-red-500 tracking-widest uppercase block mb-2">
                // CREW INDUCTION & INQUIRIES
              </span>
              <h2 className="font-display f-120 uppercase tracking-tighter leading-none text-[#F0ECD9]">
                Reach <br />
                <span className="text-red-600 font-serif italic font-normal">out</span>
              </h2>
            </div>

            {/* Curved Arrow & 3D Interactive Yellow/Red Button */}
            <div className="flex items-center gap-6">
              <svg className="w-16 h-12 text-zinc-600 hidden sm:block" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 10 10 Q 50 50 90 20" strokeLinecap="round" />
                <path d="M 80 15 L 90 20 L 85 30" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div
                onClick={onOpenPassModal}
                className="ws-3d-button flex items-center justify-center rounded-2xl bg-amber-400 border-4 border-amber-500 text-black font-display font-black text-center shadow-[0_8px_0_#b45309] active:shadow-none active:translate-y-2 transition-all p-3 cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase tracking-wider font-bold">CLAIM</span>
                  <span className="text-lg uppercase font-black text-red-600">PASS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Grid: Social Links & Newsletter Signup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pt-12 border-t border-zinc-800/80">
          {/* Left: Social Media */}
          <div className="lg:col-span-6 space-y-4">
            <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
              FOLLOW THE COLLECTIVE
            </h4>
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-zinc-300">
              <a href="https://instagram.com/nrcm.fmc" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <Share2 className="w-4 h-4 text-red-500" />
                <span>Instagram</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <Globe className="w-4 h-4 text-red-500" />
                <span>LinkedIn</span>
              </a>
              <a href="https://spotify.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <Music className="w-4 h-4 text-red-500" />
                <span>Spotify</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <Film className="w-4 h-4 text-red-500" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Right: Working Stiff Style Newsletter Subscription */}
          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="space-y-2">
              <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                Sign up for updates {subscribed && <span className="text-red-500 font-bold">/ Subscription successful!</span>}
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[#F0ECD9] font-mono text-xs focus:outline-none focus:border-red-600 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-red-500 transition-colors cursor-pointer"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sub-Footer Copyright */}
        <div className="pt-12 mt-12 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-zinc-600 gap-4">
          <div>WEBSITE BY NRCM.FMC DIGITAL STUDIO</div>
          <div>© 2026 NRCM FILM MAKING CLUB. ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </footer>
  );
}

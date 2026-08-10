import React, { useState } from 'react';
import { Share2, Globe, Music, Film, ArrowUpRight } from 'lucide-react';

export default function FooterWorkingStiff({ onOpenPassModal }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="relative bg-[#0f0f11] text-[#F0ECD9] pt-16 pb-12 px-6 md:px-12 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Footer Layout — 2 Clean Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-zinc-800/80">
          {/* Left Column: Brand & Nav Links */}
          <div className="lg:col-span-6 space-y-6">
            <a href="#" className="inline-block group">
              <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-[#F0ECD9] tracking-tighter group-hover:text-red-500 transition-colors">
                NRCM.FMC<span className="text-red-600 font-serif italic">.</span>
              </h3>
            </a>

            {/* Nav Links */}
            <div className="flex flex-wrap gap-8 font-mono text-sm font-semibold tracking-widest uppercase">
              <a href="#work" className="hover:text-red-500 transition-colors">Work</a>
              <a href="#club" className="hover:text-red-500 transition-colors">Club</a>
              <a href="#events" className="hover:text-red-500 transition-colors">Events</a>
              <a href="#join" className="hover:text-red-500 transition-colors">Join</a>
            </div>

            <p className="font-mono text-xs text-zinc-500 max-w-md leading-relaxed uppercase">
              NRCM FILM MAKING CLUB — NARSIMHA REDDY COLLEGE OF ENGINEERING & MANAGEMENT
            </p>
          </div>

          {/* Right Column: Newsletter Subscription */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 lg:pl-6">
            <div>
              <span className="font-mono text-xs text-red-500 tracking-widest uppercase font-semibold block mb-2">
                // STAY CONNECTED
              </span>
              <h4 className="font-display text-2xl font-bold uppercase text-[#F0ECD9] tracking-tight">
                SUBSCRIBE FOR UPDATES
              </h4>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-[#F0ECD9] placeholder-zinc-500 font-mono text-xs font-semibold focus:outline-none focus:border-red-600 transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-red-500 transition-colors shrink-0 cursor-pointer shadow-md"
                >
                  SUBSCRIBE
                </button>
              </div>
              {subscribed && (
                <p className="font-mono text-xs text-red-500 font-bold uppercase tracking-wider">
                  ✓ THANK YOU FOR SUBSCRIBING!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Socials & Pass CTA Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-900">
          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span className="text-zinc-600 me-2">// FOLLOW:</span>
            <a href="https://instagram.com/nrcm.fmc" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Share2 className="w-3.5 h-3.5 text-red-500" />
              <span>INSTAGRAM</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Globe className="w-3.5 h-3.5 text-red-500" />
              <span>LINKEDIN</span>
            </a>
            <a href="https://spotify.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Music className="w-3.5 h-3.5 text-red-500" />
              <span>SPOTIFY</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Film className="w-3.5 h-3.5 text-red-500" />
              <span>YOUTUBE</span>
            </a>
          </div>

          {/* Quick Event Pass Trigger */}
          <button
            onClick={onOpenPassModal}
            className="font-mono text-xs font-bold uppercase text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>GET EVENT PASS</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Footer Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-zinc-500 font-semibold uppercase tracking-widest gap-3 text-center sm:text-left">
          <div>WEBSITE BY NRCM.FMC DIGITAL STUDIO</div>
          <div>© 2026 NRCM FILM MAKING CLUB. ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';

const InstagramIcon = () => (
  <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function FooterWorkingStiff() {
  const instagramUrl = "https://www.instagram.com/nrcm.fmc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
  const youtubeUrl = "https://youtube.com/@nrcmfilmmakingclub?si=tO7FV3lKgBN2R-97";

  return (
    <footer className="w-full bg-[#0f0f11] text-[#F0ECD9] py-16 px-6 sm:px-10 md:px-16 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Main Footer Layout — Perfectly Balanced Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-zinc-800/80">
          {/* Left Block: Logo, Nav & Description */}
          <div className="space-y-4 max-w-xl">
            <a href="#" className="inline-block group">
              <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#F0ECD9] tracking-tighter group-hover:text-red-500 transition-colors">
                NRCM.FMC<span className="text-red-600 font-serif italic">.</span>
              </h3>
            </a>

            {/* Navigation Links */}
            <div className="flex flex-wrap gap-6 sm:gap-8 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase text-[#F0ECD9]">
              <a href="#work" className="hover:text-red-500 transition-colors">WORK</a>
              <a href="#club" className="hover:text-red-500 transition-colors">CLUB</a>
              <a href="#events" className="hover:text-red-500 transition-colors">EVENTS</a>
              <a href="#join" className="hover:text-red-500 transition-colors">JOIN</a>
            </div>

            <p className="font-mono text-xs text-zinc-500 leading-relaxed uppercase">
              NRCM FILM MAKING CLUB — NARSIMHA REDDY COLLEGE OF ENGINEERING & MANAGEMENT
            </p>
          </div>

          {/* Right Block: Only Instagram & YouTube Social Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="text-zinc-500 font-mono text-xs">// OFFICIAL SOCIALS:</span>
            
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-[#F0ECD9] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer shadow-md group"
            >
              <InstagramIcon />
              <span>INSTAGRAM</span>
            </a>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-[#F0ECD9] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer shadow-md group"
            >
              <YoutubeIcon />
              <span>YOUTUBE</span>
            </a>
          </div>
        </div>

        {/* Sub-Footer Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] sm:text-xs text-zinc-500 font-semibold uppercase tracking-widest gap-4 text-center sm:text-left">
          <div>WEBSITE BY NRCM.FMC DIGITAL STUDIO</div>
          <div>© 2026 NRCM FILM MAKING CLUB. ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </footer>
  );
}

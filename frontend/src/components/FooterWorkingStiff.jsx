import React from 'react';
import { Lock, Mail, Phone, ArrowUpRight, MapPin, Sparkles } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);


export default function FooterWorkingStiff({ onOpenAdminLogin, onOpenPassModal }) {
  const instagramUrl = "https://www.instagram.com/nrcm.fmc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
  const youtubeUrl = "https://youtube.com/@nrcmfilmmakingclub?si=tO7FV3lKgBN2R-97";

  return (
    <footer className="site-footer">
      <div className="footer-container space-y-12">
        
        {/* Main 4 Equal Grid Columns */}
        <div className="footer-grid">
          
          {/* Column 1: Brand & Logo */}
          <div className="footer-column space-y-4">
            <button
              onClick={onOpenAdminLogin}
              title="Click to access Admin Portal"
              className="inline-block group border-none bg-transparent text-left cursor-pointer p-0"
            >
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#F0ECD9] tracking-tighter group-hover:text-red-500 transition-colors flex items-center gap-1.5 leading-none whitespace-nowrap">
                NRCM.FMC<span className="text-red-600 font-serif italic">.</span>
                <Lock className="w-4 h-4 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity" />
              </h3>
            </button>

            <p className="font-mono text-xs font-bold text-red-500 tracking-[0.2em] uppercase">
              NRCM FILM MAKING CLUB
            </p>

            <p className="font-sans text-xs text-zinc-400 leading-relaxed uppercase">
              NARSIMHA REDDY COLLEGE OF ENGINEERING & MANAGEMENT
            </p>


          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-column space-y-4">
            <h4 className="footer-header">
              NAVIGATION
            </h4>
            <ul className="space-y-3 font-mono text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              <li>
                <a href="#work" className="hover:text-red-500 hover:translate-x-1 transition-all inline-block">
                  WORK
                </a>
              </li>
              <li>
                <a href="#club" className="hover:text-red-500 hover:translate-x-1 transition-all inline-block">
                  THE CLUB
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-red-500 hover:translate-x-1 transition-all inline-block">
                  EVENTS
                </a>
              </li>
              <li>
                <a href="#join" className="hover:text-red-500 hover:translate-x-1 transition-all inline-block">
                  JOIN CREW
                </a>
              </li>
              {onOpenPassModal && (
                <li>
                  <button 
                    onClick={onOpenPassModal}
                    className="hover:text-red-500 hover:translate-x-1 transition-all text-left uppercase cursor-pointer"
                  >
                    GET FMC PASS
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="footer-column space-y-4">
            <h4 className="footer-header">
              CONTACT US
            </h4>
            <div className="space-y-5 font-mono text-xs sm:text-sm text-zinc-400">
              {/* Gmail */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">
                  GMAIL
                </span>
                <a 
                  href="mailto:nrcmfmc@gmail.com" 
                  className="hover:text-red-500 transition-colors flex items-center gap-2.5 text-zinc-200 group"
                >
                  <Mail className="w-4 h-4 text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-mono lowercase text-xs sm:text-sm">nrcmfmc@gmail.com</span>
                </a>
              </div>

              {/* Phone Numbers */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">
                  MOBILE
                </span>
                <div className="space-y-2">
                  <a 
                    href="tel:8247758835" 
                    className="hover:text-red-500 transition-colors flex items-center gap-2.5 text-zinc-200 group"
                  >
                    <Phone className="w-4 h-4 text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono tracking-wider text-xs sm:text-sm">+91 82477 58835</span>
                  </a>
                  <a 
                    href="tel:7997639659" 
                    className="hover:text-red-500 transition-colors flex items-center gap-2.5 text-zinc-200 group"
                  >
                    <Phone className="w-4 h-4 text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono tracking-wider text-xs sm:text-sm">+91 79976 39659</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Official Socials */}
          <div className="footer-column space-y-4">
            <h4 className="footer-header">
              OFFICIAL SOCIALS
            </h4>
            <div className="space-y-5 font-mono text-xs sm:text-sm">
              {/* Instagram */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">
                  INSTAGRAM
                </span>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-red-500 transition-colors flex items-center gap-2.5 text-zinc-200 group"
                >
                  <InstagramIcon className="w-4 h-4 text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">@nrcm.fmc</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-500 transition-colors" />
                </a>
              </div>

              {/* YouTube */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">
                  YOUTUBE
                </span>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-red-500 transition-colors flex items-center gap-2.5 text-zinc-200 group"
                >
                  <YoutubeIcon className="w-4 h-4 text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium whitespace-nowrap">NRCM FilmMaking Club</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-500 transition-colors" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-Footer Copyright Status Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-zinc-500 font-semibold uppercase tracking-widest text-center sm:text-left gap-4 pt-2">
          <div>© 2026 NRCM FILM MAKING CLUB. ALL RIGHTS RESERVED.</div>
          <div className="text-[10px] text-zinc-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
            <span>NRCM CREATIVE MEDIA CELL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}


import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onOpenPassModal, onOpenJoinModal }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Club', href: '#club' },
    { label: 'Events', href: '#events' },
    { label: 'Join', href: '#join' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f11]/90 backdrop-blur-md border-b border-zinc-800/80 py-4 px-6 md:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Working Stiff Style */}
          <a href="#" className="flex flex-col items-start group focus:outline-none">
            <span className="font-display text-xl md:text-2xl font-black tracking-tighter text-[#F0ECD9] group-hover:text-red-500 transition-colors">
              NRCM.FMC<span className="text-red-600 font-serif italic">.</span>
            </span>
            <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
              FILMMAKING CLUB
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-sm font-semibold text-[#F0ECD9]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-red-500 transition-colors uppercase tracking-widest relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions: PASS CTA & Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPassModal}
              className="px-5 py-2 rounded-full bg-red-600 text-white font-mono text-xs font-bold tracking-widest uppercase hover:bg-red-500 hover:shadow-[0_0_20px_#ff1e27] transition-all flex items-center gap-1.5 border border-red-500/40 cursor-pointer"
            >
              PASS
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#F0ECD9] hover:text-red-500 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0f0f11]/98 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between p-8 md:p-16 ${
          menuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-6'
        }`}
      >
        <div className="pt-20 max-w-5xl mx-auto w-full">
          <p className="font-mono text-xs text-red-500 tracking-widest uppercase mb-8">
            // MAIN NAVIGATION
          </p>
          <div className="space-y-6">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-zinc-900 pb-4 hover:border-red-600 transition-colors"
              >
                <span className="font-display text-4xl font-black tracking-tighter text-[#F0ECD9] group-hover:text-red-500 transition-colors uppercase">
                  {link.label}
                </span>
                <span className="font-mono text-xs text-zinc-500">0{idx + 1}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full pt-8 border-t border-zinc-900 flex items-center justify-between font-mono text-xs text-zinc-500">
          <div>NRCM FILM MAKING CLUB</div>
          <button onClick={() => { setMenuOpen(false); onOpenJoinModal(); }} className="hover:text-red-500 uppercase">
            JOIN CREW
          </button>
        </div>
      </div>
    </>
  );
}

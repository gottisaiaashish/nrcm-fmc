import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Lock, Ticket, Clock } from 'lucide-react';

export default function Navbar({ onOpenPassModal, onOpenJoinModal, onOpenAdminLogin }) {
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
          {/* Logo NRCM.FMC — Clicking triggers Admin Portal Login */}
          <button
            onClick={onOpenAdminLogin}
            title="Click to access Admin Portal"
            className="flex flex-col items-start group focus:outline-none cursor-pointer border-none bg-transparent text-left"
          >
            <span className="font-display text-xl md:text-2xl font-black tracking-tighter text-[#F0ECD9] group-hover:text-red-500 transition-colors flex items-center gap-1">
              NRCM.FMC<span className="text-red-600 font-serif italic">.</span>
              <Lock className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity" />
            </span>
            <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
              FILMMAKING CLUB
            </span>
          </button>

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

            <a
              href="/booknow"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-all text-xs font-extrabold uppercase tracking-wider shadow-lg"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Bookings Opening Soon</span>
            </a>
          </nav>

          {/* Actions: Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-[#F0ECD9] hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
        <div className="pt-28 sm:pt-24 max-w-5xl mx-auto w-full">
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
          <button onClick={() => { setMenuOpen(false); onOpenAdminLogin(); }} className="hover:text-red-500 uppercase flex items-center gap-1.5 cursor-pointer">
            <Lock className="w-3.5 h-3.5 text-red-500" />
            <span>ADMIN PORTAL</span>
          </button>
          <button onClick={() => { setMenuOpen(false); onOpenJoinModal(); }} className="hover:text-red-500 uppercase cursor-pointer">
            JOIN CREW
          </button>
        </div>
      </div>
    </>
  );
}

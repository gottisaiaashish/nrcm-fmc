import React from 'react';

export default function Footer() {
  return (
    <footer className="relative py-28 bg-black text-white overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Animated Subtle Red Light Beam Line */}
      <div className="w-full max-w-xl h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent mb-16 shadow-[0_0_15px_#ff1e27] animate-pulse" />

      {/* Main Centered Branding */}
      <div className="space-y-4 max-w-2xl px-6">
        <h3 className="font-display text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase">
          NRCM<span className="text-red-600">.</span>FMC
        </h3>

        <p className="font-mono text-xs text-zinc-400 tracking-[0.25em] uppercase">
          NRCM FILM MAKING CLUB
        </p>

        <p className="font-sans text-xs text-zinc-600 tracking-wider uppercase font-light">
          NARSIMHA REDDY COLLEGE OF ENGINEERING & MANAGEMENT
        </p>

        <div className="pt-8 flex flex-col items-center gap-3">
          <a
            href="https://instagram.com/nrcm.fmc"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-zinc-400 hover:text-red-500 transition-colors tracking-widest uppercase border border-zinc-800 hover:border-red-600/50 px-5 py-2 rounded-full bg-zinc-950/80"
          >
            INSTAGRAM: @NRCM.FMC
          </a>
          <span className="font-mono text-[10px] text-zinc-700 tracking-widest pt-4">
            © 2026 NRCM.FMC — ALL RIGHTS RESERVED. STORIES BEGIN HERE.
          </span>
        </div>
      </div>

      {/* Bottom Fade to Black Mask */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </footer>
  );
}

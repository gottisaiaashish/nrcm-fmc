import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function HeroWorkingStiff() {
  return (
    <section id="hero" className="relative h-screen w-full pt-20 pb-6 bg-[#0f0f11] text-[#F0ECD9] flex flex-col justify-between items-center border-b border-zinc-800/80 px-6 md:px-12 overflow-hidden">
      {/* Red Ambient Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Working Stiff Typography Header — PERFECTLY CENTERED IN HERO VIEWPORT */}
      <div className="flex-1 flex flex-col justify-center items-center text-center my-auto relative z-10 py-2">
        <h1 className="font-display uppercase tracking-tighter leading-none select-none">
          <div className="f-120 text-[#F0ECD9] tracking-tight">Crafting</div>
          <div className="f-240 text-red-600 font-serif italic font-normal my-1 drop-shadow-[0_0_40px_rgba(229,9,20,0.5)]">
            Cinema
          </div>
          <div className="f-120 text-[#F0ECD9] tracking-tight">Since 2026</div>
        </h1>
      </div>

      {/* Hero Bottom Row: Scroll, Paragraph, Copyright */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-4 border-t border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Scroll Down */}
          <div className="hidden md:flex md:col-span-3 items-center gap-2 font-mono text-xs text-zinc-500 uppercase tracking-widest">
            <ArrowDown className="w-4 h-4 text-red-500 animate-bounce" />
            <span>SCROLL DOWN</span>
          </div>

          {/* Center Paragraph */}
          <div className="md:col-span-6 text-center">
            <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
              We don’t do this alone. We roll with top-tier student filmmakers, directors, cinematographers, and editors — because we believe every story deserves nothing less than cinematic excellence.
            </p>
          </div>

          {/* Right Copyright */}
          <div className="hidden md:block md:col-span-3 text-right font-mono text-xs text-zinc-500 uppercase tracking-widest">
            © 2026 NRCM.FMC
          </div>
        </div>
      </div>
    </section>
  );
}

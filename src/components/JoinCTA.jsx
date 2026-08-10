import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function JoinCTA({ onOpenJoinModal }) {
  return (
    <section id="join" className="relative min-h-[90vh] py-36 md:py-52 bg-black text-white overflow-hidden flex items-center justify-center border-b border-zinc-900">
      {/* Deep Red Center Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 font-mono text-xs text-red-500 tracking-[0.3em] uppercase mb-6 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-900/50 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          SECTION 08 // MEMBERSHIP RECRUITMENT
        </span>

        {/* Viewport-Filling Statement Heading */}
        <h2 className="font-display text-fluid-hero font-black tracking-tighter uppercase mb-8 text-white leading-none">
          YOUR FIRST <br />
          <span className="font-serif italic font-normal text-red-600 text-fluid-editorial drop-shadow-[0_0_50px_rgba(229,9,20,0.7)] px-2 block my-2">
            FRAME
          </span>
          STARTS HERE<span className="text-red-600">.</span>
        </h2>

        <p className="font-sans text-lg sm:text-2xl text-zinc-300 font-light max-w-2xl mx-auto mb-12">
          Join the people who create, capture and tell stories. No prior gear or experience required — only vision and passion.
        </p>

        {/* Primary CTA Button */}
        <button
          onClick={onOpenJoinModal}
          className="group inline-flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white font-mono text-sm tracking-widest uppercase font-bold hover:shadow-[0_0_50px_#ff1e27] transition-all duration-500 transform hover:-translate-y-1 active:translate-y-0 border border-red-400/40"
        >
          JOIN THE CLUB
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}

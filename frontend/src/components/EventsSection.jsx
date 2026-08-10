import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function EventsSection({ onRegisterEvent }) {
  return (
    <section id="events" className="relative py-28 sm:py-40 lg:py-48 bg-[#0f0f11] text-white overflow-hidden border-b border-zinc-900 flex items-center justify-center">
      {/* Subtle Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 w-full relative z-10 my-6 sm:my-12">
        
        {/* Main Signature Recruitment Banner Card */}
        <div className="w-full bg-[#F0ECD9] text-[#17171a] border-4 border-[#17171a] rounded-3xl p-8 sm:p-14 md:p-18 text-center shadow-[10px_10px_0px_#e50914] relative overflow-hidden flex flex-col items-center justify-center">
          
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17171a] text-[#F0ECD9] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>RECRUITMENT 2026 // APPLICATIONS OPEN</span>
          </div>

          {/* Main Title */}
          <h2 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#17171a] leading-none mb-3">
            JOIN THE FMC CREW
          </h2>

          {/* Subtitle */}
          <p className="font-mono text-xs sm:text-sm font-bold text-red-600 uppercase tracking-[0.2em] mb-6">
            NRCM FILM MAKING CLUB · OFFICIAL RECRUITMENT
          </p>

          {/* Description */}
          <p className="font-sans text-sm sm:text-base font-medium text-[#17171a]/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Apply for Cinematography, Direction, Story &amp; Screenwriting, Video Editing, Photography, Acting, Poster Design, Content Creation, and Event Management.
          </p>

          {/* Centered Large Action CTA Button */}
          <button
            onClick={onRegisterEvent}
            className="w-full sm:w-auto px-10 sm:px-16 py-5 rounded-2xl bg-[#e50914] text-white font-mono text-sm sm:text-base font-black tracking-[0.15em] uppercase border-4 border-[#17171a] shadow-[5px_5px_0px_#17171a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#17171a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#17171a] transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <span>JOIN THE CREW</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>

          {/* Footer Subtext */}
          <span className="font-mono text-[11px] font-bold text-[#17171a]/50 uppercase tracking-widest mt-6 block">
            NO PRIOR EXPERIENCE REQUIRED · ALL BRANCHES &amp; YEARS ELIGIBLE
          </span>

        </div>
      </div>
    </section>
  );
}

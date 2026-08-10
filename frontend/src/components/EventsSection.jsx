import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function EventsSection({ onRegisterEvent }) {
  return (
    <section id="events" className="relative min-h-screen w-full py-32 md:py-48 my-12 md:my-24 bg-[#0f0f11] text-white overflow-hidden border-b border-zinc-900 flex items-center justify-center">
      {/* Subtle Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-red-600/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 w-full relative z-10 my-auto">
        
        {/* Main Signature Recruitment Banner Card */}
        <div className="w-full bg-[#F0ECD9] text-[#17171a] border-4 border-[#17171a] rounded-3xl px-6 sm:px-12 md:px-16 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-28 text-center shadow-[10px_10px_0px_#e50914] relative overflow-hidden flex flex-col items-center justify-center">
          
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
          <div className="w-full flex justify-center pt-2 pb-4">
            <button
              onClick={onRegisterEvent}
              className="w-full sm:w-auto px-10 sm:px-16 py-5 rounded-2xl bg-[#e50914] text-white font-mono text-sm sm:text-base font-black tracking-[0.15em] uppercase border-4 border-[#17171a] shadow-[5px_5px_0px_#17171a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#17171a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#17171a] transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <span>JOIN THE CREW</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

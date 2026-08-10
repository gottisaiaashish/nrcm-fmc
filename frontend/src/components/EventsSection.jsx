import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function EventsSection({ onRegisterEvent }) {
  return (
    <section id="events" className="relative min-h-screen w-full py-32 md:py-48 my-12 md:my-24 bg-[#0f0f11] text-white overflow-hidden border-b border-zinc-900 flex items-center justify-center">
      {/* Subtle Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-red-600/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 w-full relative z-10 my-auto">
        
        {/* Main Signature Recruitment Banner Card */}
        <div className="w-full bg-[#17171a] text-white border-4 border-[#17171a] rounded-3xl px-6 sm:px-12 md:px-16 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-28 text-center shadow-[10px_10px_0px_#e50914] relative overflow-hidden flex flex-col items-center justify-center group">
          
          {/* Film Set Silhouette Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-125 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            style={{ backgroundImage: `url('/join_crew_bg.jpg')` }}
          />

          {/* Dark Overlay for Ultra Sharp Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/80 to-[#0f0f11]/65 pointer-events-none" />

          {/* Red Accent Frame Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#e50914] to-transparent shadow-[0_0_15px_#e50914]" />
          
          {/* Main Title */}
          <h2 className="relative z-10 font-sans font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white leading-none mb-3 drop-shadow-md">
            JOIN THE FMC CREW
          </h2>

          {/* Subtitle */}
          <p className="relative z-10 font-mono text-xs sm:text-sm font-bold text-[#e50914] uppercase tracking-[0.2em] mb-6 drop-shadow">
            NRCM FILM MAKING CLUB · OFFICIAL RECRUITMENT
          </p>

          {/* Description */}
          <p className="relative z-10 font-sans text-sm sm:text-base font-medium text-zinc-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
            Apply for Cinematography, Direction, Story &amp; Screenwriting, Video Editing, Photography, Acting, Poster Design, Content Creation, and Event Management.
          </p>

          {/* Centered Large Action CTA Button */}
          <div className="relative z-10 w-full flex justify-center pt-2 pb-4">
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

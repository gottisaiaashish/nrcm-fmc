import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function EventsSection({ onRegisterEvent }) {
  return (
    <section id="events" className="relative min-h-screen w-full bg-[#0f0f11] text-white overflow-hidden border-b border-zinc-900 py-16 sm:py-24 flex flex-col items-center justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10 my-auto flex flex-col items-center">
        {/* Main Section Heading */}
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight uppercase text-white">
            UPCOMING <span className="text-red-600 font-serif italic font-normal">EVENTS</span>
          </h2>
        </div>

        {/* Hero Upcoming Event Visual Focus Card */}
        <div className="w-full max-w-[92%] sm:max-w-full mx-auto rounded-3xl bg-[#141416] border border-zinc-800/90 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-zinc-700/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Media Visual Column */}
            <div className="lg:col-span-7 relative h-60 sm:h-80 lg:h-auto min-h-[240px] sm:min-h-[360px] lg:min-h-[480px] bg-zinc-950 overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
                alt="Junior Induction 2026"
                className="w-full h-full object-cover filter contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-black/60 lg:bg-gradient-to-r lg:from-transparent lg:via-black/40 lg:to-[#141416]" />

              {/* Status Badge on Media */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-zinc-700/60 text-white font-mono text-[10px] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>REGISTRATION OPEN</span>
              </div>
            </div>

            {/* Event Details Drawer */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between items-center text-center bg-[#141416] relative">

              {/* Centered Event Title & Specs Block */}
              <div className="my-auto py-4 w-full flex flex-col items-center justify-center">
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[0.95]">
                  JUNIOR <br />
                  INDUCTION
                </h3>
                <div className="text-red-600 font-serif italic font-normal text-4xl sm:text-5xl lg:text-6xl mt-2 drop-shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                  2026
                </div>

                {/* Specs Section: Clean Minimal Lines */}
                <div className="w-full space-y-3 pt-6 font-mono text-xs text-zinc-300 flex flex-col items-center">
                  <div className="flex items-center justify-center gap-3 border-b border-zinc-800/80 pb-2.5 w-full max-w-xs text-center">
                    <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider text-[11px] font-semibold text-zinc-200">DATE: AUGUST 11, 2026</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 border-b border-zinc-800/80 pb-2.5 w-full max-w-xs text-center">
                    <Clock className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider text-[11px] font-semibold text-zinc-200">TIME: 03:30 PM IST</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 border-b border-zinc-800/80 pb-2.5 w-full max-w-xs text-center">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider text-[11px] font-semibold text-zinc-200">VENUE: MAIN AUDITORIUM, NRCM</span>
                  </div>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="w-full pt-4 flex justify-center">
                <button
                  onClick={onRegisterEvent}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-mono text-xs tracking-[0.2em] font-extrabold uppercase shadow-[0_0_25px_rgba(229,9,20,0.5)] hover:shadow-[0_0_35px_rgba(229,9,20,0.7)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 border border-red-400/30 cursor-pointer"
                >
                  REGISTER NOW
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

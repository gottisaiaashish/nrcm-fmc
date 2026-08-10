import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import MotionButton from './MotionButton';

export default function EventsSection({ onRegisterEvent }) {
  return (
    <section id="events" className="relative min-h-screen w-full bg-[#0f0f11] text-white overflow-hidden border-b border-zinc-900 py-16 sm:py-24 flex flex-col items-center justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10 my-auto flex flex-col items-center">
        {/* Main Section Heading */}
        <h2 className="font-display text-[22px] xs:text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white text-center whitespace-nowrap mb-8 sm:mb-14">
          UPCOMING <span className="text-red-600 font-serif italic font-normal">EVENTS</span>
        </h2>

        {/* Hero Upcoming Event Visual Focus Card */}
        <div className="w-full max-w-[92%] sm:max-w-full mx-auto rounded-3xl bg-zinc-950 border border-zinc-800/90 overflow-hidden shadow-2xl transition-all duration-500 hover:border-zinc-700/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Media Visual Column */}
            <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[400px] lg:min-h-[520px] bg-zinc-900 overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
                alt="Junior Induction 2026"
                className="w-full h-full object-cover filter contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/50 lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-zinc-950" />
            </div>

            {/* Event Info Drawer */}
            <div className="lg:col-span-5 p-6 sm:p-12 lg:p-14 flex flex-col justify-between items-center text-center bg-zinc-950 relative">

              {/* Centered Event Title & Specs Block */}
              <div className="my-auto py-4 w-full flex flex-col items-center justify-center text-center">
                <h3 className="font-display text-3xl sm:text-5xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[0.95] text-center">
                  JUNIOR <br />
                  INDUCTION
                </h3>
                <div className="text-red-600 font-serif italic font-normal text-4xl sm:text-6xl lg:text-6xl mt-2 text-center drop-shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                  2026
                </div>

                {/* Specs Section: 100% Centered Clean Lines without underline borders */}
                <div className="w-full space-y-2.5 pt-6 font-mono text-xs text-zinc-300 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-2.5 text-center">
                    <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider text-xs font-semibold text-zinc-200">DATE: AUGUST 11, 2026</span>
                  </div>

                  <div className="flex items-center justify-center gap-2.5 text-center">
                    <Clock className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider text-xs font-semibold text-zinc-200">TIME: 03:30 PM IST</span>
                  </div>

                  <div className="flex items-center justify-center gap-2.5 text-center">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider text-xs font-semibold text-zinc-200">VENUE: MAIN AUDITORIUM, NRCM</span>
                  </div>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="w-full pt-6 flex justify-center items-center">
                <MotionButton
                  label="REGISTER NOW"
                  onClick={onRegisterEvent}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

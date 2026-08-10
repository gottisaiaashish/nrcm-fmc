import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function EventsSection({ onRegisterEvent }) {
  return (
    <section id="events" className="relative min-h-screen w-full bg-[#0f0f11] text-white overflow-hidden border-b border-zinc-900 py-20 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 my-auto flex flex-col items-center">
        {/* Main Section Heading */}
        <h2
          className="f-44 font-display font-extrabold tracking-tight uppercase text-white text-center block"
          style={{ marginBottom: '55px' }}
        >
          UPCOMING <span className="text-red-600 font-serif italic font-normal">EVENTS</span>
        </h2>

        {/* Hero Upcoming Event Visual Focus Card */}
        <div className="relative w-full mx-4 sm:mx-0 rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Full-Bleed Media Visual */}
            <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] bg-zinc-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
                alt="Junior Induction 2026"
                className="w-full h-full object-cover filter contrast-125 brightness-75 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/90 lg:to-black" />


            </div>

            {/* Event Info Drawer — PERFECTLY CENTERED VERTICALLY & HORIZONTALLY */}
            <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between items-center text-center bg-zinc-950">
              {/* Tag Header */}
              <div className="w-full text-center">
                <span className="font-mono text-xs text-red-500 tracking-[0.25em] uppercase font-semibold block">
                  NRCM.FMC OFFICIAL EVENT
                </span>
              </div>

              {/* Centered Event Title & Specs Block */}
              <div className="my-auto py-6 w-full flex flex-col items-center justify-center text-center">
                <h3 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-[0.9] text-center">
                  JUNIOR <br />
                  INDUCTION
                </h3>
                <div className="text-red-600 font-serif italic font-normal text-5xl sm:text-6xl mt-3 text-center">
                  2026
                </div>

                {/* Specs Section: 100% Centered Lines */}
                <div className="w-full space-y-3 pt-6 font-mono text-xs text-zinc-300 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-3 border-b border-zinc-900/80 pb-2.5 w-full max-w-xs text-center">
                    <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider">DATE: AUGUST 11, 2026</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 border-b border-zinc-900/80 pb-2.5 w-full max-w-xs text-center">
                    <Clock className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider">TIME: 03:30 PM IST</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 border-b border-zinc-900/80 pb-2.5 w-full max-w-xs text-center">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="tracking-wider">VENUE: MAIN AUDITORIUM, NRCM</span>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="w-full pt-4">
                <button
                  onClick={onRegisterEvent}
                  className="w-full py-4 rounded-xl bg-red-600 text-white font-mono text-xs tracking-widest uppercase font-bold hover:bg-red-500 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  REGISTER NOW
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

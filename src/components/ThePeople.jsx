import React, { useState } from 'react';

const CREW = [
  {
    id: 1,
    name: 'Aashish Gotti',
    role: 'DIRECTOR',
    handle: '@aashish_gotti',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    quote: 'Cinema is a mirror of unseen emotions.',
  },
  {
    id: 2,
    name: 'Karthik Varma',
    role: 'DOP',
    handle: '@karthik_dop',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    quote: 'Light creates depth where shadows live.',
  },
  {
    id: 3,
    name: 'Vikas Rao',
    role: 'EDITOR',
    handle: '@vikas_cuts',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    quote: 'The edit is where the story is born again.',
  },
  {
    id: 4,
    name: 'Siddharth Roy',
    role: 'WRITER',
    handle: '@sid_script',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    quote: 'Words become light on screen.',
  },
  {
    id: 5,
    name: 'Ananya Mehta',
    role: 'PHOTOGRAPHER',
    handle: '@ananya_stills',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    quote: 'Freezing time in 35mm stillness.',
  },
  {
    id: 6,
    name: 'Rahul K.',
    role: 'DESIGNER',
    handle: '@rahul_gfx',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    quote: 'Visual hierarchy defines emotion.',
  },
  {
    id: 7,
    name: 'Arjun Das',
    role: 'SOUND',
    handle: '@arjun_audio',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    quote: 'Audio is 50% of the film experience.',
  },
];

export default function ThePeople() {
  const [selectedMember, setSelectedMember] = useState(CREW[0]);

  return (
    <section className="relative py-32 md:py-48 bg-black text-white overflow-hidden border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-red-600 inline-block" />
              <span className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase">
                SECTION 06 // THE CREATIVE REEL
              </span>
            </div>
            <h2 className="font-display text-fluid-hero font-black tracking-tighter uppercase text-white leading-none">
              THE <span className="text-red-600 font-serif italic font-normal">MEMBERS</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-500 max-w-xs tracking-widest uppercase">
            // CINEMATIC REEL OF THE NRCM.FMC CORE CREW & DIRECTORS.
          </p>
        </div>

        {/* Selected Member Expanded Spotlight Drawer */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-950 p-8 sm:p-12 rounded-3xl border border-zinc-900">
          <div className="lg:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={selectedMember.image}
              alt={selectedMember.name}
              className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute top-4 left-4 font-mono text-xs text-red-500 px-3 py-1 rounded bg-black/80 border border-zinc-800">
              ROLE // {selectedMember.role}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between h-full py-4">
            <div>
              <span className="font-mono text-xs text-red-500 tracking-widest uppercase block mb-2">
                SELECTED CREW MEMBER
              </span>
              <h3 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-2">
                {selectedMember.name}
              </h3>
              <p className="font-mono text-sm text-zinc-500 mb-6">{selectedMember.handle}</p>

              <blockquote className="font-serif italic text-2xl sm:text-3xl text-zinc-300 border-l-2 border-red-600 pl-6 my-6 font-normal">
                "{selectedMember.quote}"
              </blockquote>
            </div>

            <div className="font-mono text-xs text-zinc-600 tracking-widest uppercase pt-4 border-t border-zinc-900">
              NRCM FILM MAKING CLUB — 2026 REEL
            </div>
          </div>
        </div>

        {/* Horizontal Film Reel Strip */}
        <div className="flex items-center gap-6 overflow-x-auto pb-6 scrollbar-none">
          {CREW.map((member) => {
            const isSelected = member.id === selectedMember.id;
            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`flex-shrink-0 cursor-pointer w-44 sm:w-56 group rounded-2xl overflow-hidden bg-zinc-950 border transition-all duration-300 ${
                  isSelected
                    ? 'border-red-600 shadow-[0_0_25px_rgba(229,9,20,0.4)] scale-105'
                    : 'border-zinc-900 hover:border-zinc-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-zinc-900 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-4 bg-zinc-950">
                  <span className="font-mono text-[10px] text-red-500 block mb-0.5">{member.role}</span>
                  <h4 className="font-display text-sm font-bold text-white group-hover:text-red-500 transition-colors truncate">
                    {member.name}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

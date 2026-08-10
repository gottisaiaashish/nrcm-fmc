import React from 'react';

export default function WorkMarqueeSection({ onSelectProject }) {
  return (
    <section id="work" className="relative py-28 bg-[#0f0f11] text-[#F0ECD9] border-b border-zinc-800/80 text-center overflow-hidden">
      <div className="font-display f-120 uppercase text-zinc-400 mb-2 tracking-tight">
        View our
      </div>

      {/* Giant Marquee Ticker with embedded video/photo texture */}
      <a
        href="#work"
        onClick={(e) => {
          e.preventDefault();
          if (onSelectProject) {
            onSelectProject({
              id: '01',
              title: 'SHORT FILMS & PRODUCTIONS',
              year: '2026',
              director: 'NRCM FMC Collective',
              image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c7a5c1?auto=format&fit=crop&w=1200&q=80',
              tags: ['Short Films', 'Music Videos', 'Documentaries'],
              desc: 'Browse our complete collection of short films, music videos, and documentaries.',
            });
          }
        }}
        className="block overflow-hidden py-4 group"
      >
        <div className="animate-marquee font-display f-280 font-black uppercase text-red-600 tracking-tighter hover:text-[#F0ECD9] transition-colors">
          <span className="px-8 drop-shadow-[0_0_40px_rgba(229,9,20,0.5)]">WORK</span>
          <span className="px-8 drop-shadow-[0_0_40px_rgba(229,9,20,0.5)]">PRODUCTIONS</span>
          <span className="px-8 drop-shadow-[0_0_40px_rgba(229,9,20,0.5)]">CINEMA</span>
          <span className="px-8 drop-shadow-[0_0_40px_rgba(229,9,20,0.5)]">WORK</span>
        </div>
      </a>
    </section>
  );
}

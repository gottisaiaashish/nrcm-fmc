import React from 'react';

const BTS_SLIDES = [
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
];

export default function MoodSection() {
  return (
    <section className="relative py-28 bg-[#0f0f11] text-[#F0ECD9] border-b border-zinc-800/80 overflow-hidden">
      {/* Super Marquee Ticker */}
      <div className="overflow-hidden whitespace-nowrap opacity-25 select-none mb-12">
        <div className="animate-marquee font-display font-black uppercase text-stroke-white text-9xl tracking-tighter">
          <span>STORIES-STORIES-STORIES — NRCM.FMC-FILM-CLUB — NOT-GENERIC-TEMPLATES — </span>
          <span>STORIES-STORIES-STORIES — NRCM.FMC-FILM-CLUB — NOT-GENERIC-TEMPLATES — </span>
        </div>
      </div>

      {/* BTS Drag / Scroll Photos Reel */}
      <div className="px-6 md:px-12">
        <div className="flex items-center justify-end mb-6">
          <span className="font-mono text-xs text-zinc-500 uppercase">
            SWIPE / SCROLL TO EXPLORE →
          </span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-12 sm:pb-16 scrollbar-none snap-x cursor-grab active:cursor-grabbing">
          {BTS_SLIDES.map((src, idx) => (
            <figure
              key={idx}
              className="flex-shrink-0 w-72 sm:w-96 aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl snap-center group"
            >
              <img
                src={src}
                alt={`BTS ${idx + 1}`}
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

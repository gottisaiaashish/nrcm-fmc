import React, { useState, useEffect, useRef } from 'react';

const BTS_PHOTOS = [
  {
    id: 1,
    title: 'Director Lensing Shot',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80',
    pos: 'top-0 left-4 sm:left-12 w-60 sm:w-80',
    speed: 0.18,
    rotate: '-rotate-3',
  },
  {
    id: 2,
    title: 'Gaffer Lighting Rig',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    pos: 'top-16 right-4 sm:right-16 w-64 sm:w-96',
    speed: -0.25,
    rotate: 'rotate-4',
  },
  {
    id: 3,
    title: 'Focus Puller Action',
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=800&q=80',
    pos: 'bottom-12 left-10 sm:left-1/3 w-56 sm:w-80',
    speed: 0.14,
    rotate: '-rotate-6',
  },
  {
    id: 4,
    title: 'Clapperboard Marker',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    pos: 'bottom-6 right-6 sm:right-1/4 w-60 sm:w-88',
    speed: -0.2,
    rotate: 'rotate-3',
  },
];

export default function BehindTheFrame() {
  const sectionRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setScrollY(rect.top);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-44 md:py-60 bg-black text-white overflow-hidden border-b border-zinc-900 min-h-[120vh]"
    >
      {/* Editorial Heading Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 pointer-events-none">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-[2px] bg-red-600 inline-block" />
          <span className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase">
            SECTION 05 // BEHIND THE FRAME
          </span>
        </div>

        <div className="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-8">
          BTS ARCHIVE // NRCM.FMC // 2026
        </div>

        {/* Main Heading with Red Editorial Italics */}
        <h2 className="font-display text-fluid-hero font-black uppercase tracking-tighter max-w-5xl text-white leading-none">
          EVERY FRAME <br />
          <span className="font-serif italic font-normal text-red-600 text-fluid-editorial px-2">
            HAS A STORY
          </span> <br />
          BEHIND IT<span className="text-red-600">.</span>
        </h2>
      </div>

      {/* Floating Multi-Speed Collage */}
      <div className="absolute inset-0 z-10 max-w-7xl mx-auto pointer-events-auto">
        {BTS_PHOTOS.map((photo) => {
          const translateY = scrollY * photo.speed;
          return (
            <div
              key={photo.id}
              className={`absolute ${photo.pos} ${photo.rotate} transition-transform duration-150 ease-out group cursor-pointer`}
              style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
            >
              <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-red-600 shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:scale-105">
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900 relative">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-2 px-1 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span className="group-hover:text-red-500 transition-colors">{photo.title}</span>
                  <span className="text-zinc-600">BTS // 2026</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

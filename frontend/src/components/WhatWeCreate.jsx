import React, { useState, useEffect, useRef } from 'react';

const PILLARS = [
  {
    title: 'FILMMAKING',
    subtitle: 'NARRATIVE DIRECTION & PRODUCTION',
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c7a5c1?auto=format&fit=crop&w=1600&q=80',
    desc: 'Transforming concept scripts into high-impact visual stories.',
  },
  {
    title: 'CINEMATOGRAPHY',
    subtitle: 'LENSING & LIGHTING COMPOSITION',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    desc: 'Volumetric red flares, geometric framing, and 35mm optical mood.',
  },
  {
    title: 'STORYTELLING',
    subtitle: 'SCREENWRITING & CONCEPT ARC',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    desc: 'Crafting non-linear narratives that resonate beyond the screen.',
  },
  {
    title: 'EDITING',
    subtitle: 'PACING & RHYTHMIC CUTTING',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    desc: 'Precision cuts, color grading pipelines, and temporal transitions.',
  },
  {
    title: 'SOUND & DESIGN',
    subtitle: 'FOLEY & CINEMATIC SCORE',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    desc: 'Immersive acoustic soundscapes that elevate emotional tension.',
  },
];

export default function WhatWeCreate() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max(-rect.top / totalHeight, 0), 0.999);
        const index = Math.floor(progress * PILLARS.length);
        setActiveIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentData = PILLARS[activeIndex] || PILLARS[0];

  return (
    <section
      ref={containerRef}
      className="relative h-[220vh] bg-black text-white w-full overflow-hidden"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-10 px-6 md:px-16">
        {/* Full-Bleed Background Media Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {PILLARS.map((item, idx) => (
            <div
              key={item.title}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                idx === activeIndex ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
              <div className="absolute inset-0 bg-red-950/20 mix-blend-color-dodge" />
            </div>
          ))}
        </div>

        {/* Top Header Label */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-red-600 inline-block" />
            <span className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase">
              SECTION 02 // WHAT WE CREATE
            </span>
          </div>

          <div className="font-mono text-xs text-zinc-500 tracking-widest">
            0{activeIndex + 1} / 0{PILLARS.length}
          </div>
        </div>

        {/* Viewport-Filling Giant Title Sequence Words */}
        <div className="relative z-10 my-auto text-center w-full">
          {PILLARS.map((item, idx) => (
            <div
              key={item.title}
              className={`transition-all duration-500 ease-out transform ${
                idx === activeIndex
                  ? 'block opacity-100 translate-y-0 scale-100'
                  : 'hidden opacity-0 translate-y-16 scale-90'
              }`}
            >
              <h2 className="font-display text-fluid-hero font-black tracking-tighter uppercase leading-none text-white drop-shadow-[0_10px_50px_rgba(229,9,20,0.5)]">
                {item.title}
                <span className="text-red-600">.</span>
              </h2>
            </div>
          ))}
        </div>

        {/* Bottom Subtitle & Description bar */}
        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/80 pt-4 pb-2 px-6 rounded-xl bg-black/70 backdrop-blur-md">
          <div>
            <p className="font-mono text-[10px] text-red-500 tracking-widest uppercase mb-0.5">
              // {currentData.subtitle}
            </p>
            <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light">
              {currentData.desc}
            </p>
          </div>

          {/* Minimal Line Indicators */}
          <div className="flex items-center gap-2">
            {PILLARS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 transition-all duration-300 ${
                  idx === activeIndex ? 'w-10 bg-red-600 shadow-[0_0_10px_#ff1e27]' : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

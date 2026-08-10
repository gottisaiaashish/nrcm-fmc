import React, { useRef, useEffect, useState } from 'react';

export default function FilmExperience() {
  const containerRef = useRef(null);
  const [scaleProgress, setScaleProgress] = useState(0.85);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress when section is in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
        setScaleProgress(0.85 + progress * 0.25);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black text-white py-24 flex items-center justify-center overflow-hidden border-b border-zinc-900"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-red-950/40 transition-transform duration-300 ease-out mx-auto"
          style={{ transform: `scale(${scaleProgress})` }}
        >
          {/* Cinema Media Canvas Placeholder */}
          <div className="relative aspect-[21/9] w-full bg-zinc-950">
            <img
              src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80"
              alt="Cinematic Experience"
              className="w-full h-full object-cover filter contrast-125 brightness-75"
            />
            {/* Cinematic Red Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-red-950/30 mix-blend-overlay" />

            {/* Minimal Overlay Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <span className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase mb-4 px-4 py-1 rounded-full bg-black/60 border border-red-800/40 backdrop-blur-md">
                SECTION 04 // THE CINEMATIC EXPERIENCE
              </span>
              <h2 className="font-display text-4xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
                EVERY FRAME <br />
                <span className="font-serif italic text-red-600 font-normal tracking-normal text-5xl sm:text-8xl md:text-[9rem]">
                  TELLS A STORY.
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

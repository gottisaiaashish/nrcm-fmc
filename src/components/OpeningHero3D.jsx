import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Text3DEnvironment from './3d/Text3DEnvironment';
import { Ticket } from 'lucide-react';

export default function OpeningHero3D({ onOpenPassModal }) {
  const scrollProgressRef = useRef(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / (window.innerHeight * 0.5), 1);
      scrollProgressRef.current = progress;
      setScrolled(scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full bg-black text-white overflow-hidden flex items-center justify-center border-b border-zinc-900">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <Text3DEnvironment scrollProgress={scrollProgressRef} />
        </Canvas>
      </div>

      {/* Ambient Red Center Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[160px] pointer-events-none z-5" />

      {/* Main Centered 2D Title Layer */}
      <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto select-none flex flex-col items-center justify-center">
        {/* Stage 0: NRCM.FMC Title */}
        <div
          className={`transition-all duration-700 ease-out w-full flex flex-col items-center justify-center ${
            !scrolled
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 -translate-y-10 pointer-events-none'
          }`}
        >
          <h1 className="font-display text-fluid-title font-black tracking-tighter text-white uppercase drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)] whitespace-nowrap px-4 text-center">
            NRCM<span className="text-red-600">.</span>FMC
          </h1>

          <p className="font-sans text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto mt-8 sm:mt-12 md:mt-16 tracking-[0.2em] uppercase font-light px-4">
            INDEPENDENT FILM STUDIO & EXPERIMENTAL DIGITAL EXPERIENCE
          </p>
        </div>

        {/* Stage 1: STORIES BEGIN HERE + Interactive Pass Button Trigger */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-out px-4 ${
            scrolled
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-105 translate-y-10 pointer-events-none'
          }`}
        >
          <h2 className="font-display text-fluid-hero font-black tracking-tight uppercase leading-none text-white drop-shadow-[0_10px_50px_rgba(0,0,0,0.9)]">
            STORIES <br />
            <span className="font-serif italic text-red-600 font-normal tracking-normal text-fluid-editorial drop-shadow-[0_0_40px_rgba(229,9,20,0.7)] px-2 inline-block">
              BEGIN
            </span> <br />
            HERE<span className="text-red-600">.</span>
          </h2>

          <button
            onClick={onOpenPassModal}
            className="mt-6 pointer-events-auto inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white font-mono text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_35px_#ff1e27] hover:scale-105 transition-all duration-300 border border-red-400/40 cursor-pointer shadow-2xl"
          >
            <Ticket className="w-4 h-4" />
            REGISTER CREW PASS →
          </button>
        </div>
      </div>

      {/* Minimal Scroll Prompt */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-300 ${
          scrolled ? 'opacity-0' : 'opacity-80 animate-bounce'
        }`}
      >
        <span className="font-mono text-[10px] text-zinc-400 tracking-[0.25em] uppercase">
          SCROLL TO ENTER FILM ↓
        </span>
      </div>
    </section>
  );
}

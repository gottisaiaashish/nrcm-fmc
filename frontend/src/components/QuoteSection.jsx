import React from 'react';

export default function QuoteSection() {
  return (
    <section className="relative min-h-screen w-full bg-[#0f0f11] text-[#F0ECD9] border-b border-zinc-800/80 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden py-20">
      {/* Red Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 my-auto">
        <h2 className="f-80 leading-tight font-display tracking-tight text-[#F0ECD9]">
          NRCM.FMC’s <span className="font-serif italic text-red-600 font-normal">creators</span> are,{' '}
          <span className="font-extrabold uppercase">hand-picked</span>{' '}
          <span className="f-32 font-mono text-zinc-400">for</span>{' '}
          <span className="font-serif italic uppercase">their</span> talent,{' '}
          <span className="font-serif italic text-red-600 font-normal">taste,</span>{' '}
          <span className="f-32 font-mono text-zinc-400">and</span> diverse,{' '}
          <span className="font-extrabold">perspectives.</span> Teamwork —{' '}
          <span className="font-extrabold uppercase">Because</span>{' '}
          <span className="font-extrabold text-red-600">doing</span>{' '}
          <span className="f-32 font-mono text-zinc-400">the</span>{' '}
          <span className="uppercase tracking-widest font-mono">dreamwork</span> solo{' '}
          <span className="f-32 font-mono text-zinc-400">is</span> a nightmare.
        </h2>
      </div>
    </section>
  );
}

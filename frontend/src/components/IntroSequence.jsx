import React, { useEffect, useState } from 'react';

export default function IntroSequence({ onComplete }) {
  const [stage, setStage] = useState(0); // 0 = initial, 1 = text revealed, 2 = sliding away, 3 = unmounted

  useEffect(() => {
    // Stage 1: Reveal text after 200ms
    const t1 = setTimeout(() => {
      setStage(1);
    }, 200);

    // Stage 2: Start curtain exit after 2.0s
    const t2 = setTimeout(() => {
      setStage(2);
    }, 2000);

    // Stage 3: Complete & unmount after 2.7s
    const t3 = setTimeout(() => {
      setStage(3);
      if (onComplete) onComplete();
    }, 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (stage === 3) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#0f0f11] text-[#F0ECD9] flex flex-col items-center justify-center transition-transform duration-700 ease-in-out ${
        stage >= 2 ? '-translate-y-full pointer-events-none' : 'translate-y-0 pointer-events-auto'
      }`}
    >
      {/* Background Red Ambient Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 text-center px-4 pointer-events-none">

        {/* Main Stylized NRCM.FMC Title Reveal */}
        <h1
          className={`font-display text-fluid-title font-black tracking-tighter text-[#F0ECD9] uppercase leading-none transition-all duration-1000 ${
            stage >= 1 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-md'
          }`}
        >
          NRCM<span className="text-red-600 font-serif italic">.</span>FMC
        </h1>

      </div>
    </div>
  );
}

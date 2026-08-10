import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function MotionButton({ label = 'REGISTER NOW', onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-mono font-extrabold tracking-widest uppercase transition-all duration-200 gap-2.5 px-7 py-3.5 cursor-pointer text-white bg-red-600 border-2 border-zinc-900 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] focus:outline-none ${className}`}
    >
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
    </button>
  );
}

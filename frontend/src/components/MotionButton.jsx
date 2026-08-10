import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function MotionButton({ label, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`group relative h-14 w-56 sm:w-60 cursor-pointer rounded-full bg-zinc-900 border border-zinc-800 p-1 outline-none overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Expanding Red Circle Background */}
      <span
        className="circle bg-red-600 m-0 block h-12 w-12 overflow-hidden rounded-full duration-500 group-hover:w-full transition-all ease-out"
        aria-hidden="true"
      />
      
      {/* Icon */}
      <div className="icon absolute top-1/2 left-4 -translate-y-1/2 duration-500 group-hover:translate-x-[0.4rem] transition-transform z-10 flex items-center justify-center pointer-events-none">
        <ArrowRight className="text-white w-5 h-5" />
      </div>

      {/* Label Text */}
      <span className="button-text text-white font-mono absolute top-1/2 left-1/2 ml-3 -translate-x-1/2 -translate-y-1/2 text-center text-xs sm:text-sm font-extrabold tracking-[0.18em] uppercase whitespace-nowrap duration-500 z-10 pointer-events-none">
        {label}
      </span>
    </button>
  );
}

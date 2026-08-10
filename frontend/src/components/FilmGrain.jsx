import React from 'react';

export default function FilmGrain() {
  return (
    <>
      {/* 35mm Dynamic SVG Film Grain */}
      <div className="film-grain" aria-hidden="true" />
      {/* Subtle Red Ambient Top Flare */}
      <div className="red-ambient-flare" aria-hidden="true" />
      {/* Scanline line overlay */}
      <div className="fixed inset-0 pointer-events-none z-[998] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" aria-hidden="true" />
    </>
  );
}

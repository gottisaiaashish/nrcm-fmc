import React from 'react';
import { X, Play, Film, Calendar, User, Tag } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl transition-all">
      <div className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-red-900/50 overflow-hidden shadow-[0_0_80px_rgba(229,9,20,0.35)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/80 border border-zinc-700 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Frame Header */}
        <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Center Simulated Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_30px_#ff1e27] hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Details Container */}
        <div className="p-8 bg-zinc-950">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-red-500 px-3 py-1 rounded bg-red-950/40 border border-red-900/50">
              FRAME // {project.id}
            </span>
            <span className="font-mono text-xs text-zinc-500">{project.year}</span>
          </div>

          <h3 className="font-display text-4xl font-extrabold tracking-tight text-white mb-4 uppercase">
            {project.title}
          </h3>

          <p className="font-sans text-sm text-zinc-300 font-light leading-relaxed mb-6">
            {project.desc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-900 font-mono text-xs text-zinc-400">
            <div>
              <span className="text-zinc-600 block text-[10px] mb-1">DIRECTOR / LAB</span>
              <span className="text-white">{project.director}</span>
            </div>
            <div>
              <span className="text-zinc-600 block text-[10px] mb-1">GENRE / TAGS</span>
              <div className="flex flex-wrap gap-1">
                {project.tags.map((t) => (
                  <span key={t} className="text-red-500">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-zinc-600 block text-[10px] mb-1">ASPECT RATIO</span>
              <span className="text-white">2.39:1 CINEMATIC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

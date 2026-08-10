import React, { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';

const PROJECTS = [
  {
    id: '01',
    title: 'SHORT FILMS',
    year: '2026',
    director: 'NRCM FMC Collective',
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c7a5c1?auto=format&fit=crop&w=1200&q=80',
    tags: ['Narrative', 'Drama', 'Cinematic'],
    desc: 'Original fictional short films crafted from scriptwriting to final color grading.',
    aspect: 'aspect-[16/10]',
  },
  {
    id: '02',
    title: 'MUSIC VIDEOS',
    year: '2025',
    director: 'FMC Visual Lab',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    tags: ['Rhythm', 'Lighting', 'VFX'],
    desc: 'High-energy visual compositions synchronized with musical performances.',
    aspect: 'aspect-[4/5]',
  },
  {
    id: '03',
    title: 'DOCUMENTARIES',
    year: '2026',
    director: 'FMC Truth Unit',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Real Life', 'Interviews'],
    desc: 'Deep dive stories exploring human experiences, campus culture, and social causes.',
    aspect: 'aspect-[4/3]',
  },
  {
    id: '04',
    title: 'COMMERCIALS',
    year: '2025',
    director: 'FMC Commercial Division',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    tags: ['Brand', 'Product'],
    desc: 'Impactful short-form promotional films designed for maximum audience engagement.',
    aspect: 'aspect-[16/9]',
  },
  {
    id: '05',
    title: 'CAMPUS STORIES',
    year: '2026',
    director: 'NRCM Student Voices',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    tags: ['Campus', 'Events'],
    desc: 'Capturing the vibrant energy, tech fests, and untold moments at NRCM.',
    aspect: 'aspect-[21/9]',
  },
];

export default function OurWork({ onSelectProject }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="work" className="relative py-32 md:py-48 bg-black text-white overflow-hidden border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-red-600 inline-block" />
              <span className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase">
                SECTION 03 // FEATURED PRODUCTIONS
              </span>
            </div>
            <h2 className="font-display text-fluid-hero font-black tracking-tighter uppercase text-white leading-none">
              OUR <span className="text-red-600 font-serif italic font-normal">WORK</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-500 max-w-xs tracking-widest uppercase">
            // ARCHIVE OF FEATURED SHORT FILMS, MUSIC VIDEOS & DOCUMENTARIES.
          </p>
        </div>

        {/* Asymmetric Editorial Poster Layout (No Generic Uniform Cards) */}
        <div className="space-y-24">
          {PROJECTS.map((project, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectProject(project)}
                className={`group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-zinc-900 pb-16 ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image Frame Column */}
                <div className={`lg:col-span-7 relative overflow-hidden rounded-2xl border border-zinc-900 ${project.aspect} bg-zinc-950 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  {/* Subtle Red Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-75" />
                  <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Red Accent Line on Hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_#ff1e27]" />

                  {/* Hover Center Badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-5 py-2 rounded-full bg-red-600 text-white font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_25px_#ff1e27]">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      VIEW FRAME
                    </span>
                  </div>
                </div>

                {/* Typography & Meta Column */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2 lg:pl-8' : 'lg:order-1 lg:pr-8'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-red-500 font-bold">{project.id} // PRODUCTION</span>
                    <span className="font-mono text-xs text-zinc-600">{project.year}</span>
                  </div>

                  <h3 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white group-hover:text-red-500 group-hover:translate-x-2 transition-all duration-300 mb-4">
                    {project.title}
                  </h3>

                  <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed mb-6">
                    {project.desc}
                  </p>

                  <div className="flex items-center gap-2">
                    {project.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] uppercase text-zinc-500 px-3 py-1 rounded bg-zinc-950 border border-zinc-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

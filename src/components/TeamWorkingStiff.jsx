import React, { useState } from 'react';
import TeamMemberModal from './modals/TeamMemberModal';

const MEMBERS = [
  {
    id: 'm01',
    letter: 'A',
    firstName: 'Aashish',
    lastName: 'Gotti',
    name: 'Aashish Gotti',
    role: 'Director / Founder',
    handle: '@aashish_gotti',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Creative conspirer. Full-stack digital architect and film director. Laser level eyes, razor sharp wit, and relentless passion for cinematic storytelling.',
  },
  {
    id: 'm02',
    letter: 'K',
    firstName: 'Karthik',
    lastName: 'Varma',
    name: 'Karthik Varma',
    role: 'Director of Photography (DOP)',
    handle: '@karthik_dop',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Visual wizard. Obsessed with 35mm optical lensing, volumetric red lighting, and geometric aspect ratios.',
  },
  {
    id: 'm03',
    letter: 'V',
    firstName: 'Vikas',
    lastName: 'Rao',
    name: 'Vikas Rao',
    role: 'Lead Editor & Colorist',
    handle: '@vikas_cuts',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: 'Cutting room virtuoso. Mastering pacing, non-linear cuts, color grading, and temporal story arcs.',
  },
  {
    id: 'm04',
    letter: 'S',
    firstName: 'Siddharth',
    lastName: 'Roy',
    name: 'Siddharth Roy',
    role: 'Screenwriter & Concept Lead',
    handle: '@sid_script',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    bio: 'Dialogue architect. Writing scripts that challenge perception and turn raw ideas into light on screen.',
  },
];

export default function TeamWorkingStiff() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="team" className="relative py-32 bg-[#0f0f11] text-[#F0ECD9] border-b border-zinc-800/80 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-16">
          <span className="w-8 h-[2px] bg-red-600 inline-block" />
          <span className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase">
            CREW & ARTIST PARTNERS
          </span>
        </div>

        {/* Working Stiff Team Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MEMBERS.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="group relative cursor-pointer flex flex-col justify-between rounded-2xl bg-zinc-950 p-6 border border-zinc-800/80 hover:border-red-600 transition-all duration-500 hover:shadow-[0_0_40px_rgba(229,9,20,0.3)] min-h-[440px] overflow-hidden"
            >
              {/* Giant Background Letter */}
              <div className="absolute top-2 right-4 f-300 font-serif italic text-red-600/10 group-hover:text-red-600/20 transition-colors select-none pointer-events-none">
                {member.letter}
              </div>

              {/* Red Corner Brackets */}
              <div className="corners opacity-0 group-hover:opacity-100 transition-opacity">
                <i /><i /><i /><i />
              </div>

              {/* Member Photo Figure */}
              <figure className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-6 z-10">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </figure>

              {/* Team Name Label */}
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase block mb-1">
                  {member.role}
                </span>
                <h3 className="font-display leading-none">
                  <span className="f-80 block text-red-600 font-serif italic font-normal">
                    {member.firstName}
                  </span>
                  <span className="f-44 block text-[#F0ECD9] tracking-tight">
                    {member.lastName}
                  </span>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Modal Popup */}
      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}

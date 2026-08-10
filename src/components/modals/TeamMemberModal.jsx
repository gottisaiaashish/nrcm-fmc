import React from 'react';
import { X } from 'lucide-react';

export default function TeamMemberModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl transition-all">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0f0f11] border-2 border-red-600/80 p-8 sm:p-12 shadow-[0_0_90px_rgba(229,9,20,0.5)] overflow-hidden text-[#F0ECD9]">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-800 via-red-600 to-red-500 shadow-[0_0_20px_#ff1e27]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center hover:bg-red-600 hover:rotate-90 transition-all cursor-pointer z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
          {/* Member Photo */}
          <div className="sm:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>

          {/* Member Info */}
          <div className="sm:col-span-7 space-y-4">
            <span className="font-mono text-xs text-red-500 tracking-widest uppercase block">
              // {member.role}
            </span>

            <h2 className="font-display f-80 uppercase tracking-tight text-[#F0ECD9] leading-none">
              <span className="text-red-600 font-serif italic block font-normal">{member.firstName}</span>
              <span>{member.lastName}</span>
            </h2>

            <p className="font-sans f-18 text-zinc-300 font-light leading-relaxed pt-2 border-t border-zinc-800">
              "{member.bio}"
            </p>

            <div className="font-mono text-xs text-zinc-500 pt-2">
              HANDLE: <span className="text-zinc-300">{member.handle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import IntroSequence from './components/IntroSequence';
import CustomCursor from './components/CustomCursor';
import FilmGrain from './components/FilmGrain';
import Navbar from './components/Navbar';
import HeroWorkingStiff from './components/HeroWorkingStiff';
import QuoteSection from './components/QuoteSection';
import MoodSection from './components/MoodSection';
import EventsSection from './components/EventsSection';
import FooterWorkingStiff from './components/FooterWorkingStiff';

// Modals
import PassModal from './components/modals/PassModal';
import JoinModal from './components/modals/JoinModal';
import ProjectModal from './components/modals/ProjectModal';

export default function App() {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#0f0f11] text-[#F0ECD9] selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
      {/* 00. Opening Intro Sequence Animation */}
      <IntroSequence />

      {/* Trailing Cursor & Grain Overlay */}
      <CustomCursor />
      <FilmGrain />

      {/* Floating Navbar */}
      <Navbar
        onOpenPassModal={() => setPassModalOpen(true)}
        onOpenJoinModal={() => setJoinModalOpen(true)}
      />

      {/* Main Working Stiff Flow Sections */}
      <main className="relative w-full">
        {/* Section 00: Working Stiff Hero */}
        <HeroWorkingStiff />

        {/* Section 01: Working Stiff Quote */}
        <QuoteSection />

        {/* Section 02: BTS Mood & Drag Slider */}
        <MoodSection />

        {/* Section 03: Events */}
        <EventsSection onRegisterEvent={() => setJoinModalOpen(true)} />
      </main>

      {/* Footer with 3D Yellow/Red Button Trigger */}
      <FooterWorkingStiff onOpenPassModal={() => setPassModalOpen(true)} />

      {/* Modals */}
      <PassModal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
      />
      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

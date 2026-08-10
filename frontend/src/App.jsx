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
import AdminLoginModal from './components/modals/AdminLoginModal';
import AdminDashboardModal from './components/modals/AdminDashboardModal';

export default function App() {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenAdmin = () => {
    const token = localStorage.getItem('nrcmfmc_admin_token');
    if (token) {
      setAdminDashboardOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setAdminLoginOpen(false);
    setAdminDashboardOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('nrcmfmc_admin_token');
    setAdminDashboardOpen(false);
  };

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
        onOpenAdminLogin={handleOpenAdmin}
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

      {/* Footer */}
      <FooterWorkingStiff
        onOpenPassModal={() => setPassModalOpen(true)}
        onOpenAdminLogin={handleOpenAdmin}
      />

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
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <AdminDashboardModal
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}

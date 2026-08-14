import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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

// Pages
import RegistrationPage from './pages/RegistrationPage';
import ReReleaseBookingPage from './pages/ReReleaseBookingPage';

function MainSite() {
  const navigate = useNavigate();
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenAdmin = () => {
    const token = localStorage.getItem('nrcmfmc_admin_token');
    if (token) setAdminDashboardOpen(true);
    else setAdminLoginOpen(true);
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
      <IntroSequence />
      <CustomCursor />
      <FilmGrain />

      <Navbar
        onOpenPassModal={() => setPassModalOpen(true)}
        onOpenJoinModal={() => setJoinModalOpen(true)}
        onOpenAdminLogin={handleOpenAdmin}
      />

      <main className="relative w-full">
        <HeroWorkingStiff />
        <QuoteSection />
        <MoodSection />
        {/* Pass /registration to navigate there directly */}
        <EventsSection onRegisterEvent={() => navigate('/registration')} />
      </main>

      <FooterWorkingStiff
        onOpenPassModal={() => setPassModalOpen(true)}
        onOpenAdminLogin={handleOpenAdmin}
      />

      <PassModal isOpen={passModalOpen} onClose={() => setPassModalOpen(false)} />
      <JoinModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/rerelease" element={<ReReleaseBookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

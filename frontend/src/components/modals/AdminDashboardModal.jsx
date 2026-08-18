import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Download, Trash2, Search, Users, LogOut, Home, FileText, Eye, Star, Ticket, Settings, QrCode, CheckCircle, AlertTriangle, ShieldAlert, ShieldCheck, Film, Save, Camera, Plus, Minus } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  // Navigation Tabs: 'overview', 'shortlisted', 'rerelease_settings', 'rerelease_tickets', 'gate_scanner'
  const [activeTab, setActiveTab] = useState('overview');

  // Recruitment Applications State
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbStatus, setDbStatus] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [recruitmentOpen, setRecruitmentOpen] = useState(() => {
    return localStorage.getItem('nrcmfmc_recruitment_open') !== 'false';
  });
  const [shortlistedIds, setShortlistedIds] = useState(() => {
    return JSON.parse(localStorage.getItem('nrcmfmc_shortlisted_ids') || '[]');
  });

  // Re-Release Movie Settings State
  const [eventSettings, setEventSettings] = useState({
    movieTitle: 'NRCM RE-RELEASE 2026',
    tagline: 'Experience the Cult Classic on the Big Screen!',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    venue: 'NRCM Main Auditorium, Block A',
    releaseDate: 'MARCH 20, 2026',
    showTimes: ['10:30 AM (Morning Show)', '02:30 PM (Matinee)', '06:30 PM (Evening Show)'],
    tiers: [
      { id: 'vip', name: 'VIP Balcony', price: 150, description: 'Premium balcony seating with snack voucher' },
      { id: 'fanzone', name: 'Fan Zone', price: 120, description: 'Front row seats with high energy crowd' },
      { id: 'general', name: 'General Student Pass', price: 99, description: 'Standard auditorium seating' }
    ],
    isBookingOpen: true,
    announcement: 'Limited seats available! Book your tickets early to avoid last minute rush.'
  });
  const [saveSettingsStatus, setSaveSettingsStatus] = useState('');

  // Re-Release Booked Tickets State
  const [ticketsList, setTicketsList] = useState([]);
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');

  // Event Suggestions State
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [suggestionSearchQuery, setSuggestionSearchQuery] = useState('');

  // Gate QR Scanner State
  const [scanTicketIdInput, setScanTicketIdInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [scanActionLoading, setScanActionLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchRegistrations();
      fetchRecruitmentStatus();
      fetchEventSettings();
      fetchTicketsList();
      fetchSuggestionsList();
      updateClock();
      const timer = setInterval(updateClock, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const fetchSuggestionsList = async () => {
    try {
      const res = await fetch('/api/admin/suggestions');
      const data = await res.json();
      if (data.success && Array.isArray(data.suggestions)) {
        setSuggestionsList(data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggestions list:', err);
    }
  };

  const deleteSuggestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event suggestion?')) return;
    try {
      await fetch(`/api/admin/suggestions/${id}`, { method: 'DELETE' });
      setSuggestionsList(prev => prev.filter(s => s._id !== id && s.suggestionId !== id));
    } catch (_) {}
  };

  // Clean up QR Scanner on tab change or close
  useEffect(() => {
    if (activeTab !== 'gate_scanner' || !cameraActive) {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (_) {}
      }
    }
  }, [activeTab, cameraActive]);

  const updateClock = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
  };

  const fetchRecruitmentStatus = async () => {
    try {
      const res = await fetch('/api/recruitment-status');
      const data = await res.json();
      if (data.success && typeof data.isOpen === 'boolean') {
        setRecruitmentOpen(data.isOpen);
      }
    } catch (_) {}
  };

  const toggleRecruitmentStatus = async () => {
    const nextStatus = !recruitmentOpen;
    setRecruitmentOpen(nextStatus);
    try {
      await fetch('/api/admin/recruitment-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: nextStatus })
      });
    } catch (_) {}
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/registrations');
      const data = await response.json();
      if (data.success) setRegistrations(data.registrations || []);
      const healthRes = await fetch('/api/health');
      const healthData = await healthRes.json();
      setDbStatus(healthData.database || 'Connected');
    } catch (err) {
      setDbStatus('Local Mode');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventSettings = async () => {
    try {
      const res = await fetch('/api/event-settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setEventSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to fetch event settings:', err);
    }
  };

  const fetchTicketsList = async () => {
    try {
      const res = await fetch('/api/admin/tickets');
      const data = await res.json();
      if (data.success) {
        setTicketsList(data.tickets || []);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    }
  };

  const handleSaveEventSettings = async (e) => {
    e.preventDefault();
    setSaveSettingsStatus('Saving...');
    try {
      const res = await fetch('/api/admin/event-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSettingsStatus('✅ Event Settings Updated Successfully!');
        setTimeout(() => setSaveSettingsStatus(''), 3000);
      } else {
        setSaveSettingsStatus('⚠️ Failed to save settings: ' + data.error);
      }
    } catch (err) {
      setSaveSettingsStatus('⚠️ Error: ' + err.message);
    }
  };

  // Gate Scanner Actions
  const handleVerifyTicket = async (ticketIdToTest) => {
    const idToVerify = ticketIdToTest || scanTicketIdInput;
    if (!idToVerify || !idToVerify.trim()) return;

    setScanActionLoading(true);
    setVerificationResult(null);

    try {
      const res = await fetch(`/api/admin/tickets/verify/${encodeURIComponent(idToVerify.trim())}`);
      const data = await res.json();
      if (data.success) {
        setVerificationResult({
          type: data.ticket.status === 'USED' ? 'ALREADY_USED' : 'VALID',
          ticket: data.ticket
        });
      } else {
        setVerificationResult({
          type: 'INVALID',
          error: data.error || 'Ticket ID not found in database.'
        });
      }
    } catch (err) {
      setVerificationResult({
        type: 'INVALID',
        error: 'Network error verifying ticket: ' + err.message
      });
    } finally {
      setScanActionLoading(false);
    }
  };

  const handlePermitEntry = async (ticketIdToPermit) => {
    if (!ticketIdToPermit) return;
    setScanActionLoading(true);

    try {
      const res = await fetch('/api/admin/tickets/permit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticketIdToPermit })
      });
      const data = await res.json();

      if (data.success) {
        setVerificationResult({
          type: 'PERMITTED_SUCCESS',
          ticket: data.ticket,
          message: data.message
        });
        fetchTicketsList(); // refresh list
      } else {
        setVerificationResult({
          type: 'ALREADY_USED',
          ticket: data.ticket,
          error: data.error
        });
      }
    } catch (err) {
      setVerificationResult({
        type: 'INVALID',
        error: 'Failed to permit entry: ' + err.message
      });
    } finally {
      setScanActionLoading(false);
    }
  };

  const stopCameraScanner = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
            try { scannerRef.current.clear(); } catch (_) {}
            scannerRef.current = null;
            setCameraActive(false);
          }).catch(() => setCameraActive(false));
        } else {
          try { scannerRef.current.clear(); } catch (_) {}
          scannerRef.current = null;
          setCameraActive(false);
        }
      } catch (_) {
        setCameraActive(false);
      }
    } else {
      setCameraActive(false);
    }
  };

  const startCameraScanner = () => {
    setCameraActive(true);
    setTimeout(() => {
      if (!scannerRef.current) {
        const html5QrCode = new Html5Qrcode("qr-reader-container");
        scannerRef.current = html5QrCode;

        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            setScanTicketIdInput(decodedText);
            handleVerifyTicket(decodedText);
            stopCameraScanner();
          },
          () => {}
        ).catch((err) => {
          console.error("Error starting back camera:", err);
          html5QrCode.start(
            { facingMode: "user" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              setScanTicketIdInput(decodedText);
              handleVerifyTicket(decodedText);
              stopCameraScanner();
            },
            () => {}
          ).catch(e => console.error(e));
        });
      }
    }, 200);
  };

  const toggleShortlist = (id) => {
    const updated = shortlistedIds.includes(id)
      ? shortlistedIds.filter(item => item !== id)
      : [...shortlistedIds, id];
    setShortlistedIds(updated);
    localStorage.setItem('nrcmfmc_shortlisted_ids', JSON.stringify(updated));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      await fetch(`/api/admin/registrations/${id}`, { method: 'DELETE' });
      setRegistrations(prev => prev.filter(item => item._id !== id && item.passId !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Delete this ticket pass?')) return;
    try {
      await fetch(`/api/admin/tickets/${id}`, { method: 'DELETE' });
      setTicketsList(prev => prev.filter(t => t._id !== id && t.ticketId !== id));
    } catch (err) {
      console.error('Delete ticket failed:', err);
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return alert('No data to export.');
    const headers = ['APP ID', 'FULL NAME', 'MOBILE', 'EMAIL', 'BRANCH & YEAR', 'INTERESTED AREA', 'PREVIOUS EXP', 'PORTFOLIO LINK', 'WHY JOIN FMC', 'WHAT YOU BRING', 'INSTAGRAM ID', 'APPLIED AT'];
    const rows = registrations.map(r => [
      `"${r.passId || r._id}"`, `"${r.name}"`, `"${r.mobile}"`, `"${r.email}"`,
      `"${r.branch}"`, `"${r.interestedArea || ''}"`, `"${r.previousExperience || ''}"`,
      `"${r.portfolioLink || ''}"`, `"${r.whyJoin || ''}"`, `"${r.whatYouBring || ''}"`,
      `"${r.instagramId || ''}"`,
      `"${new Date(r.createdAt || Date.now()).toLocaleString()}"`
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `NRCM_FMC_Recruitment_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const filteredRegistrations = registrations.filter(r => {
    const isMatch =
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.mobile?.includes(searchQuery) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.passId?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!isMatch) return false;
    const isShortlisted = shortlistedIds.includes(r._id) || shortlistedIds.includes(r.passId);
    if (activeTab === 'shortlisted') return isShortlisted;
    return !isShortlisted;
  });

  const filteredTickets = ticketsList.filter(t => {
    return (
      t.ticketId?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
      t.studentName?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
      t.rollNo?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
      t.bookingRef?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
      t.showTime?.toLowerCase().includes(ticketSearchQuery.toLowerCase())
    );
  });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  /* Inline Styling Tokens */
  const S = {
    wrap:    { position:'fixed', inset:0, zIndex:9999, display:'flex', width:'100vw', height:'100vh', overflow:'hidden', fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor:'#F2F2F7', color:'#1c1c1e' },
    sidebar: { width:220, minWidth:220, maxWidth:220, backgroundColor:'#ffffff', borderRight:'1px solid #e5e7eb', display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%', overflowY:'auto' },
    brand:   { padding:'20px 16px 16px', display:'flex', alignItems:'center', gap:10 },
    brandTxt:{ fontSize:14, fontWeight:900, color:'#1c1c1e', letterSpacing:'-0.3px' },
    nav:     { padding:'0 10px', display:'flex', flexDirection:'column', gap:4 },
    navBtn:  (active) => ({
      width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'9px 12px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer',
      border:'none', outline:'none', transition:'background 0.15s',
      backgroundColor: active ? '#1c1c1e' : 'transparent',
      color: active ? '#ffffff' : '#3a3a3c',
    }),
    iconBox: (color) => ({ width:24, height:24, borderRadius:7, backgroundColor:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }),
    badge:   (bg, color) => ({ fontSize:10, padding:'2px 6px', borderRadius:6, backgroundColor:bg, color, fontWeight:700, minWidth:18, textAlign:'center', fontFamily:'monospace' }),
    main:    { flex:1, height:'100%', overflowY:'auto', display:'flex', flexDirection:'column' },
    topbar:  { backgroundColor:'#ffffff', borderBottom:'1px solid #e5e7eb', padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexShrink:0 },
    breadcrumb: { fontSize:13, color:'#6b7280', fontWeight:500, display:'flex', alignItems:'center', gap:6 },
    topBtn:  { display:'flex', alignItems:'center', gap:6, padding:'0 14px', height:36, borderRadius:10, backgroundColor:'#ffffff', border:'1px solid #e5e7eb', fontSize:13, fontWeight:500, color:'#374151', cursor:'pointer', whiteSpace:'nowrap' },
    body:    { flex:1, padding:24, display:'flex', flexDirection:'column', gap:20 },
    card:    { backgroundColor:'#ffffff', borderRadius:16, border:'1px solid #e5e7eb', padding:'20px 24px' },
    tHead:   { backgroundColor:'#F9F9FB', borderBottom:'1px solid #f3f4f6' },
    tHeadTh: { padding:'10px 16px', fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' },
    tRow:    { borderBottom:'1px solid #f9f9fb', transition:'background 0.1s' },
    tCell:   { padding:'12px 16px', fontSize:13, color:'#374151' },
  };

  return (
    <div style={S.wrap}>

      {/* ── SIDEBAR NAV ── */}
      <aside style={S.sidebar}>
        <div>
          <div style={S.brand}>
            <span style={S.brandTxt}>NRCM.FMC OS</span>
          </div>

          <nav style={S.nav}>
            {/* Section 1: Recruitment */}
            <span style={{ fontSize:10, fontWeight:700, color:'#9ca3af', padding:'8px 12px 2px', textTransform:'uppercase', letterSpacing:'0.05em' }}>RECRUITMENT</span>

            <button style={S.navBtn(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox(activeTab === 'overview' ? 'rgba(255,255,255,0.2)' : '#f3f4f6')}>
                  <Home size={14} color={activeTab === 'overview' ? '#fff' : '#6b7280'} />
                </div>
                <span>Applications</span>
              </div>
              <span style={S.badge(activeTab === 'overview' ? 'rgba(255,255,255,0.25)' : '#e5e7eb', activeTab === 'overview' ? '#fff' : '#6b7280')}>
                {registrations.filter(r => !shortlistedIds.includes(r._id) && !shortlistedIds.includes(r.passId)).length}
              </span>
            </button>

            <button style={S.navBtn(activeTab === 'shortlisted')} onClick={() => setActiveTab('shortlisted')}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox(activeTab === 'shortlisted' ? 'rgba(255,255,255,0.2)' : '#f3f4f6')}>
                  <Star size={14} color={activeTab === 'shortlisted' ? '#fff' : '#1c1c1e'} fill={activeTab === 'shortlisted' ? '#fff' : 'none'} />
                </div>
                <span>Shortlisted</span>
              </div>
              <span style={S.badge(activeTab === 'shortlisted' ? 'rgba(255,255,255,0.25)' : '#e5e7eb', activeTab === 'shortlisted' ? '#fff' : '#374151')}>
                {shortlistedIds.length}
              </span>
            </button>

            {/* Section 2: Re-Release Movie */}
            <span style={{ fontSize:10, fontWeight:700, color:'#9ca3af', padding:'16px 12px 2px', textTransform:'uppercase', letterSpacing:'0.05em' }}>RE-RELEASE EVENT</span>

            <button style={S.navBtn(activeTab === 'rerelease_settings')} onClick={() => setActiveTab('rerelease_settings')}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox(activeTab === 'rerelease_settings' ? 'rgba(255,255,255,0.2)' : '#fef2f2')}>
                  <Settings size={14} color={activeTab === 'rerelease_settings' ? '#fff' : '#dc2626'} />
                </div>
                <span>Event Settings</span>
              </div>
            </button>

            <button style={S.navBtn(activeTab === 'rerelease_tickets')} onClick={() => setActiveTab('rerelease_tickets')}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox(activeTab === 'rerelease_tickets' ? 'rgba(255,255,255,0.2)' : '#fef2f2')}>
                  <Ticket size={14} color={activeTab === 'rerelease_tickets' ? '#fff' : '#dc2626'} />
                </div>
                <span>Booked Tickets</span>
              </div>
              <span style={S.badge(activeTab === 'rerelease_tickets' ? 'rgba(255,255,255,0.25)' : '#fee2e2', activeTab === 'rerelease_tickets' ? '#fff' : '#dc2626')}>
                {ticketsList.length}
              </span>
            </button>

            <button style={S.navBtn(activeTab === 'rerelease_suggestions')} onClick={() => setActiveTab('rerelease_suggestions')}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox(activeTab === 'rerelease_suggestions' ? 'rgba(255,255,255,0.2)' : '#fefce8')}>
                  <Film size={14} color={activeTab === 'rerelease_suggestions' ? '#fff' : '#ca8a04'} />
                </div>
                <span>Event Suggestions</span>
              </div>
              <span style={S.badge(activeTab === 'rerelease_suggestions' ? 'rgba(255,255,255,0.25)' : '#fef08a', activeTab === 'rerelease_suggestions' ? '#fff' : '#ca8a04')}>
                {suggestionsList.length}
              </span>
            </button>

            <button style={S.navBtn(activeTab === 'gate_scanner')} onClick={() => setActiveTab('gate_scanner')}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox(activeTab === 'gate_scanner' ? 'rgba(255,255,255,0.2)' : '#f0fdf4')}>
                  <QrCode size={14} color={activeTab === 'gate_scanner' ? '#fff' : '#16a34a'} />
                </div>
                <span>Gate QR Scanner</span>
              </div>
              <span style={S.badge(activeTab === 'gate_scanner' ? 'rgba(255,255,255,0.25)' : '#dcfce7', activeTab === 'gate_scanner' ? '#fff' : '#16a34a')}>GATE</span>
            </button>

            {/* Section 3: Data Export */}
            <span style={{ fontSize:10, fontWeight:700, color:'#9ca3af', padding:'16px 12px 2px', textTransform:'uppercase', letterSpacing:'0.05em' }}>TOOLS</span>

            <button style={S.navBtn(false)} onClick={exportCSV}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox('#f0fdf4')}>
                  <Download size={14} color="#16a34a" />
                </div>
                <span>Export CSV</span>
              </div>
            </button>
          </nav>
        </div>

        <div style={{ padding:'12px 12px 16px', borderTop:'1px solid #f3f4f6' }}>
          <button onClick={onLogout}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'8px 0', borderRadius:10, backgroundColor:'#f9fafb', border:'1px solid #e5e7eb', fontSize:12, fontWeight:600, color:'#ef4444', cursor:'pointer' }}>
            <LogOut size={14} /><span>Logout OS</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main style={S.main}>

        {/* Header Topbar */}
        <header style={S.topbar}>
          <div style={S.breadcrumb}>
            <span>NRCM.FMC OS</span>
            <span style={{ color:'#d1d5db', fontSize:16 }}>›</span>
            <span style={{ color:'#1c1c1e', fontWeight:600 }}>
              {activeTab === 'overview' && 'Recruitment Applications'}
              {activeTab === 'shortlisted' && 'Shortlisted Candidates'}
              {activeTab === 'rerelease_settings' && 'Re-Release Movie Settings'}
              {activeTab === 'rerelease_tickets' && 'Booked Movie Tickets'}
              {activeTab === 'gate_scanner' && 'Gate QR Ticket Scanner & Entry Verification'}
            </span>
          </div>

          <div style={{ display:'flex', gap:8, flexShrink:0, alignItems:'center' }}>
            <button onClick={() => { fetchRegistrations(); fetchEventSettings(); fetchTicketsList(); }} style={S.topBtn}>
              <RefreshCw size={14} /><span>Refresh All</span>
            </button>
            <button onClick={onClose} style={S.topBtn}>
              <X size={14} /><span>Close OS</span>
            </button>
          </div>
        </header>

        {/* TAB 1 & TAB 2: RECRUITMENT APPLICATIONS */}
        {(activeTab === 'overview' || activeTab === 'shortlisted') && (
          <div style={S.body}>
            {/* Stat Cards & Recruitment Toggle */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
              <div style={S.card}>
                <span style={{ fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase' }}>Applications Queue</span>
                <div style={{ fontSize:28, fontWeight:700, color:'#1c1c1e', marginTop:4 }}>{registrations.length}</div>
              </div>
              <div style={S.card}>
                <span style={{ fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase' }}>Shortlisted</span>
                <div style={{ fontSize:28, fontWeight:700, color:'#2563eb', marginTop:4 }}>{shortlistedIds.length}</div>
              </div>
              <div style={S.card}>
                <span style={{ fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase' }}>Recruitment Status</span>
                <button
                  onClick={toggleRecruitmentStatus}
                  style={{
                    marginTop:6,
                    padding:'6px 14px',
                    borderRadius:8,
                    backgroundColor: recruitmentOpen ? '#dcfce7' : '#fee2e2',
                    color: recruitmentOpen ? '#15803d' : '#b91c1c',
                    fontWeight:700,
                    fontSize:12,
                    border:'none',
                    cursor:'pointer'
                  }}
                >
                  {recruitmentOpen ? 'RECRUITMENT OPEN' : 'RECRUITMENT CLOSED'}
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div style={{ ...S.card, padding:0, overflow:'hidden', flex:1, display:'flex', flexDirection:'column' }}>
              <div style={{ padding:'12px 20px', borderBottom:'1px solid #f3f4f6' }}>
                <input
                  type="text"
                  placeholder="Search applications by name, roll no, mobile, branch..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid #e5e7eb', fontSize:13 }}
                />
              </div>

              <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:420 }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={S.tHead}>
                      {['#','App ID','Full Name','Branch','Mobile','Email','Interested Area','Action'].map((h, i) => (
                        <th key={i} style={{ ...S.tHeadTh, textAlign: i === 7 ? 'right' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.length > 0 ? filteredRegistrations.map((item, index) => {
                      const isShortlisted = shortlistedIds.includes(item._id) || shortlistedIds.includes(item.passId);
                      return (
                        <tr key={item._id || index} style={S.tRow}>
                          <td style={S.tCell}>{index + 1}</td>
                          <td style={{ ...S.tCell, color:'#ef4444', fontFamily:'monospace', fontWeight:600 }}>{item.passId || item._id}</td>
                          <td style={{ ...S.tCell, fontWeight:600 }}>{item.name}</td>
                          <td style={S.tCell}>{item.branch}</td>
                          <td style={{ ...S.tCell, fontFamily:'monospace' }}>{item.mobile}</td>
                          <td style={S.tCell}>{item.email}</td>
                          <td style={{ ...S.tCell, color:'#ef4444', fontWeight:600 }}>{item.interestedArea || 'N/A'}</td>
                          <td style={{ ...S.tCell, textAlign:'right' }}>
                            <button onClick={() => toggleShortlist(item._id || item.passId)} style={{ marginRight:6, padding:'4px 8px', borderRadius:6, backgroundColor: isShortlisted ? '#fef9c3' : '#f3f4f6', border:'none', cursor:'pointer' }}>
                              <Star size={12} fill={isShortlisted ? '#ca8a04' : 'none'} color={isShortlisted ? '#ca8a04' : '#6b7280'} />
                            </button>
                            <button onClick={() => setSelectedApp(item)} style={{ marginRight:6, padding:'4px 8px', borderRadius:6, backgroundColor:'#eff6ff', color:'#2563eb', border:'none', cursor:'pointer' }}>View</button>
                            <button onClick={() => handleDelete(item._id || item.passId)} style={{ padding:'4px 8px', borderRadius:6, backgroundColor:'#fef2f2', color:'#ef4444', border:'none', cursor:'pointer' }}>Delete</button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan="8" style={{ ...S.tCell, textAlign:'center', padding:40 }}>No applications found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RE-RELEASE EVENT SETTINGS */}
        {activeTab === 'rerelease_settings' && (
          <div style={S.body}>
            <form onSubmit={handleSaveEventSettings} style={{ ...S.card, display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'flex', alignItems:'center', justifyBetween:'space-between', borderBottom:'1px solid #f3f4f6', paddingBottom:12 }}>
                <div>
                  <h2 style={{ fontSize:18, fontWeight:800, color:'#1c1c1e' }}>Re-Release Movie & Ticket Configuration</h2>
                  <p style={{ fontSize:12, color:'#6b7280' }}>Changes saved here will reflect live on the <strong style={{ color:'#dc2626' }}>/booknow</strong> student booking sub-page.</p>
                </div>
                {saveSettingsStatus && <span style={{ fontSize:12, fontWeight:700, color:'#16a34a' }}>{saveSettingsStatus}</span>}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Movie Title</label>
                  <input
                    type="text"
                    value={eventSettings.movieTitle}
                    onChange={e => setEventSettings(prev => ({ ...prev, movieTitle: e.target.value }))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Release / Event Date</label>
                  <input
                    type="text"
                    value={eventSettings.releaseDate}
                    onChange={e => setEventSettings(prev => ({ ...prev, releaseDate: e.target.value }))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                  />
                </div>

                <div style={{ gridColumn:'span 2' }}>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Movie Poster Image URL</label>
                  <input
                    type="text"
                    value={eventSettings.posterUrl}
                    onChange={e => setEventSettings(prev => ({ ...prev, posterUrl: e.target.value }))}
                    placeholder="https://..."
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Venue / Campus Location</label>
                  <input
                    type="text"
                    value={eventSettings.venue}
                    onChange={e => setEventSettings(prev => ({ ...prev, venue: e.target.value }))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Booking Open / Closed Toggle</label>
                  <button
                    type="button"
                    onClick={() => setEventSettings(prev => ({ ...prev, isBookingOpen: !prev.isBookingOpen }))}
                    style={{
                      width:'100%',
                      padding:'10px',
                      borderRadius:10,
                      backgroundColor: eventSettings.isBookingOpen ? '#dcfce7' : '#fee2e2',
                      color: eventSettings.isBookingOpen ? '#15803d' : '#b91c1c',
                      fontWeight:700,
                      border:'none',
                      cursor:'pointer'
                    }}
                  >
                    {eventSettings.isBookingOpen ? 'BOOKINGS ARE LIVE (OPEN)' : 'BOOKINGS PAUSED (CLOSED)'}
                  </button>
                </div>
              </div>

              {/* Show Times Editor */}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:6 }}>Available Show Times (Comma Separated)</label>
                <input
                  type="text"
                  value={eventSettings.showTimes ? eventSettings.showTimes.join(', ') : ''}
                  onChange={e => {
                    const times = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setEventSettings(prev => ({ ...prev, showTimes: times }));
                  }}
                  placeholder="10:30 AM (Morning Show), 02:30 PM (Matinee)"
                  style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                />
              </div>

              {/* Tiers & Prices Editor */}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:6 }}>Ticket Categories & Pricing</label>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {eventSettings.tiers && eventSettings.tiers.map((tier, idx) => (
                    <div key={idx} style={{ display:'flex', gap:10, alignItems:'center', backgroundColor:'#f9fafb', padding:10, borderRadius:10, border:'1px solid #f3f4f6' }}>
                      <input
                        type="text"
                        placeholder="Category Name"
                        value={tier.name}
                        onChange={e => {
                          const updated = [...eventSettings.tiers];
                          updated[idx].name = e.target.value;
                          setEventSettings(prev => ({ ...prev, tiers: updated }));
                        }}
                        style={{ flex:1, padding:6, borderRadius:6, border:'1px solid #d1d5db', fontSize:12 }}
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={tier.price}
                        onChange={e => {
                          const updated = [...eventSettings.tiers];
                          updated[idx].price = Number(e.target.value);
                          setEventSettings(prev => ({ ...prev, tiers: updated }));
                        }}
                        style={{ width:90, padding:6, borderRadius:6, border:'1px solid #d1d5db', fontSize:12 }}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={tier.description}
                        onChange={e => {
                          const updated = [...eventSettings.tiers];
                          updated[idx].description = e.target.value;
                          setEventSettings(prev => ({ ...prev, tiers: updated }));
                        }}
                        style={{ flex:2, padding:6, borderRadius:6, border:'1px solid #d1d5db', fontSize:12 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{ padding:'12px', borderRadius:10, backgroundColor:'#dc2626', color:'#ffffff', fontWeight:800, border:'none', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyCenter:'center', gap:8 }}
              >
                <Save size={16} /> Save Re-Release Settings
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: BOOKED TICKETS LIST */}
        {activeTab === 'rerelease_tickets' && (
          <div style={S.body}>
            <div style={{ ...S.card, padding:0, overflow:'hidden', flex:1, display:'flex', flexDirection:'column' }}>
              <div style={{ padding:'12px 20px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:'#1c1c1e' }}>All Booked Movie Tickets ({ticketsList.length})</h3>
                <input
                  type="text"
                  placeholder="Search ticket ID, student name, roll no..."
                  value={ticketSearchQuery}
                  onChange={e => setTicketSearchQuery(e.target.value)}
                  style={{ width:300, padding:'6px 12px', borderRadius:8, border:'1px solid #e5e7eb', fontSize:12 }}
                />
              </div>

              <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:440 }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={S.tHead}>
                      {['#','Ticket Pass ID','Student Name','Roll No','Branch','Show Date & Time','Category','Price','Status','Action'].map((h, i) => (
                        <th key={i} style={{ ...S.tHeadTh, textAlign: i === 9 ? 'right' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length > 0 ? filteredTickets.map((t, idx) => (
                      <tr key={t._id || idx} style={S.tRow}>
                        <td style={S.tCell}>{idx + 1}</td>
                        <td style={{ ...S.tCell, color:'#dc2626', fontFamily:'monospace', fontWeight:700 }}>{t.ticketId}</td>
                        <td style={{ ...S.tCell, fontWeight:600 }}>{t.studentName}</td>
                        <td style={{ ...S.tCell, fontFamily:'monospace' }}>{t.rollNo}</td>
                        <td style={S.tCell}>{t.branch}</td>
                        <td style={S.tCell}>{t.showDate || 'AUGUST 24, 2026'} ({t.showTime})</td>
                        <td style={{ ...S.tCell, fontWeight:600 }}>{t.tierName}</td>
                        <td style={{ ...S.tCell, color:'#16a34a', fontWeight:700 }}>₹{t.price}</td>
                        <td style={S.tCell}>
                          <span style={{
                            padding:'3px 8px', borderRadius:6, fontSize:10, fontWeight:800,
                            backgroundColor: t.status === 'USED' ? '#fee2e2' : '#dcfce7',
                            color: t.status === 'USED' ? '#b91c1c' : '#15803d'
                          }}>
                            {t.status === 'USED' ? 'USED / SCANNED' : 'VALID'}
                          </span>
                        </td>
                        <td style={{ ...S.tCell, textAlign:'right' }}>
                          <button
                            onClick={() => {
                              setActiveTab('gate_scanner');
                              setScanTicketIdInput(t.ticketId);
                              handleVerifyTicket(t.ticketId);
                            }}
                            style={{ padding:'4px 8px', borderRadius:6, backgroundColor:'#f0fdf4', color:'#16a34a', border:'none', cursor:'pointer', fontSize:11, marginRight:6 }}
                          >
                            Verify & Scan
                          </button>
                          <button onClick={() => handleDeleteTicket(t._id || t.ticketId)} style={{ padding:'4px 8px', borderRadius:6, backgroundColor:'#fef2f2', color:'#ef4444', border:'none', cursor:'pointer' }}>Delete</button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="10" style={{ ...S.tCell, textAlign:'center', padding:40 }}>No booked tickets found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GATE QR SCANNER & SINGLE-USE VERIFICATION */}
        {activeTab === 'gate_scanner' && (
          <div style={S.body}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              
              {/* Left Box: QR Input / Camera trigger */}
              <div style={{ ...S.card, display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ borderBottom:'1px solid #f3f4f6', paddingBottom:12 }}>
                  <h2 style={{ fontSize:18, fontWeight:800, color:'#1c1c1e', display:'flex', alignItems:'center', gap:8 }}>
                    <QrCode size={20} color="#16a34a" /> Gate QR Ticket Scanner
                  </h2>
                  <p style={{ fontSize:12, color:'#6b7280', marginTop:2 }}>
                    Scan QR code using camera or manually enter Ticket Pass ID to grant entrance permission.
                  </p>
                </div>

                <div style={{ display:'flex', gap:8 }}>
                  <input
                    type="text"
                    placeholder="Enter or Scan Ticket ID (e.g. NRCM-TKT-XXXX)"
                    value={scanTicketIdInput}
                    onChange={e => setScanTicketIdInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleVerifyTicket()}
                    style={{ flex:1, padding:'12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:14, fontFamily:'monospace', fontWeight:700 }}
                  />
                  <button
                    onClick={() => handleVerifyTicket()}
                    disabled={scanActionLoading}
                    style={{ padding:'0 20px', borderRadius:10, backgroundColor:'#16a34a', color:'#ffffff', fontWeight:700, border:'none', cursor:'pointer' }}
                  >
                    Check
                  </button>
                </div>

                <button
                  onClick={startCameraScanner}
                  style={{ padding:'12px', borderRadius:10, backgroundColor:'#f3f4f6', border:'1px solid #e5e7eb', color:'#374151', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                >
                  <Camera size={18} /> Start Live Camera QR Scanner
                </button>

                {cameraActive && (
                  <div style={{ border:'2px dashed #16a34a', padding:12, borderRadius:14, backgroundColor:'#f0fdf4', display:'flex', flexDirection:'column', gap:10 }}>
                    <div id="qr-reader-container" style={{ width:'100%', borderRadius:10, overflow:'hidden' }} />
                    <button
                      onClick={stopCameraScanner}
                      style={{ padding:'10px', borderRadius:10, backgroundColor:'#dc2626', color:'#ffffff', fontWeight:700, border:'none', cursor:'pointer', fontSize:13 }}
                    >
                      Stop Camera Scanner
                    </button>
                  </div>
                )}
              </div>

              {/* Right Box: Verification Result Card */}
              <div style={{ ...S.card, display:'flex', flexDirection:'column', justifyContent:'center' }}>
                {!verificationResult ? (
                  <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>
                    <QrCode size={48} style={{ margin:'0 auto 12px', opacity:0.4 }} />
                    <p style={{ fontSize:14, fontWeight:600 }}>Ready to Scan Ticket Pass</p>
                    <p style={{ fontSize:12 }}>Scan or enter a Ticket ID on the left to verify authenticity.</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    
                    {/* RESULT TYPE: VALID */}
                    {verificationResult.type === 'VALID' && (
                      <div style={{ backgroundColor:'#f0fdf4', border:'2px solid #22c55e', borderRadius:16, padding:20, textCenter:'left' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, color:'#15803d', fontWeight:800, fontSize:18, marginBottom:8 }}>
                          <CheckCircle size={24} /> VALID TICKET - ENTRY READY
                        </div>

                        <div style={{ fontSize:13, color:'#1c1c1e', spaceY:6 }}>
                          <p>Ticket ID: <strong style={{ fontFamily:'monospace', color:'#dc2626' }}>{verificationResult.ticket.ticketId}</strong></p>
                          <p>Attendee Name: <strong>{verificationResult.ticket.studentName}</strong> ({verificationResult.ticket.rollNo})</p>
                          <p>Branch: <strong>{verificationResult.ticket.branch}</strong></p>
                          <p>Show Date & Time: <strong>{verificationResult.ticket.showDate || 'AUGUST 24, 2026'} ({verificationResult.ticket.showTime})</strong></p>
                          <p>Category: <strong>{verificationResult.ticket.tierName}</strong></p>
                        </div>

                        <button
                          onClick={() => handlePermitEntry(verificationResult.ticket.ticketId)}
                          disabled={scanActionLoading}
                          style={{ marginTop:16, width:'100%', padding:'14px', borderRadius:12, backgroundColor:'#16a34a', color:'#ffffff', fontSize:15, fontWeight:900, border:'none', cursor:'pointer', boxShadow:'0 4px 12px rgba(22, 163, 74, 0.3)' }}
                        >
                          PERMIT ENTRY & MARK USED
                        </button>
                      </div>
                    )}

                    {/* RESULT TYPE: PERMITTED SUCCESS */}
                    {verificationResult.type === 'PERMITTED_SUCCESS' && (
                      <div style={{ backgroundColor:'#f0fdf4', border:'2px solid #16a34a', borderRadius:16, padding:20, textCenter:'center' }}>
                        <ShieldCheck size={48} color="#16a34a" style={{ margin:'0 auto 10px' }} />
                        <h3 style={{ fontSize:20, fontWeight:900, color:'#15803d' }}>ENTRY PERMITTED!</h3>
                        <p style={{ fontSize:13, color:'#374151', marginTop:4 }}>
                          Ticket <strong>{verificationResult.ticket.ticketId}</strong> has been marked as <strong>USED</strong> in database.
                        </p>
                      </div>
                    )}

                    {/* RESULT TYPE: ALREADY USED (ANTI-DUPLICATE WARNING) */}
                    {verificationResult.type === 'ALREADY_USED' && (
                      <div style={{ backgroundColor:'#fef2f2', border:'3px solid #ef4444', borderRadius:16, padding:20 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, color:'#b91c1c', fontWeight:900, fontSize:18, marginBottom:8 }}>
                          <ShieldAlert size={28} color="#ef4444" /> ENTRY DENIED! ALREADY SCANNED!
                        </div>

                        <p style={{ fontSize:13, color:'#991b1b', fontWeight:700, marginBottom:12 }}>
                          This ticket was ALREADY USED & SCANNED previously at: <br />
                          <span style={{ fontFamily:'monospace', backgroundColor:'#fee2e2', padding:'2px 6px', borderRadius:4 }}>
                            {verificationResult.ticket?.usedAt ? new Date(verificationResult.ticket.usedAt).toLocaleString('en-IN') : 'Earlier Today'}
                          </span>
                        </p>

                        <div style={{ fontSize:12, color:'#374151', backgroundColor:'#ffffff', padding:12, borderRadius:10, border:'1px solid #fecaca' }}>
                          <p>Ticket ID: <strong>{verificationResult.ticket?.ticketId}</strong></p>
                          <p>Name: <strong>{verificationResult.ticket?.studentName}</strong></p>
                          <p>Roll No: <strong>{verificationResult.ticket?.rollNo}</strong></p>
                        </div>
                      </div>
                    )}

                    {/* RESULT TYPE: INVALID TICKET */}
                    {verificationResult.type === 'INVALID' && (
                      <div style={{ backgroundColor:'#fef2f2', border:'2px solid #f87171', borderRadius:16, padding:20 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, color:'#b91c1c', fontWeight:900, fontSize:16, marginBottom:6 }}>
                          <AlertTriangle size={24} /> UNAUTHORIZED / UNKNOWN TICKET
                        </div>
                        <p style={{ fontSize:13, color:'#7f1d1d' }}>{verificationResult.error}</p>
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: EVENT SUGGESTIONS RECEIVED FROM STUDENTS */}
        {activeTab === 'rerelease_suggestions' && (
          <div style={S.body}>
            
            {/* Header Stat & Search Bar */}
            <div style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
              <div>
                <h2 style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:0, display:'flex', alignItems:'center', gap:8 }}>
                  <Film size={20} color="#ca8a04" /> Student Event Suggestions ({suggestionsList.length})
                </h2>
                <p style={{ fontSize:12, color:'#64748b', margin:'4px 0 0 0' }}>
                  Live list of events and movie requests submitted by students from the campus portal.
                </p>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ position:'relative', width:240 }}>
                  <Search size={14} color="#9ca3af" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search suggestions..."
                    value={suggestionSearchQuery}
                    onChange={(e) => setSuggestionSearchQuery(e.target.value)}
                    style={{ width:'100%', height:36, paddingLeft:34, paddingRight:12, borderRadius:10, border:'1px solid #e5e7eb', fontSize:12, outline:'none' }}
                  />
                </div>
                <button onClick={fetchSuggestionsList} style={S.topBtn}>
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>

            {/* Suggestions Table / Cards View */}
            <div style={S.card}>
              {suggestionsList.length === 0 ? (
                <div style={{ textAlign:'center', padding:40, color:'#64748b' }}>
                  <Film size={40} color="#ca8a04" style={{ margin:'0 auto 12px', opacity:0.5 }} />
                  <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', margin:0 }}>No Event Suggestions Submitted Yet</h3>
                  <p style={{ fontSize:12, margin:'4px 0 0 0' }}>When students submit event or movie ideas in the Events tab, they will appear here in real-time!</p>
                </div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                    <thead>
                      <tr style={S.tHead}>
                        <th style={S.tHeadTh}>SUGGESTION ID</th>
                        <th style={S.tHeadTh}>SUGGESTION CONTENT / REQUEST</th>
                        <th style={S.tHeadTh}>DATE RECEIVED</th>
                        <th style={S.tHeadTh}>STATUS</th>
                        <th style={{ ...S.tHeadTh, textAlign:'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestionsList
                        .filter(s => s.text?.toLowerCase().includes(suggestionSearchQuery.toLowerCase()))
                        .map((s) => (
                          <tr key={s._id || s.suggestionId} style={S.tRow}>
                            <td style={S.tCell}>
                              <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:12, color:'#64748b' }}>
                                {s.suggestionId || s._id?.slice(-6)}
                              </span>
                            </td>
                            <td style={S.tCell}>
                              <strong style={{ fontSize:14, color:'#0f172a' }}>{s.text}</strong>
                            </td>
                            <td style={S.tCell}>
                              <span style={{ fontSize:12, color:'#64748b' }}>
                                {new Date(s.createdAt || Date.now()).toLocaleString('en-IN', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true })}
                              </span>
                            </td>
                            <td style={S.tCell}>
                              <span style={{ backgroundColor:'rgba(202, 138, 4, 0.15)', color:'#ca8a04', fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:8 }}>
                                {s.status || 'NEW'}
                              </span>
                            </td>
                            <td style={{ ...S.tCell, textAlign:'right' }}>
                              <button
                                onClick={() => deleteSuggestion(s._id || s.suggestionId)}
                                style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', padding:4 }}
                                title="Delete Suggestion"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

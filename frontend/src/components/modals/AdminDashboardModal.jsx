import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Download, Trash2, Search, Users, LogOut, Home, FileText, Eye, Star, Ticket, Settings, QrCode, CheckCircle, AlertTriangle, ShieldAlert, ShieldCheck, Film, Save, Camera, Plus, Minus, Clock, Edit } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  // Navigation Tabs: 'overview', 'shortlisted', 'rerelease_settings', 'rerelease_tickets', 'gate_scanner'
  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem('nrcmfmc_admin_active_tab') || 'rerelease_tickets';
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem('nrcmfmc_admin_active_tab', tab);
  };

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
    venue: 'NRCM Main Auditorium, MT Block',
    releaseDate: 'MARCH 20, 2026',
    showTimes: ['10:00 AM to 12:30 PM', '01:00 PM to 03:30 PM'],
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

  // Manual Issue Ticket Modal State
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueError, setIssueError] = useState('');
  const [issueSuccessMsg, setIssueSuccessMsg] = useState('');
  const [issueFormData, setIssueFormData] = useState({
    studentName: '',
    rollNo: '',
    branch: 'CSE - 1st Year',
    mobile: '',
    email: '',
    movieTitle: 'Businessman',
    showDate: 'AUGUST 24, 2026',
    showTime: '10:00 AM to 12:30 PM',
    tierName: 'General Pass',
    price: 50,
    quantity: 1,
    razorpayPaymentId: '',
    razorpayOrderId: ''
  });

  // Edit Single Ticket Timing & Details Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');
  const [editingTicket, setEditingTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({
    ticketId: '',
    studentName: '',
    rollNo: '',
    showDate: 'AUGUST 24, 2026',
    showTime: '10:00 AM to 12:30 PM',
    tierName: '',
    status: 'VALID'
  });

  // Bulk Edit Tickets Timing State
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false);
  const [bulkShowTime, setBulkShowTime] = useState('');
  const [bulkShowDate, setBulkShowDate] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');

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

  const handleManualIssueTicket = async (e) => {
    e.preventDefault();
    setIssueLoading(true);
    setIssueError('');
    setIssueSuccessMsg('');

    try {
      const res = await fetch('/api/admin/tickets/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueFormData)
      });
      const data = await res.json();
      if (data.success && data.tickets) {
        setTicketsList(prev => [...data.tickets, ...prev]);
        setIssueSuccessMsg(`✅ ${data.tickets.length} Ticket(s) issued successfully! Ref: ${data.bookingRef}`);
        setTimeout(() => {
          setIssueModalOpen(false);
          setIssueSuccessMsg('');
          setIssueFormData({
            studentName: '',
            rollNo: '',
            branch: 'CSE - 1st Year',
            mobile: '',
            email: '',
            movieTitle: eventSettings.movieTitle || 'Businessman',
            showDate: 'AUGUST 24, 2026',
            showTime: '10:00 AM to 12:30 PM',
            tierName: 'General Pass',
            price: 50,
            quantity: 1,
            razorpayPaymentId: '',
            razorpayOrderId: ''
          });
        }, 1500);
      } else {
        setIssueError(data.error || 'Failed to generate tickets.');
      }
    } catch (err) {
      setIssueError('Network error issuing ticket: ' + err.message);
    } finally {
      setIssueLoading(false);
    }
  };

  const handleOpenEditModal = (ticket) => {
    setEditingTicket(ticket);
    setEditFormData({
      ticketId: ticket.ticketId,
      studentName: ticket.studentName || '',
      rollNo: ticket.rollNo || '',
      branch: ticket.branch || '',
      mobile: ticket.mobile || '',
      email: ticket.email || '',
      showDate: ticket.showDate || eventSettings.releaseDate || 'AUGUST 24, 2026',
      showTime: ticket.showTime || (eventSettings.showTimes?.[0]) || '10:00 AM to 12:30 PM',
      tierName: ticket.tierName || '',
      status: ticket.status || 'VALID'
    });
    setEditError('');
    setEditSuccessMsg('');
    setEditModalOpen(true);
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!editingTicket) return;

    setEditLoading(true);
    setEditError('');
    setEditSuccessMsg('');

    try {
      const ticketIdOrDbId = editingTicket._id || editingTicket.ticketId;
      const res = await fetch(`/api/admin/tickets/${encodeURIComponent(ticketIdOrDbId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showDate: editFormData.showDate,
          showTime: editFormData.showTime,
          tierName: editFormData.tierName,
          status: editFormData.status,
          studentName: editFormData.studentName,
          rollNo: editFormData.rollNo,
          branch: editFormData.branch,
          mobile: editFormData.mobile,
          email: editFormData.email
        })
      });
      const data = await res.json();
      if (data.success && data.ticket) {
        setTicketsList(prev => prev.map(t => (t._id === data.ticket._id || t.ticketId === data.ticket.ticketId) ? data.ticket : t));
        setEditSuccessMsg('✅ Ticket details & Branch/Year updated successfully!');
        setTimeout(() => {
          setEditModalOpen(false);
          setEditSuccessMsg('');
          setEditingTicket(null);
        }, 1200);
      } else {
        setEditError(data.error || 'Failed to update ticket.');
      }
    } catch (err) {
      setEditError('Network error updating ticket: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleSelectAllTickets = (e) => {
    if (e.target.checked) {
      const allIds = filteredTickets.map(t => t._id || t.ticketId);
      setSelectedTicketIds(allIds);
    } else {
      setSelectedTicketIds([]);
    }
  };

  const handleToggleSelectTicket = (id) => {
    setSelectedTicketIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkUpdateTiming = async (e) => {
    e.preventDefault();
    if (selectedTicketIds.length === 0) return;

    setBulkLoading(true);
    setBulkError('');
    setBulkSuccessMsg('');

    try {
      const res = await fetch('/api/admin/tickets/bulk-update-timing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketIds: selectedTicketIds,
          showTime: bulkShowTime,
          showDate: bulkShowDate
        })
      });
      const data = await res.json();
      if (data.success) {
        setTicketsList(prev => prev.map(t => {
          const tId = t._id || t.ticketId;
          if (selectedTicketIds.includes(tId)) {
            return {
              ...t,
              ...(bulkShowTime ? { showTime: bulkShowTime } : {}),
              ...(bulkShowDate ? { showDate: bulkShowDate } : {})
            };
          }
          return t;
        }));
        setBulkSuccessMsg(`✅ Timings updated for ${selectedTicketIds.length} ticket(s)!`);
        setTimeout(() => {
          setBulkEditModalOpen(false);
          setSelectedTicketIds([]);
          setBulkSuccessMsg('');
          setBulkShowTime('');
          setBulkShowDate('');
        }, 1200);
      } else {
        setBulkError(data.error || 'Failed to bulk update ticket timings.');
      }
    } catch (err) {
      setBulkError('Network error: ' + err.message);
    } finally {
      setBulkLoading(false);
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

  const handleResetMovieSettings = async () => {
    if (!window.confirm('Are you sure you want to DELETE / CLEAR the active movie screening? This will close bookings and clear the movie details.')) {
      return;
    }
    setSaveSettingsStatus('Resetting...');
    try {
      const res = await fetch('/api/admin/event-settings/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setEventSettings(data.settings);
        setSaveSettingsStatus('✅ Active Movie Screening Reset / Deleted!');
        setTimeout(() => setSaveSettingsStatus(''), 3000);
      } else {
        setSaveSettingsStatus('⚠️ Failed to reset: ' + data.error);
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
      t.mobile?.includes(ticketSearchQuery) ||
      t.bookingRef?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
      t.showTime?.toLowerCase().includes(ticketSearchQuery.toLowerCase())
    );
  });

  // Real-Time Ticket Analytics & Detailed Breakdown
  const ticketStats = React.useMemo(() => {
    const totalTickets = ticketsList.length;
    let totalRevenue = 0;
    let validTickets = 0;
    let usedTickets = 0;

    const showTimeBreakdown = {};
    const bookingTimeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    const dateBreakdown = {};
    const branchBreakdown = {};

    ticketsList.forEach(t => {
      totalRevenue += (Number(t.price) || 0);

      if (t.status === 'USED') {
        usedTickets++;
      } else {
        validTickets++;
      }

      let show = (t.showTime || '10:00 AM to 12:30 PM').trim();
      if (show.includes('10:30') || show.includes('10:00 AM') || show.includes('Morning')) {
        show = '10:00 AM to 12:30 PM';
      } else if (show.includes('01:00 PM') || show.includes('02:30') || show.includes('Matinee') || show.includes('Afternoon')) {
        show = '01:00 PM to 03:30 PM';
      }
      showTimeBreakdown[show] = (showTimeBreakdown[show] || 0) + 1;

      if (t.createdAt) {
        const d = new Date(t.createdAt);
        const istHours = (d.getUTCHours() + 5 + Math.floor((d.getUTCMinutes() + 30) / 60)) % 24;
        if (istHours >= 6 && istHours < 12) bookingTimeSlots.morning++;
        else if (istHours >= 12 && istHours < 17) bookingTimeSlots.afternoon++;
        else if (istHours >= 17 && istHours < 22) bookingTimeSlots.evening++;
        else bookingTimeSlots.night++;

        const dateStr = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' });
        dateBreakdown[dateStr] = (dateBreakdown[dateStr] || 0) + 1;
      }

      const br = t.branch || 'Unknown';
      branchBreakdown[br] = (branchBreakdown[br] || 0) + 1;
    });

    const sortedBranches = Object.entries(branchBreakdown).sort((a, b) => b[1] - a[1]);
    const sortedDates = Object.entries(dateBreakdown);

    return {
      totalTickets,
      totalRevenue,
      validTickets,
      usedTickets,
      showTimeBreakdown,
      bookingTimeSlots,
      sortedDates,
      sortedBranches
    };
  }, [ticketsList]);

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
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f3f4f6', paddingBottom:12 }}>
                <div>
                  <h2 style={{ fontSize:18, fontWeight:800, color:'#1c1c1e', margin:0 }}>Re-Release Movie & Ticket Configuration</h2>
                  <p style={{ fontSize:12, color:'#6b7280', margin:'4px 0 0 0' }}>Changes saved here will reflect live on the <strong style={{ color:'#dc2626' }}>/booknow</strong> student booking sub-page.</p>
                </div>
                {saveSettingsStatus && <span style={{ fontSize:12, fontWeight:700, color:'#16a34a', backgroundColor:'#f0fdf4', padding:'6px 12px', borderRadius:8, border:'1px solid #bbf7d0' }}>{saveSettingsStatus}</span>}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Movie Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Businessman, Devara, OG..."
                    value={eventSettings.movieTitle || ''}
                    onChange={e => setEventSettings(prev => ({ ...prev, movieTitle: e.target.value }))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Tagline / Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Guns Don't Need Reasons, They Need Bullets!"
                    value={eventSettings.tagline || ''}
                    onChange={e => setEventSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                  />
                </div>

                <div style={{ gridColumn:'span 2' }}>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Movie Description / Storyline</label>
                  <textarea
                    rows={3}
                    placeholder="Brief movie plot or event description..."
                    value={eventSettings.description || ''}
                    onChange={e => setEventSettings(prev => ({ ...prev, description: e.target.value }))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13, fontFamily:'inherit' }}
                  />
                </div>

                <div style={{ gridColumn:'span 2' }}>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Movie Poster Image URL</label>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <input
                      type="text"
                      value={eventSettings.posterUrl || ''}
                      onChange={e => setEventSettings(prev => ({ ...prev, posterUrl: e.target.value }))}
                      placeholder="https://..."
                      style={{ flex:1, padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                    />
                    {eventSettings.posterUrl && (
                      <img
                        src={eventSettings.posterUrl}
                        alt="Poster Preview"
                        style={{ width:48, height:64, objectFit:'cover', borderRadius:8, border:'1px solid #cbd5e1', backgroundColor:'#0f172a' }}
                        onError={e => e.target.style.display = 'none'}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Screening Date</label>
                  <input
                    type="text"
                    placeholder="e.g. AUGUST 24, 2026"
                    value={eventSettings.releaseDate || ''}
                    onChange={e => setEventSettings(prev => ({ ...prev, releaseDate: e.target.value }))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Venue / Campus Location</label>
                  <input
                    type="text"
                    value={eventSettings.venue || ''}
                    onChange={e => setEventSettings(prev => ({ ...prev, venue: e.target.value }))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                  />
                </div>

                <div style={{ gridColumn:'span 2' }}>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Booking Open / Closed Status</label>
                  <button
                    type="button"
                    onClick={() => setEventSettings(prev => ({ ...prev, isBookingOpen: !prev.isBookingOpen }))}
                    style={{
                      width:'100%',
                      padding:'12px',
                      borderRadius:10,
                      backgroundColor: eventSettings.isBookingOpen ? '#dcfce7' : '#fee2e2',
                      color: eventSettings.isBookingOpen ? '#15803d' : '#b91c1c',
                      fontWeight:800,
                      border: eventSettings.isBookingOpen ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      cursor:'pointer',
                      fontSize:13
                    }}
                  >
                    {eventSettings.isBookingOpen ? '🟢 BOOKINGS ARE LIVE (OPEN)' : '🔴 BOOKINGS PAUSED (CLOSED)'}
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
                  placeholder="10:00 AM to 12:30 PM, 01:00 PM to 03:30 PM"
                  style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #e5e7eb', fontSize:13 }}
                />
              </div>

              {/* Tiers & Prices Editor */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:'#374151', margin:0 }}>Ticket Categories & Pricing</label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = eventSettings.tiers ? [...eventSettings.tiers] : [];
                      updated.push({ id: `tier_${Date.now()}`, name: 'New Tier', price: 50, description: 'Standard pass' });
                      setEventSettings(prev => ({ ...prev, tiers: updated }));
                    }}
                    style={{ fontSize:12, fontWeight:700, color:'#2563eb', backgroundColor:'#eff6ff', border:'1px solid #bfdbfe', padding:'4px 10px', borderRadius:6, cursor:'pointer' }}
                  >
                    + Add New Tier
                  </button>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {eventSettings.tiers && eventSettings.tiers.map((tier, idx) => (
                    <div key={idx} style={{ display:'flex', gap:10, alignItems:'center', backgroundColor:'#f9fafb', padding:10, borderRadius:10, border:'1px solid #f3f4f6' }}>
                      <input
                        type="text"
                        placeholder="Category Name"
                        value={tier.name || ''}
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
                        value={tier.price || 0}
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
                        value={tier.description || ''}
                        onChange={e => {
                          const updated = [...eventSettings.tiers];
                          updated[idx].description = e.target.value;
                          setEventSettings(prev => ({ ...prev, tiers: updated }));
                        }}
                        style={{ flex:2, padding:6, borderRadius:6, border:'1px solid #d1d5db', fontSize:12 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = eventSettings.tiers.filter((_, i) => i !== idx);
                          setEventSettings(prev => ({ ...prev, tiers: updated }));
                        }}
                        style={{ backgroundColor:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:6, padding:'6px 10px', fontSize:12, cursor:'pointer', fontWeight:700 }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', gap:12, marginTop:8 }}>
                <button
                  type="submit"
                  style={{ flex:1, padding:'12px', borderRadius:10, backgroundColor:'#dc2626', color:'#ffffff', fontWeight:800, border:'none', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                >
                  <Save size={16} /> Save & Publish Movie Settings
                </button>

                <button
                  type="button"
                  onClick={handleResetMovieSettings}
                  style={{ padding:'12px 18px', borderRadius:10, backgroundColor:'#fef2f2', color:'#dc2626', fontWeight:700, border:'1.5px solid #fecaca', cursor:'pointer', fontSize:13 }}
                  title="Clear current movie title & details"
                >
                  🗑️ Delete / Clear Screening
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: BOOKED TICKETS LIST & ANALYTICS */}
        {activeTab === 'rerelease_tickets' && (
          <div style={S.body}>

            {/* 1. TOP SUMMARY METRICS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div style={{ ...S.card, padding: '16px 20px', borderLeft: '4px solid #dc2626' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tickets Booked</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span>🎟️ {ticketStats.totalTickets}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Tickets</span>
                </div>
              </div>

              <div style={{ ...S.card, padding: '16px 20px', borderLeft: '4px solid #16a34a' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue Collected</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span>💰 ₹{ticketStats.totalRevenue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ ...S.card, padding: '16px 20px', borderLeft: '4px solid #2563eb' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valid / Active Tickets</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span>✅ {ticketStats.validTickets}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: 6 }}>100% VALID</span>
                </div>
              </div>

              <div style={{ ...S.card, padding: '16px 20px', borderLeft: '4px solid #d97706' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scanned Gate Entries</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span>🚪 {ticketStats.usedTickets}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Scanned</span>
                </div>
              </div>
            </div>

            {/* 2. ANALYTICS BREAKDOWN CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

              {/* Show-Wise Breakdown */}
              <div style={{ ...S.card, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>🕒 Show-Wise Breakdown</h4>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: 6 }}>Live</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.keys(ticketStats.showTimeBreakdown).length > 0 ? (
                    Object.entries(ticketStats.showTimeBreakdown).map(([showName, count]) => {
                      const pct = Math.round((count / (ticketStats.totalTickets || 1)) * 100);
                      return (
                        <div key={showName} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#334155' }}>
                            <span>{showName}</span>
                            <span style={{ color: '#dc2626', fontFamily: 'monospace' }}>{count} Tickets ({pct}%)</span>
                          </div>
                          <div style={{ height: 6, width: '100%', backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#dc2626', borderRadius: 3 }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No show data available yet.</div>
                  )}
                </div>
              </div>

              {/* Booking Time Slots (IST) */}
              <div style={{ ...S.card, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>⏳ Booking Time Slots (IST)</h4>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: 6 }}>Peak Times</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: '🌅 Morning (6 AM - 12 PM)', count: ticketStats.bookingTimeSlots.morning },
                    { label: '☀️ Afternoon (12 PM - 5 PM)', count: ticketStats.bookingTimeSlots.afternoon },
                    { label: '🌆 Evening (5 PM - 10 PM)', count: ticketStats.bookingTimeSlots.evening, isPeak: true },
                    { label: '🌙 Night (10 PM - 6 AM)', count: ticketStats.bookingTimeSlots.night },
                  ].map((slot) => {
                    const pct = Math.round((slot.count / (ticketStats.totalTickets || 1)) * 100);
                    return (
                      <div key={slot.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#334155' }}>
                          <span style={{ fontWeight: slot.isPeak ? 700 : 600 }}>{slot.label}</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: slot.isPeak ? '#2563eb' : '#475569' }}>
                            {slot.count} Tickets {slot.isPeak && '(Highest!)'}
                          </span>
                        </div>
                        <div style={{ height: 6, width: '100%', backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: slot.isPeak ? '#2563eb' : '#64748b', borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date Trends & Top Branches */}
              <div style={{ ...S.card, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>📅 Dates & 🎓 Top Branches</h4>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: 6 }}>Analytics</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Daily Trend */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Daily Booking Trend</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {ticketStats.sortedDates.length > 0 ? (
                        ticketStats.sortedDates.map(([dStr, count]) => (
                          <div key={dStr} style={{ padding: '4px 10px', borderRadius: 8, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#1e293b' }}>
                            {dStr}: <span style={{ color: '#dc2626' }}>{count} tix</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>No date data</div>
                      )}
                    </div>
                  </div>

                  {/* Top Branches */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Top Booked Branches</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 110, overflowY: 'auto', paddingRight: 4 }}>
                      {ticketStats.sortedBranches.slice(0, 5).map(([br, count], i) => (
                        <div key={br} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#334155' }}>
                          <span>{i + 1}. {br}</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{count} tix</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. ALL BOOKED TICKETS TABLE */}
            <div style={{ ...S.card, padding:0, overflow:'hidden', flex:1, display:'flex', flexDirection:'column' }}>
              <div style={{ padding:'12px 20px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:'#1c1c1e', margin:0 }}>All Booked Movie Tickets ({ticketsList.length})</h3>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <input
                    type="text"
                    placeholder="Search ticket ID, student name, roll no..."
                    value={ticketSearchQuery}
                    onChange={e => setTicketSearchQuery(e.target.value)}
                    style={{ width:240, padding:'6px 12px', borderRadius:8, border:'1px solid #e5e7eb', fontSize:12 }}
                  />
                  <button
                    onClick={() => setIssueModalOpen(true)}
                    style={{ padding:'6px 14px', borderRadius:8, backgroundColor:'#dc2626', color:'#ffffff', fontWeight:700, border:'none', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', gap:6 }}
                  >
                    <Plus size={14} /> Issue Ticket Manually
                  </button>
                </div>
              </div>

              {/* Bulk Selection Bar */}
              {selectedTicketIds.length > 0 && (
                <div style={{ backgroundColor: '#eff6ff', borderBottom: '1px solid #bfdbfe', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>
                    Selected {selectedTicketIds.length} ticket(s)
                  </span>
                  <button
                    onClick={() => setBulkEditModalOpen(true)}
                    style={{ padding: '6px 14px', borderRadius: 8, backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Clock size={14} /> Bulk Change Show Timing
                  </button>
                </div>
              )}

              <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:440 }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={S.tHead}>
                      <th style={{ ...S.tHeadTh, width:30 }}>
                        <input
                          type="checkbox"
                          onChange={handleToggleSelectAllTickets}
                          checked={filteredTickets.length > 0 && selectedTicketIds.length === filteredTickets.length}
                        />
                      </th>
                      {['#','Ticket Pass ID','Student Name','Mobile No','Roll No','Branch','Show Date & Time','Category','Price','Status','Action'].map((h, i) => (
                        <th key={i} style={{ ...S.tHeadTh, textAlign: i === 10 ? 'right' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length > 0 ? filteredTickets.map((t, idx) => {
                      const tId = t._id || t.ticketId;
                      const isSelected = selectedTicketIds.includes(tId);
                      return (
                        <tr key={t._id || idx} style={{ ...S.tRow, backgroundColor: isSelected ? '#f0f9ff' : 'transparent' }}>
                          <td style={S.tCell}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectTicket(tId)}
                            />
                          </td>
                          <td style={S.tCell}>{idx + 1}</td>
                          <td style={{ ...S.tCell, color:'#dc2626', fontFamily:'monospace', fontWeight:700 }}>{t.ticketId}</td>
                          <td style={{ ...S.tCell, fontWeight:600 }}>{t.studentName}</td>
                          <td style={{ ...S.tCell, fontFamily:'monospace', fontWeight:700, color:'#0f172a' }}>{t.mobile || 'N/A'}</td>
                          <td style={{ ...S.tCell, fontFamily:'monospace' }}>{t.rollNo}</td>
                          <td style={S.tCell}>{t.branch}</td>
                          <td style={{ ...S.tCell, fontWeight:600, color:'#2563eb' }}>{t.showDate || 'AUGUST 24, 2026'} ({t.showTime})</td>
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
                          <td style={{ ...S.tCell, textAlign:'right', whiteSpace:'nowrap' }}>
                            <button
                              onClick={() => handleOpenEditModal(t)}
                              style={{ padding:'4px 10px', borderRadius:6, backgroundColor:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', cursor:'pointer', fontSize:11, marginRight:6, fontWeight:700, display:'inline-flex', alignItems:'center', gap:4 }}
                              title="Change Show Timing & Details"
                            >
                              <Clock size={12} /> Edit Timing
                            </button>
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
                      );
                    }) : (
                      <tr><td colSpan="12" style={{ ...S.tCell, textAlign:'center', padding:40 }}>No booked tickets found.</td></tr>
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

      {/* ── MANUAL ISSUE TICKET MODAL (ADMIN ONLY) ── */}
      {issueModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ticket size={20} color="#dc2626" /> Issue Ticket Manually (Admin)
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Generate entry pass for offline/paid students. Reflects immediately in Total Bookings.
                </p>
              </div>
              <button
                onClick={() => setIssueModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Notifications */}
            {issueError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
                {issueError}
              </div>
            )}
            {issueSuccessMsg && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px', fontWeight: 700 }}>
                {issueSuccessMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleManualIssueTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Row 1: Student Name & Roll No */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={issueFormData.studentName}
                    onChange={e => setIssueFormData({ ...issueFormData, studentName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25X01A05IS"
                    value={issueFormData.rollNo}
                    onChange={e => setIssueFormData({ ...issueFormData, rollNo: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 2: Mobile & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9381501682"
                    value={issueFormData.mobile}
                    onChange={e => setIssueFormData({ ...issueFormData, mobile: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. 25x01a05is@nrcmec.org"
                    value={issueFormData.email}
                    onChange={e => setIssueFormData({ ...issueFormData, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 3: Branch & Show Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Branch & Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE - 1st Year"
                    value={issueFormData.branch}
                    onChange={e => setIssueFormData({ ...issueFormData, branch: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Show Date
                  </label>
                  <select
                    value={issueFormData.showDate}
                    onChange={e => setIssueFormData({ ...issueFormData, showDate: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="AUGUST 24, 2026">AUGUST 24, 2026</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Show Time & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Show Time
                  </label>
                  <select
                    value={issueFormData.showTime}
                    onChange={e => setIssueFormData({ ...issueFormData, showTime: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="10:00 AM to 12:30 PM">10:00 AM to 12:30 PM</option>
                    <option value="01:00 PM to 03:30 PM">01:00 PM to 03:30 PM</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Pass Category & Price
                  </label>
                  <select
                    value={issueFormData.tierName}
                    onChange={e => {
                      const selectedTier = e.target.value;
                      let p = 50;
                      if (selectedTier === 'VIP Balcony') p = 150;
                      if (selectedTier === 'Fan Zone') p = 120;
                      setIssueFormData({ ...issueFormData, tierName: selectedTier, price: p });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="General Pass">General Pass (₹50)</option>
                    <option value="VIP Balcony">VIP Balcony (₹150)</option>
                    <option value="Fan Zone">Fan Zone (₹120)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Ticket Quantity & Razorpay Payment ID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    No. of Tickets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={issueFormData.quantity}
                    onChange={e => setIssueFormData({ ...issueFormData, quantity: parseInt(e.target.value, 10) || 1 })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Razorpay Payment ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. pay_TRclxrU4KRljMU"
                    value={issueFormData.razorpayPaymentId}
                    onChange={e => setIssueFormData({ ...issueFormData, razorpayPaymentId: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issueLoading}
                  style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)' }}
                >
                  <Plus size={16} /> {issueLoading ? 'Issuing Ticket...' : 'Generate & Add Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT TICKET TIMING & DETAILS MODAL ── */}
      {editModalOpen && editingTicket && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={20} color="#2563eb" /> Change Ticket Show Timing
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Update show date & time for Ticket: <strong style={{ color: '#dc2626', fontFamily: 'monospace' }}>{editingTicket.ticketId}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Ticket Brief Card */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{editingTicket.studentName} ({editingTicket.rollNo})</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Branch: {editingTicket.branch || 'N/A'} | Current: <span style={{ color: '#dc2626', fontWeight: 600 }}>{editingTicket.showDate || 'AUGUST 24, 2026'} ({editingTicket.showTime})</span>
              </div>
            </div>

            {/* Notifications */}
            {editError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
                {editError}
              </div>
            )}
            {editSuccessMsg && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px', fontWeight: 700 }}>
                {editSuccessMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUpdateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Row 1: Student Name & Roll No */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.studentName}
                    onChange={e => setEditFormData({ ...editFormData, studentName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.rollNo}
                    onChange={e => setEditFormData({ ...editFormData, rollNo: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 2: Branch & Year (Crucial requested fix) */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  🎓 Branch & Year (Edit Branch Mistakes) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE - 1st Year, ECE - 2nd Year..."
                  value={editFormData.branch}
                  onChange={e => setEditFormData({ ...editFormData, branch: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #2563eb', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box', backgroundColor: '#eff6ff' }}
                />
              </div>

              {/* Row 3: Mobile & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.mobile}
                    onChange={e => setEditFormData({ ...editFormData, mobile: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Show Time Select / Custom Input */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Show Time *
                </label>
                <select
                  value={editFormData.showTime}
                  onChange={e => setEditFormData({ ...editFormData, showTime: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff', boxSizing: 'border-box', marginBottom: '6px' }}
                >
                  {eventSettings.showTimes && eventSettings.showTimes.map((st, i) => (
                    <option key={i} value={st}>{st}</option>
                  ))}
                  <option value="10:00 AM to 12:30 PM">10:00 AM to 12:30 PM</option>
                  <option value="01:00 PM to 03:30 PM">01:00 PM to 03:30 PM</option>
                  <option value="04:00 PM to 06:30 PM">04:00 PM to 06:30 PM</option>
                  <option value="07:00 PM to 09:30 PM">07:00 PM to 09:30 PM</option>
                </select>
                <input
                  type="text"
                  placeholder="Or type custom timing (e.g. 02:00 PM to 04:30 PM)"
                  value={editFormData.showTime}
                  onChange={e => setEditFormData({ ...editFormData, showTime: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Show Date Select / Custom Input */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Show Date *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AUGUST 24, 2026"
                  value={editFormData.showDate}
                  onChange={e => setEditFormData({ ...editFormData, showDate: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Category & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Pass Category
                  </label>
                  <input
                    type="text"
                    value={editFormData.tierName}
                    onChange={e => setEditFormData({ ...editFormData, tierName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Ticket Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="VALID">VALID</option>
                    <option value="USED">USED / SCANNED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}
                >
                  <Save size={16} /> {editLoading ? 'Saving Changes...' : 'Save Updated Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── BULK EDIT TICKETS TIMING MODAL ── */}
      {bulkEditModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={20} color="#2563eb" /> Bulk Change Show Timings
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Updating timings for <strong style={{ color: '#2563eb' }}>{selectedTicketIds.length} selected ticket(s)</strong>
                </p>
              </div>
              <button
                onClick={() => setBulkEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Notifications */}
            {bulkError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px', fontWeight: 600 }}>
                {bulkError}
              </div>
            )}
            {bulkSuccessMsg && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px', fontWeight: 700 }}>
                {bulkSuccessMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleBulkUpdateTiming} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Bulk Show Time */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Select New Show Time
                </label>
                <select
                  value={bulkShowTime}
                  onChange={e => setBulkShowTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff', boxSizing: 'border-box', marginBottom: '6px' }}
                >
                  <option value="">-- Keep Original Time --</option>
                  {eventSettings.showTimes && eventSettings.showTimes.map((st, i) => (
                    <option key={i} value={st}>{st}</option>
                  ))}
                  <option value="10:00 AM to 12:30 PM">10:00 AM to 12:30 PM</option>
                  <option value="01:00 PM to 03:30 PM">01:00 PM to 03:30 PM</option>
                  <option value="04:00 PM to 06:30 PM">04:00 PM to 06:30 PM</option>
                  <option value="07:00 PM to 09:30 PM">07:00 PM to 09:30 PM</option>
                </select>
                <input
                  type="text"
                  placeholder="Or type custom timing"
                  value={bulkShowTime}
                  onChange={e => setBulkShowTime(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Bulk Show Date */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Select New Show Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. AUGUST 24, 2026 (Leave empty to keep original)"
                  value={bulkShowDate}
                  onChange={e => setBulkShowDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={() => setBulkEditModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkLoading || (!bulkShowTime && !bulkShowDate)}
                  style={{ padding: '10px 20px', borderRadius: '10px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)', opacity: (!bulkShowTime && !bulkShowDate) ? 0.6 : 1 }}
                >
                  <Clock size={16} /> {bulkLoading ? 'Updating All...' : `Apply Timing to ${selectedTicketIds.length} Tickets`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

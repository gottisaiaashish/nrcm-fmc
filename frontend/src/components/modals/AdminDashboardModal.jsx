import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Download, Trash2, Search, Users, LogOut, Home, FileText, Eye } from 'lucide-react';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbStatus, setDbStatus] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedApp, setSelectedApp] = useState(null);
  const [recruitmentOpen, setRecruitmentOpen] = useState(() => {
    return localStorage.getItem('nrcmfmc_recruitment_open') !== 'false';
  });

  useEffect(() => {
    if (isOpen) {
      fetchRegistrations();
      fetchRecruitmentStatus();
      updateClock();
      const timer = setInterval(updateClock, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const fetchRecruitmentStatus = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      const res = await fetch(`${apiUrl}/api/recruitment-status`);
      const data = await res.json();
      if (data.success && typeof data.isOpen === 'boolean') {
        setRecruitmentOpen(data.isOpen);
        localStorage.setItem('nrcmfmc_recruitment_open', data.isOpen ? 'true' : 'false');
      }
    } catch (_) {}
  };

  const toggleRecruitmentStatus = async () => {
    const nextStatus = !recruitmentOpen;
    setRecruitmentOpen(nextStatus);
    localStorage.setItem('nrcmfmc_recruitment_open', nextStatus ? 'true' : 'false');
    window.dispatchEvent(new Event('recruitment_status_changed'));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      await fetch(`${apiUrl}/api/admin/recruitment-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: nextStatus })
      });
    } catch (_) {}
  };

  const updateClock = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/registrations`);
      const data = await response.json();
      if (data.success) setRegistrations(data.registrations || []);
      const healthRes = await fetch(`${apiUrl}/api/health`);
      const healthData = await healthRes.json();
      setDbStatus(healthData.database || 'Connected');
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      setRegistrations(localData);
      setDbStatus('Local Storage');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      await fetch(`${apiUrl}/api/admin/registrations/${id}`, { method: 'DELETE' });
      setRegistrations(prev => prev.filter(item => item._id !== id && item.passId !== id));
      const localData = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(localData.filter(item => item._id !== id && item.passId !== id)));
    } catch (err) {
      console.error('Delete failed:', err);
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

  const filtered = registrations.filter(r =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.mobile?.includes(searchQuery) ||
    r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.interestedArea?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.whyJoin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.whatYouBring?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.instagramId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.passId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  /* ── reusable inline style tokens ── */
  const S = {
    wrap:    { position:'fixed', inset:0, zIndex:9999, display:'flex', width:'100vw', height:'100vh', overflow:'hidden', fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor:'#F2F2F7', color:'#1c1c1e' },
    sidebar: { width:185, minWidth:185, maxWidth:185, backgroundColor:'#ffffff', borderRight:'1px solid #e5e7eb', display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%', overflowY:'auto' },
    brand:   { padding:'20px 16px 16px', display:'flex', alignItems:'center', gap:10 },
    logoBox: { width:32, height:32, borderRadius:8, backgroundColor:'#1c1c1e', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
    logoTxt: { color:'#fff', fontSize:10, fontWeight:900, letterSpacing:'-0.5px' },
    brandTxt:{ fontSize:13, fontWeight:700, color:'#1c1c1e', letterSpacing:'-0.3px', lineHeight:1.2 },
    nav:     { padding:'0 8px', display:'flex', flexDirection:'column', gap:2 },
    navBtn:  (active) => ({
      width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'9px 12px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer',
      border:'none', outline:'none', transition:'background 0.15s',
      backgroundColor: active ? '#1c1c1e' : 'transparent',
      color: active ? '#ffffff' : '#3a3a3c',
    }),
    iconBox: (color) => ({ width:24, height:24, borderRadius:7, backgroundColor:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }),
    badge:   (bg, color) => ({ fontSize:10, padding:'2px 6px', borderRadius:6, backgroundColor:bg, color, fontWeight:700, minWidth:18, textAlign:'center', fontFamily:'monospace' }),
    main:    { flex:1, height:'100%', overflowY:'auto', display:'flex', flexDirection:'column' },
    topbar:  { backgroundColor:'#ffffff', borderBottom:'1px solid #e5e7eb', padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexShrink:0 },
    breadcrumb: { fontSize:13, color:'#6b7280', fontWeight:500, display:'flex', alignItems:'center', gap:6 },
    searchWrap: { position:'relative', flex:1, maxWidth:320, margin:'0 16px' },
    searchInput: { width:'100%', height:36, paddingLeft:32, paddingRight:36, borderRadius:10, backgroundColor:'#F2F2F7', border:'1px solid #e5e7eb', fontSize:13, color:'#1c1c1e', outline:'none', fontFamily:'inherit' },
    topBtn:  { display:'flex', alignItems:'center', gap:6, padding:'0 14px', height:36, borderRadius:10, backgroundColor:'#ffffff', border:'1px solid #e5e7eb', fontSize:13, fontWeight:500, color:'#374151', cursor:'pointer', whiteSpace:'nowrap' },
    body:    { flex:1, padding:24, display:'flex', flexDirection:'column', gap:20 },
    card:    { backgroundColor:'#ffffff', borderRadius:16, border:'1px solid #e5e7eb', padding:'20px 24px' },
    statLabel: { fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 },
    statNum: { fontSize:30, fontWeight:700, color:'#1c1c1e', lineHeight:1 },
    statSub: (color) => ({ fontSize:12, fontWeight:600, color, marginTop:6, display:'block' }),
    tHead:   { backgroundColor:'#F9F9FB', borderBottom:'1px solid #f3f4f6' },
    tHeadTh: { padding:'10px 16px', fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' },
    tRow:    { borderBottom:'1px solid #f9f9fb', transition:'background 0.1s' },
    tCell:   { padding:'12px 16px', fontSize:13, color:'#374151' },
  };

  return (
    <div style={S.wrap}>

      {/* ── SIDEBAR ── */}
      <aside style={S.sidebar}>
        <div>
          {/* Brand */}
          <div style={S.brand}>
            <span style={S.brandTxt}>NRCM.FMC OS</span>
          </div>

          {/* Nav */}
          <nav style={S.nav}>
            {/* Home */}
            <button style={S.navBtn(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox(activeTab === 'overview' ? 'rgba(255,255,255,0.2)' : '#f3f4f6')}>
                  <Home size={14} color={activeTab === 'overview' ? '#fff' : '#6b7280'} />
                </div>
                <span style={{ whiteSpace:'nowrap' }}>Overview</span>
              </div>
              <span style={S.badge(activeTab === 'overview' ? 'rgba(255,255,255,0.25)' : '#e5e7eb', activeTab === 'overview' ? '#fff' : '#6b7280')}>HQ</span>
            </button>

            {/* Event Passes */}
            <button style={S.navBtn(false)} onClick={() => setActiveTab('overview')}
              onMouseEnter={e => e.currentTarget.style.backgroundColor='#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox('#fff1f2')}>
                  <Users size={14} color="#ef4444" />
                </div>
                <span>Applications</span>
              </div>
              <span style={S.badge('#ef4444', '#fff')}>{registrations.length}</span>
            </button>

            {/* Export */}
            <button style={S.navBtn(false)} onClick={exportCSV}
              onMouseEnter={e => e.currentTarget.style.backgroundColor='#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={S.iconBox('#f0fdf4')}>
                  <Download size={14} color="#16a34a" />
                </div>
                <span>Export Data</span>
              </div>
              <span style={S.badge('#f3f4f6', '#9ca3af')}>CSV</span>
            </button>
          </nav>
        </div>

        {/* Logout only */}
        <div style={{ padding:'12px 12px 16px', borderTop:'1px solid #f3f4f6' }}>
          <button onClick={onLogout}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'8px 0', borderRadius:10, backgroundColor:'#f9fafb', border:'1px solid #e5e7eb', fontSize:12, fontWeight:600, color:'#ef4444', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor='#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor='#f9fafb'}>
            <LogOut size={14} /><span>Logout OS</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={S.main}>

        {/* Top Header */}
        <header style={S.topbar}>
          <div style={S.breadcrumb}>
            <span>NRCM.FMC OS</span>
            <span style={{ color:'#d1d5db', fontSize:16 }}>›</span>
            <span style={{ color:'#1c1c1e', fontWeight:600 }}>Recruitment Applications</span>
          </div>

          <div style={S.searchWrap}>
            <Search size={14} color="#9ca3af" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={S.searchInput}
            />
            <span style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', fontSize:10, color:'#d1d5db', backgroundColor:'#e5e7eb', padding:'2px 5px', borderRadius:4, fontFamily:'monospace' }}>⌘K</span>
          </div>

          <div style={{ display:'flex', gap:8, flexShrink:0, alignItems:'center' }}>
            {/* Recruitment Toggle Switch */}
            <button onClick={toggleRecruitmentStatus} title="Toggle Recruitment Status ON/OFF"
              style={{
                display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:20,
                backgroundColor: recruitmentOpen ? '#f0fdf4' : '#fef2f2',
                border: `1.5px solid ${recruitmentOpen ? '#bbf7d0' : '#fecaca'}`,
                color: recruitmentOpen ? '#16a34a' : '#dc2626',
                fontWeight:700, fontSize:11, cursor:'pointer', transition:'all 0.2s ease',
                boxShadow:'0 1px 2px rgba(0,0,0,0.05)'
              }}>
              <span style={{
                width:8, height:8, borderRadius:'50%',
                backgroundColor: recruitmentOpen ? '#16a34a' : '#dc2626',
                boxShadow: recruitmentOpen ? '0 0 8px #16a34a' : '0 0 8px #dc2626'
              }} />
              <span>RECRUITMENT: {recruitmentOpen ? 'ON (OPEN)' : 'OFF (CLOSED)'}</span>
            </button>

            <button onClick={fetchRegistrations} disabled={loading} style={S.topBtn}
              onMouseEnter={e => e.currentTarget.style.backgroundColor='#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor='#ffffff'}>
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              <span>Refresh</span>
            </button>
            <button onClick={onClose} style={{ ...S.topBtn }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor='#fef2f2'; e.currentTarget.style.color='#ef4444'; e.currentTarget.style.borderColor='#fecaca'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor='#ffffff'; e.currentTarget.style.color='#374151'; e.currentTarget.style.borderColor='#e5e7eb'; }}>
              <X size={14} /><span>Close OS</span>
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={S.body}>

          {/* Welcome */}
          <div style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, color:'#1c1c1e', display:'flex', alignItems:'center', gap:8 }}>
                {getGreeting()} 🌼
              </h1>
              <p style={{ fontSize:13, color:'#6b7280', marginTop:4 }}>
                Welcome to NRCM.FMC Command Center. Reviewing live student recruitment applications.
              </p>
            </div>
            <div style={{ textAlign:'right', flexShrink:0, marginLeft:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end', fontSize:15, fontWeight:600, color:'#1c1c1e' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', backgroundColor:'#10b981', display:'inline-block', animation:'pulse 2s infinite' }} />
                <span>{currentTime || '00:00:00 am'}</span>
              </div>
              <p style={{ fontSize:11, color:'#9ca3af', fontWeight:500, marginTop:3 }}>{currentDate}</p>
            </div>
          </div>

          {/* Stat Cards & Controls */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
            {[
              { label:'Total Applications', value: registrations.length, sub:'↑ Live FMC Recruitment Applications', subColor:'#10b981' },
              { label:'Active Departments', value: new Set(registrations.map(r => r.branch)).size || 1, sub:'In Active Review', subColor:'#3b82f6' },
            ].map((c, i) => (
              <div key={i} style={S.card}>
                <span style={S.statLabel}>{c.label}</span>
                <div style={S.statNum}>{c.value}</div>
                <span style={S.statSub(c.subColor)}>{c.sub}</span>
              </div>
            ))}

            {/* 3rd Card: Direct Recruitment Switch */}
            <div style={{ ...S.card, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div>
                <span style={S.statLabel}>RECRUITMENT CONTROL</span>
                <div style={{ fontSize:18, fontWeight:800, color: recruitmentOpen ? '#16a34a' : '#dc2626', marginTop:6 }}>
                  {recruitmentOpen ? 'ONLINE (ACCEPTING)' : 'OFFLINE (CLOSED)'}
                </div>
              </div>
              <button onClick={toggleRecruitmentStatus}
                style={{
                  marginTop:12, padding:'8px 14px', borderRadius:10,
                  backgroundColor: recruitmentOpen ? '#16a34a' : '#dc2626',
                  color:'#ffffff', border:'none', fontWeight:700, fontSize:12,
                  cursor:'pointer', transition:'all 0.2s ease', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                  boxShadow: recruitmentOpen ? '0 4px 12px rgba(22, 163, 74, 0.3)' : '0 4px 12px rgba(220, 38, 38, 0.3)'
                }}>
                <span>SWITCH TO {recruitmentOpen ? 'OFF (CLOSE)' : 'ON (OPEN)'}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ ...S.card, padding:0, overflow:'hidden', flex:1, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid #f3f4f6' }}>
              <h2 style={{ fontSize:15, fontWeight:600, color:'#1c1c1e', display:'flex', alignItems:'center', gap:8 }}>
                <FileText size={16} color="#ef4444" />
                Recruitment Applications List
              </h2>
              <span style={{ fontSize:11, fontWeight:500, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Showing {filtered.length} Entries
              </span>
            </div>

            <div style={{ overflowX:'auto', overflowY:'auto', maxHeight:380 }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={S.tHead}>
                    {['#','App ID','Full Name','Branch','Mobile','Email','Interested Area','Prev Exp','Why Join FMC','What You Bring','Insta ID','Portfolio / Links','Action'].map((h, i) => (
                      <th key={i} style={{ ...S.tHeadTh, textAlign: i === 12 ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((item, index) => (
                    <tr key={item._id || index} style={S.tRow}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                      <td style={{ ...S.tCell, color:'#9ca3af', fontWeight:500, fontSize:12 }}>{index + 1}</td>
                      <td style={{ ...S.tCell, color:'#ef4444', fontFamily:'monospace', fontWeight:600, fontSize:12 }}>{item.passId || item._id}</td>
                      <td style={{ ...S.tCell, fontWeight:600, color:'#1c1c1e' }}>{item.name}</td>
                      <td style={S.tCell}>
                        <span style={{ padding:'3px 8px', borderRadius:6, backgroundColor:'#f3f4f6', color:'#4b5563', fontSize:11, fontWeight:600 }}>{item.branch}</span>
                      </td>
                      <td style={{ ...S.tCell, fontFamily:'monospace', fontSize:12 }}>{item.mobile}</td>
                      <td style={{ ...S.tCell, color:'#6b7280', fontSize:12 }}>{item.email}</td>
                      <td style={{ ...S.tCell, fontWeight:600, color:'#ef4444', fontSize:12 }}>{item.interestedArea || 'N/A'}</td>
                      <td style={{ ...S.tCell, fontSize:12 }}>{item.previousExperience || 'N/A'}</td>
                      <td style={{ ...S.tCell, fontSize:11, color:'#374151', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={item.whyJoin}>
                        {item.whyJoin || 'N/A'}
                      </td>
                      <td style={{ ...S.tCell, fontSize:11, color:'#374151', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={item.whatYouBring}>
                        {item.whatYouBring || 'N/A'}
                      </td>
                      <td style={{ ...S.tCell, fontFamily:'monospace', color:'#2563eb', fontSize:12 }}>{item.instagramId || 'N/A'}</td>
                      <td style={{ ...S.tCell, fontSize:11, color:'#6b7280', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {item.portfolioLink ? (
                          <a href={item.portfolioLink.startsWith('http') ? item.portfolioLink : `https://${item.portfolioLink}`} target="_blank" rel="noreferrer" style={{ color:'#2563eb', textDecoration:'underline' }}>
                            {item.portfolioLink}
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td style={{ ...S.tCell, textAlign:'right', whiteSpace:'nowrap' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6 }}>
                          <button onClick={() => setSelectedApp(item)} title="View Full Application Details"
                            style={{ padding:'6px 10px', borderRadius:8, backgroundColor:'#eff6ff', border:'none', color:'#2563eb', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600 }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor='#2563eb'; e.currentTarget.style.color='#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor='#eff6ff'; e.currentTarget.style.color='#2563eb'; }}>
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <button onClick={() => handleDelete(item._id || item.passId)} title="Delete Entry"
                            style={{ padding:'6px', borderRadius:8, backgroundColor:'#fef2f2', border:'none', color:'#ef4444', cursor:'pointer', display:'inline-flex', alignItems:'center' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor='#ef4444'; e.currentTarget.style.color='#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor='#fef2f2'; e.currentTarget.style.color='#ef4444'; }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="13" style={{ ...S.tCell, textAlign:'center', color:'#d1d5db', padding:'60px 0', fontSize:13 }}>
                        {loading ? 'Loading applications...' : 'No recruitment applications found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Application Detail View Modal */}
      {selectedApp && (
        <div style={{ position:'fixed', inset:0, zIndex:10000, backgroundColor:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyCenter:'center', padding:20 }} onClick={() => setSelectedApp(null)}>
          <div style={{ backgroundColor:'#ffffff', color:'#1c1c1e', borderRadius:16, width:'100%', maxWidth:650, maxHeight:'90vh', overflowY:'auto', margin:'auto', padding:24, boxShadow:'0 25px 50px -12px rgba(0, 0, 0, 0.25)', border:'1px solid #e5e7eb' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyBetween:'space-between', pb:16, borderBottom:'1px solid #f3f4f6', marginBottom:20 }}>
              <div>
                <span style={{ fontSize:11, fontWeight:700, fontFamily:'monospace', color:'#ef4444', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                  RECRUITMENT APPLICATION #{selectedApp.passId || selectedApp._id}
                </span>
                <h2 style={{ fontSize:22, fontWeight:800, color:'#1c1c1e', margin:'2px 0 0' }}>
                  {selectedApp.name}
                </h2>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ background:'none', border:'none', padding:6, cursor:'pointer', color:'#6b7280', borderRadius:8 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16, marginBottom:20 }}>
              <div style={{ backgroundColor:'#f9fafb', padding:'12px 14px', borderRadius:10, border:'1px solid #f3f4f6' }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', display:'block' }}>BRANCH & YEAR</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#1c1c1e', marginTop:2, display:'block' }}>{selectedApp.branch || 'N/A'}</span>
              </div>
              <div style={{ backgroundColor:'#f9fafb', padding:'12px 14px', borderRadius:10, border:'1px solid #f3f4f6' }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', display:'block' }}>INTERESTED AREA</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#ef4444', marginTop:2, display:'block' }}>{selectedApp.interestedArea || 'N/A'}</span>
              </div>
              <div style={{ backgroundColor:'#f9fafb', padding:'12px 14px', borderRadius:10, border:'1px solid #f3f4f6' }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', display:'block' }}>PHONE NUMBER</span>
                <span style={{ fontSize:13, fontWeight:600, fontFamily:'monospace', color:'#1c1c1e', marginTop:2, display:'block' }}>{selectedApp.mobile || 'N/A'}</span>
              </div>
              <div style={{ backgroundColor:'#f9fafb', padding:'12px 14px', borderRadius:10, border:'1px solid #f3f4f6' }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', display:'block' }}>EMAIL ID</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#1c1c1e', marginTop:2, display:'block', wordBreak:'break-all' }}>{selectedApp.email || 'N/A'}</span>
              </div>
              <div style={{ backgroundColor:'#f9fafb', padding:'12px 14px', borderRadius:10, border:'1px solid #f3f4f6' }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', display:'block' }}>PREVIOUS EXPERIENCE</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#1c1c1e', marginTop:2, display:'block' }}>{selectedApp.previousExperience || 'N/A'}</span>
              </div>
              <div style={{ backgroundColor:'#f9fafb', padding:'12px 14px', borderRadius:10, border:'1px solid #f3f4f6' }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', display:'block' }}>INSTAGRAM HANDLE</span>
                <span style={{ fontSize:13, fontWeight:600, fontFamily:'monospace', color:'#2563eb', marginTop:2, display:'block' }}>{selectedApp.instagramId || 'N/A'}</span>
              </div>
            </div>

            {selectedApp.portfolioLink && (
              <div style={{ backgroundColor:'#eff6ff', padding:'12px 14px', borderRadius:10, border:'1px solid #bfdbfe', marginBottom:20 }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#1e40af', textTransform:'uppercase', letterSpacing:'0.05em', display:'block' }}>PORTFOLIO / DRIVE LINK</span>
                <a href={selectedApp.portfolioLink.startsWith('http') ? selectedApp.portfolioLink : `https://${selectedApp.portfolioLink}`} target="_blank" rel="noreferrer" style={{ fontSize:13, fontWeight:600, color:'#2563eb', textDecoration:'underline', marginTop:2, display:'block', wordBreak:'break-all' }}>
                  {selectedApp.portfolioLink}
                </a>
              </div>
            )}

            {/* Paragraph 1: Why Join FMC */}
            <div style={{ marginBottom:20 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:6 }}>
                WHY DO YOU WANT TO JOIN NRCM FILM MAKING CLUB?
              </span>
              <div style={{ backgroundColor:'#f9fafb', padding:14, borderRadius:12, border:'1px solid #e5e7eb', fontSize:13, color:'#1c1c1e', lineHeight:1.6, whiteSpace:'pre-wrap' }}>
                {selectedApp.whyJoin || 'No response provided.'}
              </div>
            </div>

            {/* Paragraph 2: What You Bring */}
            <div style={{ marginBottom:20 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:6 }}>
                WHAT UNIQUE SKILLS OR PERSPECTIVE WILL YOU BRING TO FMC?
              </span>
              <div style={{ backgroundColor:'#f9fafb', padding:14, borderRadius:12, border:'1px solid #e5e7eb', fontSize:13, color:'#1c1c1e', lineHeight:1.6, whiteSpace:'pre-wrap' }}>
                {selectedApp.whatYouBring || 'No response provided.'}
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:12, borderTop:'1px solid #f3f4f6' }}>
              <button onClick={() => setSelectedApp(null)} style={{ padding:'8px 20px', borderRadius:10, backgroundColor:'#1c1c1e', color:'#ffffff', border:'none', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .custom-cursor, .custom-cursor-dot { display: none !important; }
      `}</style>
    </div>
  );
}

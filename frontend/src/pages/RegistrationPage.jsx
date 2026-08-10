import React, { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', branch: 'CSE', mobile: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      await fetch(`${apiUrl}/api/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (_) {}
    const existing = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
    existing.unshift({ _id: `FMC-PASS-${Date.now()}`, passId: `FMC-PASS-${Date.now()}`, ...formData, createdAt: new Date().toISOString() });
    localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(existing));
    setLoading(false);
    setSubmitted(true);
  };

  const S = {
    page:     { fontFamily: "'Space Grotesk', -apple-system, sans-serif", minHeight: '100vh', backgroundColor: '#F0ECD9', color: '#17171a' },
    topbar:   { backgroundColor: '#0f0f11', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    backBtn:  { fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 },
    brand:    { fontFamily: 'monospace', fontSize: 11, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' },

    eventBanner: { margin: 0, borderRadius: 0, overflow: 'hidden', border: 'none', boxShadow: 'none', backgroundColor: '#0f0f11' },
    bannerImg: { width: '100%', height: 'clamp(160px, 40vw, 240px)', objectFit: 'cover', display: 'block', filter: 'brightness(0.35) contrast(1.1)' },
    bannerOverlay: { position: 'relative', marginTop: -4 },
    bannerCenter: { position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' },
    eventTag:  { fontFamily: 'monospace', fontSize: 9, color: '#e50914', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 },
    heroTitle: { fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 0.9, letterSpacing: '-0.02em', fontSize: 'clamp(1.8rem, 7vw, 3rem)', margin: 0 },
    heroYear:  { color: '#e50914', lineHeight: 1, marginTop: 4, fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontStyle: 'italic' },

    metaRow:  { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', backgroundColor: '#17171a' },
    metaCell: (last) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 6px', gap: 4, borderRight: last ? 'none' : '1px solid rgba(255,255,255,0.08)' }),
    metaLbl:  { fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' },
    metaVal:  { fontFamily: 'monospace', fontSize: 10, color: '#fff', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 },

    formWrap: { padding: '28px 20px 40px', maxWidth: 560, margin: '0 auto' },
    heading:  { textAlign: 'center', marginBottom: 28 },
    h2:       { fontWeight: 900, textTransform: 'uppercase', color: '#17171a', letterSpacing: '-0.02em', fontSize: 'clamp(2rem, 8vw, 3rem)', margin: '0 0 8px', lineHeight: 1 },
    subtext:  { fontFamily: 'monospace', fontSize: 10, color: 'rgba(23,23,26,0.45)', textTransform: 'uppercase', letterSpacing: '0.2em' },

    fieldWrap:{ marginBottom: 16 },
    label:    { display: 'block', fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: 'rgba(23,23,26,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 },
    input:    { width: '100%', height: 52, backgroundColor: '#EBE7D3', border: '3px solid #17171a', borderRadius: 14, padding: '0 16px', color: '#17171a', fontSize: 14, fontFamily: 'inherit', fontWeight: 600, outline: 'none', boxSizing: 'border-box', transition: 'background 0.15s' },
    select:   { width: '100%', height: 52, backgroundColor: '#EBE7D3', border: '3px solid #17171a', borderRadius: 14, padding: '0 40px 0 16px', color: '#17171a', fontSize: 14, fontFamily: 'inherit', fontWeight: 600, outline: 'none', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' },
    grid2:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
    submitBtn:{ width: '100%', padding: '16px 0', borderRadius: 14, backgroundColor: '#e50914', color: '#fff', fontFamily: 'monospace', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2em', border: '3px solid #17171a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8, boxShadow: '3px 3px 0 #17171a', transition: 'transform 0.1s, box-shadow 0.1s' },
    footer:   { textAlign: 'center', fontFamily: 'monospace', fontSize: 10, color: 'rgba(23,23,26,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 28 },
  };

  if (submitted) {
    return (
      <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', backgroundColor: '#e50914', border: '4px solid #17171a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 #17171a', marginBottom: 24 }}>
          <Check size={42} color="#fff" strokeWidth={3.5} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#e50914', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12, display: 'block' }}>
          EVENT PASS GENERATED
        </span>
        <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 8vw, 3rem)', textTransform: 'uppercase', color: '#17171a', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16 }}>
          PASS CONFIRMED,<br />{formData.name}
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(23,23,26,0.65)', textTransform: 'uppercase', lineHeight: 2, maxWidth: 320, marginBottom: 32 }}>
          Your official entry pass for{' '}
          <span style={{ color: '#e50914', fontWeight: 700 }}>NRCM.FMC Induction 2026</span>{' '}
          has been logged for{' '}
          <span style={{ color: '#e50914', fontWeight: 700 }}>{formData.branch}</span>.
          {' '}See you at Main Auditorium!
        </p>
        <button onClick={() => navigate('/')}
          style={{ padding: '14px 36px', borderRadius: 40, backgroundColor: '#17171a', color: '#F0ECD9', fontFamily: 'monospace', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', border: '3px solid #17171a', cursor: 'pointer', boxShadow: '3px 3px 0 rgba(23,23,26,0.3)' }}>
          DONE — BACK TO SITE
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>

      {/* STICKY TOP BAR */}
      <div style={S.topbar}>
        <button onClick={() => navigate('/')} style={S.backBtn}>← Back</button>
        <span style={S.brand}>NRCM.FMC</span>
        <div style={{ width: 40 }} />
      </div>

      {/* EVENT BANNER */}
      <div style={S.eventBanner}>
        <div style={{ position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
            alt="Junior Induction 2026"
            style={S.bannerImg}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
            <span style={S.eventTag}>NRCM.FMC · Official Event</span>
            <h1 style={S.heroTitle}>JUNIOR INDUCTION</h1>
            <div style={S.heroYear}>2026</div>
          </div>
        </div>
        {/* meta strip inside banner card */}
        <div style={S.metaRow}>
          {[
            { icon: <Calendar size={12} color="#e50914" />, label: 'DATE', val: 'AUG 11, 2026' },
            { icon: <Clock size={12} color="#e50914" />, label: 'TIME', val: '03:30 PM IST' },
            { icon: <MapPin size={12} color="#e50914" />, label: 'VENUE', val: 'MAIN AUDI' },
          ].map((item, i) => (
            <div key={i} style={S.metaCell(i === 2)}>
              {item.icon}
              <span style={S.metaLbl}>{item.label}</span>
              <span style={S.metaVal}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div style={S.formWrap}>
        <div style={S.heading}>
          <h2 style={S.h2}>REACH OUT</h2>
          <p style={S.subtext}>Fill in your details to secure your entry pass</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={S.fieldWrap}>
            <label style={S.label}>FULL NAME *</label>
            <input type="text" required placeholder="ENTER YOUR FULL NAME" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })} style={S.input}
              onFocus={e => e.target.style.backgroundColor = '#fff'}
              onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
          </div>

          <div style={S.fieldWrap}>
            <label style={S.label}>BRANCH / DEPT *</label>
            <div style={{ position: 'relative' }}>
              <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} style={S.select}>
                <option value="CSE">CSE — COMPUTER SCIENCE</option>
                <option value="ECE">ECE — ELECTRONICS &amp; COMM</option>
                <option value="IT">IT — INFORMATION TECH</option>
                <option value="CSM/CSD">CSM / CSD — AI &amp; DATA</option>
                <option value="MECH">MECH — MECHANICAL</option>
                <option value="CIVIL">CIVIL — CIVIL ENGG</option>
              </select>
              <ChevronDown size={16} color="#17171a" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={S.grid2}>
            <div>
              <label style={S.label}>MOBILE *</label>
              <input type="tel" required placeholder="+91 98765 43210" value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })} style={S.input}
                onFocus={e => e.target.style.backgroundColor = '#fff'}
                onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
            </div>
            <div>
              <label style={S.label}>EMAIL *</label>
              <input type="email" required placeholder="STUDENT@NRCM.AC.IN" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} style={S.input}
                onFocus={e => e.target.style.backgroundColor = '#fff'}
                onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}
            onMouseDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '1px 1px 0 #17171a'; }}
            onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #17171a'; }}>
            {loading ? 'GENERATING PASS...' : <>SUBMIT <ArrowRight size={16} strokeWidth={3} /></>}
          </button>
        </form>

        <p style={S.footer}>© NRCM Film Making Club · Junior Induction 2026</p>
      </div>

    </div>
  );
}

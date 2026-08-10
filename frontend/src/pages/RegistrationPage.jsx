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

  /* ── all styles inline to bypass dark global CSS ── */
  const S = {
    page:    { fontFamily: "'Space Grotesk', -apple-system, sans-serif", minHeight: '100vh', backgroundColor: '#0f0f11', color: '#fff' },
    hero:    { position: 'relative', width: '100%', height: 'clamp(240px, 55vw, 420px)', overflow: 'hidden' },
    heroImg: { width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) contrast(1.1)', transform: 'scale(1.05)' },
    heroGrad:{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f0f11 0%, transparent 50%)' },
    backBtn: { position: 'absolute', top: 16, left: 16, fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 },
    heroCont:{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', paddingBottom: 16 },
    eventTag:{ fontFamily: 'monospace', fontSize: 10, color: '#ef4444', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 },
    heroTitle:{ fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 0.9, letterSpacing: '-0.02em', fontSize: 'clamp(2rem, 9vw, 5rem)', margin: 0 },
    heroYear:{ fontStyle: 'italic', color: '#ef4444', lineHeight: 1, marginTop: 6, fontSize: 'clamp(2.4rem, 10vw, 5.5rem)', fontFamily: "'Instrument Serif', serif" },

    metaBar: { backgroundColor: '#111114', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    metaGrid:{ maxWidth: 480, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', divideX: '1px solid rgba(255,255,255,0.05)' },
    metaCell:{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 8px', gap: 5, borderRight: '1px solid rgba(255,255,255,0.05)' },
    metaLbl: { fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' },
    metaVal: { fontFamily: 'monospace', fontSize: 11, color: '#fff', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 },

    /* separator line between meta bar and form */
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '0' },

    formWrap:{ maxWidth: 480, margin: '0 auto', padding: '36px 20px 40px' },
    heading: { textAlign: 'center', marginBottom: 32 },
    h2:      { fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 0.9, letterSpacing: '-0.02em', fontSize: 'clamp(2rem, 8vw, 3rem)', margin: '0 0 10px' },
    subtext: { fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.2em' },

    fieldWrap:{ marginBottom: 16 },
    label:   { display: 'block', fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 8 },
    input:   { width: '100%', height: 50, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '0 16px', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, background 0.2s' },
    select:  { width: '100%', height: 50, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '0 40px 0 16px', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer', transition: 'border-color 0.2s' },
    grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
    submitBtn:{ width: '100%', padding: '15px 0', borderRadius: 14, backgroundColor: '#e50914', color: '#fff', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.15em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8, boxShadow: '0 8px 30px rgba(229,9,20,0.3)', transition: 'background 0.15s' },
    footer:  { textAlign: 'center', fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 32 },
  };

  if (submitted) {
    return (
      <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', backgroundColor: '#e50914', border: '3px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(229,9,20,0.4)', marginBottom: 28 }}>
          <Check size={44} color="#fff" strokeWidth={3} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#ef4444', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: 12 }}>✦ PASS GENERATED ✦</span>
        <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 9vw, 3.5rem)', textTransform: 'uppercase', color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 16 }}>
          PASS CONFIRMED,<br /><span style={{ color: '#ef4444' }}>{formData.name}</span>
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', lineHeight: 2, maxWidth: 320, marginBottom: 36 }}>
          Your entry for <span style={{ color: '#ef4444', fontWeight: 700 }}>NRCM.FMC Induction 2026</span> has been logged for <span style={{ color: '#fff', fontWeight: 700 }}>{formData.branch}</span>. See you at Main Auditorium!
        </p>
        <button onClick={() => navigate('/')}
          style={{ padding: '14px 36px', borderRadius: 40, backgroundColor: '#fff', color: '#0f0f11', fontFamily: 'monospace', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', border: 'none', cursor: 'pointer' }}>
          ← BACK TO SITE
        </button>
      </div>
    );
  }

  return (
    <div style={S.page}>

      {/* HERO */}
      <div style={S.hero}>
        <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80" alt="Junior Induction" style={S.heroImg} />
        <div style={S.heroGrad} />
        <button onClick={() => navigate('/')} style={S.backBtn}>← NRCM.FMC</button>
        <div style={S.heroCont}>
          <span style={S.eventTag}>NRCM.FMC · Official Event</span>
          <h1 style={S.heroTitle}>JUNIOR<br />INDUCTION</h1>
          <div style={S.heroYear}>2026</div>
        </div>
      </div>

      {/* META BAR */}
      <div style={S.metaBar}>
        <div style={S.metaGrid}>
          {[
            { icon: <Calendar size={14} color="#ef4444" />, label: 'DATE', val: 'AUG 11, 2026' },
            { icon: <Clock size={14} color="#ef4444" />, label: 'TIME', val: '03:30 PM IST' },
            { icon: <MapPin size={14} color="#ef4444" />, label: 'VENUE', val: 'MAIN AUDI' },
          ].map((item, i) => (
            <div key={i} style={{ ...S.metaCell, borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              {item.icon}
              <span style={S.metaLbl}>{item.label}</span>
              <span style={S.metaVal}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DIVIDER */}
      <div style={S.divider} />

      {/* FORM */}
      <div style={S.formWrap}>
        <div style={S.heading}>
          <h2 style={S.h2}>REACH OUT</h2>
          <p style={S.subtext}>Secure your entry pass below</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div style={S.fieldWrap}>
            <label style={S.label}>FULL NAME *</label>
            <input type="text" required placeholder="Enter your full name" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })} style={S.input}
              onFocus={e => { e.target.style.borderColor = 'rgba(239,68,68,0.5)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'; }} />
          </div>

          <div style={S.fieldWrap}>
            <label style={S.label}>BRANCH / DEPT *</label>
            <div style={{ position: 'relative' }}>
              <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} style={S.select}
                onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                <option value="CSE" style={{ background: '#17171a' }}>CSE — Computer Science</option>
                <option value="ECE" style={{ background: '#17171a' }}>ECE — Electronics &amp; Comm</option>
                <option value="IT" style={{ background: '#17171a' }}>IT — Information Tech</option>
                <option value="CSM/CSD" style={{ background: '#17171a' }}>CSM / CSD — AI &amp; Data</option>
                <option value="MECH" style={{ background: '#17171a' }}>MECH — Mechanical</option>
                <option value="CIVIL" style={{ background: '#17171a' }}>CIVIL — Civil Engg</option>
              </select>
              <ChevronDown size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={S.grid2}>
            <div>
              <label style={S.label}>MOBILE *</label>
              <input type="tel" required placeholder="+91 98765 43210" value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })} style={S.input}
                onFocus={e => { e.target.style.borderColor = 'rgba(239,68,68,0.5)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'; }} />
            </div>
            <div>
              <label style={S.label}>EMAIL *</label>
              <input type="email" required placeholder="student@nrcm.ac.in" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} style={S.input}
                onFocus={e => { e.target.style.borderColor = 'rgba(239,68,68,0.5)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'; }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cc0812'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e50914'}>
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                GENERATING PASS...
              </>
            ) : (
              <>SUBMIT <ArrowRight size={16} strokeWidth={3} /></>
            )}
          </button>
        </form>

        <p style={S.footer}>© NRCM Film Making Club · Junior Induction 2026</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClosed, setIsClosed] = useState(() => {
    return localStorage.getItem('nrcmfmc_recruitment_open') === 'false';
  });

  React.useEffect(() => {
    const handleStatusChange = () => {
      setIsClosed(localStorage.getItem('nrcmfmc_recruitment_open') === 'false');
    };
    window.addEventListener('storage', handleStatusChange);
    window.addEventListener('recruitment_status_changed', handleStatusChange);
    return () => {
      window.removeEventListener('storage', handleStatusChange);
      window.removeEventListener('recruitment_status_changed', handleStatusChange);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    branch: 'CSE',
    year: '1ST YEAR',
    interestedArea: 'Cinematography / Camera',
    previousExperience: 'No',
    portfolioLink: '',
    whyJoin: '',
    whatYouBring: '',
    instagramId: ''
  });

  const handleSubmit = async (e) => {
    if (isClosed) return;
    e.preventDefault();
    setLoading(true);
    const submissionData = {
      ...formData,
      branch: `${formData.branch} — ${formData.year}`
    };
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      await fetch(`${apiUrl}/api/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
    } catch (_) {}
    const existing = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
    existing.unshift({ _id: `FMC-APP-${Date.now()}`, passId: `FMC-APP-${Date.now()}`, ...submissionData, createdAt: new Date().toISOString() });
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

    formWrap: { padding: '28px 20px 48px', maxWidth: 640, margin: '0 auto' },
    heading:  { textAlign: 'center', marginBottom: 28 },
    h2:       { fontWeight: 900, textTransform: 'uppercase', color: '#17171a', letterSpacing: '-0.02em', fontSize: 'clamp(2rem, 8vw, 3rem)', margin: '0 0 8px', lineHeight: 1 },
    subtext:  { fontFamily: 'monospace', fontSize: 10, color: 'rgba(23,23,26,0.45)', textTransform: 'uppercase', letterSpacing: '0.2em' },

    fieldWrap:{ marginBottom: 20 },
    label:    { display: 'block', fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: 'rgba(23,23,26,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 },
    subLabel: { fontFamily: 'monospace', fontSize: 9, color: 'rgba(23,23,26,0.45)', textTransform: 'uppercase', fontWeight: 500, marginLeft: 6 },
    input:    { width: '100%', height: 52, backgroundColor: '#EBE7D3', border: '3px solid #17171a', borderRadius: 14, padding: '0 16px', color: '#17171a', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, outline: 'none', boxSizing: 'border-box', transition: 'background 0.15s' },
    textarea: { width: '100%', minHeight: 90, backgroundColor: '#EBE7D3', border: '3px solid #17171a', borderRadius: 14, padding: '12px 16px', color: '#17171a', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, outline: 'none', boxSizing: 'border-box', transition: 'background 0.15s', resize: 'vertical' },
    select:   { width: '100%', height: 52, backgroundColor: '#EBE7D3', border: '3px solid #17171a', borderRadius: 14, padding: '0 40px 0 16px', color: '#17171a', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, outline: 'none', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' },
    grid2:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 },
    submitBtn:{ width: '100%', padding: '18px 0', borderRadius: 14, backgroundColor: '#e50914', color: '#fff', fontFamily: 'monospace', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2em', border: '3px solid #17171a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, boxShadow: '3px 3px 0 #17171a', transition: 'transform 0.1s, box-shadow 0.1s' },
    footer:   { textAlign: 'center', fontFamily: 'monospace', fontSize: 10, color: 'rgba(23,23,26,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 28 },
  };

  if (submitted) {
    return (
      <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', backgroundColor: '#e50914', border: '4px solid #17171a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 #17171a', marginBottom: 24 }}>
          <Check size={42} color="#fff" strokeWidth={3.5} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#e50914', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12, display: 'block' }}>
          APPLICATION RECEIVED
        </span>
        <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 7vw, 2.8rem)', textTransform: 'uppercase', color: '#17171a', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
          APPLICATION UNDER REVIEW,<br />{formData.name}
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(23,23,26,0.65)', textTransform: 'uppercase', lineHeight: 2, maxWidth: 380, marginBottom: 32 }}>
          Thank you for applying! Your recruitment application for{' '}
          <span style={{ color: '#e50914', fontWeight: 700 }}>NRCM.FMC</span>{' '}
          has been recorded for{' '}
          <span style={{ color: '#e50914', fontWeight: 700 }}>{formData.branch}</span>.
          {' '}Our team will review your application details and contact you soon!
        </p>
        <button onClick={() => navigate('/')}
          style={{ padding: '14px 36px', borderRadius: 40, backgroundColor: '#17171a', color: '#F0ECD9', fontFamily: 'monospace', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', border: '3px solid #17171a', cursor: 'pointer', boxShadow: '3px 3px 0 rgba(23,23,26,0.3)' }}>
          DONE — BACK TO SITE
        </button>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="min-h-screen w-full bg-[#F0ECD9] text-[#17171a] flex flex-col justify-between items-center px-6 py-10">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#17171a]">
            NRCM.FMC // RECRUITMENT 2026
          </span>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#17171a] text-[#F0ECD9] hover:bg-red-600 transition-all font-mono text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md"
          >
            <span>← BACK TO SITE</span>
          </button>
        </div>

        <div className="w-full max-w-3xl mx-auto text-center py-12 flex flex-col items-center my-auto">
          <div className="w-20 h-20 rounded-full bg-red-600/10 text-red-600 border-4 border-[#17171a] mb-8 flex items-center justify-center shadow-[4px_4px_0px_#17171a]">
            <ChevronDown className="w-10 h-10 rotate-90 stroke-[3]" />
          </div>

          <h1 className="font-sans font-black uppercase text-4xl sm:text-6xl md:text-7xl text-[#17171a] tracking-tight leading-none mb-6 text-center">
            SORRY, RECRUITMENT HAS BEEN CLOSED
          </h1>

          <p className="font-mono text-xs sm:text-base font-bold text-[#17171a]/70 uppercase tracking-widest leading-relaxed max-w-xl mb-10 text-center">
            APPLICATIONS FOR NRCM FILM MAKING CLUB RECRUITMENT 2026 ARE CURRENTLY CLOSED. THANK YOU FOR YOUR INTEREST!
          </p>

          <button
            onClick={() => navigate('/')}
            className="px-10 py-5 rounded-2xl bg-[#e50914] text-white font-mono text-sm sm:text-base font-black tracking-[0.15em] uppercase border-4 border-[#17171a] shadow-[6px_6px_0px_#17171a] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-3"
          >
            <span>RETURN TO HOME</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        <div className="w-full text-center font-mono text-xs font-bold text-[#17171a]/40 uppercase tracking-widest">
          © 2026 NRCM FILM MAKING CLUB · OFFICIAL RECRUITMENT
        </div>
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
            src="/join_crew_bg.jpg"
            alt="NRCM FMC Crew Recruitment"
            style={S.bannerImg}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
            <span style={S.eventTag}>NRCM.FMC · RECRUITMENT 2026</span>
            <h1 style={S.heroTitle}>JOIN THE CREW</h1>
            <div style={S.heroYear}>2026</div>
          </div>
        </div>
        {/* meta strip inside banner card */}
        <div style={S.metaRow}>
          {[
            { label: 'CLUB', val: 'NRCM.FMC' },
            { label: 'STATUS', val: 'APPLICATIONS OPEN' },
            { label: 'ELIGIBILITY', val: 'ALL BRANCHES' },
          ].map((item, i) => (
            <div key={i} style={S.metaCell(i === 2)}>
              <span style={S.metaLbl}>{item.label}</span>
              <span style={S.metaVal}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div style={S.formWrap}>
        <div style={S.heading}>
          <h2 style={S.h2}>JOIN THE CLUB</h2>
          <p style={S.subtext}>Fill in your details to apply for NRCM FMC Crew</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* 1. Full Name */}
          <div style={S.fieldWrap}>
            <label style={S.label}>1. FULL NAME *</label>
            <input type="text" required placeholder="ENTER YOUR FULL NAME" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })} style={S.input}
              onFocus={e => e.target.style.backgroundColor = '#fff'}
              onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
          </div>

          {/* 2 & 3. Phone & Email */}
          <div style={S.grid2}>
            <div>
              <label style={S.label}>2. PHONE NUMBER *</label>
              <input type="tel" required placeholder="+91 98765 43210" value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })} style={S.input}
                onFocus={e => e.target.style.backgroundColor = '#fff'}
                onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
            </div>
            <div>
              <label style={S.label}>3. EMAIL ID *</label>
              <input type="email" required placeholder="STUDENT@NRCM.AC.IN" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} style={S.input}
                onFocus={e => e.target.style.backgroundColor = '#fff'}
                onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
            </div>
          </div>

          {/* 4. Branch & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full" style={S.fieldWrap}>
            <div>
              <label style={S.label}>4. BRANCH *</label>
              <div style={{ position: 'relative' }}>
                <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} style={S.select}>
                  <option value="CSE">CSE — COMPUTER SCIENCE</option>
                  <option value="ECE">ECE — ELECTRONICS &amp; COMM</option>
                  <option value="EEE">EEE — ELECTRICAL &amp; ELECTRONICS</option>
                  <option value="AIML">AIML — AI &amp; MACHINE LEARNING</option>
                  <option value="CYBER SECURITY">CYBER SECURITY</option>
                  <option value="CIVIL">CIVIL — CIVIL ENGG</option>
                  <option value="MECH">MECH — MECHANICAL</option>
                  <option value="IT">IT — INFORMATION TECH</option>
                  <option value="OTHER">OTHER</option>
                </select>
                <ChevronDown size={16} color="#17171a" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div>
              <label style={S.label}>YEAR OF STUDY *</label>
              <div style={{ position: 'relative' }}>
                <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} style={S.select}>
                  <option value="1ST YEAR">1ST YEAR (I YEAR)</option>
                  <option value="2ND YEAR">2ND YEAR (II YEAR)</option>
                  <option value="3RD YEAR">3RD YEAR (III YEAR)</option>
                  <option value="4TH YEAR">4TH YEAR (IV YEAR)</option>
                </select>
                <ChevronDown size={16} color="#17171a" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* 5. Interested Area */}
          <div style={S.fieldWrap}>
            <label style={S.label}>5. WHICH AREA ARE YOU INTERESTED IN? *</label>
            <div style={{ position: 'relative' }}>
              <select value={formData.interestedArea} onChange={e => setFormData({ ...formData, interestedArea: e.target.value })} style={S.select}>
                <option value="Cinematography / Camera">CINEMATOGRAPHY / CAMERA</option>
                <option value="Direction">DIRECTION</option>
                <option value="Story & Screenwriting">STORY &amp; SCREENWRITING</option>
                <option value="Video Editing">VIDEO EDITING</option>
                <option value="Photography">PHOTOGRAPHY</option>
                <option value="Acting">ACTING</option>
                <option value="Graphic / Poster Design">GRAPHIC / POSTER DESIGN</option>
                <option value="Content Creation">CONTENT CREATION</option>
                <option value="Marketing & PR">MARKETING &amp; PR</option>
                <option value="Production / Event Management">PRODUCTION / EVENT MANAGEMENT</option>
              </select>
              <ChevronDown size={16} color="#17171a" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* 6. Previous Experience */}
          <div style={S.fieldWrap}>
            <label style={S.label}>6. DO YOU HAVE ANY PREVIOUS EXPERIENCE? *</label>
            <div style={{ position: 'relative' }}>
              <select value={formData.previousExperience} onChange={e => setFormData({ ...formData, previousExperience: e.target.value })} style={S.select}>
                <option value="No">NO</option>
                <option value="Yes">YES</option>
                <option value="A little / Beginner">A LITTLE / BEGINNER</option>
              </select>
              <ChevronDown size={16} color="#17171a" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* 7. Portfolio Link */}
          <div style={S.fieldWrap}>
            <label style={S.label}>
              7. IF YES, SHARE YOUR WORK / PORTFOLIO
              <span style={S.subLabel}>(OPTIONAL)</span>
            </label>
            <input type="text" placeholder="Instagram / YouTube / Drive / Portfolio link" value={formData.portfolioLink}
              onChange={e => setFormData({ ...formData, portfolioLink: e.target.value })} style={S.input}
              onFocus={e => e.target.style.backgroundColor = '#fff'}
              onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
          </div>

          {/* 8. Why join FMC */}
          <div style={S.fieldWrap}>
            <label style={S.label}>8. WHY DO YOU WANT TO JOIN FMC?</label>
            <textarea placeholder="Share why you want to be a part of FMC..." value={formData.whyJoin}
              onChange={e => setFormData({ ...formData, whyJoin: e.target.value })} style={S.textarea}
              onFocus={e => e.target.style.backgroundColor = '#fff'}
              onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
          </div>

          {/* 9. What can you bring */}
          <div style={S.fieldWrap}>
            <label style={S.label}>9. WHAT CAN YOU BRING TO FMC?</label>
            <textarea placeholder="Examples: Creativity, editing, ideas, leadership, photography, acting, etc." value={formData.whatYouBring}
              onChange={e => setFormData({ ...formData, whatYouBring: e.target.value })} style={S.textarea}
              onFocus={e => e.target.style.backgroundColor = '#fff'}
              onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
          </div>

          {/* 10. Instagram ID */}
          <div style={S.fieldWrap}>
            <label style={S.label}>
              10. INSTAGRAM ID
              <span style={S.subLabel}>(Useful to identify/contact students)</span>
            </label>
            <input type="text" placeholder="@username" value={formData.instagramId}
              onChange={e => setFormData({ ...formData, instagramId: e.target.value })} style={S.input}
              onFocus={e => e.target.style.backgroundColor = '#fff'}
              onBlur={e => e.target.style.backgroundColor = '#EBE7D3'} />
          </div>

          <button type="submit" disabled={loading} style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}
            onMouseDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '1px 1px 0 #17171a'; }}
            onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #17171a'; }}>
            {loading ? 'SUBMITTING...' : <>SUBMIT APPLICATION <ArrowRight size={16} strokeWidth={3} /></>}
          </button>
        </form>

        <p style={S.footer}>© NRCM Film Making Club · Official Recruitment 2026</p>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, ChevronDown, HelpCircle, Camera, Video } from 'lucide-react';

export default function SupportModal({ isOpen, onClose }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How do I enter the auditorium on show day?',
      a: 'Present your Digital Pass QR Code (from your phone screen or PDF) at NRCM Main Auditorium Block A Entrance Gate Counter 1 for instant single-use scan.'
    },
    {
      q: 'Can I book multiple tickets for my friends?',
      a: 'Yes! Select your desired quantity (1 to 10 tickets), fill the student details in the form, and you will receive separate unique QR passes for each student.'
    },
    {
      q: 'What if my payment succeeded but pass did not generate?',
      a: 'Don\'t worry! Tap the WhatsApp/Phone support buttons below or present your Razorpay Payment Ref ID at Counter 1 for instant pass re-issuance.'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            borderBottom: '1px solid #1e293b'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#ffffff' }}>FMC Student Helpdesk</h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>NRCM FilmMaking Club • Block A</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              backgroundColor: 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Quick Action Contact Cards */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '10px' }}>
              CONTACT US
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Mobile Phone 1 & WhatsApp */}
              <a
                href="https://wa.me/918919786462"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block' }}>+91 89197 86462</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>WhatsApp / Call Support</span>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  Chat / Call
                </span>
              </a>

              {/* Mobile Phone 2 */}
              <a
                href="tel:+917997639659"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block' }}>+91 79976 39659</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>FMC Coordinator Line</span>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  Call Now
                </span>
              </a>

              {/* Email Support */}
              <a
                href="mailto:nrcmfmc@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block' }}>nrcmfmc@gmail.com</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Official Helpdesk Email</span>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#e11d48', backgroundColor: '#fff1f2', padding: '4px 10px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                  Email
                </span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '10px' }}>
              OFFICIAL SOCIALS
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <a
                href="https://instagram.com/nrcm.fmc"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#fdf2f8',
                  border: '1px solid #fbcfe8',
                  color: '#db2777',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Camera size={16} /> @nrcm.fmc
              </a>

              <a
                href="https://youtube.com/@nrcm.fmc"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecdd3',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Video size={16} /> FMC YouTube
              </a>
            </div>
          </div>

          {/* Gate Counter Location Card */}
          <div style={{ padding: '14px', borderRadius: '16px', backgroundColor: '#0f172a', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <MapPin size={16} color="#e11d48" />
              <strong style={{ fontSize: '13px', color: '#ffffff' }}>Gate Counter Location</strong>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
              NRCM Main Auditorium, Block A Entrance • Gate Counter 1 (9:30 AM - 5:30 PM on show days).
            </p>
          </div>

          {/* Student FAQs */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '10px' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqs.map((item, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={`support-faq-${idx}`}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#0f172a'
                      }}
                    >
                      <span>{item.q}</span>
                      <ChevronDown size={16} style={{ color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '10px 14px 12px 14px', fontSize: '11px', color: '#64748b', borderTop: '1px dashed #e2e8f0', lineHeight: '1.5' }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Close Button */}
        <div style={{ padding: '14px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Close Support
          </button>
        </div>
      </div>
    </div>
  );
}

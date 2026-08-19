import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, ChevronDown, Camera, Video, Clock } from 'lucide-react';

export default function SupportPage() {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = 'FMC Student Helpdesk & Support';
  }, []);

  const faqs = [
    {
      q: 'How do I enter the auditorium on show day?',
      a: 'Present your Digital Entry Pass QR Code (on your mobile phone screen or saved PDF) at NRCM Main Auditorium MT Block Entrance Gate Counter 1 for an instant single-use QR scan.'
    },
    {
      q: 'Can I book multiple tickets for my friends?',
      a: 'Yes! Select your desired quantity (up to 10 tickets), fill each student\'s details in the verification cards, and individual digital passes with unique QR codes will be issued for everyone.'
    },
    {
      q: 'What if my payment succeeded but pass did not generate?',
      a: 'Don\'t worry! Contact our student leads directly via WhatsApp/Call below, or present your Razorpay Payment ID at Gate Counter 1 for instant pass re-issuance.'
    },
    {
      q: 'What is the ticket price and convenience fee?',
      a: 'The entry pass price is fixed at ₹50 per student. A nominal Razorpay Payment Gateway & GST fee of +₹3 per ticket applies at checkout (Total: ₹53 per ticket).'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '60px' }}>
      
      {/* Top Fixed Navigation Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 20px'
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#0f172a',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} color="#0f172a" />
            <span>Back</span>
          </button>

          <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
            Help & Support
          </span>

          <div style={{ width: '28px' }} />
        </div>
      </header>

      {/* Main Page Container */}
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Hero Banner Card */}
        <div
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)'
          }}
        >
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
            How can we help you?
          </h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
            Have questions about your movie passes, showtimes, or payment? Our student coordinators are here to assist!
          </p>
        </div>

        {/* DIRECT CONTACT CARDS */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '12px' }}>
            CONTACT US
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Phone 1 & WhatsApp */}
            <a
              href="https://wa.me/918247758835"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '18px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                textDecoration: 'none',
                color: '#0f172a',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '15px', display: 'block', fontWeight: 800 }}>+91 82477 58835</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>WhatsApp / Call Support</span>
                </div>
              </div>
            </a>

            {/* Phone 2 */}
            <a
              href="tel:+917997639659"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '18px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                textDecoration: 'none',
                color: '#0f172a',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '15px', display: 'block', fontWeight: 800 }}>+91 79976 39659</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>FMC Coordinator Line</span>
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:nrcmfmc@gmail.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '18px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                textDecoration: 'none',
                color: '#0f172a',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', display: 'block', fontWeight: 800 }}>nrcmfmc@gmail.com</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Official FMC Helpdesk Email</span>
                </div>
              </div>
            </a>

          </div>
        </div>

        {/* OFFICIAL SOCIALS */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '12px' }}>
            OFFICIAL SOCIAL MEDIA
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <a
              href="https://instagram.com/nrcm.fmc"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '14px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px'
              }}
            >
              <Camera size={18} color="#0f172a" /> @nrcm.fmc
            </a>

            <a
              href="https://youtube.com/@nrcm.fmc"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '14px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px'
              }}
            >
              <Video size={18} color="#0f172a" /> FMC YouTube
            </a>
          </div>
        </div>

        {/* GATE COUNTER LOCATION CARD */}
        <div style={{ padding: '18px', borderRadius: '20px', backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} color="#0f172a" />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: 800 }}>Gate Counter Location</strong>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>NRCM Main Auditorium, MT Block Entrance</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
            <Clock size={14} color="#0f172a" />
            <span>Counter 1 Hours: <strong>9:30 AM – 5:30 PM</strong> (Show Days)</span>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '12px' }}>
            FREQUENTLY ASKED QUESTIONS
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((item, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={`support-faq-page-${idx}`}
                  style={{
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#0f172a'
                    }}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={18} style={{ color: '#0f172a', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '12px 16px 14px 16px', fontSize: '12px', color: '#475569', borderTop: '1px dashed #e2e8f0', lineHeight: '1.6' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Back Button */}
        <button
          onClick={() => navigate('/booknow')}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)'
          }}
        >
          Return to Booking Page
        </button>

      </main>
    </div>
  );
}

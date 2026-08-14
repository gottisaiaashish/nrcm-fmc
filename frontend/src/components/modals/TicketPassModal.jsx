import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Ticket, ShieldCheck, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TicketPassModal({ isOpen, onClose, tickets = [], bookingRef = '' }) {
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);

  if (!isOpen || !tickets || tickets.length === 0) return null;

  const currentTicket = tickets[activeTicketIndex] || tickets[0];

  const handlePrint = () => {
    window.print();
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
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Top Bar (Sticky/Pinned Header) */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexShrink: 0,
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
            <Ticket size={18} />
          </div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Entry Pass</h4>
            <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
              {tickets.length > 1 ? `Ticket ${activeTicketIndex + 1} of ${tickets.length}` : `Ref: ${bookingRef || currentTicket.bookingRef}`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {tickets.length > 1 && (
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              <button
                disabled={activeTicketIndex === 0}
                onClick={() => setActiveTicketIndex(prev => Math.max(0, prev - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTicketIndex === 0 ? '#cbd5e1' : '#0f172a',
                  cursor: activeTicketIndex === 0 ? 'default' : 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={activeTicketIndex === tickets.length - 1}
                onClick={() => setActiveTicketIndex(prev => Math.min(tickets.length - 1, prev + 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTicketIndex === tickets.length - 1 ? '#cbd5e1' : '#0f172a',
                  cursor: activeTicketIndex === tickets.length - 1 ? 'default' : 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#0f172a',
              backgroundColor: '#f1f5f9',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#ffffff',
            border: '2px solid #e11d48',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
            boxSizing: 'border-box',
            margin: 'auto 0'
          }}
        >
          {/* Top Title & Valid Badge */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px dashed #cbd5e1', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                NRCM FMC OFFICIAL ENTRY PASS
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                {currentTicket.movieTitle || 'Businessman'}
              </h2>
            </div>
            <span style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <ShieldCheck size={14} /> VALID
            </span>
          </div>

          {/* Clean Stacked Information Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px 0', borderBottom: '1px dashed #cbd5e1', fontSize: '12px' }}>
            
            {/* Attendee */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Attendee:</span>
              <strong style={{ color: '#0f172a', fontWeight: 800, fontSize: '13px' }}>{currentTicket.studentName}</strong>
            </div>

            {/* Roll Number */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Roll No:</span>
              <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontWeight: 700 }}>{currentTicket.rollNo}</strong>
            </div>

            {/* Branch & Year */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Branch & Year:</span>
              <strong style={{ color: '#0f172a', fontWeight: 700 }}>{currentTicket.branch || 'CSE'}</strong>
            </div>

            {/* Showtime */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Showtime:</span>
              <strong style={{ color: '#0f172a', fontWeight: 700 }}>{currentTicket.showTime}</strong>
            </div>

            {/* Price / Pass */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Tier & Price:</span>
              <strong style={{ color: '#e11d48', fontWeight: 800 }}>{currentTicket.tierName || 'General Pass'} (₹{currentTicket.price || 50})</strong>
            </div>

            {/* Venue */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Venue:</span>
              <strong style={{ color: '#0f172a', fontWeight: 700, fontSize: '11px' }}>NRCM Main Auditorium, Block A</strong>
            </div>

          </div>

          {/* QR Code Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '14px' }}>
            <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '2px solid #0f172a', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <QRCodeSVG value={currentTicket.ticketId} size={135} level="H" includeMargin={false} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>TICKET ID CODE</span>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 800, color: '#e11d48', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '3px 10px', borderRadius: '8px', display: 'inline-block', marginTop: '4px' }}>
                {currentTicket.ticketId}
              </span>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Single-use scan at college entry gate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Bottom Action Footer Bar */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '10px',
          flexShrink: 0,
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={handlePrint}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Printer size={15} /> Save PDF
        </button>

        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '12px',
            backgroundColor: '#e11d48',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

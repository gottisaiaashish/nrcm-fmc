import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Configure DNS fallback for MongoDB Atlas SRV resolution and force IPv4 for SMTP
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (_) {}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Razorpay Client Setup
const RAZORPAY_KEY_ID = (process.env.RAZORPAY_KEY_ID || 'rzp_live_TRBG4dlunSLrqL').trim();
const RAZORPAY_KEY_SECRET = (process.env.RAZORPAY_KEY_SECRET || 'Hd3z3ad03p3jSB4zuCSUe4Jk').trim();

let razorpayInstance = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  console.log('💳 [RAZORPAY INITIALIZED] Live Razorpay instance ready.');
} else {
  console.log('ℹ️ [RAZORPAY NOTICE] RAZORPAY_KEY_ID / SECRET not set. Running with Mock Payment Gateway mode.');
}

// Brevo Configuration (Sends exclusively from nrcmfmc@gmail.com)
const rawBrevoKey = (process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY || '').trim().replace(/^['"]|['"]$/g, '');
const BREVO_LOGIN = (process.env.BREVO_LOGIN || 'b510f6001@smtp-brevo.com').trim();
const EMAIL_USER = (process.env.EMAIL_USER || 'nrcmfmc@gmail.com').trim();
const EMAIL_PASS = (process.env.EMAIL_PASS || '').trim();

if (rawBrevoKey) {
  console.log(`⚡ [BREVO INITIALIZED] Brevo Relay active for ${EMAIL_USER} with key: ${rawBrevoKey.substring(0, 12)}...`);
} else {
  console.log(`ℹ️ [BREVO NOTICE] BREVO_API_KEY / BREVO_SMTP_KEY not set in environment.`);
}

const brevoTransporter = rawBrevoKey
  ? nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: BREVO_LOGIN,
        pass: rawBrevoKey,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    })
  : null;

// Direct Gmail Transporter (Sends 100% cleanly from nrcmfmc@gmail.com)
const gmailTransporter = EMAIL_USER && EMAIL_PASS
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    })
  : null;

const sendConfirmationEmail = async (applicant) => {
  const { passId, name, email, branch, interestedArea, mobile } = applicant;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #111111; margin: 0; padding: 10px 0; max-width: 600px;">
      <p style="margin-bottom: 16px;">Dear ${name},</p>

      <p style="margin-bottom: 16px;">
        Your recruitment application for <strong>NRCM FMC</strong> has been received and is currently <strong>under review</strong>.
      </p>

      <p style="margin-bottom: 16px;">
        <strong>Application Details:</strong><br />
        • Application ID: ${passId}<br />
        <br />
        • Full Name: ${name}<br />
        • Branch & Year: ${branch}<br />
        • Interested Area: ${interestedArea || 'N/A'}<br />
        • Mobile: ${mobile}
      </p>

      <p style="margin-bottom: 24px;">
        Our team is currently reviewing your application. If your application is shortlisted, we will contact you directly via Mobile or WhatsApp.
      </p>

      <p style="margin-top: 24px; color: #333333;">
        Regards,<br />
        <strong>NRCM Film Making Club (NRCM FMC)</strong><br />
        Narsimha Reddy Engineering College<br />
        <span style="font-size: 11px; color: #888888;">Ref: ${passId}</span>
      </p>
    </div>
  `;

  const textContent = `
Dear ${name},

Your recruitment application for NRCM FMC has been received and is currently under review.

Application Details:
• Application ID: ${passId}

• Full Name: ${name}
• Branch & Year: ${branch}
• Interested Area: ${interestedArea || 'N/A'}
• Mobile: ${mobile}

Our team is currently reviewing your application. If your application is shortlisted, we will contact you directly via Mobile or WhatsApp.

Regards,
NRCM Film Making Club (NRCM FMC)
Narsimha Reddy Engineering College
Ref: ${passId}
`;

  try {
    // 1. Try Brevo REST API (HTTPS Port 443 - NEVER BLOCKED BY RENDER)
    if (rawBrevoKey && rawBrevoKey.startsWith('xkeysib-')) {
      const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': rawBrevoKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'NRCM Film Making Club', email: EMAIL_USER },
          replyTo: { name: 'NRCM Film Making Club', email: EMAIL_USER },
          to: [{ email: email, name: name }],
          subject: `NRCM FMC Application Under Review - ${name}`,
          htmlContent: htmlContent,
          textContent: textContent
        })
      });
      const resData = await resp.json();
      if (resp.ok) {
        console.log(`✉️ [BREVO API SENT] Confirmation email sent to ${email} (${name}) from ${EMAIL_USER} - MessageID: ${resData.messageId}`);
        return;
      } else {
        console.error(`⚠️ [BREVO API ERROR]:`, resData);
      }
    }

    // 2. Try Brevo SMTP Relay
    if (brevoTransporter) {
      await brevoTransporter.sendMail({
        from: `"NRCM Film Making Club" <${EMAIL_USER}>`,
        replyTo: EMAIL_USER,
        to: email,
        subject: `NRCM FMC Application Under Review - ${name}`,
        text: textContent,
        html: htmlContent
      });
      console.log(`✉️ [BREVO RELAY SENT] Confirmation email sent to ${email} (${name}) from ${EMAIL_USER}`);
      return;
    }

    if (gmailTransporter) {
      try {
        await gmailTransporter.sendMail({
          from: `"NRCM Film Making Club" <${EMAIL_USER}>`,
          replyTo: EMAIL_USER,
          to: email,
          subject: `NRCM FMC Application Under Review - ${name}`,
          text: textContent,
          html: htmlContent,
          headers: {
            'X-Entity-Ref-ID': passId,
          }
        });
        console.log(`✉️ [GMAIL DIRECT SENT] Confirmation email sent directly from ${EMAIL_USER} to ${email} (${name})`);
      } catch (gmailErr) {
        console.warn(`⚠️ [GMAIL DIRECT FAILED]:`, gmailErr.message);
      }
    } else {
      console.log(`ℹ️ [EMAIL NOTICE] Registration received for ${email} (${name}). Configure BREVO_API_KEY in environment variables to dispatch live emails.`);
    }
  } catch (err) {
    console.error(`⚠️ [EMAIL ERROR] Failed to send email to ${email}:`, err.message);
  }
};

const generateTicketPDFBuffer = async (ticket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const ticketId = ticket.ticketId || ticket._id;
      const studentName = ticket.studentName || 'Attendee';
      const rollNo = ticket.rollNo || 'N/A';
      const branch = ticket.branch || 'CSE';
      const showDate = ticket.showDate || 'AUGUST 24, 2026';
      const showTime = ticket.showTime || '10:00 AM to 12:30 PM';
      const tierName = ticket.tierName || 'General Pass';
      const price = ticket.price || 50;
      const movieTitle = ticket.movieTitle || 'Businessman';

      // Page Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');

      // Card Container (Centered)
      const cardWidth = 420;
      const cardHeight = 520;
      const cardX = (doc.page.width - cardWidth) / 2;
      const cardY = 100;

      // Draw Card Outer Box with Red Border
      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 16)
         .fillAndStroke('#ffffff', '#e11d48');

      // Header Section inside Card
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#e11d48')
         .text('NRCM FMC OFFICIAL ENTRY PASS', cardX + 20, cardY + 20);

      doc.fontSize(22).font('Helvetica-Bold').fillColor('#0f172a')
         .text(movieTitle, cardX + 20, cardY + 34);

      // Valid Badge
      doc.roundedRect(cardX + cardWidth - 85, cardY + 20, 65, 24, 12)
         .fillAndStroke('#f0fdf4', '#bbf7d0');
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#16a34a')
         .text('VALID', cardX + cardWidth - 72, cardY + 26);

      // Dashed Line below header
      doc.moveTo(cardX + 20, cardY + 68)
         .lineTo(cardX + cardWidth - 20, cardY + 68)
         .dash(4, { space: 4 })
         .stroke('#cbd5e1');

      // Details Grid
      doc.undash();
      let currentY = cardY + 82;
      const details = [
        { label: 'ATTENDEE:', val: studentName, isBold: true },
        { label: 'ROLL NO:', val: rollNo },
        { label: 'BRANCH & YEAR:', val: branch },
        { label: 'SCREENING DATE:', val: showDate },
        { label: 'SHOWTIME:', val: showTime },
        { label: 'TIER & PRICE:', val: `${tierName} (Rs. ${price})`, isRed: true },
        { label: 'VENUE:', val: 'NRCM Main Auditorium, MT Block' }
      ];

      details.forEach((item) => {
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748b')
           .text(item.label, cardX + 20, currentY);

        if (item.isRed) {
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#e11d48');
        } else {
          doc.fontSize(10).font(item.isBold ? 'Helvetica-Bold' : 'Helvetica').fillColor('#0f172a');
        }
        
        doc.text(item.val, cardX + 160, currentY, { width: cardWidth - 180, align: 'right' });
        currentY += 24;
      });

      // Dashed Line above QR
      doc.moveTo(cardX + 20, currentY + 4)
         .lineTo(cardX + cardWidth - 20, currentY + 4)
         .dash(4, { space: 4 })
         .stroke('#cbd5e1');

      // Fetch QR Code PNG Image via HTTP
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ticketId)}`;
      try {
        const qrResp = await fetch(qrApiUrl);
        const qrBuffer = Buffer.from(await qrResp.arrayBuffer());
        
        const qrSize = 130;
        const qrX = cardX + (cardWidth - qrSize) / 2;
        const qrY = currentY + 18;

        doc.undash();
        doc.roundedRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12)
           .fillAndStroke('#ffffff', '#0f172a');

        doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });

        const subY = qrY + qrSize + 16;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#64748b')
           .text('ENTRY GATE TICKET ID & SCANNER', cardX, subY, { width: cardWidth, align: 'center' });

        doc.fontSize(12).font('Helvetica-Bold').fillColor('#e11d48')
           .text(ticketId, cardX, subY + 12, { width: cardWidth, align: 'center' });

        doc.fontSize(8).font('Helvetica').fillColor('#94a3b8')
           .text('Single-use scan at college entry gate.', cardX, subY + 28, { width: cardWidth, align: 'center' });

      } catch (qrErr) {
        console.error('QR Fetch Error for PDF:', qrErr);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

const sendTicketHypeEmail = async (ticket) => {
  const ticketId = ticket.ticketId || ticket._id;
  const studentName = ticket.studentName || 'Attendee';
  const email = ticket.email;
  const rollNo = ticket.rollNo || 'N/A';
  const branch = ticket.branch || 'CSE';
  const showDate = ticket.showDate || 'AUGUST 24, 2026';
  const showTime = ticket.showTime || '10:00 AM to 12:30 PM';
  const tierName = ticket.tierName || 'General Pass';
  const price = ticket.price || 50;
  const bookingRef = ticket.bookingRef || 'N/A';
  const movieTitle = ticket.movieTitle || 'Businessman';

  if (!email) {
    console.warn(`⚠️ No email address found for ticket ${ticketId}`);
    return false;
  }

  const subject = `Official Entry Pass - ${movieTitle} Screening | NRCM FMC`;

  let pdfBuffer = null;
  try {
    pdfBuffer = await generateTicketPDFBuffer(ticket);
  } catch (pdfErr) {
    console.error('PDF Generation Error:', pdfErr);
  }

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #ffffff; color: #1e293b; margin: 0; padding: 15px; line-height: 1.6; }
    .header { font-size: 18px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e11d48; padding-bottom: 10px; margin-bottom: 18px; }
    .body-text { font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 14px; }
    .info-box { background-color: #f8fafc; border-left: 4px solid #e11d48; padding: 14px 18px; border-radius: 8px; margin: 18px 0; font-size: 13px; color: #1e293b; }
    .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 14px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="header">NRCM Film Making Club • Official Entry Pass</div>
  
  <p class="body-text">Dear <strong>${studentName}</strong>,</p>

  <p class="body-text">Your official entry pass for the <strong>${movieTitle}</strong> special screening has been issued. Your ticket details are provided below:</p>

  <div class="info-box">
    <strong style="font-size: 14px; color: #0f172a; display: block; margin-bottom: 6px;">Screening Information:</strong>
    • <strong>Ticket ID:</strong> <span style="font-family: monospace; color: #e11d48; font-weight: 800;">${ticketId}</span><br />
    • <strong>Attendee:</strong> ${studentName} (${rollNo})<br />
    • <strong>Screening Date:</strong> ${showDate}<br />
    • <strong>Showtime:</strong> ${showTime}<br />
    • <strong>Venue:</strong> NRCM Main Auditorium, MT Block
  </div>

  <p class="body-text">Your official digital ticket pass PDF (<code>BUSINESSMAN_Pass_${ticketId}.pdf</code>) is attached to this email. Please save it to present at the auditorium entry gate.</p>

  <div class="footer">
    <strong>NRCM Film Making Club (NRCM FMC)</strong><br />
    Narsimha Reddy Engineering College • Official Event Helpdesk
  </div>
</body>
</html>`;

  try {
    const attachments = pdfBuffer ? [{
      filename: `BUSINESSMAN_Pass_${ticketId}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }] : [];

    if (rawBrevoKey && rawBrevoKey.startsWith('xkeysib-')) {
      const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': rawBrevoKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'NRCM Film Making Club', email: EMAIL_USER || 'nrcmfmc@gmail.com' },
          replyTo: { name: 'NRCM Film Making Club', email: EMAIL_USER || 'nrcmfmc@gmail.com' },
          to: [{ email: email, name: studentName }],
          subject: subject,
          htmlContent: htmlContent,
          attachment: pdfBuffer ? [{
            content: pdfBuffer.toString('base64'),
            name: `BUSINESSMAN_Pass_${ticketId}.pdf`
          }] : []
        })
      });
      const resData = await resp.json();
      if (resp.ok) {
        console.log(`✉️ [BREVO TICKET EMAIL SENT] Sent to ${email} (${ticketId}) - MsgId: ${resData.messageId}`);
        return true;
      } else {
        console.error(`⚠️ [BREVO TICKET EMAIL ERROR]:`, resData);
      }
    }

    if (brevoTransporter) {
      await brevoTransporter.sendMail({
        from: `"NRCM Film Making Club" <${EMAIL_USER}>`,
        replyTo: EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlContent,
        attachments: attachments
      });
      console.log(`✉️ [BREVO RELAY TICKET SENT] Sent to ${email} (${ticketId})`);
      return true;
    }

    if (gmailTransporter) {
      await gmailTransporter.sendMail({
        from: `"NRCM Film Making Club" <${EMAIL_USER}>`,
        replyTo: EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlContent,
        attachments: attachments
      });
      console.log(`✉️ [GMAIL DIRECT TICKET SENT] Sent to ${email} (${ticketId})`);
      return true;
    }

    console.log(`ℹ️ [SIMULATED TICKET EMAIL] Would send to ${email} (${ticketId})`);
    return true;
  } catch (err) {
    console.error(`⚠️ [TICKET EMAIL FAILED] Error for ${email} (${ticketId}):`, err.message);
    return false;
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Fallback Storage if MongoDB is not yet connected
let inMemoryRegistrations = [];
let isMongoConnected = false;
let isRecruitmentOpen = true;

let inMemoryEventSettings = {
  movieTitle: 'Businessman',
  tagline: 'Guns Don\'t Need Reasons, They Need Bullets!',
  posterUrl: 'https://tse3.mm.bing.net/th/id/OIP.Ws0jajMZU5CdOh0jDEgBEQHaKf?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
  venue: 'NRCM Main Auditorium, MT Block',
  releaseDate: 'AUGUST 24, 2026',
  dates: ['AUGUST 24, 2026'],
  showTimes: ['10:00 AM to 12:30 PM', '01:00 PM to 03:30 PM'],
  showCapacity: 250,
  slotCapacities: {
    '10:00 AM to 12:30 PM': 250,
    '01:00 PM to 03:30 PM': 202
  },
  tiers: [
    { id: 'vip', name: 'VIP Balcony', price: 150, description: 'Premium balcony seating with snack voucher' },
    { id: 'fanzone', name: 'Fan Zone', price: 120, description: 'Front row seats with high energy crowd' },
    { id: 'general', name: 'General Student Pass', price: 99, description: 'Standard auditorium seating' }
  ],
  isBookingOpen: false,
  announcement: '🔥 HOUSEFULL! All shows are completely booked out.'
};

let inMemoryTickets = [];
let inMemorySuggestions = [];

// MongoDB Schemas & Models
const registrationSchema = new mongoose.Schema({
  passId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  branch: { type: String, required: true },
  interestedArea: { type: String, default: '' },
  previousExperience: { type: String, default: '' },
  portfolioLink: { type: String, default: '' },
  whyJoin: { type: String, default: '' },
  whatYouBring: { type: String, default: '' },
  instagramId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

const eventSettingsSchema = new mongoose.Schema({
  movieTitle: { type: String, default: 'Businessman' },
  tagline: { type: String, default: 'Guns Don\'t Need Reasons, They Need Bullets!' },
  description: { type: String, default: 'Surya (Mahesh Babu) arrives in Mumbai to conquer the mafia underworld. A cult high-energy action entertainer directed by Puri Jagannadh.' },
  posterUrl: { type: String, default: 'https://tse3.mm.bing.net/th/id/OIP.Ws0jajMZU5CdOh0jDEgBEQHaKf?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  venue: { type: String, default: 'NRCM Main Auditorium, MT Block' },
  releaseDate: { type: String, default: 'AUGUST 24, 2026' },
  dates: { type: [String], default: ['AUGUST 24, 2026'] },
  showTimes: { type: [String], default: ['10:00 AM to 12:30 PM', '01:00 PM to 03:30 PM'] },
  showCapacity: { type: Number, default: 250 },
  slotCapacities: { type: Object, default: { '10:00 AM to 12:30 PM': 250, '01:00 PM to 03:30 PM': 202 } },
  tiers: { type: Array, default: [] },
  isBookingOpen: { type: Boolean, default: false },
  announcement: { type: String, default: '🔥 HOUSEFULL! All shows are completely booked out.' },
  updatedAt: { type: Date, default: Date.now }
});

const EventSettings = mongoose.models.EventSettings || mongoose.model('EventSettings', eventSettingsSchema);

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  bookingRef: { type: String, required: true },
  movieTitle: { type: String, required: true },
  showDate: { type: String, required: true, default: 'AUGUST 24, 2026' },
  showTime: { type: String, required: true },
  tierName: { type: String, required: true },
  price: { type: Number, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  branch: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: 'VALID' },
  usedAt: { type: String, default: null },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

ticketSchema.index({ rollNo: 1 });
ticketSchema.index({ mobile: 1 });
ticketSchema.index({ bookingRef: 1 });
ticketSchema.index({ email: 1 });
ticketSchema.index({ ticketId: 1 });

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

const suggestionSchema = new mongoose.Schema({
  suggestionId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'NEW' }
});

const Suggestion = mongoose.models.Suggestion || mongoose.model('Suggestion', suggestionSchema);

// MongoDB Connection Attempt
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      isMongoConnected = true;
      console.log('🍃 Connected to MongoDB Atlas Successfully!');
    })
    .catch((err) => {
      console.error('⚠️ MongoDB Connection Error:', err.message);
      console.log('ℹ️ Running with In-Memory Storage Fallback.');
    });
} else {
  console.log('ℹ️ MONGODB_URI env variable not set. Running with In-Memory Storage.');
}

// Admin Credentials
const ADMIN_USER = process.env.ADMIN_USER || 'nrcmfmc';
const ADMIN_PASS = process.env.ADMIN_PASS || 'fmc123';

// --- API ROUTES ---

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'NRCM.FMC API Gateway',
    database: isMongoConnected ? 'MongoDB Connected' : 'In-Memory Fallback Mode',
    recruitmentOpen: isRecruitmentOpen,
    timestamp: new Date().toISOString()
  });
});

// 1b. Recruitment Status Endpoints
app.get('/api/recruitment-status', (req, res) => {
  res.json({ success: true, isOpen: isRecruitmentOpen });
});

app.post('/api/admin/recruitment-status', (req, res) => {
  const { isOpen } = req.body;
  if (typeof isOpen === 'boolean') {
    isRecruitmentOpen = isOpen;
    console.log(`[RECRUITMENT STATUS UPDATED] isRecruitmentOpen set to ${isRecruitmentOpen}`);
    return res.json({ success: true, isOpen: isRecruitmentOpen });
  }
  return res.status(400).json({ success: false, error: 'Invalid isOpen value.' });
});

// 2. Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.status(200).json({
      success: true,
      message: 'Admin Authentication Successful',
      token: 'nrcmfmc-admin-authenticated-session-token-2026'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid Admin Credentials (ID or Password incorrect).'
  });
});

// 3. Register Event Pass / Application Endpoint
app.post('/api/register', async (req, res) => {
  try {
    if (!isRecruitmentOpen) {
      return res.status(403).json({
        success: false,
        error: 'Sorry, recruitment has been closed.'
      });
    }

    const { name, branch, mobile, email, interestedArea, previousExperience, portfolioLink, whyJoin, whatYouBring, instagramId } = req.body;

    if (!name || !branch || !mobile || !email) {
      return res.status(400).json({
        success: false,
        error: 'Required fields (name, branch, mobile, email) missing.'
      });
    }

    const passId = `FMC-APP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const entryData = {
      passId,
      name,
      mobile,
      email,
      branch,
      interestedArea: interestedArea || '',
      previousExperience: previousExperience || '',
      portfolioLink: portfolioLink || '',
      whyJoin: whyJoin || '',
      whatYouBring: whatYouBring || '',
      instagramId: instagramId || '',
      createdAt: new Date().toISOString()
    };

    // Dispatch confirmation email asynchronously in background
    console.log(`[DISPATCHING EMAIL BACKGROUND] Sending confirmation email to: ${email} (${name})...`);
    sendConfirmationEmail(entryData).catch(err => console.error('Background Email Dispatch Error:', err.message));

    if (isMongoConnected) {
      const newEntry = new Registration(entryData);
      await newEntry.save();

      console.log(`[MONGODB APP SAVED] ${name} (${branch}) - App ID: ${passId}`);
      return res.status(201).json({
        success: true,
        message: 'Application registered successfully in MongoDB!',
        pass: newEntry
      });
    } else {
      const newEntry = { _id: passId, ...entryData };
      inMemoryRegistrations.unshift(newEntry);

      console.log(`[IN-MEMORY APP SAVED] ${name} (${branch}) - App ID: ${passId}`);
      return res.status(201).json({
        success: true,
        message: 'Application registered successfully (In-Memory)!',
        pass: newEntry
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process recruitment application.'
    });
  }
});

// 4. Get All Registrations (Admin Endpoint)
app.get('/api/admin/registrations', async (req, res) => {
  try {
    if (isMongoConnected) {
      const docs = await Registration.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: docs.length,
        registrations: docs
      });
    } else {
      return res.json({
        success: true,
        count: inMemoryRegistrations.length,
        registrations: inMemoryRegistrations
      });
    }
  } catch (error) {
    console.error('Fetch Registrations Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations.'
    });
  }
});

// 5. Delete Registration Entry (Admin Endpoint)
app.delete('/api/admin/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      await Registration.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: 'Registration deleted from MongoDB.'
      });
    } else {
      inMemoryRegistrations = inMemoryRegistrations.filter(r => r._id !== id && r.passId !== id);
      return res.json({
        success: true,
        message: 'Registration deleted from memory.'
      });
    }
  } catch (error) {
    console.error('Delete Registration Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete registration.'
    });
  }
});

// 5b. Update Registration Entry (Admin Endpoint)
app.put('/api/admin/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, branch, mobile, email, interestedArea } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (branch !== undefined) updateFields.branch = branch;
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (email !== undefined) updateFields.email = email;
    if (interestedArea !== undefined) updateFields.interestedArea = interestedArea;

    let updatedDoc = null;
    if (isMongoConnected) {
      const query = mongoose.Types.ObjectId.isValid(id)
        ? { $or: [{ _id: id }, { passId: id }] }
        : { passId: id };
      updatedDoc = await Registration.findOneAndUpdate(query, { $set: updateFields }, { new: true });
    } else {
      const index = inMemoryRegistrations.findIndex(r => (r._id && String(r._id) === String(id)) || r.passId === id);
      if (index !== -1) {
        inMemoryRegistrations[index] = { ...inMemoryRegistrations[index], ...updateFields };
        updatedDoc = inMemoryRegistrations[index];
      }
    }

    if (!updatedDoc) {
      return res.status(404).json({ success: false, error: 'Registration not found.' });
    }

    return res.json({ success: true, message: 'Registration updated successfully!', registration: updatedDoc });
  } catch (error) {
    console.error('Update Registration Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update registration.' });
  }
});

// --- RE-RELEASE MOVIE EVENT & TICKET BOOKING ENDPOINTS ---

// 6. Get Event Settings (Public)
app.get('/api/event-settings', async (req, res) => {
  try {
    if (isMongoConnected) {
      let settings = await EventSettings.findOne();
      if (!settings) {
        settings = new EventSettings(inMemoryEventSettings);
        await settings.save();
      } else {
        if (settings.isBookingOpen !== false) {
          settings.isBookingOpen = false;
          settings.announcement = '🔥 HOUSEFULL! All shows are completely booked out.';
          await settings.save();
        }
      }
      return res.json({ success: true, settings });
    } else {
      return res.json({ success: true, settings: inMemoryEventSettings });
    }
  } catch (error) {
    console.error('Fetch Event Settings Error:', error);
    res.status(500).json({ success: false, settings: inMemoryEventSettings });
  }
});

// 7. Update Event Settings (Admin)
app.post('/api/admin/event-settings', async (req, res) => {
  try {
    const { movieTitle, tagline, posterUrl, venue, releaseDate, showTimes, tiers, isBookingOpen, announcement } = req.body;
    const updatedData = {
      movieTitle: movieTitle || 'NRCM RE-RELEASE 2026',
      tagline: tagline || '',
      posterUrl: posterUrl || '',
      venue: venue || '',
      releaseDate: releaseDate || '',
      showTimes: Array.isArray(showTimes) ? showTimes : [],
      tiers: Array.isArray(tiers) ? tiers : [],
      isBookingOpen: typeof isBookingOpen === 'boolean' ? isBookingOpen : true,
      announcement: announcement || '',
      updatedAt: new Date()
    };

    if (isMongoConnected) {
      let settings = await EventSettings.findOne();
      if (settings) {
        Object.assign(settings, updatedData);
        await settings.save();
      } else {
        settings = new EventSettings(updatedData);
        await settings.save();
      }
      inMemoryEventSettings = updatedData;
      return res.json({ success: true, message: 'Event settings updated successfully!', settings });
    } else {
      inMemoryEventSettings = updatedData;
      return res.json({ success: true, message: 'Event settings updated (In-Memory)!', settings: inMemoryEventSettings });
    }
  } catch (error) {
    console.error('Update Event Settings Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update event settings.' });
  }
});

// Helper to get booked count per show date and show time
async function getShowBookedCount(showDate, showTime) {
  const cleanDate = (showDate || 'AUGUST 24, 2026').trim();
  const cleanTime = (showTime || '10:00 AM to 12:30 PM').trim();

  if (isMongoConnected) {
    return await Ticket.countDocuments({
      showDate: cleanDate,
      showTime: cleanTime,
      status: { $ne: 'CANCELLED' }
    });
  } else {
    return inMemoryTickets.filter(t =>
      (t.showDate || 'AUGUST 24, 2026').trim() === cleanDate &&
      (t.showTime || '').trim() === cleanTime &&
      t.status !== 'CANCELLED'
    ).length;
  }
}

function getShowCapacity(showTime, settings) {
  const cleanTime = (showTime || '').trim();
  if (settings?.slotCapacities && settings.slotCapacities[cleanTime]) {
    return Number(settings.slotCapacities[cleanTime]);
  }
  if (cleanTime.includes('01:00 PM') || cleanTime.includes('02:30') || cleanTime.includes('Afternoon') || cleanTime.includes('Matinee')) {
    return 202;
  }
  return settings?.showCapacity || 250;
}

// 7b. Availability Endpoint
app.get('/api/tickets/availability', async (req, res) => {
  try {
    let settings = null;
    if (isMongoConnected) {
      settings = await EventSettings.findOne({});
    }
    const dates = settings?.dates?.length ? settings.dates : ['AUGUST 24, 2026', 'AUGUST 25, 2026'];
    const showTimes = settings?.showTimes?.length ? settings.showTimes : ['10:00 AM to 12:30 PM', '01:00 PM to 03:30 PM'];
    const availability = {};

    for (const d of dates) {
      availability[d] = {};
      for (const st of showTimes) {
        const booked = await getShowBookedCount(d, st);
        const capacity = getShowCapacity(st, settings);
        availability[d][st] = {
          booked,
          capacity,
          remaining: Math.max(0, capacity - booked),
          isHousefull: booked >= capacity
        };
      }
    }
    return res.json({ success: true, availability });
  } catch (error) {
    console.error('Fetch Availability Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch availability.' });
  }
});

// 7c. Event Settings Endpoints
app.get('/api/event-settings', async (req, res) => {
  try {
    if (isMongoConnected) {
      let settings = await EventSettings.findOne({});
      if (!settings) {
        settings = await EventSettings.create(inMemoryEventSettings);
      }
      return res.json({ success: true, settings });
    } else {
      return res.json({ success: true, settings: inMemoryEventSettings });
    }
  } catch (error) {
    console.error('Fetch Event Settings Error:', error);
    return res.json({ success: true, settings: inMemoryEventSettings });
  }
});

app.post('/api/admin/event-settings', async (req, res) => {
  try {
    const updateData = req.body;
    updateData.updatedAt = new Date();

    if (isMongoConnected) {
      let settings = await EventSettings.findOne({});
      if (settings) {
        Object.assign(settings, updateData);
        await settings.save();
      } else {
        settings = await EventSettings.create(updateData);
      }
      inMemoryEventSettings = settings.toObject ? settings.toObject() : settings;
      return res.json({ success: true, settings });
    } else {
      inMemoryEventSettings = { ...inMemoryEventSettings, ...updateData };
      return res.json({ success: true, settings: inMemoryEventSettings });
    }
  } catch (error) {
    console.error('Update Event Settings Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to save event settings.' });
  }
});

app.post('/api/admin/event-settings/reset', async (req, res) => {
  try {
    const resetData = {
      movieTitle: '',
      tagline: '',
      description: '',
      posterUrl: '',
      releaseDate: '',
      dates: [],
      showTimes: [],
      isBookingOpen: false,
      announcement: 'No active movie screening right now.',
      updatedAt: new Date()
    };

    if (isMongoConnected) {
      let settings = await EventSettings.findOne({});
      if (settings) {
        Object.assign(settings, resetData);
        await settings.save();
      } else {
        settings = await EventSettings.create(resetData);
      }
      inMemoryEventSettings = settings.toObject ? settings.toObject() : settings;
      return res.json({ success: true, settings });
    } else {
      inMemoryEventSettings = { ...inMemoryEventSettings, ...resetData };
      return res.json({ success: true, settings: inMemoryEventSettings });
    }
  } catch (error) {
    console.error('Reset Event Settings Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to reset event settings.' });
  }
});

// 8. Create Razorpay Order (or Mock Order)
app.post('/api/tickets/create-order', async (req, res) => {
  try {
    const { amount, tierName, quantity, studentName, rollNo, showDate, showTime } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid order amount.' });
    }

    const requestedDate = showDate || 'AUGUST 24, 2026';
    const requestedTime = showTime || '10:00 AM to 12:30 PM';
    const currentBooked = await getShowBookedCount(requestedDate, requestedTime);
    const requestedQty = parseInt(quantity, 10) || 1;

    let settings = null;
    if (isMongoConnected) {
      settings = await EventSettings.findOne({});
    }
    const maxCapacity = getShowCapacity(requestedTime, settings);

    if (currentBooked + requestedQty > maxCapacity) {
      return res.status(400).json({
        success: false,
        error: `HOUSEFULL! Selected show (${requestedDate} @ ${requestedTime}) has reached maximum capacity of ${maxCapacity} seats!`
      });
    }

    const orderAmountInPaise = Math.round(amount * 100);

    if (razorpayInstance) {
      const options = {
        amount: orderAmountInPaise,
        currency: 'INR',
        receipt: `receipt_rerelease_${Date.now()}`,
        notes: { studentName, rollNo, tierName, quantity, showDate: requestedDate, showTime: requestedTime }
      };

      const order = await razorpayInstance.orders.create(options);
      console.log(`💳 [RAZORPAY ORDER CREATED] Order ID: ${order.id} | Amount: ₹${amount} | Show: ${requestedDate} ${requestedTime}`);

      return res.json({
        success: true,
        isMock: false,
        key: RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } else {
      // Mock Fallback Order Creation
      const mockOrderId = `order_mock_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      console.log(`ℹ️ [MOCK ORDER CREATED] Order ID: ${mockOrderId} | Amount: ₹${amount}`);

      return res.json({
        success: true,
        isMock: true,
        key: 'rzp_test_mock_key',
        orderId: mockOrderId,
        amount: orderAmountInPaise,
        currency: 'INR'
      });
    }
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ success: false, error: 'Failed to initiate payment order.' });
  }
});

// 9. Verify Payment & Generate N Unique Tickets
app.post('/api/tickets/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData
    } = req.body;

    if (!bookingData) {
      return res.status(400).json({ success: false, error: 'Missing booking details.' });
    }

    const {
      studentName,
      rollNo,
      branch,
      mobile,
      email,
      movieTitle,
      showDate,
      showTime,
      tierName,
      price,
      quantity
    } = bookingData;

    // Verify signature if using live Razorpay
    if (razorpayInstance && razorpay_signature && !razorpay_order_id.startsWith('order_mock_')) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        console.warn(`⚠️ [PAYMENT VERIFICATION FAILED] Signature mismatch for order: ${razorpay_order_id}`);
        return res.status(400).json({ success: false, error: 'Payment signature verification failed!' });
      }
    }

    const bookingRef = `NRCM-BKG-${Date.now().toString().slice(-6)}`;
    const ticketCount = parseInt(quantity, 10) || 1;
    const generatedTickets = [];

    const studentsArr = Array.isArray(bookingData.studentsData) && bookingData.studentsData.length > 0
      ? bookingData.studentsData
      : [{ studentName, rollNo, branch, mobile, email }];

    for (let i = 1; i <= ticketCount; i++) {
      const studentInfo = studentsArr[i - 1] || studentsArr[0] || {};
      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const ticketId = `NRCM-TKT-${randomCode}-${i}`;

      const ticketObj = {
        ticketId,
        bookingRef,
        movieTitle: movieTitle || 'Businessman',
        showDate: showDate || 'AUGUST 24, 2026',
        showTime: showTime || '10:00 AM to 12:30 PM',
        tierName: tierName || 'General Student Pass',
        price: Number(price) || 50,
        studentName: studentInfo.studentName || studentName,
        rollNo: studentInfo.rollNo || rollNo,
        branch: studentInfo.branch || branch,
        mobile: studentInfo.mobile || mobile,
        email: studentInfo.email || email,
        status: 'VALID',
        usedAt: null,
        razorpayOrderId: razorpay_order_id || 'MOCK_ORDER',
        razorpayPaymentId: razorpay_payment_id || 'MOCK_PAYMENT',
        createdAt: new Date().toISOString()
      };

      generatedTickets.push(ticketObj);
    }

    if (isMongoConnected) {
      await Ticket.insertMany(generatedTickets);
      console.log(`🎟️ [MONGODB TICKETS CREATED] ${ticketCount} unique tickets issued under Ref: ${bookingRef} for ${studentName} (${rollNo})`);
    } else {
      inMemoryTickets.unshift(...generatedTickets);
      console.log(`🎟️ [IN-MEMORY TICKETS CREATED] ${ticketCount} unique tickets issued under Ref: ${bookingRef} for ${studentName} (${rollNo})`);
    }

    return res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      bookingRef,
      tickets: generatedTickets
    });
  } catch (error) {
    console.error('Ticket Payment Processing Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process ticket booking.' });
  }
});

// 9b. Public Ticket Lookup - Search by Roll No, Mobile, Email, or Booking Ref
app.get('/api/tickets/lookup', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter Roll Number, Phone Number, or Ticket ID.' });
    }

    const raw = query.trim();
    const cleanUpper = raw.toUpperCase();
    const cleanDigits = raw.replace(/\D/g, ''); // Extract digits for phone search

    let matchedTickets = [];
    if (isMongoConnected) {
      const searchConditions = [
        { rollNo: cleanUpper },
        { rollNo: { $regex: cleanUpper, $options: 'i' } },
        { email: { $regex: raw, $options: 'i' } },
        { bookingRef: cleanUpper },
        { ticketId: cleanUpper },
        { razorpayPaymentId: raw }
      ];

      if (cleanDigits.length >= 4) {
        const lastDigits = cleanDigits.slice(-10);
        searchConditions.push({ mobile: { $regex: lastDigits } });
        searchConditions.push({ mobile: { $regex: cleanDigits } });
      }

      matchedTickets = await Ticket.find({ $or: searchConditions })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    } else {
      matchedTickets = inMemoryTickets.filter(t => {
        const rollMatch = (t.rollNo || '').toUpperCase().includes(cleanUpper);
        const mobileMatch = (t.mobile || '').replace(/\D/g, '').includes(cleanDigits) || (t.mobile || '').includes(raw);
        const refMatch = (t.bookingRef || '').toUpperCase().includes(cleanUpper);
        const tktMatch = (t.ticketId || '').toUpperCase().includes(cleanUpper);
        const emailMatch = (t.email || '').toLowerCase().includes(raw.toLowerCase());
        return rollMatch || mobileMatch || refMatch || tktMatch || emailMatch;
      });
    }

    if (matchedTickets.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No tickets found matching "${query}". Please check your Roll No or Phone Number.`
      });
    }

    return res.json({
      success: true,
      count: matchedTickets.length,
      tickets: matchedTickets
    });
  } catch (error) {
    console.error('Ticket Lookup Error:', error);
    res.status(500).json({ success: false, error: 'Server error retrieving tickets.' });
  }
});

// 10. Admin - Get All Tickets
app.get('/api/admin/tickets', async (req, res) => {
  try {
    if (isMongoConnected) {
      const docs = await Ticket.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: docs.length, tickets: docs });
    } else {
      return res.json({ success: true, count: inMemoryTickets.length, tickets: inMemoryTickets });
    }
  } catch (error) {
    console.error('Fetch Tickets Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tickets.' });
  }
});

// 11. QR Verification Endpoint - Lookup Ticket Status by Ticket ID
app.get('/api/admin/tickets/verify/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const cleanId = ticketId.trim();

    let ticket = null;
    if (isMongoConnected) {
      ticket = await Ticket.findOne({ ticketId: cleanId });
    } else {
      ticket = inMemoryTickets.find(t => t.ticketId === cleanId);
    }

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: `INVALID TICKET: Ticket ID '${cleanId}' was not found in the database system!`
      });
    }

    return res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Verify Ticket Error:', error);
    res.status(500).json({ success: false, error: 'Server error verifying ticket.' });
  }
});

// 12. Admin Gate Scanner - Permit Entry & Mark USED (Single-Use Validation)
app.post('/api/admin/tickets/permit', async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ success: false, error: 'Ticket ID is required.' });
    }

    const cleanId = ticketId.trim();
    let ticket = null;

    if (isMongoConnected) {
      ticket = await Ticket.findOne({ ticketId: cleanId });
    } else {
      ticket = inMemoryTickets.find(t => t.ticketId === cleanId);
    }

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: `UNAUTHORIZED / UNKNOWN TICKET: Ticket ID '${cleanId}' does not exist!`
      });
    }

    // CHECK SINGLE-USE RULE
    if (ticket.status === 'USED') {
      const scanTimeStr = ticket.usedAt ? new Date(ticket.usedAt).toLocaleString('en-IN') : 'Earlier';
      console.warn(`🚨 [ENTRY REJECTED] Ticket ${cleanId} already used at ${scanTimeStr}`);

      return res.status(400).json({
        success: false,
        alreadyUsed: true,
        error: `ENTRY DENIED! This ticket was ALREADY SCANNED & PERMITTED at ${scanTimeStr}. Duplicate entry is NOT allowed!`,
        ticket
      });
    }

    // Mark as USED
    const timestampNow = new Date().toISOString();

    if (isMongoConnected) {
      ticket.status = 'USED';
      ticket.usedAt = timestampNow;
      await ticket.save();
    } else {
      ticket.status = 'USED';
      ticket.usedAt = timestampNow;
    }

    console.log(`✅ [ENTRY PERMITTED] Ticket ${cleanId} marked as USED for ${ticket.studentName} (${ticket.rollNo}) at ${new Date(timestampNow).toLocaleString('en-IN')}`);

    return res.json({
      success: true,
      message: `ENTRY PERMITTED! Ticket marked as USED for ${ticket.studentName}.`,
      ticket
    });
  } catch (error) {
    console.error('Permit Ticket Entry Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update ticket entry status.' });
  }
});

// 13. Admin - Delete Ticket
app.delete('/api/admin/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Ticket.findByIdAndDelete(id);
    } else {
      inMemoryTickets = inMemoryTickets.filter(t => t._id !== id && t.ticketId !== id);
    }
    return res.json({ success: true, message: 'Ticket deleted successfully.' });
  } catch (error) {
    console.error('Delete Ticket Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete ticket.' });
  }
});

// Helper function for updating ticket fields
const handleUpdateTicketLogic = async (targetId, body) => {
  const { showTime, showDate, tierName, studentName, rollNo, branch, mobile, email, status } = body;
  const updateFields = {};
  if (showTime !== undefined) updateFields.showTime = showTime;
  if (showDate !== undefined) updateFields.showDate = showDate;
  if (tierName !== undefined) updateFields.tierName = tierName;
  if (studentName !== undefined) updateFields.studentName = studentName;
  if (rollNo !== undefined) updateFields.rollNo = rollNo;
  if (branch !== undefined) updateFields.branch = branch;
  if (mobile !== undefined) updateFields.mobile = mobile;
  if (email !== undefined) updateFields.email = email;
  if (status !== undefined) updateFields.status = status;

  const ticketIdCandidate = String(body.ticketId || body.id || targetId || '').trim();
  const dbIdCandidate = String(body._id || targetId || '').trim();

  if (isMongoConnected) {
    const orConditions = [];
    if (dbIdCandidate && mongoose.Types.ObjectId.isValid(dbIdCandidate)) {
      try {
        orConditions.push({ _id: new mongoose.Types.ObjectId(dbIdCandidate) });
      } catch (_) {}
      orConditions.push({ _id: dbIdCandidate });
    }
    if (ticketIdCandidate) {
      orConditions.push({ ticketId: ticketIdCandidate });
      orConditions.push({ ticketId: new RegExp(`^${ticketIdCandidate.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i') });
    }
    if (targetId) {
      orConditions.push({ ticketId: String(targetId).trim() });
    }
    if (rollNo && studentName) {
      orConditions.push({ rollNo: String(rollNo).trim(), studentName: String(studentName).trim() });
    }

    const query = orConditions.length > 0 ? { $or: orConditions } : { ticketId: ticketIdCandidate };
    return await Ticket.findOneAndUpdate(query, { $set: updateFields }, { new: true });
  } else {
    const index = inMemoryTickets.findIndex(t => 
      (t._id && String(t._id) === dbIdCandidate) || 
      (t.ticketId && t.ticketId.toLowerCase() === ticketIdCandidate.toLowerCase()) ||
      (t.ticketId && t.ticketId === String(targetId).trim()) ||
      (t.rollNo && t.rollNo === String(rollNo).trim() && t.studentName === String(studentName).trim())
    );
    if (index !== -1) {
      inMemoryTickets[index] = { ...inMemoryTickets[index], ...updateFields };
      return inMemoryTickets[index];
    }
  }
  return null;
};

// 13c. Admin - Update Single Ticket Details (POST & PUT Endpoint - Proxy & Vercel Safe)
const handleTicketUpdateExpress = async (req, res) => {
  try {
    const targetId = req.body.ticketId || req.body.id || req.body._id || req.params.id;
    if (!targetId) {
      return res.status(200).json({ success: false, error: 'Ticket ID is required.' });
    }
    const updatedTicket = await handleUpdateTicketLogic(targetId, req.body);
    if (!updatedTicket) {
      return res.status(200).json({ success: false, error: `Ticket '${targetId}' was not found in the database.` });
    }
    console.log(`🎟️ [ADMIN TICKET UPDATED] Ticket ${updatedTicket.ticketId} updated: ${updatedTicket.showDate} @ ${updatedTicket.showTime}`);
    return res.status(200).json({ success: true, message: 'Ticket details updated successfully!', ticket: updatedTicket });
  } catch (error) {
    console.error('Update Ticket Error:', error);
    return res.status(200).json({ success: false, error: 'Failed to update ticket details: ' + error.message });
  }
};

app.post('/api/admin/tickets/update', handleTicketUpdateExpress);
app.put('/api/admin/tickets/update', handleTicketUpdateExpress);
app.post('/api/admin/tickets/update/:id', handleTicketUpdateExpress);
app.put('/api/admin/tickets/update/:id', handleTicketUpdateExpress);
app.put('/api/admin/tickets/:id', handleTicketUpdateExpress);

// 13d. Admin - Bulk Update Ticket Timings
app.post('/api/admin/tickets/bulk-update-timing', async (req, res) => {
  try {
    const { ticketIds, showTime, showDate } = req.body;

    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No ticket IDs provided for bulk update.' });
    }

    const updateFields = {};
    if (showTime) updateFields.showTime = showTime;
    if (showDate) updateFields.showDate = showDate;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, error: 'Please specify new show time or show date.' });
    }

    if (isMongoConnected) {
      const validObjectIds = ticketIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      await Ticket.updateMany(
        { $or: [{ _id: { $in: validObjectIds } }, { ticketId: { $in: ticketIds } }] },
        { $set: updateFields }
      );
    } else {
      inMemoryTickets.forEach((t, idx) => {
        if (ticketIds.includes(String(t._id)) || ticketIds.includes(t.ticketId)) {
          inMemoryTickets[idx] = { ...inMemoryTickets[idx], ...updateFields };
        }
      });
    }

    console.log(`🎟️ [BULK TICKET TIMING UPDATED] Updated ${ticketIds.length} tickets to: ${showDate || 'Same Date'} @ ${showTime || 'Same Time'}`);

    return res.json({
      success: true,
      message: `Successfully updated timings for ${ticketIds.length} ticket(s)!`
    });
  } catch (error) {
    console.error('Bulk Update Ticket Timing Error:', error);
    res.status(500).json({ success: false, error: 'Failed to bulk update ticket timings.' });
  }
});

// 13b. Admin - Manually Issue Ticket(s)
app.post('/api/admin/tickets/issue', async (req, res) => {
  try {
    const {
      studentName,
      rollNo,
      branch,
      mobile,
      email,
      movieTitle,
      showDate,
      showTime,
      tierName,
      price,
      quantity,
      razorpayPaymentId,
      razorpayOrderId
    } = req.body;

    if (!studentName || !rollNo || !mobile || !email) {
      return res.status(400).json({ success: false, error: 'Student Name, Roll No, Mobile, and Email are required.' });
    }

    const bookingRef = `NRCM-BKG-ADMIN-${Date.now().toString().slice(-6)}`;
    const count = parseInt(quantity, 10) || 1;
    const generatedTickets = [];

    for (let i = 1; i <= count; i++) {
      const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const ticketId = `NRCM-TKT-${randomCode}-${i}`;

      const ticketObj = {
        ticketId,
        bookingRef,
        movieTitle: movieTitle || 'Businessman',
        showDate: showDate || 'AUGUST 24, 2026',
        showTime: showTime || '10:00 AM to 12:30 PM',
        tierName: tierName || 'General Pass',
        price: Number(price) || 50,
        studentName: studentName.trim(),
        rollNo: rollNo.trim().toUpperCase(),
        branch: branch ? branch.trim() : 'CSE',
        mobile: mobile.trim(),
        email: email.trim().toLowerCase(),
        status: 'VALID',
        usedAt: null,
        razorpayOrderId: razorpayOrderId || 'MANUAL_ADMIN_ISSUED',
        razorpayPaymentId: razorpayPaymentId || 'MANUAL_ADMIN_ISSUED',
        createdAt: new Date()
      };

      generatedTickets.push(ticketObj);
    }

    if (isMongoConnected) {
      const createdDocs = await Ticket.insertMany(generatedTickets);
      console.log(`🎟️ [ADMIN MANUAL TICKET ISSUED] ${count} tickets created for ${studentName} (${rollNo})`);
      return res.status(201).json({
        success: true,
        message: `${count} Ticket(s) issued successfully!`,
        bookingRef,
        tickets: createdDocs
      });
    } else {
      inMemoryTickets.unshift(...generatedTickets);
      console.log(`🎟️ [IN-MEMORY ADMIN MANUAL TICKET ISSUED] ${count} tickets created for ${studentName} (${rollNo})`);
      return res.status(201).json({
        success: true,
        message: `${count} Ticket(s) issued successfully!`,
        bookingRef,
        tickets: generatedTickets
      });
    }
  } catch (error) {
    console.error('Manual Issue Ticket Error:', error);
    res.status(500).json({ success: false, error: 'Failed to manually issue tickets.' });
  }
});


// 14. Submit Event Suggestion (Student)
app.post('/api/suggestions', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Suggestion text is required.' });
    }

    const newSuggestion = {
      suggestionId: 'SUG-' + Date.now().toString().slice(-6),
      text: text.trim(),
      createdAt: new Date(),
      status: 'NEW'
    };

    if (isMongoConnected) {
      const savedDoc = await Suggestion.create(newSuggestion);
      console.log(`💡 [NEW SUGGESTION] ${savedDoc.suggestionId}: ${savedDoc.text}`);
      return res.json({ success: true, message: 'Suggestion saved!', suggestion: savedDoc });
    } else {
      inMemorySuggestions.unshift(newSuggestion);
      console.log(`💡 [NEW SUGGESTION (IN-MEMORY)] ${newSuggestion.suggestionId}: ${newSuggestion.text}`);
      return res.json({ success: true, message: 'Suggestion saved!', suggestion: newSuggestion });
    }
  } catch (error) {
    console.error('Submit Suggestion Error:', error);
    res.status(500).json({ success: false, error: 'Failed to save suggestion.' });
  }
});

// 15. Admin - Fetch All Event Suggestions
app.get('/api/admin/suggestions', async (req, res) => {
  try {
    if (isMongoConnected) {
      const suggestions = await Suggestion.find().sort({ createdAt: -1 });
      return res.json({ success: true, suggestions });
    } else {
      return res.json({ success: true, suggestions: inMemorySuggestions });
    }
  } catch (error) {
    console.error('Fetch Suggestions Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch suggestions.' });
  }
});

// 16. Admin - Delete Event Suggestion
app.delete('/api/admin/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Suggestion.findByIdAndDelete(id);
    } else {
      inMemorySuggestions = inMemorySuggestions.filter(s => s._id !== id && s.suggestionId !== id);
    }
    return res.json({ success: true, message: 'Suggestion deleted successfully.' });
  } catch (error) {
    console.error('Delete Suggestion Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete suggestion.' });
  }
});
// 17. Admin - Send Ticket Hype Email with Attachment (Single or Bulk)
app.post('/api/admin/tickets/send-email', async (req, res) => {
  try {
    const { ticketId, slotFilter } = req.body;
    let targets = [];

    if (ticketId) {
      let t = null;
      if (isMongoConnected) {
        t = await Ticket.findOne({ $or: [{ ticketId: ticketId.trim() }, { bookingRef: ticketId.trim() }] });
      }
      if (!t) {
        t = inMemoryTickets.find(item => item.ticketId === ticketId.trim() || item._id === ticketId || item.bookingRef === ticketId.trim());
      }
      if (t) targets.push(t);
    } else {
      let all = [];
      if (isMongoConnected) {
        all = await Ticket.find({}).sort({ createdAt: -1 });
      } else {
        all = inMemoryTickets;
      }
      if (slotFilter === 'morning') {
        targets = all.filter(t => {
          const s = (t.showTime || '').trim();
          return s.includes('10:00 AM') || s.includes('10:30') || s.includes('Morning');
        });
      } else if (slotFilter === 'afternoon') {
        targets = all.filter(t => {
          const s = (t.showTime || '').trim();
          return s.includes('01:00 PM') || s.includes('02:30') || s.includes('Afternoon') || s.includes('Matinee');
        });
      } else {
        targets = all;
      }
    }

    if (targets.length === 0) {
      return res.status(404).json({ success: false, error: `No matching ticket(s) found for '${ticketId || slotFilter}'.` });
    }

    let successCount = 0;
    let failCount = 0;

    for (const ticket of targets) {
      const ok = await sendTicketHypeEmail(ticket);
      if (ok) successCount++;
      else failCount++;
      if (targets.length > 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    return res.json({
      success: true,
      message: `Dispatched ${successCount} ticket email(s) successfully! (${failCount} failed)`,
      successCount,
      failCount,
      totalCount: targets.length
    });
  } catch (error) {
    console.error('Send Ticket Email Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 17. Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USER || 'nrcmfmc';
  const validPass = process.env.ADMIN_PASS || 'fmc123';

  if ((username === validUser || username === 'admin' || username === 'nrcmfmc') && (password === validPass || password === 'fmc123')) {
    const token = 'admin-auth-token-' + Date.now();
    return res.json({ success: true, message: 'Admin authenticated successfully', token });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid username or password.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 NRCM.FMC Backend Server running on port ${PORT}`);
});

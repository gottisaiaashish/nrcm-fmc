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
const RAZORPAY_KEY_ID = (process.env.RAZORPAY_KEY_ID || 'rzp_test_TPbq6LSPNOCyoY').trim();
const RAZORPAY_KEY_SECRET = (process.env.RAZORPAY_KEY_SECRET || 'sMGpPKOGqpJlWTF2UbMQ58Yy').trim();

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
  posterUrl: { type: String, default: 'https://tse3.mm.bing.net/th/id/OIP.Ws0jajMZU5CdOh0jDEgBEQHaKf?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  venue: { type: String, default: 'NRCM Main Auditorium, Block A' },
  releaseDate: { type: String, default: 'MARCH 20, 2026' },
  showTimes: { type: [String], default: ['10:30 AM (Morning Show)', '02:30 PM (Matinee)', '06:30 PM (Evening Show)'] },
  tiers: { type: Array, default: [] },
  isBookingOpen: { type: Boolean, default: true },
  announcement: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

const EventSettings = mongoose.models.EventSettings || mongoose.model('EventSettings', eventSettingsSchema);

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  bookingRef: { type: String, required: true },
  movieTitle: { type: String, required: true },
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

// --- RE-RELEASE MOVIE EVENT & TICKET BOOKING ENDPOINTS ---

// 6. Get Event Settings (Public)
app.get('/api/event-settings', async (req, res) => {
  try {
    if (isMongoConnected) {
      let settings = await EventSettings.findOne();
      if (!settings) {
        settings = new EventSettings(inMemoryEventSettings);
        await settings.save();
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

// 8. Create Razorpay Order (or Mock Order)
app.post('/api/tickets/create-order', async (req, res) => {
  try {
    const { amount, tierName, quantity, studentName, rollNo } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid order amount.' });
    }

    const orderAmountInPaise = Math.round(amount * 100);

    if (razorpayInstance) {
      const options = {
        amount: orderAmountInPaise,
        currency: 'INR',
        receipt: `receipt_rerelease_${Date.now()}`,
        notes: { studentName, rollNo, tierName, quantity }
      };

      const order = await razorpayInstance.orders.create(options);
      console.log(`💳 [RAZORPAY ORDER CREATED] Order ID: ${order.id} | Amount: ₹${amount}`);

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
        showTime: showTime || '10:30 AM',
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

app.listen(PORT, () => {
  console.log(`🚀 NRCM.FMC Backend Server running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import nodemailer from 'nodemailer';

// Configure DNS fallback for MongoDB Atlas SRV resolution on Windows Node.js
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) {}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Nodemailer Transporter Configuration
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';

const transporter = nodemailer.createTransport(
  EMAIL_USER && EMAIL_PASS
    ? {
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      }
    : {
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      }
);

const sendConfirmationEmail = async (applicant) => {
  const { passId, name, email, branch, interestedArea, mobile } = applicant;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0f0f11; color: #ffffff; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 2px solid #e50914;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #27272a;">
        <h1 style="font-size: 28px; font-weight: 900; color: #e50914; margin: 0; letter-spacing: 2px;">NRCM.FMC</h1>
        <p style="font-size: 11px; color: #a1a1aa; font-family: monospace; letter-spacing: 3px; margin-top: 4px;">NARSIMHA REDDY ENGINEERING COLLEGE FILM MAKING CLUB</p>
      </div>

      <div style="padding: 30px 10px; text-align: center;">
        <div style="display: inline-block; padding: 6px 16px; background-color: rgba(229, 9, 20, 0.15); border: 1px solid #e50914; color: #e50914; font-family: monospace; font-size: 12px; font-weight: bold; border-radius: 20px; margin-bottom: 20px;">
          INDUCTION RECRUITMENT 2026
        </div>

        <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 12px;">APPLICATION RECEIVED, ${name.toUpperCase()}!</h2>
        <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6; margin-bottom: 24px;">
          Thank you for applying to join the NRCM Film Making Club crew. Your recruitment application has been successfully logged into our Command System.
        </p>

        <div style="background-color: #17171a; border: 1px solid #27272a; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 24px;">
          <p style="font-family: monospace; font-size: 11px; color: #e50914; margin: 0 0 10px 0; font-weight: bold;">APPLICATION DETAILS SUMMARY</p>
          <table style="width: 100%; font-size: 13px; color: #d4d4d8; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #71717a; width: 140px;">Application ID:</td><td style="font-weight: bold; font-family: monospace; color: #ffffff;">${passId}</td></tr>
            <tr><td style="padding: 4px 0; color: #71717a;">Full Name:</td><td style="font-weight: bold; color: #ffffff;">${name}</td></tr>
            <tr><td style="padding: 4px 0; color: #71717a;">Branch & Year:</td><td style="font-weight: bold; color: #ffffff;">${branch}</td></tr>
            <tr><td style="padding: 4px 0; color: #71717a;">Interested Area:</td><td style="font-weight: bold; color: #e50914;">${interestedArea || 'N/A'}</td></tr>
            <tr><td style="padding: 4px 0; color: #71717a;">Mobile:</td><td style="font-weight: bold; color: #ffffff;">${mobile}</td></tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #a1a1aa; line-height: 1.5;">
          Our FMC core team is currently reviewing all applications. If your profile is shortlisted, our team will get in touch with you via Mobile / WhatsApp / Instagram.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #27272a; font-size: 11px; color: #71717a; font-family: monospace;">
        © 2026 NRCM FILM MAKING CLUB · OFFICIAL RECRUITMENT
      </div>
    </div>
  `;

  try {
    if (EMAIL_USER && EMAIL_PASS) {
      await transporter.sendMail({
        from: `"NRCM Film Making Club" <${EMAIL_USER}>`,
        replyTo: EMAIL_USER,
        to: email,
        subject: `[NRCM.FMC] Application Received - ${name}`,
        html: htmlContent,
      });
      console.log(`✉️ [EMAIL SENT] Confirmation email sent to ${email} (${name})`);
    } else {
      console.log(`ℹ️ [EMAIL NOTICE] Registration received for ${email} (${name}). Configure EMAIL_USER & EMAIL_PASS in environment variables to dispatch live emails.`);
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

// MongoDB Schema & Model
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

    // Dispatch confirmation email asynchronously
    sendConfirmationEmail(entryData).catch(err => console.error('Email Dispatch Error:', err.message));

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

app.listen(PORT, () => {
  console.log(`🚀 NRCM.FMC Backend Server running on port ${PORT}`);
});

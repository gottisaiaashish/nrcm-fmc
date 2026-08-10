import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Fallback Storage if MongoDB is not yet connected
let inMemoryRegistrations = [];
let isMongoConnected = false;

// MongoDB Schema & Model
const registrationSchema = new mongoose.Schema({
  passId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
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
    timestamp: new Date().toISOString()
  });
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

// 3. Register Event Pass Endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, branch, mobile, email } = req.body;

    if (!name || !branch || !mobile || !email) {
      return res.status(400).json({
        success: false,
        error: 'All fields (name, branch, mobile, email) are required.'
      });
    }

    const passId = `FMC-PASS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isMongoConnected) {
      const newEntry = new Registration({
        passId,
        name,
        branch,
        mobile,
        email
      });
      await newEntry.save();

      console.log(`[MONGODB PASS SAVED] ${name} (${branch}) - Pass ID: ${passId}`);
      return res.status(201).json({
        success: true,
        message: 'Event pass registered successfully in MongoDB!',
        pass: newEntry
      });
    } else {
      const newEntry = {
        _id: passId,
        passId,
        name,
        branch,
        mobile,
        email,
        createdAt: new Date().toISOString()
      };
      inMemoryRegistrations.unshift(newEntry);

      console.log(`[IN-MEMORY PASS SAVED] ${name} (${branch}) - Pass ID: ${passId}`);
      return res.status(201).json({
        success: true,
        message: 'Event pass registered successfully (In-Memory)!',
        pass: newEntry
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process event registration.'
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

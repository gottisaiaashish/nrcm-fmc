import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory registration storage (can be connected to MongoDB/PostgreSQL)
const registrations = [];

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'NRCM.FMC API Gateway',
    timestamp: new Date().toISOString()
  });
});

// Event Pass Registration Endpoint
app.post('/api/register', (req, res) => {
  const { name, branch, mobile, email } = req.body;

  if (!name || !branch || !mobile || !email) {
    return res.status(400).json({
      success: false,
      error: 'All fields (name, branch, mobile, email) are required.'
    });
  }

  const newEntry = {
    id: `PASS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    branch,
    mobile,
    email,
    registeredAt: new Date().toISOString()
  };

  registrations.push(newEntry);
  console.log(`[PASS GENERATED] ${newEntry.name} (${newEntry.branch}) - ${newEntry.mobile}`);

  return res.status(201).json({
    success: true,
    message: 'Event pass registered successfully!',
    pass: newEntry
  });
});

// Get All Registrations Endpoint
app.get('/api/registrations', (req, res) => {
  res.json({
    success: true,
    count: registrations.length,
    registrations
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NRCM.FMC Backend Server running on port ${PORT}`);
});

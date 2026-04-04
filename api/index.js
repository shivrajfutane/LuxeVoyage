import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import connectDB from '../backend/db.js';
import Trip from '../backend/models/Trip.js';
import User from '../backend/models/User.js';
import { getForecast } from '../backend/services/weather.js';
import { sendDeleteOTP, sendResetPIN } from '../backend/services/email.js';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';

// Define the Express application
const app = express();

// DATABASE CONNECTION MIDDLEWARE (Critical for Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB-FATAL] Request blocked due to connection error');
    res.status(500).json({ error: 'Vault Connection Failed', details: err.message });
  }
});

const router = express.Router();
const port = process.env.PORT || 5000;

// Initialize Google Auth Client safely
let client;
if (process.env.GOOGLE_CLIENT_ID) {
  client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database Health Guard
const dbHealthCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
    console.error(`[DB-HEALTH-ALARM] Database state: ${mongoose.connection.readyState}. Rejecting request to: ${req.path}`);
    return res.status(503).json({
      error: 'Database Offline',
      details: 'LuxeVoyage cannot reach its travel vault (MongoDB).',
      action: 'ACTION REQUIRED: Please check your MongoDB Atlas whitelisting/connection string.'
    });
  }
  next();
};

// Apply Health Check to all API routes
router.use(dbHealthCheck);

// --- API ROUTES ---

router.get('/ping', (req, res) => res.json({ status: 'alive' }));

// 1. Trip Generation (AI)
router.post('/plan-trip', async (req, res) => {
  try {
    const { destination, budget, days, interests, travelStyle, userId } = req.body;
    if (!destination || !budget || !days || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(401).json({ error: 'Missing GROQ_API_KEY' });

    const groq = new Groq({ apiKey });
    const weatherContext = await getForecast(destination);

    const prompt = `Plan a ${days}-day trip to ${destination} for a ${budget} budget. Style: ${travelStyle}. Interests: ${interests}. 
    Weather now: ${weatherContext}. 
    
    ### CRITICAL REQUIREMENT:
    Every activity MUST have coordinates { lat: number, lng: number }. 
    Provide a numeric estimate for "estimatedTotalCost" (e.g. ₹150,000).

    Output JSON ONLY in this exact structure:
    {
      "destination": "${destination}",
      "estimatedTotalCost": "...",
      "itinerary": [
        {
          "day": 1,
          "theme": "...",
          "activities": [
            {"time": "...", "place": "...", "description": "...", "cost": "₹...", "coordinates": {"lat": 0.0, "lng": 0.0}, "imageQuery": "..."}
          ]
        }
      ]
    }`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    let tripPlan = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
    if (tripPlan.tripPlan) tripPlan = tripPlan.tripPlan;

    const newTrip = new Trip({
      destination: tripPlan.destination || destination,
      budget,
      days,
      travelStyle,
      interests,
      estimatedTotalCost: tripPlan.estimatedTotalCost || 'Varies',
      itinerary: tripPlan.itinerary,
      userId
    });
    const savedTrip = await newTrip.save();
    res.json({ ...tripPlan, tripId: savedTrip._id, userId: savedTrip.userId });
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ error: 'Generation failed', details: error.message });
  }
});

// 2. Trip Management
router.get('/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving trip' });
  }
});

router.get('/trips/user/:userId', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'History fetch failed' });
  }
});

// 3. User Authentication
router.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });
    user = new User({ name, email, password });
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto, createdAt: user.createdAt, preferences: user.preferences } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const { email, name, picture } = googleResponse.data;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, password: Math.random().toString(36), profilePhoto: picture });
      await user.save();
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto, createdAt: user.createdAt, preferences: user.preferences } });
  } catch (error) {
    res.status(401).json({ error: 'Google auth failed' });
  }
});

// 4. Password Recovery
router.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Traveler not found.' });
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPIN = pin;
    user.resetPINExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendResetPIN(email, pin);
    res.json({ message: 'Security PIN dispatched.' });
  } catch (error) {
    res.status(500).json({ error: 'Recovery failed.' });
  }
});

router.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, pin, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetPIN !== pin || new Date() > user.resetPINExpires) {
      return res.status(403).json({ error: 'Invalid or expired PIN.' });
    }
    user.password = newPassword;
    user.resetPIN = null;
    await user.save();
    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ error: 'Reset failed.' });
  }
});

// 5. User Profile
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({ id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto, preferences: user.preferences });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

router.patch('/user/:userId/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (req.body.profilePhoto) user.profilePhoto = req.body.profilePhoto;
    await user.save();
    res.json({ user: { id: user._id, name: user.name, profilePhoto: user.profilePhoto } });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

router.post('/user/:userId/delete-request', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.deleteOTP = otp;
    user.deleteOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendDeleteOTP(user.email, otp);
    res.json({ message: 'Code sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Secure deletion failed.' });
  }
});

router.delete('/user/:userId', async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.params.userId);
    if (user.deleteOTP !== otp || new Date() > user.deleteOTPExpires) {
      return res.status(403).json({ error: 'Invalid code.' });
    }
    await Trip.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);
    res.json({ message: 'Account deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Purge failed.' });
  }
});

// 6. Collaborative Features
router.post('/trips/:id/expenses', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    trip.expenses.push(req.body);
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Expense add failed' });
  }
});

// Mount the router on /api
app.use('/api', router);

// Error Handlers
app.use((req, res) => {
  console.warn(`[404-QUERY] ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route Not Found', path: req.url });
});

app.use((err, req, res, next) => {
  console.error('[GLOBAL-ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, '0.0.0.0', () => console.log(`Cruising on ${port}`));
}

export default app;

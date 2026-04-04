import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import NodeCache from 'node-cache';

dotenv.config();

// --- Database Logic (Self-Contained) ---
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('⚠️ MONGO_URI is not defined. Database skipped.');
      return false;
    }
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ MongoDB Connected (Serverless Native)');
    }
    return true;
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
    return false;
  }
};

// --- Models (Serverless Safe) ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: null },
  preferences: {
    interests: { type: [String], default: [] },
    travelStyle: { type: String, default: 'Elite Voyager' },
    budgetTier: { type: String, default: 'Premium' },
    bio: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now },
  deleteOTP: { type: String, default: null },
  deleteOTPExpires: { type: Date, default: null },
  resetPIN: { type: String, default: null },
  resetPINExpires: { type: Date, default: null }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const ActivitySchema = new mongoose.Schema({
  time: String,
  place: String,
  description: String,
  cost: String,
  coordinates: { lat: Number, lng: Number }
});
const DaySchema = new mongoose.Schema({
  day: Number,
  theme: String,
  crowdLevel: String,
  buddyTip: String,
  activities: [ActivitySchema]
});
const TripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  budget: { type: String, required: true },
  days: { type: Number, required: true },
  travelStyle: { type: String, default: 'Balanced' },
  interests: { type: String, default: 'Standard' },
  estimatedTotalCost: { type: String },
  itinerary: [DaySchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expenses: [{
    amount: Number,
    category: { type: String, enum: ['Food', 'Transport', 'Stay', 'Shopping', 'Other'], default: 'Other' },
    description: String,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  packingList: [{
    item: String,
    category: String,
    isPacked: { type: Boolean, default: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assigneeName: String
  }],
  createdAt: { type: Date, default: Date.now }
});
const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

// --- Weather Service (Self-Contained) ---
const weatherCache = new NodeCache({ stdTTL: 3600 });
const getForecast = async (destination) => {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`;
    const geoRes = await axios.get(geoUrl);
    if (!geoRes.data?.results?.[0]) return "Weather unavailable.";
    const { latitude, longitude } = geoRes.data.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherRes = await axios.get(weatherUrl);
    const daily = weatherRes.data.daily;
    return `5-Day Forecast: ${daily.temperature_2m_max[0]}°C High / ${daily.temperature_2m_min[0]}°C Low. Codes: ${daily.weather_code[0]}`;
  } catch { return "Weather unavailable."; }
};

// --- Email Service (Self-Contained) ---
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendResetPIN = async (email, pin) => {
  try { await transporter.sendMail({ from: '"LuxeVoyage Security"', to: email, subject: 'Recovery Code', text: `Your code: ${pin}` }); } catch {}
};

const sendDeleteOTP = async (email, otp) => {
  try { await transporter.sendMail({ from: '"LuxeVoyage Security"', to: email, subject: 'Deletion Code', text: `Your code: ${otp}` }); } catch {}
};

// --- Express App Logic ---
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initial Handshake / Error Trap
try { connectDB(); } catch {}

// Health Check (Bypass DB)
app.get('/api/ping', (req, res) => res.json({ status: 'alive' }));

// DB Heath Middleware
const dbHealthCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
    return res.status(503).json({ error: 'Database Offline' });
  }
  next();
};

app.use('/api', dbHealthCheck);

// Primary handlers (Consolidated)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User exists' });
    user = new User({ name, email, password });
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) { res.status(500).json({ error: 'Signup failed', details: error.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid' });
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) { res.status(500).json({ error: 'Login failed' }); }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const { email, name, picture } = googleResponse.data;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, password: Math.random().toString(36), profilePhoto: picture });
      await user.save();
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto } });
  } catch { res.status(500).json({ error: 'Google failed' }); }
});

app.post('/api/plan-trip', async (req, res) => {
  try {
    const { destination, budget, days, interests, travelStyle, userId } = req.body;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const weather = await getForecast(destination);
    const prompt = `Plan a ${days}-day trip to ${destination}. Style: ${travelStyle}. ${weather} Output JSON with itinerary.`;
    const chat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });
    let tripPlan = JSON.parse(chat.choices[0]?.message?.content || "{}");
    const newTrip = new Trip({ ...tripPlan, destination, budget, days, travelStyle, interests, userId });
    await newTrip.save();
    res.json({ ...tripPlan, tripId: newTrip._id, userId });
  } catch (error) { res.status(500).json({ error: 'Generation failed', details: error.message }); }
});

app.get('/api/trips/user/:userId', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch { res.status(500).json({ error: 'Server error history' }); }
});

app.get('/api/user/:userId/public', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const trips = await Trip.find({ userId: req.params.userId });
    res.json({ name: user.name, profilePhoto: user.profilePhoto, stats: { journeys: trips.length } });
  } catch { res.status(500).json({ error: 'Failed public' }); }
});

// Final Error Fallback
app.use((err, req, res, next) => res.status(500).json({ error: 'Monolithic Crash Trap', message: err.message }));

app.use((req, res) => res.status(404).json({ error: 'Route Not Found' }));

export default app;

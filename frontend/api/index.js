import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import connectDB from '../../backend/db.js';
import Trip from '../../backend/models/Trip.js';
import User from '../../backend/models/User.js';
import { getForecast } from '../../backend/services/weather.js';
import { sendDeleteOTP, sendResetPIN } from '../../backend/services/email.js';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

// Defensively connect to DB
try {
  connectDB();
} catch (err) {
  console.error('[CRITICAL-STARTUP-ERROR] Database connection failed:', err);
}

const app = express();
const port = process.env.PORT || 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database Health Guard
const dbHealthCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
    console.error(`[DB-HEALTH-ALARM] Database state: ${mongoose.connection.readyState}. Rejecting request to: ${req.path}`);
    return res.status(503).json({
      error: 'Database Offline',
      details: 'LuxeVoyage cannot reach its travel vault (MongoDB). Please ensure your IP is whitelisted in Atlas.',
      action: 'ACTION REQUIRED: Please add your current IP address to your MongoDB Atlas Whitelist.'
    });
  }
  next();
};

app.use('/api', dbHealthCheck);

// Primary Trip Generation (AI)
app.post('/api/plan-trip', async (req, res) => {
  try {
    const { destination, budget, days, interests, travelStyle, userId } = req.body;
    if (!destination || !budget || !days || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(401).json({ error: 'Missing GROQ_API_KEY in backend/.env' });

    const groq = new Groq({ apiKey });
    const weatherContext = await getForecast(destination);

    const prompt = `Plan a ${days}-day trip to ${destination} for a ${budget} budget. Style: ${travelStyle}. Interests: ${interests}. 
    Weather now: ${weatherContext}. 
    Output JSON ONLY with:
    1. destination
    2. estimatedTotalCost
    3. itinerary: list of days with:
       - day (number)
       - theme
       - crowdLevel
       - buddyTip
       - activities: list with time, place, description, cost, 
         coordinates: { lat: number, lng: number }, 
         imageQuery: (string, e.g., "Eiffel Tower sunset")`;

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
    res.status(500).json({ error: 'Failed to generate trip plan', details: error.message });
  }
});

// Trip Retrieval
app.get('/api/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving trip' });
  }
});

app.get('/api/trips/user/:userId', async (req, res) => {
  try {
    console.log(`[DEBUG-HISTORY] Fetching trips for User: ${req.params.userId}`);
    const trips = await Trip.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    console.log(`[DEBUG-HISTORY] Found ${trips.length} trips.`);
    res.json(trips);
  } catch (error) {
    console.error('[DEBUG-HISTORY-ERROR]', error);
    res.status(500).json({ error: 'Server error fetching history' });
  }
});

// User Auth Endpoints (Signup/Login)
app.post('/api/auth/signup', async (req, res) => {
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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto, createdAt: user.createdAt, preferences: user.preferences } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// PASSWORD RECOVERY
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Traveler not found in our records.' });

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPIN = pin;
    user.resetPINExpires = expiry;
    await user.save();

    console.log(`[AUTH-SECURE] Password Reset PIN for ${email}: ${pin}`);
    await sendResetPIN(email, pin);

    res.json({ message: 'Security PIN dispatched to your email.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate recovery.' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, pin, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Identity not found.' });

    if (!user.resetPIN || user.resetPIN !== pin || new Date() > user.resetPINExpires) {
      return res.status(403).json({ error: 'Invalid or expired security PIN.' });
    }

    user.password = newPassword;
    user.resetPIN = null;
    user.resetPINExpires = null;
    await user.save();

    res.json({ message: 'Security vault updated. Password successfully reset.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// GOOGLE AUTH (Secure Implementation)
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Verification token missing' });

    // Use the access token to fetch user info from Google's userinfo endpoint
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    
    const { email, name, picture } = googleResponse.data;
    if (!email) return res.status(400).json({ error: 'Failed to retrieve traveler identity' });

    let user = await User.findOne({ email });
    if (!user) {
      // Create new user if they don't exist
      user = new User({
        name,
        email,
        password: Math.random().toString(36).slice(-8), // Dummy password for OAuth users
        profilePhoto: picture
      });
      await user.save();
    }

    res.json({ user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto, createdAt: user.createdAt, preferences: user.preferences } });
  } catch (error) {
    console.error('[GOOGLE-AUTH-ERROR]', error.response?.data || error.message);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// EXPENSE MANAGEMENT
app.post('/api/trips/:id/expenses', async (req, res) => {
  try {
    const { amount, category, description, userId } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    trip.expenses.push({ amount, category, description, paidBy: userId });
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

app.delete('/api/trips/:id/expenses/:expenseId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    trip.expenses = trip.expenses.filter(e => e._id.toString() !== req.params.expenseId);
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// PACKING LIST MANAGEMENT
app.post('/api/trips/:id/packing/generate', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `Generate a smart travel packing list for a ${trip.days}-day trip to ${trip.destination}. 
    Budget: ${trip.budget}. Style: ${trip.travelStyle}.
    Output JSON ONLY as an array of objects with "item" and "category" (e.g., Electronics, Clothing, Essentials).`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    let list = JSON.parse(completion.choices[0]?.message?.content || "[]");
    if (list.packingList) list = list.packingList;
    if (list.items) list = list.items;
    if (!Array.isArray(list)) list = Object.values(list).find(v => Array.isArray(v)) || [];

    trip.packingList = list.map(i => ({ item: i.item, category: i.category, isPacked: false }));
    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error('[PACKING-GEN-ERROR]', error);
    res.status(500).json({ error: 'Failed to generate packing strategy' });
  }
});

app.patch('/api/trips/:id/packing/:itemId/toggle', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    const item = trip.packingList.id(req.params.itemId);
    item.isPacked = !item.isPacked;
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle item' });
  }
});

app.patch('/api/trips/:id/packing/:itemId/claim', async (req, res) => {
  try {
    const { userId, userName } = req.body;
    const trip = await Trip.findById(req.params.id);
    const item = trip.packingList.id(req.params.itemId);
    item.assignedTo = userId;
    item.assigneeName = userName;
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to claim item' });
  }
});

app.patch('/api/trips/:id/packing/:itemId/unclaim', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    const item = trip.packingList.id(req.params.itemId);
    item.assignedTo = null;
    item.assigneeName = null;
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unclaim item' });
  }
});

// Profile Management
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto, createdAt: user.createdAt, preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving user' });
  }
});

app.patch('/api/user/:userId/profile', async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (profilePhoto) user.profilePhoto = profilePhoto;
    await user.save();
    res.json({ message: 'Profile updated', user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto, createdAt: user.createdAt } });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// User Preferences (Travel Persona)
app.patch('/api/user/:userId/preferences', async (req, res) => {
  try {
    const { interests, travelStyle, budgetTier, bio } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.preferences) user.preferences = {};
    if (interests) user.preferences.interests = interests;
    if (travelStyle) user.preferences.travelStyle = travelStyle;
    if (budgetTier) user.preferences.budgetTier = budgetTier;
    if (bio) user.preferences.bio = bio;

    await user.save();
    res.json({ message: 'Preferences updated', preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// ACCOUNT DELETION WORKFLOW (Secure 2-Stage)
app.post('/api/user/:userId/delete-request', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Identity not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.deleteOTP = otp;
    user.deleteOTPExpires = expiry;
    await user.save();

    console.log(`[AUTH-SECURE] Deletion OTP for ${user.email}: ${otp}`);
    await sendDeleteOTP(user.email, otp);

    res.json({ message: 'Security code sent to your registered email.' });
  } catch (error) {
    console.error('[DELETE-REQUEST-ERROR]', error);
    res.status(500).json({ error: 'Failed to initiate secure deletion.' });
  }
});

app.delete('/api/user/:userId', async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Identity not found' });

    // Verify OTP
    if (!user.deleteOTP || user.deleteOTP !== otp || new Date() > user.deleteOTPExpires) {
      return res.status(403).json({ error: 'Invalid or expired security code.' });
    }

    // OBLITERATE DATA
    await Trip.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);

    console.log(`[AUTH-SECURE] User ${user.email} and all associated data purged.`);
    res.json({ message: 'Account and all travel data permanently deleted. Goodbye.' });
  } catch (error) {
    console.error('[DELETE-ERROR]', error);
    res.status(500).json({ error: 'Critical failure during data purge.' });
  }
});

// PUBLIC PROFILE Retrieval (Privacy-Safe)
app.get('/api/user/:userId/public', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Nomad not found' });

    const trips = await Trip.find({ userId });
    const journeyCount = trips.length;
    const miles = journeyCount > 0 ? (journeyCount * 1.2).toFixed(1) : '0';
    const continents = journeyCount > 0 ? Math.min(Math.max(Math.ceil(journeyCount / 1.5), 1), 7) : 0;

    res.json({
      name: user.name,
      profilePhoto: user.profilePhoto,
      preferences: user.preferences,
      createdAt: user.createdAt,
      stats: { journeys: journeyCount, miles: `${miles}k`, continents }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve public identity' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[GLOBAL-ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// JSON 404 Handler (CRITICAL: Prevents HTML "Unexpected token '<'" errors in frontend)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route Not Found', 
    path: req.originalUrl,
    message: 'The requested luxury endpoint does not exist.' 
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, '0.0.0.0', () => console.log(`[LuxeVoyage] Server cruising on http://localhost:${port}`));
}

export default app;

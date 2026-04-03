import mongoose from 'mongoose';

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

export default mongoose.models.User || mongoose.model('User', UserSchema);

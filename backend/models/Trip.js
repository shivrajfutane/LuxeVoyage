import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  time: String,
  place: String,
  description: String,
  whatToLookFor: String,
  payAttention: String,
  cost: String,
  coordinates: { lat: Number, lng: Number },
  votes: { type: [String], default: [] }
});

const DaySchema = new mongoose.Schema({
  day: Number,
  theme: String,
  crowdLevel: String,
  localEvent: String,
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
  collaborators: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  }],
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

export default mongoose.model('Trip', TripSchema);

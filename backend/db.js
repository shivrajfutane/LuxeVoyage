import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('⚠️ MONGO_URI is not defined. Skipping database connection.');
      return false;
    }
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (err.message.includes('IP address') || err.name === 'MongooseServerSelectionError') {
      console.error('\n' + '='.repeat(50));
      console.error('🚀 ACTION REQUIRED: FIX YOUR MONGODB CONNECTION');
      console.error('1. Log into your MongoDB Atlas Dashboard.');
      console.error('2. Go to "Network Access" in the sidebar.');
      console.error('3. Click "Add IP Address" and select "ADD CURRENT IP ADDRESS".');
      console.error('4. Confirm changes and wait 60 seconds.');
      console.error('='.repeat(50) + '\n');
    }
    return false;
  }
};

export default connectDB;

import mongoose from "mongoose";

// DEBUG LOG: Verify environment variable presence and formatting
// CAUTION: This will print your password to the logs. Remove after debugging.
console.log("MONGO_URI:", process.env.MONGO_URI);

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ Mongo Error:", err.message);
    throw err;
  }
};

export default connectDB;

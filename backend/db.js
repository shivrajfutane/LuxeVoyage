import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("MongoDB Connected");

  } catch (error) {
    console.error("MongoDB ERROR:", error.message);
    throw error;
  }
};

export default connectDB;

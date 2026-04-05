import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGODB_URI or MONGO_URI in your travel vault.");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless function invocations in production.
 */
let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected (Cached)");
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

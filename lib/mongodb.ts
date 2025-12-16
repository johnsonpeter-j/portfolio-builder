import mongoose from "mongoose";
import { initializeAdmin } from "./initAdmin";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("Please define the MONGO_URL environment variable inside .env.local");
}

interface MongooseValues {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongoose: MongooseValues;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let adminInitPromise: Promise<void> | null = null;

export async function connectToDatabase() {
  if (cached.conn) {
    // Initialize admin on first connection (only once, fire and forget)
    if (!adminInitPromise) {
      adminInitPromise = initializeAdmin().catch(err => {
        console.error("Admin initialization error:", err);
      });
    }
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URL!, opts).then(async (mongoose) => {
      // Initialize admin after first successful connection
      if (!adminInitPromise) {
        adminInitPromise = initializeAdmin().catch(err => {
          console.error("Admin initialization error:", err);
        });
      }
      return mongoose.connection;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

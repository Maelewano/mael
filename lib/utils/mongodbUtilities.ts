import { MongoClient } from "mongodb";
import mongoose, { Mongoose } from "mongoose";
import { env } from '@/env.mjs';
import { logger } from '@/lib/utils/logger';

const uri = env.MONGODB_URI as string;
if (!uri) throw new Error("Please define the MONGODB_URI environment variable");

// Declare global type augmentation (make TS happy)
declare global {
  /* eslint-disable no-var */
  // eslint-disable-next-line no-unused-vars
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  /* eslint-disable no-var */
  // eslint-disable-next-line no-unused-vars
  var _mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let cached = globalThis._mongoose;

if (env.NODE_ENV === "development") {
  // Use a global variable so we don't create a new client on every reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

if (!globalThis._mongoose) {
  globalThis._mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!cached) {
    cached = globalThis._mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    logger.debug('Using cached mongoose connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    logger.info('Creating new mongoose connection to:', uri.replace(/\/\/.*@/, '//***:***@'));
    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      if (mongooseInstance.connection.db) {
        logger.info('Mongoose connected successfully to database:', mongooseInstance.connection.db.databaseName);
      }
      return mongooseInstance;
    });
  }

  try {
    const [mongooseInstance] = await Promise.all([cached.promise]);
    cached.conn = mongooseInstance;
  } catch (e) {
    logger.error('Mongoose connection failed', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default clientPromise;
export { connectDB };

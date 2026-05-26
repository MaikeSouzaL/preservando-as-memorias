import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

const localCache = cached!;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.warn("MONGODB_URI não definida. Retornando null (provável fase de build).");
    return null;
  }

  if (localCache.conn) {
    return localCache.conn;
  }

  if (!localCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    localCache.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  localCache.conn = await localCache.promise;
  return localCache.conn;
}

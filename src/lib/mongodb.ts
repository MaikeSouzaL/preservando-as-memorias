import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

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
  if (!MONGODB_URI) {
    throw new Error("Por favor, defina a variável MONGODB_URI no arquivo .env");
  }

  if (localCache.conn) {
    return localCache.conn;
  }

  if (!localCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    localCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  localCache.conn = await localCache.promise;
  return localCache.conn;
}

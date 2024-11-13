import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connect = async () => {
  if (cached.conn) return cached.conn;

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "clerkauthv5",
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });


    try {
      // Await the connection promise and cache the result
      cached.conn = await cached.promise;
      console.log("Connected to MongoDB successfully.");
      return cached.conn;
    } catch (error) {
      // Log any errors during connection and rethrow them
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  cached.conn = await cached.promise;

  return cached.conn;
};

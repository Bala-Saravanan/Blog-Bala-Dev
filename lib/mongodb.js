import mongoose from "mongoose";

let isConnected = false; // track connection

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "blogDB",
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

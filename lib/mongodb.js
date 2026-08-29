import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

console.log("DNS SERVERS:", dns.getServers());
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    console.log(
      "Mongo URI:",
      process.env.MONGO_URI?.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@"),
    );

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "blogDB",
    });

    isConnected = true;

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};

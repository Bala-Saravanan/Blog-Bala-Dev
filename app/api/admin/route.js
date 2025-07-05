import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const adminDoc = await mongoose.connection.db.collection("admin").findOne();
    console.log(adminDoc);
    return Response.json(adminDoc);
  } catch (error) {
    console.error("Error fetching admin doc:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

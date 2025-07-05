import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const adminDoc = await mongoose.connection.db.collection("admin").findOne();
    if (adminDoc.email !== body.email) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    const authorized = await bcrypt.compare(body.password, adminDoc.password);
    if (authorized) {
      return NextResponse.json({ status: 200, message: "Success" });
    } else {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 400, message: error.message });
  }
}

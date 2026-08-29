import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const resolvedParams =
      params && typeof params.then === "function" ? await params : params;
    const blogId = resolvedParams?.id;

    if (!blogId) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    const action = body?.action || "like";
    const increment = action === "unlike" ? -1 : 1;

    const collection = mongoose.connection.db.collection("blogs");

    // Find blog by ObjectId or by slug
    let existing = null;
    if (mongoose.Types.ObjectId.isValid(blogId)) {
      try {
        existing = await collection.findOne({
          _id: new mongoose.Types.ObjectId(blogId),
        });
      } catch {}
    }

    if (!existing) {
      existing = await collection.findOne({ slug: blogId });
    }

    if (!existing) {
      existing = await collection.findOne({ _id: blogId });
    }

    if (!existing) {
      console.warn(`[Like API] Blog not found for id/slug: ${blogId}`);
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    const currentLikes =
      typeof existing.likes === "number" && !isNaN(existing.likes)
        ? existing.likes
        : 0;
    const newLikes = Math.max(0, currentLikes + increment);

    // Direct MongoDB update - guaranteed to persist in Compass
    await collection.updateOne(
      { _id: existing._id },
      { $set: { likes: newLikes } }
    );

    console.log(
      `[Like API] Successfully updated blog ${existing._id} (${existing.title}) likes: ${currentLikes} -> ${newLikes}`
    );

    return NextResponse.json({
      success: true,
      likes: newLikes,
    });
  } catch (error) {
    console.error("[Like API] Error updating likes:", error);
    return NextResponse.json(
      { message: "Failed to update like", error: error.message },
      { status: 500 }
    );
  }
}




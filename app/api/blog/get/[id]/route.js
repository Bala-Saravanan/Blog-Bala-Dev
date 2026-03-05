import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/blog.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const blog = await Blog.findById(params.id);
    return NextResponse.json(blog);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to get the blog",
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedBlog = await Blog.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to update blogs",
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Blog.findByIdAndDelete(params.id);
    return NextResponse.json({
      message: "Blog deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to delete the blog",
      status: 500,
    });
  }
}

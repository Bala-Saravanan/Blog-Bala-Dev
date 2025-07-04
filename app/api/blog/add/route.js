import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/blog.model.js";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log(body);
    await Blog.create(body);
    return new Response(JSON.stringify({ status: 201 }));
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ status: 400 }));
  }
}

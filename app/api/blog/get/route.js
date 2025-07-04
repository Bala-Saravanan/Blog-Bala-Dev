import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/blog.model";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(blogs), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get blogs", { status: 400 });
  }
}

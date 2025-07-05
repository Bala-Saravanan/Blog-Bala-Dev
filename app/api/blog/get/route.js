import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/blog.model";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const BLOG_PER_PAGE = 3;
  const skip = BLOG_PER_PAGE * (page - 1);
  try {
    await connectDB();
    const [blogs, totalCount] = await Promise.all([
      Blog.find().skip(skip).limit(BLOG_PER_PAGE).sort({ createdAt: -1 }),
      Blog.countDocuments(),
    ]);
    return new Response(JSON.stringify({ blogs, totalCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get blogs", { status: 400 });
  }
}

import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/blog.model";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limitParam = searchParams.get("limit");
  const BLOG_PER_PAGE = limitParam ? parseInt(limitParam) : 3;
  const slug = searchParams.get("slug");
  const search = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";
  const skip = BLOG_PER_PAGE * (page - 1);

  try {
    await connectDB();

    const andConditions = [];

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      andConditions.push({
        $or: [
          { title: { $regex: searchRegex } },
          { excerpt: { $regex: searchRegex } },
          { content: { $regex: searchRegex } },
          { tags: { $regex: searchRegex } },
        ],
      });
    }

    if (tag.trim()) {
      const tagRegex = new RegExp(`^${tag.trim()}$`, "i");
      andConditions.push({
        tags: { $regex: tagRegex },
      });
    }

    const filter = {};
    if (andConditions.length === 1) {
      Object.assign(filter, andConditions[0]);
    } else if (andConditions.length > 1) {
      filter.$and = andConditions;
    }

    const [rawBlogs, rawBlog, totalCount, allTags, rawMostLiked] =
      await Promise.all([
        Blog.find(filter)
          .skip(skip)
          .limit(BLOG_PER_PAGE)
          .sort({ createdAt: -1 }),
        slug ? Blog.findOne({ slug }) : null,
        Blog.countDocuments(filter),
        Blog.distinct("tags"),
        Blog.find().sort({ likes: -1, createdAt: -1 }).limit(3),
      ]);

    const blogs = rawBlogs.map((b) => {
      const doc = b.toObject ? b.toObject() : b;
      return {
        ...doc,
        likes:
          typeof doc.likes === "number" && !isNaN(doc.likes) ? doc.likes : 0,
      };
    });

    const mostLikedBlogs = (rawMostLiked || []).map((b) => {
      const doc = b.toObject ? b.toObject() : b;
      return {
        ...doc,
        likes:
          typeof doc.likes === "number" && !isNaN(doc.likes) ? doc.likes : 0,
      };
    });

    const blog = rawBlog
      ? {
          ...(rawBlog.toObject ? rawBlog.toObject() : rawBlog),
          likes:
            typeof rawBlog.likes === "number" && !isNaN(rawBlog.likes)
              ? rawBlog.likes
              : 0,
        }
      : null;

    return new Response(
      JSON.stringify({
        blogs,
        blog,
        totalCount,
        allTags: allTags.filter(Boolean),
        mostLikedBlogs,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to get blogs:", error);
    return new Response("Failed to get blogs", { status: 400 });
  }
}


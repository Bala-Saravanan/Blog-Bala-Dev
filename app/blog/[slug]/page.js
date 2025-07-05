import Image from "next/image";

async function getBlogBySlug(slug) {
  const res = await fetch(
    `${process.env.NEXT_API_URL}/api/blog/get/?slug=${slug}`,
    {
      cache: "no-cache",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  return res.json();
}
export default async function BlogDetailPage({ params }) {
  const { slug } = params;
  const { blog } = await getBlogBySlug(slug);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Image
          src={blog.image}
          alt={blog.title}
          width={800}
          height={400}
          className="rounded-xl object-cover w-full h-64"
        />
      </div>

      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
        <p className="text-sm">{new Date(blog.createdAt).toDateString()}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <article className="prose max-w-none mt-8">
        <p>{blog.content}</p>
      </article>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

marked.setOptions({
  breaks: true,
});

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
  const { slug } = await params;
  const { blog } = await getBlogBySlug(slug);

  const cleanMarkdown = blog.content.replace(/\\n/g, "\n");

  const dirtyHTML = marked(cleanMarkdown);
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  const safeHTML = DOMPurify.sanitize(dirtyHTML);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="my-4">
        <button className="px-3 md:px-7 py-2 rounded-full ring-1 ring-purple-600 text-purple-600">
          <Link href={"/"}>← Back</Link>
        </button>
      </div>
      <main className="">
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

        <article className="prose prose-lg dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
        </article>
      </main>
    </div>
  );
}

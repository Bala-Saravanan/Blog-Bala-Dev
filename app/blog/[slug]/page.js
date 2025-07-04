"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BlogDetailPage() {
  const { slug } = useParams();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blog/get");
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.log(error);
        setError(error?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return <p className="text-center py-10 text-red-500">Blog not found</p>;
  }
  if (error) {
    return <p className="text-center py-28 text-red-500">{error}</p>;
  }
  if (loading) {
    return <p className="text-center py-28">Loading...</p>;
  }

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

"use client";

import Link from "next/link";
import Image from "next/image";

export default function BlogCard({ blog }) {
  return (
    <div className="rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden hover:shadow-lg hover:shadow-purple-300 transition-shadow duration-300 flex flex-col sm:flex-row min-h-[280px]">
      {/* Blog Image */}
      <div className="relative w-full sm:w-1/3 h-56 sm:h-auto sm:min-h-[280px]">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Blog Content */}
      <div className="p-6 flex flex-col justify-between sm:w-2/3">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
          <p className="text-base  line-clamp-4">{blog.excerpt}</p>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm">
          <p>{new Date(blog.createdAt).toDateString()}</p>
          <button className="px-6 py-2 border-1 border-purple-600 rounded-full text-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-700 ease-in-out">
            <Link href={`/blog/${blog.slug}`}>Read more →</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

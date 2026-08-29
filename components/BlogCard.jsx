"use client";

import Link from "next/link";
import Image from "next/image";
import LikeButton from "./LikeButton";

export default function BlogCard({ blog }) {
  const blogId = blog?._id || blog?.slug;

  return (
    <div className="rounded-2xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden hover:shadow-lg hover:shadow-purple-300 dark:hover:shadow-purple-950/50 transition-shadow duration-300 flex flex-col sm:flex-row min-h-[280px] bg-white dark:bg-gray-800/90">
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
            {blog.tags &&
              blog.tags.map((tag, i) => (
                <Link
                  key={i}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/70 px-2 py-1 rounded-full transition-colors"
                >
                  #{tag}
                </Link>
              ))}
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            {blog.title}
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 line-clamp-4">
            {blog.excerpt}
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <span>
              {blog.createdAt
                ? new Date(blog.createdAt).toDateString()
                : "Recent"}
            </span>

            {/* Like Button Component */}
            {blogId && (
              <LikeButton
                blogId={blogId}
                initialLikes={blog.likes || 0}
                size="sm"
              />
            )}
          </div>

          <button className="px-5 py-1.5 border border-purple-600 rounded-full text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition-colors duration-300 ease-in-out font-medium text-xs sm:text-sm cursor-pointer">
            <Link href={`/blog/${blog.slug}`}>Read more →</Link>
          </button>
        </div>
      </div>
    </div>
  );
}



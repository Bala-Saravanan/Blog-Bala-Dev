"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFire, FaHeart } from "react-icons/fa";

export default function MostLikedBlogs({ blogs = [] }) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  // Limit to top 3 blogs
  const topBlogs = blogs.slice(0, 3);

  const getRankBadgeStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/20";
      case 1:
        return "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/20";
      case 2:
        return "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-blue-500/20";
      default:
        return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/90 rounded-3xl p-6 border border-gray-200 dark:border-gray-700/80 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100 dark:border-gray-700/60">
        <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/50 dark:to-red-950/50 text-orange-600 dark:text-orange-400 rounded-xl shadow-xs">
          <FaFire size={18} />
        </div>
        <div>
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-tight">
            Most-Liked Blogs
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Top 3 community favorites
          </p>
        </div>
      </div>

      {/* List of Top 3 Blogs */}
      <div className="space-y-4">
        {topBlogs.map((blog, index) => {
          const rank = index + 1;
          const blogSlug = blog.slug || blog._id;

          return (
            <Link
              key={blog._id || index}
              href={`/blog/${blogSlug}`}
              className="group flex items-center gap-3.5 p-2.5 -mx-2.5 rounded-2xl hover:bg-purple-50/60 dark:hover:bg-gray-700/40 transition-all duration-200"
            >
              {/* Rank & Image Container */}
              <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-xs ring-1 ring-gray-200 dark:ring-gray-700">
                {blog.image ? (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 font-bold">
                    #{rank}
                  </div>
                )}

                {/* Rank Pill Badge */}
                <div
                  className={`absolute top-1 left-1 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shadow-xs ${getRankBadgeStyle(
                    index
                  )}`}
                >
                  {rank}
                </div>
              </div>

              {/* Content Snippet */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2 transition-colors leading-snug">
                  {blog.title}
                </h4>

                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 font-semibold text-red-500 dark:text-red-400">
                    <FaHeart size={11} />
                    {blog.likes || 0}
                  </span>

                  <span className="text-gray-300 dark:text-gray-600">•</span>

                  <span className="truncate">
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : "Recent"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

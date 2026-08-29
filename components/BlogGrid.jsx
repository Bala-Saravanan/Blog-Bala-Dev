"use client";

import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import BlogSearch from "./BlogSearch";
import MostLikedBlogs from "./MostLikedBlogs";
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";

const BlogGrid = ({
  blogs = [],
  page = 1,
  totalCount = 0,
  allTags = [],
  activeSearch = "",
  activeTag = "",
  mostLikedBlogs = [],
}) => {
  const BLOG_PER_PAGE = 3;
  const hasPrev = BLOG_PER_PAGE * (page - 1) > 0;
  const hasNext = BLOG_PER_PAGE * (page - 1) + BLOG_PER_PAGE < totalCount;
  const hasActiveFilters = Boolean(activeSearch || activeTag);

  return (
    <div className="pt-16 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Blogs
        </h2>
        {totalCount > 0 && (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing {blogs.length} of {totalCount}{" "}
            {totalCount === 1 ? "article" : "articles"}
          </span>
        )}
      </div>

      {/* Search & Tag Filter Bar */}
      <BlogSearch
        allTags={allTags}
        activeSearch={activeSearch}
        activeTag={activeTag}
      />

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
        {/* Left Column: Main Blog Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {blogs.length > 0 ? (
            <>
              {blogs.map((blog) => (
                <BlogCard key={blog._id || blog.slug} blog={blog} />
              ))}

              {/* Pagination */}
              <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
            </>
          ) : (
            <div className="py-16 px-6 text-center bg-white dark:bg-gray-800/60 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm my-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                <FiBookOpen size={30} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                No Blogs Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 text-sm">
                {hasActiveFilters
                  ? "We couldn't find any articles matching your search query or tag filter. Try using different keywords or reset your filters."
                  : "No blogs have been published yet. Please check back later!"}
              </p>

              {hasActiveFilters && (
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Clear All Filters
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Most-Liked Blogs Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <MostLikedBlogs blogs={mostLikedBlogs} />
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;



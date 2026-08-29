"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiTag, FiPlus, FiEdit2, FiTrash2, FiUser } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  const BLOG_PER_PAGE = 5;

  // Authentication check
  useEffect(() => {
    const access = localStorage.getItem("admin");
    if (access !== "granted") {
      alert("Not authenticated");
      router.push("/");
    }
  }, [router]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchBlogs = useCallback(
    async (currentPage = page, searchStr = debouncedSearch, tagStr = selectedTag) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", currentPage.toString());
        queryParams.set("limit", BLOG_PER_PAGE.toString());
        if (searchStr.trim()) queryParams.set("search", searchStr.trim());
        if (tagStr.trim()) queryParams.set("tag", tagStr.trim());

        const res = await fetch(`/api/blog/get?${queryParams.toString()}`);
        const data = await res.json();

        setBlogs(data.blogs || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(Math.max(1, Math.ceil((data.totalCount || 0) / BLOG_PER_PAGE)));

        if (data.allTags && data.allTags.length > 0) {
          setAllTags(data.allTags);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, debouncedSearch, selectedTag]
  );

  useEffect(() => {
    fetchBlogs(page, debouncedSearch, selectedTag);
  }, [page, debouncedSearch, selectedTag]);

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedTag("");
    setPage(1);
  };

  async function deleteBlog(id) {
    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/blog/get/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // If current page only had 1 item and page > 1, go back one page
        if (blogs.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchBlogs(page, debouncedSearch, selectedTag);
        }
      } else {
        alert("Failed to delete blog.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting blog.");
    }
  }

  const hasActiveFilters = Boolean(search || selectedTag);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your articles, search blog content, and filter by tags.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/dashboard/about"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/80 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 transition-all cursor-pointer shadow-xs text-sm"
          >
            <FiUser size={16} />
            Edit About
          </Link>

          <Link
            href="/blog/add"
            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer text-sm"
          >
            <FiPlus size={18} />
            Create Blog
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mt-8 bg-white dark:bg-gray-800/80 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, excerpt, or tags..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Tag Dropdown & Filter Info */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <FiTag className="text-gray-400 hidden sm:block" size={16} />
              <select
                value={selectedTag}
                onChange={(e) => handleTagChange(e.target.value)}
                className="py-2.5 px-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                <option value="">All Tags</option>
                {allTags.map((tag, idx) => (
                  <option key={idx} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline px-2 py-1"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700/50">
          <span>
            {loading ? "Searching..." : `Found ${totalCount} blog ${totalCount === 1 ? "post" : "posts"}`}
          </span>
          {hasActiveFilters && (
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              Filters applied
            </span>
          )}
        </div>
      </div>

      {/* Blogs Table */}
      <div className="mt-6 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="py-3.5 px-6">Blog Post</th>
                <th className="py-3.5 px-6">Tags</th>
                <th className="py-3.5 px-6">Likes</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p>Loading blogs...</p>
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {blog.title}
                      </div>
                      {blog.excerpt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5 max-w-md">
                          {blog.excerpt}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {blog.tags && blog.tags.length > 0 ? (
                          blog.tags.map((t, i) => (
                            <span
                              key={i}
                              onClick={() => handleTagChange(t)}
                              title={`Filter by #${t}`}
                              className="text-xs bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors"
                            >
                              #{t}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No tags</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-900/50">
                        <FaHeart size={12} className="text-red-500" />
                        {blog.likes || 0}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/edit/${blog._id}`}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                        >
                          <FiEdit2 size={13} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteBlog(blog._id)}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          <FiTrash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-medium text-base text-gray-800 dark:text-gray-200">
                      No blogs found
                    </p>
                    <p className="text-xs mt-1">
                      {hasActiveFilters
                        ? "Try adjusting your search query or tag filter."
                        : "No blog posts currently exist in the database."}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Prev
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    page === p
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


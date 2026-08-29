"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FiSearch, FiX, FiTag, FiChevronDown } from "react-icons/fi";

export default function BlogSearch({
  allTags = [],
  activeSearch = "",
  activeTag = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(activeSearch);

  // Sync internal search input with URL search param
  useEffect(() => {
    setSearchTerm(activeSearch);
  }, [activeSearch]);

  const updateFilters = (newSearch, newTag) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");

    if (newSearch && newSearch.trim()) {
      params.set("search", newSearch.trim());
    } else {
      params.delete("search");
    }

    if (newTag && newTag.trim()) {
      params.set("tag", newTag.trim());
    } else {
      params.delete("tag");
    }

    // Reset to page 1 whenever search or tag filter changes
    params.set("page", "1");

    startTransition(() => {
      const targetPath = pathname === "/blog" ? "/blog" : "/";
      router.push(`${targetPath}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters(searchTerm, activeTag);
  };

  const handleTagSelect = (e) => {
    const selectedTag = e.target.value;
    updateFilters(searchTerm, selectedTag);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    const params = new URLSearchParams();
    params.set("page", "1");
    startTransition(() => {
      const targetPath = pathname === "/blog" ? "/blog" : "/";
      router.push(`${targetPath}`);
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    updateFilters("", activeTag);
  };

  const handleClearTag = () => {
    updateFilters(searchTerm, "");
  };

  const hasActiveFilters = Boolean(activeSearch || activeTag);

  return (
    <div className="w-full max-w-3xl mb-8 space-y-4">
      {/* Search Input Bar and Tag Filter Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400 pointer-events-none">
              <FiSearch size={18} />
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs by title, keywords, or tags..."
              className="w-full pl-11 pr-24 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />

            <div className="absolute right-2.5 flex items-center gap-1">
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search"
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FiX size={16} />
                </button>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>

        {/* Tag Filter Dropdown */}
        {allTags && allTags.length > 0 && (
          <div className="relative min-w-[160px] sm:w-auto">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 pointer-events-none">
              <FiTag size={15} />
            </div>

            <select
              value={activeTag}
              onChange={handleTagSelect}
              aria-label="Filter blogs by tag"
              className="w-full pl-9 pr-9 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm text-gray-800 dark:text-gray-100 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
            >
              <option value="">All Tags</option>
              {allTags.map((tag, idx) => (
                <option key={idx} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>

            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <FiChevronDown size={15} />
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Chips / Clear All Banner */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 flex-wrap text-purple-900 dark:text-purple-200">
            <span className="font-medium">Filtered by:</span>
            {activeSearch && (
              <span className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs">
                Keyword: &ldquo;{activeSearch}&rdquo;
                <button
                  onClick={handleClearSearch}
                  className="hover:text-red-500 transition-colors ml-1 cursor-pointer"
                  title="Remove keyword filter"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {activeTag && (
              <span className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs">
                Tag: #{activeTag}
                <button
                  onClick={handleClearTag}
                  className="hover:text-red-500 transition-colors ml-1 cursor-pointer"
                  title="Remove tag filter"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 underline cursor-pointer shrink-0 ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}


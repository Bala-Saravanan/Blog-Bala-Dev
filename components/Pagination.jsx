"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ page, hasPrev, hasNext }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="my-6 w-full flex justify-between items-center">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={!hasPrev}
        className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl border border-purple-600 cursor-pointer hover:bg-transparent hover:text-purple-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-purple-600 disabled:hover:text-white"
      >
        {"← "}Prev
      </button>

      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Page {page}
      </span>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNext}
        className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl border border-purple-600 cursor-pointer hover:bg-transparent hover:text-purple-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-purple-600 disabled:hover:text-white"
      >
        Next{" →"}
      </button>
    </div>
  );
}


"use client";

import { useRouter } from "next/navigation";

export default function Pagination({ page, hasPrev, hasNext }) {
  const router = useRouter();
  return (
    <div className="my-4 w-full flex justify-between">
      <button
        onClick={() => router.push(`?page=${page - 1}`)}
        disabled={!hasPrev}
        className="px-7 py-3 bg-purple-600 text-white rounded-lg border-1 border-purple-600 cursor-pointer hover:bg-white hover:text-purple-600 disabled:cursor-not-allowed disabled:bg-purple-300"
      >
        {"< "}Prev
      </button>
      <button
        onClick={() => router.push(`?page=${page + 1}`)}
        disabled={!hasNext}
        className="px-7 py-3 bg-purple-600 text-white rounded-lg border-1 border-purple-600 cursor-pointer hover:bg-white hover:text-purple-600 disabled:cursor-not-allowed disabled:bg-purple-300"
      >
        Next{" >"}
      </button>
    </div>
  );
}

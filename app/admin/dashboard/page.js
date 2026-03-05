"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchBlogs(page = 1) {
    const res = await fetch(`/api/blog/get?page=${page}`);
    const data = await res.json();
    setBlogs(data.blogs);
    setTotalPages(Math.floor(data.totalCount / 2));
  }

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  async function deleteBlog(id) {
    const confirmDelete = confirm("Delete this blog?");

    if (!confirmDelete) return;

    await fetch(`/api/blog/get/${id}`, {
      method: "DELETE",
    });

    fetchBlogs();
  }

  return (
    <div className="p-10 pt-20">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Link
        href="/blog/add"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
      >
        Create Blog
      </Link>

      <table className="mt-6 w-full border">
        <thead>
          <tr className="border">
            <th className="p-2">Title</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border">
              <td className="p-2">{blog.title}</td>

              <td className="p-2 flex gap-3">
                <Link
                  href={`/admin/dashboard/edit/${blog._id}`}
                  className="py-1 px-2 font-semibold text-white bg-blue-500 rounded-lg"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="py-1 px-2 font-semibold text-white bg-red-400 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-purple-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

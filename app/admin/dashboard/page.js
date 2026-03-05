"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);

  async function fetchBlogs() {
    const res = await fetch("/api/blog/get");
    const data = await res.json();
    setBlogs(data.blogs);
    console.log(data.blogs);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

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
    </div>
  );
}

"use client";

import BlogGrid from "@/components/BlogGrid";
import { useEffect, useState } from "react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blog/get");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error(error);
        setError(error?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }
  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }
  return (
    <div>
      <BlogGrid blogs={blogs} />
    </div>
  );
};
export default Blogs;

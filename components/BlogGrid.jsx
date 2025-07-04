"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
// import { blogs } from "@/constants/blogs";

const BlogGrid = ({ blogs = [] }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold pt-16 pb-10">My Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id} className="p-4 max-w-3xl mr-auto">
          <BlogCard blog={blog} />
        </div>
      ))}
    </div>
  );
};
export default BlogGrid;

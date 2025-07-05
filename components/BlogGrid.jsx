"use client";

import BlogCard from "./BlogCard";
import Pagination from "./Pagination";

const BlogGrid = ({ blogs = [], page, totalCount }) => {
  const BLOG_PER_PAGE = 3;
  const hasPrev = BLOG_PER_PAGE * (page - 1) > 0;
  const hasNext = BLOG_PER_PAGE * (page - 1) + BLOG_PER_PAGE < totalCount;
  return (
    <div>
      <h1 className="text-3xl font-bold pt-16 pb-10">My Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id} className="p-4 max-w-3xl mr-auto">
          <BlogCard blog={blog} />
        </div>
      ))}
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};
export default BlogGrid;

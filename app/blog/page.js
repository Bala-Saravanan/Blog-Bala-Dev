// "use client";

import BlogGrid from "@/components/BlogGrid";
// import { useEffect, useState } from "react";

async function getAllBlogs(page) {
  const res = await fetch(`http://localhost:3000/api/blog/get?page=${page}`, {
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const Blogs = async ({ page }) => {
  const { blogs, totalCount } = await getAllBlogs(page);

  return (
    <div>
      <BlogGrid blogs={blogs} page={page} totalCount={totalCount} />
    </div>
  );
};
export default Blogs;

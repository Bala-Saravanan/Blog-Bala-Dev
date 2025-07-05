import BlogGrid from "@/components/BlogGrid";

async function getAllBlogs(page) {
  const res = await fetch(
    `${process.env.NEXT_API_URL}/api/blog/get?page=${page}`,
    {
      cache: "no-cache",
    }
  );
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

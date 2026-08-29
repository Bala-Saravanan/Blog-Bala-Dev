import BlogGrid from "@/components/BlogGrid";

async function getAllBlogs(page = 1, search = "", tag = "") {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page.toString());
  if (search) queryParams.set("search", search);
  if (tag) queryParams.set("tag", tag);

  const res = await fetch(
    `${process.env.NEXT_API_URL}/api/blog/get?${queryParams.toString()}`,
    {
      cache: "no-cache",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const Blogs = async ({ page, search, tag, searchParams }) => {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentPage = page || parseInt(resolvedParams?.page) || 1;
  const currentSearch =
    search !== undefined ? search : resolvedParams?.search || "";
  const currentTag = tag !== undefined ? tag : resolvedParams?.tag || "";

  const {
    blogs = [],
    totalCount = 0,
    allTags = [],
    mostLikedBlogs = [],
  } = await getAllBlogs(currentPage, currentSearch, currentTag);

  return (
    <div>
      <BlogGrid
        blogs={blogs}
        page={currentPage}
        totalCount={totalCount}
        allTags={allTags}
        activeSearch={currentSearch}
        activeTag={currentTag}
        mostLikedBlogs={mostLikedBlogs}
      />
    </div>
  );
};

export default Blogs;


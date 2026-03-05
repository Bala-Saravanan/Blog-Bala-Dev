"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const EditPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const form = useRef();

  const [blog, setBlog] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: [],
    image: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch blog
  async function getBlogById() {
    try {
      const res = await fetch(`/api/blog/get/${id}`);
      const data = await res.json();

      if (data) {
        setBlog(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Admin auth check
  useEffect(() => {
    const access = localStorage.getItem("admin");

    if (access !== "granted") {
      alert("Not authenticated");
      router.push("/");
    }
  }, [router]);

  // Fetch blog on load
  useEffect(() => {
    if (id) getBlogById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(form.current);
      const imageFile = formData.get("image");

      let imageUrl = blog.image;

      // Upload new image only if selected
      if (imageFile && imageFile.size > 0) {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        const uploadData = await uploadRes.json();

        if (!uploadData.url) {
          alert("Image upload failed");
          setLoading(false);
          return;
        }

        imageUrl = uploadData.url;
      }

      const updateBlog = {
        title: formData.get("title"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        tags: formData
          .get("tags")
          .split(",")
          .map((tag) => tag.trim()),
        image: imageUrl,
      };

      await fetch(`/api/blog/get/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBlog),
      });

      alert("Blog updated successfully!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.log(error);
      alert("Failed to update blog!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-10 pt-20">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

      <form ref={form} onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={blog.title || ""}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          placeholder="Title"
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Excerpt */}
        <textarea
          name="excerpt"
          value={blog.excerpt || ""}
          onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
          placeholder="Excerpt"
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Content */}
        <textarea
          name="content"
          value={blog.content || ""}
          onChange={(e) => setBlog({ ...blog, content: e.target.value })}
          rows={8}
          placeholder="Content"
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Current Image */}
        {blog.image && (
          <div>
            <p className="mb-2 font-medium">Current Image</p>
            <img src={blog.image} alt="Blog" className="w-64 rounded mb-3" />
          </div>
        )}

        {/* Upload New Image */}
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full border px-4 py-2 rounded"
        />

        {/* Tags */}
        <input
          type="text"
          name="tags"
          value={blog.tags?.join(", ") || ""}
          onChange={(e) =>
            setBlog({
              ...blog,
              tags: e.target.value.split(",").map((t) => t.trim()),
            })
          }
          placeholder="react, nextjs, mongodb"
          className="w-full border px-4 py-2 rounded"
        />

        {/* Submit */}
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditPage;

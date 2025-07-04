"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AddBlogPage() {
  const form = useRef();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  // Authorization check (super simple – email based)
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail === process.env.NEXT_PUBLIC_USER_EMAIL) {
      setIsAuthorized(true);
    } else {
      router.push("/"); // redirect if not authorized
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(form.current);
    const imageFile = formData.get("image");

    // Upload image to Cloudinary
    const uploadForm = new FormData();
    uploadForm.append("file", imageFile);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: uploadForm,
    });

    const uploadData = await uploadRes.json();
    const imageUrl = uploadData.url;

    if (!imageUrl) {
      alert("Image upload failed");
      setLoading(false);
      return;
    }

    // Prepare blog data
    const blogData = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      tags: formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim()),
      image: imageUrl,
    };

    // Save blog to DB
    await fetch("/api/blog/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
    });

    setLoading(false);
    alert("Blog created!");
    router.push("/");
  };

  if (!isAuthorized) return null;

  return (
    <main className="max-w-3xl mx-auto px-6 py-28">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>
      <form ref={form} onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="excerpt"
          placeholder="Short excerpt"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="content"
          placeholder="Blog content..."
          rows={6}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="file"
          name="image"
          placeholder="Image URL"
          accept="image/*"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="tags"
          placeholder="Comma-separated tags (e.g. personal, react)"
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </main>
  );
}

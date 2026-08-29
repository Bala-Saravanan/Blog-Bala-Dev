"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiSave, FiCheckCircle, FiAlertCircle, FiExternalLink } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function EditAboutPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // Admin auth check
  useEffect(() => {
    const access = localStorage.getItem("admin");
    if (access !== "granted") {
      alert("Not authenticated");
      router.push("/");
    }
  }, [router]);

  // Fetch current about data
  useEffect(() => {
    async function fetchAboutData() {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        if (data?.about) {
          setFormData({
            title: data.about.title || "About Me",
            name: data.about.name || "Bala Saravanan",
            bio: data.about.bio || "",
            linkedinUrl: data.about.linkedinUrl || "",
            githubUrl: data.about.githubUrl || "",
          });
        }
      } catch (err) {
        console.error("Failed to load about data:", err);
        setStatusMsg({
          type: "error",
          text: "Failed to load current About section content.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMsg({
          type: "success",
          text: "About section updated successfully!",
        });
        setTimeout(() => {
          setStatusMsg({ type: "", text: "" });
        }, 4000);
      } else {
        setStatusMsg({
          type: "error",
          text: data.message || "Failed to update About section.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        type: "error",
        text: "An error occurred while updating the About section.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[85vh]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Back to Dashboard"
            >
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Edit About Section
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-11">
            Update your profile introduction, biography story, and social profile links.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto pl-11 sm:pl-0">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline px-3 py-2"
          >
            <FiExternalLink size={14} />
            View Live Page
          </Link>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMsg.text && (
        <div
          className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            statusMsg.type === "success"
              ? "bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {statusMsg.type === "success" ? (
            <FiCheckCircle size={18} className="shrink-0" />
          ) : (
            <FiAlertCircle size={18} className="shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Edit Form */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 dark:text-gray-400">
          <div className="inline-block w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-medium">Loading About section content...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-800/80 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              General Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Page Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Page Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. About Me"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Bala Saravanan"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Biography / Content <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Separate paragraphs with an empty line (double Enter) to format clean paragraphs on the public page.
              </p>
              <textarea
                id="bio"
                name="bio"
                rows={9}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write your story, background, and what you do..."
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white font-sans"
              />
            </div>
          </div>

          {/* Social Links Card */}
          <div className="bg-white dark:bg-gray-800/80 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              Social Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* LinkedIn URL */}
              <div>
                <label
                  htmlFor="linkedinUrl"
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  <FaLinkedin className="text-blue-600" size={16} />
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label
                  htmlFor="githubUrl"
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  <FaGithub className="text-gray-800 dark:text-gray-200" size={16} />
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit & Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Link
              href="/admin/dashboard"
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl text-sm transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-purple-500/20 transition-all text-sm disabled:opacity-50 cursor-pointer"
            >
              <FiSave size={16} />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

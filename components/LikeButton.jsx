"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function LikeButton({ blogId, initialLikes = 0, size = "sm" }) {
  const [likes, setLikes] = useState(
    typeof initialLikes === "number" ? initialLikes : 0
  );
  const [isLiked, setIsLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (blogId) {
      const likedInStorage =
        localStorage.getItem(`liked_${blogId}`) === "true";
      setIsLiked(likedInStorage);
    }
  }, [blogId]);

  useEffect(() => {
    if (typeof initialLikes === "number" && !isNaN(initialLikes)) {
      setLikes(initialLikes);
    }
  }, [initialLikes]);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!blogId) {
      console.warn("LikeButton: blogId is missing");
      return;
    }

    const newLikedState = !isLiked;
    const action = newLikedState ? "like" : "unlike";
    const delta = newLikedState ? 1 : -1;

    // Optimistic UI update
    setIsLiked(newLikedState);
    setLikes((prev) => Math.max(0, prev + delta));
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);

    if (newLikedState) {
      localStorage.setItem(`liked_${blogId}`, "true");
    } else {
      localStorage.removeItem(`liked_${blogId}`);
    }

    try {
      const res = await fetch(`/api/blog/${blogId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (res.ok && typeof data?.likes === "number") {
        setLikes(data.likes);
      } else {
        console.error("Like API returned error:", data);
        // Rollback on API error
        setIsLiked(!newLikedState);
        setLikes((prev) => Math.max(0, prev - delta));
        if (newLikedState) {
          localStorage.removeItem(`liked_${blogId}`);
        } else {
          localStorage.setItem(`liked_${blogId}`, "true");
        }
      }
    } catch (err) {
      console.error("Failed to sync like with server:", err);
      // Rollback on network error
      setIsLiked(!newLikedState);
      setLikes((prev) => Math.max(0, prev - delta));
      if (newLikedState) {
        localStorage.removeItem(`liked_${blogId}`);
      } else {
        localStorage.setItem(`liked_${blogId}`, "true");
      }
    }
  };

  const isLarge = size === "lg";

  return (
    <button
      type="button"
      onClick={handleLikeToggle}
      title={isLiked ? "Unlike post" : "Like post"}
      aria-label="Like post"
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer select-none ${
        isLarge ? "px-4 py-2 text-sm shadow-xs" : "px-2.5 py-1 text-xs"
      } ${
        isLiked
          ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-800 shadow-xs"
          : "bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 dark:hover:text-red-400"
      } ${animating ? "scale-110" : "scale-100"}`}
    >
      {isLiked ? (
        <FaHeart size={isLarge ? 18 : 14} className="text-red-500 animate-pulse" />
      ) : (
        <FaRegHeart size={isLarge ? 18 : 14} />
      )}
      <span>
        {likes} {isLarge ? (likes === 1 ? "Like" : "Likes") : ""}
      </span>
    </button>
  );
}


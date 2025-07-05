"use client";

export default function Error({ error, reset }) {
  console.error("Error loading blogs:", error);

  return (
    <div className="pt-28 text-center text-red-500">
      <p>Something went wrong while loading blogs.</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

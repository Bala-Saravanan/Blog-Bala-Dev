"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

const AdminLogin = () => {
  const router = useRouter();
  const form = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(form.current);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const res = await fetch("/api/admin/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.message === "Success") {
      router.push("/blog/add");
    } else {
      router.push("/");
    }
  };
  return (
    <div className="pt-28 sm:w-xl w-xs mx-auto">
      <form
        ref={form}
        onSubmit={handleSubmit}
        className="p-10 rounded-lg shadow-lg ring-1 ring-gray-200 dark:ring-gray-700"
      >
        <h1 className="text-center font-semibold text-lg my-2">Admin Login</h1>
        <div className="mb-2 flex flex-col gap-2">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full p-1 border rounded focus:outline-purple-600"
            required
          />
        </div>
        <div className="mb-2 flex flex-col gap-2">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full p-1 border rounded focus:outline-purple-600"
            required
          />
        </div>
        <div className="w-full mt-4 mb-2">
          <button
            type="submit"
            className="px-7 py-2 rounded text-white bg-purple-600 cursor-pointer"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
export default AdminLogin;

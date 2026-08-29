"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import NavLink from "./NavLink";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminAuth = useCallback(() => {
    if (typeof window !== "undefined") {
      const access = localStorage.getItem("admin") === "granted";
      setIsAdmin(access);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    checkAdminAuth();

    // Listen for custom auth events and cross-tab storage changes
    const handleAuthChange = () => checkAdminAuth();
    window.addEventListener("adminAuthChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    // Theme initialization
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(isDark);

    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");

    return () => {
      window.removeEventListener("adminAuthChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [checkAdminAuth]);

  // Sync auth state on route transitions
  useEffect(() => {
    checkAdminAuth();
  }, [pathname, checkAdminAuth]);

  // Update theme when darkMode changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode, mounted]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.dispatchEvent(new Event("adminAuthChange"));
    setIsAdmin(false);
    setOpenMenu(false);

    // If currently on an admin or blog creation route, redirect to home
    if (pathname.startsWith("/admin") || pathname === "/blog/add") {
      router.push("/");
    }
  };

  const navItems = [
    { link: "Home", href: "/" },
    { link: "About", href: "/about" },
    { link: "Contact Me", href: "/contact" },
    ...(isAdmin
      ? [{ link: "Dashboard", href: "/admin/dashboard", isSpecial: true }]
      : []),
  ];

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="max-w-screen-lg mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo & Nav Items */}
        <div className="flex items-center">
          <div className="text-lg font-semibold tracking-wide border-0 sm:border-r-2 pr-10">
            <Link href="/">BLOG</Link>
          </div>
          <ul className="hidden sm:flex gap-6 font-medium pl-10 items-center">
            {navItems.map(({ link, href, isSpecial }, index) => (
              <li key={index}>
                {isSpecial ? (
                  <NavLink
                    href={href}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
                  >
                    <span>{link}</span>
                  </NavLink>
                ) : (
                  <NavLink href={href} className="hover:text-purple-600">
                    {link}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Icons & Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Admin Logout Button (Desktop) */}
          {isAdmin && (
            <button
              onClick={handleLogout}
              title="Admin Logout"
              aria-label="Logout"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors cursor-pointer ring-1 ring-red-200 dark:ring-red-900/50"
            >
              <FiLogOut size={13} />
              <span>Logout</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="focus:outline-none cursor-pointer hover:text-purple-600"
          >
            {darkMode ? (
              <MdOutlineLightMode size={24} />
            ) : (
              <MdOutlineDarkMode size={24} />
            )}
          </button>

          {/* Social Icons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/bala-saravanan-j/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin
                size={24}
                className="cursor-pointer hover:text-purple-600"
              />
            </a>
            <a
              href="https://github.com/Bala-Saravanan"
              target="_blank"
              rel="noreferrer"
            >
              <FaSquareGithub
                size={24}
                className="cursor-pointer hover:text-purple-600"
              />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="block sm:hidden relative">
            <IoIosMenu
              size={28}
              onClick={() => setOpenMenu(true)}
              className="cursor-pointer"
            />
          </div>

          {/* Mobile Slide Menu */}
          <div
            className={`fixed top-0 right-0 h-screen w-64 bg-gray-100 dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ${openMenu ? "translate-x-0" : "translate-x-full"
              } sm:hidden`}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold">Menu</h2>
              <IoMdClose
                size={24}
                onClick={() => setOpenMenu(false)}
                className="cursor-pointer"
              />
            </div>
            <ul className="flex flex-col gap-5 p-6 text-base font-medium">
              {navItems.map(({ link, href, isSpecial }, index) => (
                <li key={index}>
                  <Link
                    href={href}
                    onClick={() => setOpenMenu(false)}
                    className={
                      isSpecial
                        ? "flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400"
                        : "hover:text-purple-600"
                    }
                  >
                    {link}
                  </Link>
                </li>
              ))}

              {/* Mobile Logout Button */}
              {isAdmin && (
                <li className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left font-semibold text-red-600 dark:text-red-400 hover:text-red-700 py-1.5 cursor-pointer"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </li>
              )}

              <li className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="https://www.linkedin.com/in/bala-saravanan-j/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://github.com/Bala-Saravanan"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaSquareGithub size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;


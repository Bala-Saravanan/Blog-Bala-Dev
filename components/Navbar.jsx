"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import NavLink from "./NavLink";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const navItems = [
    { link: "Home", href: "/" },
    { link: "About", href: "/about" },
    { link: "Contact Me", href: "/contact" },
  ];
  useEffect(() => {
    setMounted(true);

    // Only run on client
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(isDark);

    // Apply the theme class immediately after deciding
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, []);

  // Optional: whenever darkMode changes, update root again
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode, mounted]);

  if (!mounted) return null;
  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="max-w-screen-lg mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo & Nav Items */}
        <div className="flex items-center">
          <div className="text-lg font-semibold tracking-wide border-0 sm:border-r-2 pr-10">
            <Link href="/">BLOG</Link>
          </div>
          <ul className="hidden sm:flex gap-6 font-medium pl-10">
            {navItems.map(({ link, href }, index) => (
              <li key={index}>
                <NavLink href={href} className="hover:text-purple-600">
                  {link}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Icons & Menu */}
        <div className="flex items-center gap-4 sm:gap-6">
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
            className={`fixed top-0 right-0 h-screen w-64 bg-gray-100 dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ${
              openMenu ? "translate-x-0" : "translate-x-full"
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
            <ul className="flex flex-col gap-6 p-6 text-base font-medium">
              {navItems.map(({ link, href }, index) => (
                <li key={index}>
                  <Link href={href} onClick={() => setOpenMenu(false)}>
                    {link}
                  </Link>
                </li>
              ))}
              <li className="flex gap-4 pt-4">
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

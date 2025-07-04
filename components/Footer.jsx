"use client";

import Link from "next/link";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mx-5 mt-16 border-t border-gray-800 dark:border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Bala's Blog
          </h2>
          <p className="mt-2 text-sm">
            A personal blog sharing my developer journey, projects, and
            insights.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <div className="flex gap-4 text-xl">
            <a
              href="https://www.linkedin.com/in/bala-saravanan-j/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/Bala-Saravanan"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600"
            >
              <FaGithub />
            </a>
            <a
              href="mailto:jbalasaravanan174@gmail.com"
              className="hover:text-purple-600"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} Bala Saravanan. All rights reserved.
      </div>
    </footer>
  );
}

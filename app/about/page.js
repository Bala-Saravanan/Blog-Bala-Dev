import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const DEFAULT_ABOUT = {
  title: "About Me",
  name: "Bala Saravanan",
  bio: `Hi! I'm Bala Saravanan, a passionate student developer who loves building web applications and sharing my journey through code. I’m currently focused on mastering frontend technologies like React, Tailwind CSS, and exploring backend with Node.js and MongoDB.

This blog is my personal space where I document what I learn, the projects I build, and the mistakes I grow from. Whether it's a new framework, an exciting side project, or just some dev thoughts — you'll find it here.

Outside of coding, I enjoy reading, learning about tech trends, and helping others get started in development.`,
  linkedinUrl: "https://www.linkedin.com/in/bala-saravanan-j/",
  githubUrl: "https://github.com/Bala-Saravanan",
};

async function getAboutData() {
  try {
    const apiUrl = process.env.NEXT_API_URL || "";
    const res = await fetch(`${apiUrl}/api/about`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      return DEFAULT_ABOUT;
    }

    const data = await res.json();
    return data?.about || DEFAULT_ABOUT;
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return DEFAULT_ABOUT;
  }
}

export default async function AboutPage() {
  const about = await getAboutData();

  // Split bio by double or single line breaks into clean paragraphs
  const paragraphs = about.bio
    ? about.bio.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];

  return (
    <main className="max-w-3xl mx-auto px-6 py-28">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        {about.title || "About Me"}
      </h1>

      <div className="space-y-4 mb-8">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, index) => (
            <p
              key={index}
              className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
            >
              {p}
            </p>
          ))
        ) : (
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {about.bio}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        {about.linkedinUrl && (
          <Link
            href={about.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-white bg-purple-600 hover:bg-purple-700 rounded-xl font-medium text-center shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <FaLinkedin size={18} />
            LinkedIn
          </Link>
        )}

        {about.githubUrl && (
          <Link
            href={about.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl font-medium text-center transition-all cursor-pointer shadow-xs"
          >
            <FaGithub size={18} />
            GitHub
          </Link>
        )}

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl font-medium text-center transition-all cursor-pointer"
        >
          Contact Me
        </Link>
      </div>
    </main>
  );
}


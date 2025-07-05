export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-28">
      <h1 className="text-4xl font-bold mb-6">About Me</h1>

      <p className="text-lg mb-4 leading-relaxed">
        Hi! I&apos;m
        <span className="font-semibold">Bala Saravanan</span>, a passionate
        student developer who loves building web applications and sharing my
        journey through code. I’m currently focused on mastering frontend
        technologies like React, Tailwind CSS, and exploring backend with
        Node.js and MongoDB.
      </p>

      <p className="text-lg mb-4 leading-relaxed">
        This blog is my personal space where I document what I learn, the
        projects I build, and the mistakes I grow from. Whether it&apos;s a new
        framework, an exciting side project, or just some dev thoughts —
        you&apos;ll find it here.
      </p>

      <p className="text-lg mb-8 leading-relaxed">
        Outside of coding, I enjoy reading, learning about tech trends, and
        helping others get started in development.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="https://www.linkedin.com/in/bala-saravanan-j/"
          className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg text-center transition"
        >
          LinkedIn
        </a>
        <a
          href="/contact"
          className="px-6 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg text-center transition"
        >
          Contact Me
        </a>
      </div>
    </main>
  );
}

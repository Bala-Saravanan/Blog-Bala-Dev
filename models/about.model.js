import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "About Me",
    },
    name: {
      type: String,
      default: "Bala Saravanan",
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      default: `Hi! I'm Bala Saravanan, a passionate student developer who loves building web applications and sharing my journey through code. I’m currently focused on mastering frontend technologies like React, Tailwind CSS, and exploring backend with Node.js and MongoDB.

This blog is my personal space where I document what I learn, the projects I build, and the mistakes I grow from. Whether it's a new framework, an exciting side project, or just some dev thoughts — you'll find it here.

Outside of coding, I enjoy reading, learning about tech trends, and helping others get started in development.`,
    },
    linkedinUrl: {
      type: String,
      default: "https://www.linkedin.com/in/bala-saravanan-j/",
    },
    githubUrl: {
      type: String,
      default: "https://github.com/Bala-Saravanan",
    },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.models.About || mongoose.model("About", aboutSchema);

export default About;

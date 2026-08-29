import { connectDB } from "@/lib/mongodb";
import About from "@/models/about.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        title: "About Me",
        name: "Bala Saravanan",
        bio: `Hi! I'm Bala Saravanan, a passionate student developer who loves building web applications and sharing my journey through code. I’m currently focused on mastering frontend technologies like React, Tailwind CSS, and exploring backend with Node.js and MongoDB.

This blog is my personal space where I document what I learn, the projects I build, and the mistakes I grow from. Whether it's a new framework, an exciting side project, or just some dev thoughts — you'll find it here.

Outside of coding, I enjoy reading, learning about tech trends, and helping others get started in development.`,
        linkedinUrl: "https://www.linkedin.com/in/bala-saravanan-j/",
        githubUrl: "https://github.com/Bala-Saravanan",
      });
    }

    return NextResponse.json({ about }, { status: 200 });
  } catch (error) {
    console.error("Error fetching about section:", error);
    return NextResponse.json(
      { message: "Failed to fetch about data", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { title, name, bio, linkedinUrl, githubUrl } = body;

    const updateData = {
      ...(title && { title }),
      ...(name && { name }),
      ...(bio && { bio }),
      linkedinUrl: linkedinUrl || "",
      githubUrl: githubUrl || "",
    };

    const updatedAbout = await About.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(
      { success: true, about: updatedAbout },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating about section:", error);
    return NextResponse.json(
      { message: "Failed to update about data", error: error.message },
      { status: 500 }
    );
  }
}

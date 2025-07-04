import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minLength: 2,
    },
    slug: String,
    excerpt: { type: String, required: [true, "excerpt is required"] },
    content: { type: String, required: [true, "content is required"] },
    tags: [{ type: String, required: [true, "tags are required"] }],
    image: { type: String, required: [true, "image is required"] },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  if (typeof this.title === "string" && this.title && !this.slug) {
    console.log(this);
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;

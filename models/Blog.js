import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;

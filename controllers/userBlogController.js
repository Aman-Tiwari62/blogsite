import cloudinary from "../config/cloudinary.js";
import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
    try {
      let imageUrl = null;
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "blog_pics",
        });
        imageUrl = result.secure_url;
      }
  
      const blog = new Blog({
        content: req.body.content,
        photo: imageUrl,
        author: req.user.id,
      });
  
      await blog.save();
      res.redirect("/user/home");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating blog");
    }
};
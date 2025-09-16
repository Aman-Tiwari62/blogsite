import express from 'express';
import multer from "multer";
import { createBlog } from '../controllers/userBlogController.js';
import Blog from '../models/Blog.js';

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post('/create', upload.single("photo"), createBlog);

router.get('/loadBlogs', async (req, res) => {
    try {
        const blogs = await Blog.find()
          .populate("author", "firstname lastname email profilePic") // show author info
          .sort({ createdAt: -1 }); // newest first
        console.log(blogs);
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
    }
});

router.get('/loadMyBlogs', async (req,res) => {
    try {
        const userId = req.user.id; // from decoded JWT
        const blogs = await Blog.find({ author: userId }).populate("author");
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user blogs" });
    }
})

export default router;
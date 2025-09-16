import express from "express";
import multer from "multer";
import User from "../models/User.js";
import { uploadProfile, logout } from "../controllers/userController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" }); // temp storage

router.get('/home', async (req, res)=>{
    const user = await User.findById(req.user.id); 
    res.render("usersPage/home", { user });
})
router.get('/uploadProfilePage', async (req, res) => {
    const userId = req.user.id; // or however you store logged-in user
    const user = await User.findById(userId);
    res.render('usersPage/uploadProfilePage',{user});
})

router.post('/uploadProfile', upload.single("profilePic"), uploadProfile);

router.get('/logout', logout)

export default router;

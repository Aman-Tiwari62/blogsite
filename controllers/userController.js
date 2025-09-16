import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const uploadProfile = async (req, res) => {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pics",
    });

    // Get userId (assuming req.user is set by auth middleware)
    const userId = req.user.id;

    // Save Cloudinary URL in DB
    await User.findByIdAndUpdate(userId, { profilePic: result.secure_url });

    res.json({ success: true, url: result.secure_url });
    res.status
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // return res.status(200).json({ success: true, message: "Logged out successfully" });
  res.redirect('/');
};


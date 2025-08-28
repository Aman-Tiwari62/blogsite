// controllers/userController.js
import User from "../models/User.js";
import EnrolledUser from "../models/EnrolledUser.js";

import bcrypt from "bcrypt";



// verify
export const verify = async (req,res) => {
  
  
}
// Register user
export const registerUser = async (req, res) => {
  try {
    

    

    const newUser = new User({ firstname, lastname, email, password });
    await newUser.save();
    // console.log("working fine");

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (err) {
    console.log('error');
    res.status(500).json({ error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import validator from 'validator';
import dns from "dns";
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import {generateOTP} from "../utils/generateOTP.js"

function checkDomain(email) {
  const domain = email.split("@")[1];
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export const register = async (req,res) => {
  
    try{
      const { firstname, lastname, email, password } = req.body;

      // step 1 of verification: format check
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format !!" });
      }

      // step 2 of validation: domain check
      const domainValid = await checkDomain(email);
      if (!domainValid) {
        return res.status(400).json({ error: "Invalid email domain !!" });
      }

      // checking if the email is already registered:
      const existingUser = await User.findOne({email});
      if (existingUser ) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      // adding to database with encrypted password
      const saltRounds = 10; // cost factor (higher = more secure but slower)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generating the email
      const otpSentAt = Date.now();
      // Create new user
      const newUser = new User({
        firstname,
        lastname,
        email,
        hashedPassword,
        otp,
        otpSentAt,
      });
      await newUser.save();
      await sendEmail(email, otp);
      res.status(201).json({ message: "User enrolled. OTP sent", email, otpSentAt });
  
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

export const resendotp = async (req, res) => {
    try {
        console.log("Raw body:", req.body);
        const { email } = req.body;

        if (!email) {
          return res.status(400).json({ error: "Email is required" });
        }

        // find user
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        if(user.verified){
          return res.status(401).json({error:"email already verified"});
        }
        const lastOTPSentAt = user.otpSentAt;
        const now = Date.now();
        if((now - lastOTPSentAt) > 60*1000){
          // generate a new OTP (6 digit)
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpSentAt = Date.now(); // when OTP is generated
          user.otp = otp;
          user.otpSentAt = otpSentAt;
          await user.save();
          // send OTP via email
          await sendEmail(email, otp);
          res.status(201).json({otpSentAt});
        } else{
          res.status(400).json({error:"wait for 60 seconds before resending"});
        }
    } catch (err) {
        console.error("Error in resendotp:", err);
        res.status(400).json({ error: "Server error" });
    }
};

export const verifyEmail = async (req, res) => {
  const {otp, email} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if(user.verified){
    return res.status(401).json({error:"email already verified"});
  }
  if(Date.now()-user.otpSentAt > 5*60*1000){
    return res.status(401).json({error:"otp expired, click resend to get new otp!"});
  }
  else if(user.otp !== otp){
    return res.status(402).json({error:"invalid otp ! eneter correct otp"});
  }
  user.verified = true;
  user.otp = null; // optional: clear otp
  user.otpSentAt = null; // optional: clear sent time
  await user.save();
  const token = jwt.sign(
    { id: user._id},
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // ✅ Send token in httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  

  return res.status(201).json({message:"email verified!"});

}

export const login = async (req, res) => {
  const {email, password} = req.body;
  // status code: - 
  // 400 (error in email, either invalid format, invalid domain or email not registered)
  // 401 (password don't match)
  // 403 (user not verified);
  // 500 (server error)

  try{
    // step 1 of verification: format check
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format !!" });
    }

    // step 2 of validation: domain check
    const domainValid = await checkDomain(email);
    if (!domainValid) {
      return res.status(400).json({ error: "Invalid email domain !!" });
    }

    // checking if the email is already registered:
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ error: "email not registered! sign up to create account." });
    }
    console.log("1");
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log("2");
    if(!user.verified){
      const { otp, otpSentAt } = await generateOTP(user);
      await sendEmail(email, otp);
      return res.status(403).json({ message: "User enrolled. OTP sent", email, otpSentAt });
    }
    console.log("3");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    console.log('4');

    return res.status(200).json({success:"login successfull"});
  } catch(err){
    console.log(err);
    res.status(500).json({error:"server error"});
  }
}

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
}
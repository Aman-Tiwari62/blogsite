import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true }, 
    otp: {type: String},
    otpSentAt: {type: Date},
    verified: { type: Boolean, default: false },
    profilePic: {type: String, default: null},
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

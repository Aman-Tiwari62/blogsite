// utils/generateOTP.js
export const generateOTP = async (user) => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Set expiry time (5 minutes from now)
    const otpSentAt = Date.now();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  
    // Save in user model
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  
    return { otp, otpSentAt };
  };
  
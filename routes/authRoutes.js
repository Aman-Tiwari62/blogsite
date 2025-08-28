import express from "express";
import { enrollUser, login, resendotp, verifyOTP } from "../controllers/authController.js";

const router = express.Router();

router.get("/loginform", (req,res) => {
    res.render('auth/formLogin');
}); 

router.get("/registerform", (req,res) => {
    res.render('auth/formRegister');
}); 

router.post("/enroll",enrollUser);

router.get("/verifyPage",(req,res) => {
    const { email,otpSentAt } = req.query;
    res.render("auth/formVerify", { email });
})

router.post("/verifyotp", verifyOTP);

router.post("/resendotp", resendotp);

router.post("/login", login)

export default router;
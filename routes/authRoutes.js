import express from "express";
import { register, login, resendotp, verifyEmail, logout } from "../controllers/authController.js";

const router = express.Router();

router.get("/loginform", (req,res) => {
    res.render('auth/formLogin');
}); 

router.get("/registerform", (req,res) => {
    res.render('auth/formRegister');
}); 

router.post("/register",register);

router.get("/verifyPage",(req,res) => {
    const { email,otpSentAt } = req.query;
    res.render("auth/verifyEmail", { email });
})

router.post("/verifyEmail", verifyEmail);

router.post("/resendotp", resendotp);

router.post("/login", login);

router.get("/logout", logout)

export default router;
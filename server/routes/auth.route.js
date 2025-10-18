import express from "express";
import {
	login,
	AdminLoginPage,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	changePassword,
	adminForgotPassword,
	adminResetPasswordWithOTP,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/AdminLoginPage", AdminLoginPage);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", verifyToken, changePassword);

// Admin OTP-based password reset routes
router.post("/admin/forgot-password", adminForgotPassword);
router.post("/admin/reset-password-otp", adminResetPasswordWithOTP);

export default router;

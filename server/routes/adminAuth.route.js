import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { User } from "../models/user.model.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const bcryptjs = (await import("bcryptjs")).default;
		const { generateTokenAndSetCookie } = await import("../utils/generateTokenAndSetCookie.js");

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		// Check if user is admin
		if (user.role !== 'admin') {
			return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
		}

		// Check if email is verified
		if (!user.isVerified) {
			return res.status(403).json({ success: false, message: "Please verify your email first" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Admin logged in successfully",
			admin: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in admin login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
});

// Admin logout
router.post("/logout", async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Admin logged out successfully" });
});

// Check admin auth
router.get("/check-auth", verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Check if user is admin
		if (user.role !== 'admin') {
			return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
		}

		res.status(200).json({ success: true, admin: user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
});

export default router;

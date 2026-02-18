import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
	sendPasswordResetOTP,
	sendPasswordResetOTPEmail,
} from "../email/emails.js";
import { User } from "../models/user.model.js";

import { AllowedEmail } from "../models/allowedEmail.model.js";

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		// Check if email is allowed
		const isAllowed = await AllowedEmail.findOne({ email });
		if (!isAllowed) {
			return res.status(403).json({
				success: false,
				message: "You do not have permission to signup. Please contact Admin."
			});
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
			role: "teacher", // Only allowed emails can signup, assuming they are teachers/users
			department: isAllowed.department || null // Inherit department from invitation
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const resendVerificationEmail = async (req, res) => {
	try {
		const userId = req.userId; // From verifyToken middleware
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (user.isVerified) {
			return res.status(400).json({ success: false, message: "Email already verified" });
		}

		// Generate new verification token
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
		user.verificationToken = verificationToken;
		user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
		await user.save();

		// Send verification email
		await sendVerificationEmail(user.email, verificationToken);

		res.status(200).json({
			success: true,
			message: "Verification email sent successfully"
		});
	} catch (error) {
		console.log("error in resendVerificationEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
export const AdminLoginPage = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if the admin user exists in the database
		const user = await User.findOne({ email, role: "admin" }); // Assuming "role" field specifies admin
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid admin credentials" });
		}

		// Validate password
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid admin credentials" });
		}

		// Generate token and set it as a cookie
		generateTokenAndSetCookie(res, user._id);

		// Save last login date
		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Admin logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in AdminLoginPage ", error);
		res.status(400).json({ success: false, message: error.message });
	}
}
export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate 6-digit OTP
		const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
		const resetPasswordOTPExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

		user.resetPasswordOTP = resetOTP;
		user.resetPasswordOTPExpiresAt = resetPasswordOTPExpiresAt;

		await user.save();

		// send email with OTP
		await sendPasswordResetOTPEmail(user.email, resetOTP);

		res.status(200).json({ success: true, message: "Password reset OTP sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { otp, password } = req.body;

		const user = await User.findOne({
			resetPasswordOTP: otp,
			resetPasswordOTPExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordOTP = undefined;
		user.resetPasswordOTPExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const changePassword = async (req, res) => {
	try {
		console.log('Change password request received');
		const { currentPassword, newPassword } = req.body;
		const userId = req.userId;

		console.log('User ID from token:', userId);

		// Validate inputs
		if (!currentPassword || !newPassword) {
			console.log('Missing required fields');
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		// Find user
		const user = await User.findById(userId);
		if (!user) {
			console.log('User not found with ID:', userId);
			return res.status(404).json({ success: false, message: "User not found" });
		}

		console.log('User found:', user.email);

		// Verify current password
		const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
		if (!isPasswordValid) {
			console.log('Current password is incorrect');
			return res.status(400).json({ success: false, message: "Current password is incorrect" });
		}

		console.log('Current password verified successfully');

		// Hash new password
		const hashedPassword = await bcryptjs.hash(newPassword, 10);

		// Update password
		user.password = hashedPassword;
		await user.save();

		console.log('Password updated successfully');

		res.status(200).json({ success: true, message: "Password changed successfully" });
	} catch (error) {
		console.error("Error in changePassword:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Admin password reset request with OTP (only for backupid849@gmail.com)
export const adminForgotPassword = async (req, res) => {
	const { email } = req.body;
	const ADMIN_BACKUP_EMAIL = "backupid849@gmail.com";

	try {
		// Check if email matches the admin backup email
		if (email !== ADMIN_BACKUP_EMAIL) {
			return res.status(403).json({
				success: false,
				message: "Admin password reset is only available for authorized backup email (backupid849@gmail.com)"
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Admin user not found. Please run the setup script: node server/scripts/setupBackupAdmin.js"
			});
		}

		// Ensure user has admin role
		if (user.role !== 'admin') {
			return res.status(403).json({
				success: false,
				message: "This email is not registered as an admin. Please contact support."
			});
		}

		// Generate 6-digit OTP
		const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
		const resetOTPExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

		user.resetPasswordOTP = resetOTP;
		user.resetPasswordOTPExpiresAt = resetOTPExpiresAt;

		await user.save();

		// Send OTP email
		await sendPasswordResetOTP(user.email, resetOTP);

		console.log(`✅ OTP sent to ${user.email}: ${resetOTP}`); // For testing

		res.status(200).json({
			success: true,
			message: "Password reset OTP sent to your email. Valid for 15 minutes."
		});
	} catch (error) {
		console.log("Error in adminForgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Verify OTP and reset admin password
export const adminResetPasswordWithOTP = async (req, res) => {
	const { email, otp, newPassword } = req.body;
	const ADMIN_BACKUP_EMAIL = "backupid849@gmail.com";

	try {
		// Check if email matches the admin backup email
		if (email !== ADMIN_BACKUP_EMAIL) {
			return res.status(403).json({
				success: false,
				message: "Admin password reset is only available for authorized backup email"
			});
		}

		// Validate inputs
		if (!email || !otp || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Email, OTP, and new password are required"
			});
		}

		const user = await User.findOne({
			email,
			role: "admin",
			resetPasswordOTP: otp,
			resetPasswordOTPExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired OTP"
			});
		}

		// Update password
		const hashedPassword = await bcryptjs.hash(newPassword, 10);

		user.password = hashedPassword;
		user.resetPasswordOTP = undefined;
		user.resetPasswordOTPExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({
			success: true,
			message: "Admin password reset successful"
		});
	} catch (error) {
		console.log("Error in adminResetPasswordWithOTP ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

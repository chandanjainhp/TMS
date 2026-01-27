import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		req.userId = decoded.userId;

		// Log for debugging
		if (req.user) {
			console.log(`[AUTH] User: ${req.user.name}, Role: ${req.user.role}, Path: ${req.path}`);
		} else {
			// Fetch user to log role (temporary debug)
			User.findById(decoded.userId).then(u => {
				if (u) console.log(`[AUTH DEBUG] User: ${u.name}, Role: ${u.role} accessing ${req.originalUrl}`);
			});
		}

		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

export const isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId);
		if (!user || user.role !== 'admin') {
			return res.status(403).json({ success: false, message: "Access denied - Admin only" });
		}
		next();
	} catch (error) {
		console.log("Error in isAdmin ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const ADMIN_ROLES = ['admin', 'hod', 'principal', 'superAdmin'];

// Verifies JWT and attaches req.userId + req.user to the request.
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

    req.userId = decoded.userId;

    const user = await User.findById(decoded.userId).select(
      "-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt"
    );
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized - user not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Requires verifyToken to run first. Allows all admin-type roles.
export const isAdmin = (req, res, next) => {
  if (!req.user || !ADMIN_ROLES.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied - Admin only" });
  }
  next();
};

// Requires verifyToken to run first. Allows only principal and superAdmin.
export const isPrincipal = (req, res, next) => {
  if (!req.user || !['principal', 'superAdmin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied - Principal office only" });
  }
  next();
};

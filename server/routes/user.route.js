import express from "express";
import { getAllUsers, getUserById, getUserStats } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Get all users (admin only)
router.get("/", getAllUsers);

// Get user stats (admin only)
router.get("/stats", getUserStats);

// Get user by ID
router.get("/:id", getUserById);

export default router;

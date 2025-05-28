import express from "express";
import { getAllUsers, getUserById, getUserStats } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get all users (requires authentication)
router.get("/", verifyToken, getAllUsers);

// Get user stats
router.get("/stats", verifyToken, getUserStats);

// Get user by ID
router.get("/:id", verifyToken, getUserById);

export default router;

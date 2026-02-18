import express from "express";
import { logUserActivity, getUserActivities, getActivityStats } from "../controllers/userActivity.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Log user activity (requires authentication)
router.post("/log", verifyToken, logUserActivity);

// Get user activities (requires authentication)
router.get("/", verifyToken, getUserActivities);

// Get activity statistics (requires authentication)
router.get("/stats", verifyToken, getActivityStats);

export default router;

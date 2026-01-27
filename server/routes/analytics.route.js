import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getClassPerformance, getStudentPerformance, getFilterOptions, checkStudentResult } from "../controllers/analytics.controller.js";

const router = express.Router();

// Admin routes (should ideally check for admin role too, but verifyToken is a start)
router.get("/filters", verifyToken, getFilterOptions);
router.get("/class-performance", verifyToken, getClassPerformance);

// Student/Public routes (authenticated)
router.get("/student-performance", verifyToken, getStudentPerformance);

// Public Result Check
router.post("/check-result", checkStudentResult);

export default router;

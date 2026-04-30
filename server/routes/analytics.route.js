import express from "express";
import { verifyToken, isAdmin } from "../middleware/verifyToken.js";
import {
  getClassPerformance,
  getStudentPerformance,
  getFilterOptions,
  checkStudentResult,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Admin-only analytics
router.get("/filters", verifyToken, isAdmin, getFilterOptions);
router.get("/class-performance", verifyToken, isAdmin, getClassPerformance);

// Teacher view (any authenticated user)
router.get("/student-performance", verifyToken, getStudentPerformance);

// Public result check (captcha-protected on frontend)
router.post("/check-result", checkStudentResult);

export default router;

import express from "express";
import { verifyToken, isAdmin } from "../middleware/verifyToken.js";
import { getMyClasses, createTeacher, getDepartmentTeachers } from "../controllers/teacher.controller.js";

const router = express.Router();

// Teacher-only: view own classes
router.get("/my-classes", verifyToken, getMyClasses);

// Admin-only: manage faculty
router.post("/create", verifyToken, isAdmin, createTeacher);
router.get("/list", verifyToken, isAdmin, getDepartmentTeachers);

export default router;

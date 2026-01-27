import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getMyClasses, createAnnouncement, getMyAnnouncements } from "../controllers/teacher.controller.js";

const router = express.Router();

// All routes require login
router.use(verifyToken);

router.get("/my-classes", getMyClasses);
router.post("/announcements", createAnnouncement);
router.get("/announcements", getMyAnnouncements);

export default router;

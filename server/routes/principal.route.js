import express from "express";
import multer from "multer";
import { verifyToken, isPrincipal } from "../middleware/verifyToken.js";
import {
  uploadMasterList,
  getSystemStats,
  getAdminUsers,
  createHOD,
  deleteAdminUser,
} from "../controllers/principal.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/stats", verifyToken, isPrincipal, getSystemStats);
router.post("/upload-master", verifyToken, isPrincipal, upload.single("file"), uploadMasterList);
router.get("/admins", verifyToken, isPrincipal, getAdminUsers);
router.post("/create-hod", verifyToken, isPrincipal, createHOD);
router.delete("/admins/:id", verifyToken, isPrincipal, deleteAdminUser);

export default router;

import express from "express";
import { addAllowedEmail, getAllowedEmails } from "../controllers/allowedEmail.controller.js";
import { verifyToken, isAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, isAdmin, addAllowedEmail);
router.get("/", verifyToken, isAdmin, getAllowedEmails);

export default router;

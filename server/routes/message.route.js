import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { sendMessage, getInbox, getSentBox, markAsRead, searchUsersForMessaging } from "../controllers/message.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/send", sendMessage);
router.get("/inbox", getInbox);
router.get("/sent", getSentBox);
router.put("/:messageId/read", markAsRead);
router.get("/users", searchUsersForMessaging);

// Upload attachment
import { messageUpload } from "../middleware/uploadMiddleware.js";
router.post("/upload", messageUpload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    // Return file details suitable for storing in attachments array
    res.status(200).json({
        success: true,
        data: {
            originalName: req.file.originalname,
            fileUrl: `/uploads/${req.file.filename}`,
            mimeType: req.file.mimetype,
            size: req.file.size
        }
    });
});

export default router;

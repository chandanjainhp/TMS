import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadMasterList, getSystemStats } from "../controllers/principal.controller.js";

const router = express.Router();

// Memory storage for multer (buffer processing)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to ensure Principal role
const isPrincipal = (req, res, next) => {
    // Check if user exists (already verified by verifyToken)
    // Accept 'principal' or 'superAdmin' roles
    if (req.user && (req.user.role === 'principal' || req.user.role === 'superAdmin')) {
        next();
    } else {
        // Temporary: Allow 'admin' (HOD) for testing purposes if Principal user not setup
        // REMOVE THIS IN PRODUCTION
        if (req.user && req.user.role === 'admin') {
            console.log("WARN: Allowing Admin access to Principal route");
            return next();
        }
        res.status(403).json({ success: false, message: "Access Denied: Principal Office Only" });
    }
};

router.get("/stats", verifyToken, isPrincipal, getSystemStats);
router.post("/upload-master", verifyToken, isPrincipal, upload.single("file"), uploadMasterList);

export default router;

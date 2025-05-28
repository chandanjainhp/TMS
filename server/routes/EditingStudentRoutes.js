import multer from "multer";
import authMiddleware from '../middleware/authMiddleware.js';
import {getAllStudents, updateStudents,importCsv,selectStudent,exportCsv,exportPdf} from '../controllers/EditingStudentController.js';
import { Router } from 'express';
const router = Router();


const upload = multer({ dest: "uploads/" });

// Define routes
router.post("/import/csv", upload.single("file"), importCsv);
router.get("/students", selectStudent);
router.get("/export/csv", exportCsv);
router.get("/export/pdf", exportPdf);
router.get('/editingstudents', authMiddleware, getAllStudents);
router.put('/editingstudents', authMiddleware, updateStudents);

export default router;


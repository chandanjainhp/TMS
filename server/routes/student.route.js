import express from "express";

import { selectStudent, exportCsv, exportPdf } from "../controllers/student.controller.js";

const router = express.Router();


router.get("/students", selectStudent);
router.get("/export/csv", exportCsv);
router.get("/export/pdf", exportPdf);

// Repository Routes
import { getClassRepository, finalizeSemester } from "../controllers/repository.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.get("/repository", verifyToken, getClassRepository);
router.post("/finalize", verifyToken, finalizeSemester);

export default router;

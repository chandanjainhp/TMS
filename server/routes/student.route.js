import express from "express";

import { selectStudent, exportCsv, exportPdf } from "../controllers/student.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getClassRepository, finalizeSemester } from "../controllers/repository.controller.js";

const router = express.Router();

router.get("/repository", verifyToken, getClassRepository);
router.post("/finalize", verifyToken, finalizeSemester);

export default router;

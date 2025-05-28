import express from "express";

import {  selectStudent, exportCsv, exportPdf } from "../controllers/student.controller.js";

const router = express.Router();


router.get("/students", selectStudent);
router.get("/export/csv", exportCsv);
router.get("/export/pdf", exportPdf);

export default router;

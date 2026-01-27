import express from 'express';
import { upload, validateFormData, handleUploadErrors } from '../middleware/uploadMiddleware.js';
import { uploadRecords, getRecords, deleteRecord, updateRecord, getUploadBatches } from '../controllers/from.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Route for uploading CSV files
router.post(
  '/',
  upload.fields([{ name: 'csvFile', maxCount: 1 }, { name: 'subjectFile', maxCount: 1 }]),
  validateFormData,
  handleUploadErrors,
  uploadRecords
);

// Route for getting upload batches (summary view)
router.get('/batches', verifyToken, getUploadBatches);

// Route for getting records with sorting and filtering (accessible to all authenticated users)
router.get('/records', verifyToken, getRecords);

// Route for updating a record by ID (admin/teacher)
router.put('/records/:id', verifyToken, updateRecord);

// Route for deleting a record by ID (admin only)
router.delete('/records/:id', verifyToken, deleteRecord);

export default router;

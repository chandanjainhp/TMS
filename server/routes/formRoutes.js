import express from 'express';
import { upload, validateFormData, handleUploadErrors } from '../middleware/uploadMiddleware.js';
import { uploadRecords, getRecords, deleteRecord } from '../controllers/from.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Route for uploading CSV files
router.post(
  '/',
  upload.single('csvFile'),
  validateFormData,
  handleUploadErrors,
  uploadRecords
);

// Route for getting records with sorting and filtering (accessible to all authenticated users)
router.get('/records', verifyToken, getRecords);

// Route for deleting a record by ID (admin only)
router.delete('/records/:id', verifyToken, deleteRecord);

export default router;

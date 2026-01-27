import express from 'express';
import { getSubjects, createSubject, deleteSubject } from '../controllers/subject.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Get subjects (with optional branch/semester filters)
router.get('/', verifyToken, getSubjects);

// Create a new subject
router.post('/', verifyToken, createSubject);

// Delete a subject
router.delete('/:id', verifyToken, deleteSubject);

export default router;

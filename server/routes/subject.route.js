import express from 'express';
import { getSubjects, createSubject, deleteSubject } from '../controllers/subject.controller.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// Any authenticated user can view subjects
router.get('/', verifyToken, getSubjects);

// Admin-only: create and delete
router.post('/', verifyToken, isAdmin, createSubject);
router.delete('/:id', verifyToken, isAdmin, deleteSubject);

export default router;

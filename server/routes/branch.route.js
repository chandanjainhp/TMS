import express from 'express';
import { getBranches, addBranch, deleteBranch, seedBranches } from '../controllers/branch.controller.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getBranches); // Can be public? Or protected. Let's make it protected.
router.post('/', verifyToken, isAdmin, addBranch);
router.delete('/:id', verifyToken, isAdmin, deleteBranch);
router.post('/seed', verifyToken, isAdmin, seedBranches); // Optional, for initial setup

export default router;

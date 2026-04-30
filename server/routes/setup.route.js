import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

const router = express.Router();

const ADMIN_ROLES = ['admin', 'hod', 'principal', 'superAdmin'];
const VALID_SETUP_ROLES = ['principal', 'hod', 'admin'];
const DEPARTMENTS = ['Physics', 'Mathematics', 'Electronics', 'Computer Science', 'Chemistry', 'Biology'];

// GET /check-setup -> returns { setupComplete: true/false }
router.get('/check-setup', async (req, res) => {
    try {
        const adminCount = await User.countDocuments({ role: { $in: ADMIN_ROLES } });
        res.json({ setupComplete: adminCount > 0 });
    } catch (error) {
        console.error('Check setup error:', error);
        res.status(500).json({ message: 'Server error retrieving setup status', error: error.message });
    }
});

// POST /setup-admin -> creates first admin if none exist
router.post('/setup-admin', async (req, res) => {
    try {
        const adminCount = await User.countDocuments({ role: { $in: ADMIN_ROLES } });

        if (adminCount > 0) {
            return res.status(403).json({ message: 'Setup already completed' });
        }

        const { email, password, name, role = 'principal', department } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        if (!VALID_SETUP_ROLES.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be principal, hod, or admin.' });
        }

        // HOD requires a department
        if (role === 'hod' && !department) {
            return res.status(400).json({ message: 'Department is required for HOD role' });
        }

        // Validate department if provided
        if (department && !DEPARTMENTS.includes(department) && department !== 'Global') {
            return res.status(400).json({ message: 'Invalid department' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new User({
            email,
            password: hashedPassword,
            name,
            role,
            department: role === 'principal' ? 'Global' : (department || null),
            isVerified: true,
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin account created successfully', role });
    } catch (error) {
        console.error('Setup admin error:', error);
        res.status(500).json({ message: 'Server error during setup', error: error.message });
    }
});

export default router;

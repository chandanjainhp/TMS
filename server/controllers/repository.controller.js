import { Student } from '../models/Student.model.js';
import { User } from '../models/user.model.js';

// Get Class Repository (Scoped for Teachers/Admins)
// Get Class Repository (Scoped for Teachers/Admins)
export const getClassRepository = async (req, res) => {
    try {
        const { branch, semester, section, year } = req.query;
        let department = req.query.department;

        // Security: Enforce Department Scope
        const user = await User.findById(req.userId);
        if (user && user.department && user.department !== 'Global') {
            department = user.department;
        }

        if (!department || !branch || !semester) {
            return res.status(400).json({ success: false, message: "Department, Branch, and Semester are required filters" });
        }

        const query = { department, branch, semester };
        if (section) query.section = section;
        if (year) query.year = year;

        const students = await Student.find(query).sort({ usn: 1 });

        res.status(200).json({
            success: true,
            data: students
        });

    } catch (error) {
        console.error("Error fetching repository:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Finalize Semester (Lock records)
export const finalizeSemester = async (req, res) => {
    try {
        const { department, branch, semester, section } = req.body;
        const userId = req.userId;

        if (!department || !branch || !semester) {
            return res.status(400).json({ success: false, message: "Department, Branch, and Semester are required" });
        }

        // Optional: Check if user is authorized (HOD or Super Admin)
        const user = await User.findById(userId);
        if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
            // Allow teachers to finalize for now, or restrict to Admin?
            // Plan said: "Only teachers or admins with permission can finalize."
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const query = { department, branch, semester };
        if (section) query.section = section;

        const result = await Student.updateMany(
            query,
            { $set: { lockStatus: 'Final' } }
        );

        res.status(200).json({
            success: true,
            message: `Semester finalized. ${result.modifiedCount} records locked.`,
        });

    } catch (error) {
        console.error("Error finalizing semester:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

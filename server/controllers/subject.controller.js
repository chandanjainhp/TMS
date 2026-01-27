import { Subject } from '../models/subject.model.js';

// Get all subjects (with optional filters)
export const getSubjects = async (req, res) => {
    try {
        const { branch, semester } = req.query;

        // Build filter - now supports optional filters
        const filter = {};
        if (branch) filter.branch = branch;
        if (semester) filter.semester = Number(semester);

        const subjects = await Subject.find(filter).sort({ branch: 1, semester: 1, name: 1 });

        res.status(200).json({
            success: true,
            data: subjects
        });
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ success: false, message: "Error fetching subjects" });
    }
};

// Create a new subject
export const createSubject = async (req, res) => {
    try {
        const { name, branch, semester, code, subSubjects } = req.body;

        if (!name || !branch || !semester) {
            return res.status(400).json({ success: false, message: "Name, branch, and semester are required" });
        }

        // Check if subject already exists
        const existing = await Subject.findOne({ name, branch, semester: Number(semester) });
        if (existing) {
            return res.status(400).json({ success: false, message: "Subject already exists for this branch and semester" });
        }

        const newSubject = new Subject({
            name,
            branch,
            semester: Number(semester),
            code: code || '',
            subSubjects: subSubjects || []
        });

        await newSubject.save();

        res.status(201).json({
            success: true,
            data: newSubject,
            message: "Subject created successfully"
        });
    } catch (error) {
        console.error("Error creating subject:", error);
        res.status(500).json({ success: false, message: "Error creating subject" });
    }
};

// Delete a subject
export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const subject = await Subject.findByIdAndDelete(id);

        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.status(200).json({
            success: true,
            message: "Subject deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting subject:", error);
        res.status(500).json({ success: false, message: "Error deleting subject" });
    }
};

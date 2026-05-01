import Record from '../models/form.model.js';
import { Announcement } from '../models/announcement.model.js';
import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

// Get "My Classes" based on uploaded records
export const getMyClasses = async (req, res) => {
    try {
        const teacherName = req.user.name; // Assuming 'name' in User model matches 'teacherName' in Record

        // We want to find distinct Dep/Year/Section/Subject combinations for this teacher
        // that have been uploaded in the records.
        // NOTE: This relies on the "teacherName" field in records matching the User's name.
        // A robust system would link by ID, but we work with what we have.

        const classes = await Record.aggregate([
            { $match: { teacherName: { $regex: new RegExp(`^${teacherName}$`, 'i') } } }, // Case-insensitive match
            {
                $group: {
                    _id: {
                        department: "$department",
                        section: "$section",
                        subject: "$subject",
                        year: "$year",
                        semester: "$semester"
                    },
                    studentCount: { $sum: 1 } // Count records (students)
                }
            },
            { $sort: { "_id.year": 1, "_id.semester": 1, "_id.section": 1 } }
        ]);

        // Format for frontend
        const formattedClasses = classes.map(c => ({
            id: `${c._id.department}-${c._id.year}-${c._id.section}-${c._id.subject}`, // unique key
            name: `${c._id.year} Year - Sec ${c._id.section}`,
            subject: c._id.subject,
            department: c._id.department,
            semester: c._id.semester,
            students: c.studentCount
        }));

        res.status(200).json({ success: true, classes: formattedClasses });
    } catch (error) {
        console.error("Error fetching my classes:", error);
        res.status(500).json({ success: false, message: "Error fetching classes", error: error.message });
    }
};

// Create a new Teacher (HOD only)
export const createTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hodDepartment = req.user.department;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if HOD has a department assigned
        if (!hodDepartment && req.user.role !== 'principal' && req.user.role !== 'superAdmin') {
            return res.status(400).json({ success: false, message: "HOD must have a department assigned to create teachers." });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newTeacher = new User({
            name,
            email,
            password: hashedPassword,
            role: 'instructor', // New role name
            department: hodDepartment, // Lock to HOD's department
            isVerified: true // Auto-verify since HOD created them
        });

        await newTeacher.save();

        res.status(201).json({
            success: true,
            message: "Instructor created successfully",
            teacher: {
                id: newTeacher._id,
                name: newTeacher.name,
                email: newTeacher.email,
                department: newTeacher.department
            }
        });

    } catch (error) {
        console.error("Error creating teacher:", error);
        res.status(500).json({ success: false, message: "Error creating instructor", error: error.message });
    }
};

// Get all teachers in HOD's department
export const getDepartmentTeachers = async (req, res) => {
    try {
        const hodDepartment = req.user.department;

        // Query: Role is instructor/teacher AND department matches HOD
        const query = {
            role: { $in: ['instructor', 'teacher'] }
        };

        // If HOD, filter by dept. If Principal, show all (optional, but requested for HOD scope)
        if (req.user.role !== 'principal' && req.user.role !== 'superAdmin') {
            query.department = hodDepartment;
        }

        const teachers = await User.find(query).select('-password');

        res.status(200).json({ success: true, teachers });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ success: false, message: "Error fetching faculty list" });
    }
};

// Get announcements for teacher's classes
export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ teacherId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ success: false, message: "Error fetching announcements" });
    }
};

// Create announcement
export const createAnnouncement = async (req, res) => {
    try {
        const { title, content, department, section, subject } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required" });
        }

        const announcement = new Announcement({
            title,
            content,
            department: department || '',
            section: section || '',
            subject: subject || '',
            teacherId: req.user._id,
            teacherName: req.user.name
        });

        await announcement.save();
        res.status(201).json({ success: true, message: "Announcement created", data: announcement });
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ success: false, message: "Error creating announcement" });
    }
};

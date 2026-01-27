import Record from '../models/form.models.js';
import { Announcement } from '../models/announcement.model.js';

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
                        year: "$year"
                    },
                    count: { $sum: 1 },
                    lastUpdate: { $max: "$createdAt" }
                }
            },
            { $sort: { "_id.year": -1, "_id.department": 1, "_id.section": 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: classes
        });
    } catch (error) {
        console.error("Error in getMyClasses:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Announcement
export const createAnnouncement = async (req, res) => {
    try {
        const { title, content, department, section, subject } = req.body;

        const announcement = new Announcement({
            title,
            content,
            teacherId: req.userId,
            teacherName: req.user.name,
            department,
            section,
            subject
        });

        await announcement.save();

        res.status(201).json({
            success: true,
            data: announcement,
            message: "Announcement created successfully"
        });
    } catch (error) {
        console.error("Error in createAnnouncement:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Announcements (for Teacher View - maybe filtered by what they posted?)
export const getMyAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ teacherId: req.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: announcements
        });
    } catch (error) {
        console.error("Error in getMyAnnouncements:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Announcements (Public/Student view - filtered by their dep/sec if we had student logic)
// For now, let's just make a generic getter if needed, but the prompt focuses on Teacher Workspace.

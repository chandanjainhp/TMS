import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    department: {
        type: String, // e.g., "CSE"
    },
    section: {
        type: String, // e.g., "A", "All"
    },
    // Optional: Link to a specific subject if needed
    subject: {
        type: String
    }
}, { timestamps: true });

export const Announcement = mongoose.model("Announcement", announcementSchema);

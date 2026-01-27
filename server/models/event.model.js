import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['class', 'exam', 'event'],
        default: 'event',
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String, // e.g., "Room 101"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    department: {
        type: String, // For filtering (e.g., "CSE")
    }
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);

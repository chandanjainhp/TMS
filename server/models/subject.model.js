import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    branch: {
        type: String,
        required: true,
        lowercase: false,
        trim: true,
        enum: ['PMCS', 'BCA', 'PME', 'PCM'] // Optional: Validate against known branches if strictness is needed
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    code: {
        type: String,
        trim: true,
        required: false
    },
    subSubjects: [{
        type: String,
        trim: true
    }]
}, { timestamps: true });

// Ensure unique subject per branch/semester to avoid duplicates? 
// Maybe not, same name could theoretically exist. But (branch, semester, name) should likely be unique.
subjectSchema.index({ branch: 1, semester: 1, name: 1 }, { unique: true });

export const Subject = mongoose.model("Subject", subjectSchema);

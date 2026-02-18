import mongoose from "mongoose";

const allowedEmailSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        department: {
            type: String,
            required: false, // Optional for Super Admins or global allowed emails
            default: null
        },
    },
    { timestamps: true }
);

export const AllowedEmail = mongoose.model("AllowedEmail", allowedEmailSchema);

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
    },
    { timestamps: true }
);

export const AllowedEmail = mongoose.model("AllowedEmail", allowedEmailSchema);

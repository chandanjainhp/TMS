import { AllowedEmail } from "../models/allowedEmail.model.js";

export const addAllowedEmail = async (req, res) => {
    const { email } = req.body;
    const userId = req.userId; // From verifyToken middleware (Admin)

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const existingEmail = await AllowedEmail.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email is already allowed" });
        }

        const newAllowedEmail = new AllowedEmail({
            email,
            addedBy: userId,
        });

        await newAllowedEmail.save();

        res.status(201).json({ success: true, message: "Email added to allowed list successfully", data: newAllowedEmail });
    } catch (error) {
        console.error("Error in addAllowedEmail:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllowedEmails = async (req, res) => {
    try {
        const emails = await AllowedEmail.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: emails });
    } catch (error) {
        console.error("Error in getAllowedEmails:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

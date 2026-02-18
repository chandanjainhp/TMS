import { AllowedEmail } from "../models/allowedEmail.model.js";
import { User } from "../models/user.model.js";

export const addAllowedEmail = async (req, res) => {
    const { email, department } = req.body;
    const userId = req.userId; // From verifyToken middleware (Admin)

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Fetch creating user to check role/department
        const user = req.user || await User.findById(userId);

        // Determine department for the new teacher
        let teacherDepartment = null;

        if (user.department && user.department !== 'Global') {
            // If HOD, force their department
            teacherDepartment = user.department;
        } else {
            // If Super Admin, require department in body or use provided
            // User requirement: "admin muster enter the email and barch"
            if (!department) {
                return res.status(400).json({ success: false, message: "Branch (Department) is required for new teachers" });
            }
            teacherDepartment = department;
        }

        const existingEmail = await AllowedEmail.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email is already allowed" });
        }

        const newAllowedEmail = new AllowedEmail({
            email,
            addedBy: userId,
            department: teacherDepartment
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

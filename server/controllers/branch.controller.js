import { Branch } from '../models/branch.model.js';

export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find().sort({ name: 1 });
        res.status(200).json({ success: true, data: branches });
    } catch (error) {
        console.error("Error fetching branches:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addBranch = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Branch name is required" });
        }

        const existingBranch = await Branch.findOne({ name });
        if (existingBranch) {
            return res.status(400).json({ success: false, message: "Branch already exists" });
        }

        const newBranch = new Branch({ name });
        await newBranch.save();

        res.status(201).json({ success: true, data: newBranch });
    } catch (error) {
        console.error("Error adding branch:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        await Branch.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Branch deleted successfully" });
    } catch (error) {
        console.error("Error deleting branch:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const seedBranches = async (req, res) => {
    try {
        const defaultBranches = [
            'BCA', 'PMCS', 'PME', 'PCM',
            'B.Com', 'B.Sc', 'B.A', 'B.B.A',
            'MCA', 'M.Sc', 'M.Com'
        ];

        let addedCount = 0;
        for (const name of defaultBranches) {
            const exists = await Branch.findOne({ name });
            if (!exists) {
                await Branch.create({ name });
                addedCount++;
            }
        }

        res.status(200).json({ success: true, message: `Seeded ${addedCount} new branches` });
    } catch (error) {
        console.error("Error seeding branches:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

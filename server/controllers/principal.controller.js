import xlsx from "xlsx";
import { Student } from "../models/Student.model.js";
import { User } from "../models/user.model.js";

// Helper to normalize keys
const normalizeKey = (key) => key.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export const uploadMasterList = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = xlsx.utils.sheet_to_json(sheet);

        if (!rawData || rawData.length === 0) {
            return res.status(400).json({ success: false, message: "Excel file is empty" });
        }

        // Stats
        let created = 0;
        let updated = 0;
        let failed = 0;
        const errors = [];

        // Processing
        for (const [index, row] of rawData.entries()) {
            // Normalize row keys for flexibility
            const cleanRow = {};
            Object.keys(row).forEach(k => cleanRow[normalizeKey(k)] = row[k]);

            // Required fields: Roll No, Name, Branch, Dept, Sem
            // Accept variations: rollno, usn, name, studentname, branch, department, dept, sem, semester, section
            const rollNo = cleanRow.rollno || cleanRow.usn || cleanRow.rollnumber;
            const name = cleanRow.name || cleanRow.studentname;
            const branch = cleanRow.branch;
            const rawDept = cleanRow.department || cleanRow.dept;
            const sem = cleanRow.semester || cleanRow.sem;
            const section = cleanRow.section;

            if (!rollNo || !name || !branch || !rawDept || !sem) {
                failed++;
                errors.push(`Row ${index + 2}: Missing required fields (RollNo, Name, Branch, Dept, Sem)`);
                continue;
            }

            // Normalize Department Name (Simple mapping)
            // Ideally should fetch from DB, but for now we standardize commonly used names
            let department = rawDept;
            if (rawDept.toLowerCase().includes("comp")) department = "Computer Science";
            else if (rawDept.toLowerCase().includes("mech")) department = "Mechanical";
            else if (rawDept.toLowerCase().includes("civil")) department = "Civil";
            else if (rawDept.toLowerCase().includes("elec")) department = "Electronics";

            const studentData = {
                name,
                usn: rollNo,
                department,
                branch,
                semester: sem.toString(),
                section: section || 'A',
                // Preserve existing fields if updating
            };

            // Check if exists
            const existing = await Student.findOne({ usn: rollNo });

            if (existing) {
                // Update basic info but preserve data
                existing.name = name;
                existing.department = department;
                existing.branch = branch;
                existing.semester = sem.toString();
                if (section) existing.section = section;

                await existing.save();
                updated++;
            } else {
                // Create new
                await Student.create(studentData);
                created++;
            }
        }

        res.status(200).json({
            success: true,
            message: `Processed ${rawData.length} records.`,
            stats: { created, updated, failed },
            errors: errors.length > 0 ? errors.slice(0, 5) : [] // Return top 5 errors if any
        });

    } catch (error) {
        console.error("Master Upload Error:", error);
        res.status(500).json({ success: false, message: "Error processing Excel file", error: error.message });
    }
};

export const getSystemStats = async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const facultyCount = await User.countDocuments({ role: { $in: ['teacher', 'instructor', 'hod', 'admin'] } });
        const deptCount = (await Student.distinct("department")).length;

        // Mock attendance for now
        const avgAttendance = "87%";

        res.status(200).json({
            success: true,
            data: {
                studentCount,
                facultyCount,
                deptCount,
                avgAttendance
            }
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ success: false, message: "Error fetching stats" });
    }
};

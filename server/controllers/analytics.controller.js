import Record from '../models/form.model.js';
import { User } from '../models/user.model.js';

// Get Class Performance Analytics (Admin)
export const getClassPerformance = async (req, res) => {
    try {
        const { department, year, section, subject, testType } = req.query;

        console.log("Analytics Request Query:", req.query);

        const matchStage = {};
        if (department) matchStage.department = department;
        if (year) matchStage.year = year;
        if (section) matchStage.section = section;
        if (subject) matchStage.subject = subject;
        if (testType) matchStage.testType = testType;

        // Helper to get total marks field with fallbacks
        const totalMarksField = {
            $toDouble: {
                $ifNull: [
                    "$csvData.Total Marks",
                    {
                        $ifNull: [
                            "$csvData.totalMarks",
                            { $ifNull: ["$csvData.Total marks", "$csvData.total_marks"] }
                        ]
                    }
                ]
            }
        };

        // Aggregation pipeline to calculate statistics
        const stats = await Record.aggregate([
            { $match: matchStage },
            {
                $addFields: {
                    totalMarksNum: totalMarksField
                }
            },
            {
                $group: {
                    _id: null,
                    totalRecords: { $sum: 1 },
                    avgTotalMarks: { $avg: "$totalMarksNum" },
                    maxTotalMarks: { $max: "$totalMarksNum" },
                    minTotalMarks: { $min: "$totalMarksNum" },
                }
            }
        ]);

        // Grade distribution 
        const distribution = await Record.aggregate([
            { $match: matchStage },
            {
                $addFields: {
                    totalMarks: totalMarksField
                }
            },
            {
                $bucket: {
                    groupBy: "$totalMarks",
                    boundaries: [0, 35, 50, 60, 75, 90, 101], // Modified buckets for better grading visual
                    default: "Other",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        // Get subject-wise performance if subject filter is NOT applied (to compare subjects)
        let subjectPerformance = [];
        if (!subject) {
            subjectPerformance = await Record.aggregate([
                { $match: matchStage },
                {
                    $addFields: {
                        totalMarksNum: totalMarksField
                    }
                },
                {
                    $group: {
                        _id: "$subject",
                        avgMarks: { $avg: "$totalMarksNum" }
                    }
                },
                { $sort: { avgMarks: -1 } },
                { $limit: 10 }
            ]);
        }

        res.status(200).json({
            success: true,
            data: {
                stats: stats[0] || {},
                distribution,
                subjectPerformance
            }
        });

    } catch (error) {
        console.error("Error in getClassPerformance:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Student Performance Analytics (Student View)
export const getStudentPerformance = async (req, res) => {
    try {
        const { usn } = req.query;

        if (!usn) {
            return res.status(400).json({ success: false, message: "USN is required" });
        }

        // Enhanced search supporting lowercase/uppercase keys
        const studentRecords = await Record.find({
            $or: [
                { "csvData.usn": { $regex: new RegExp(`^${usn}$`, "i") } },
                { "csvData.USN": { $regex: new RegExp(`^${usn}$`, "i") } }
            ]
        }).sort({ createdAt: -1 });

        if (!studentRecords.length) {
            return res.status(404).json({ success: false, message: "No records found for this student." });
        }

        const subjectWisePerformance = {};
        const subjectTrend = []; // New array for trend analysis

        studentRecords.forEach(record => {
            const subject = record.subject;
            const data = record.csvData || {};
            // Handle lowercase or Title Case keys
            const marks = parseFloat(data['Total Marks'] || data['totalMarks'] || 0);

            if (!subjectWisePerformance[subject]) {
                subjectWisePerformance[subject] = [];
            }
            subjectWisePerformance[subject].push({
                testDate: record.aiTestDate,
                marks,
                testName: data['Test Name'] || data['testName'] || 'Assessment'
            });

            // Flat structure for overall trend
            subjectTrend.push({
                testDate: record.aiTestDate,
                subject: subject,
                marks: marks,
                testName: record.testType || data['Test Name']
            });
        });

        res.status(200).json({
            success: true,
            data: {
                studentDetails: studentRecords[0]?.csvData, // This will return whatever keys are there (usn or USN)
                records: studentRecords,
                subjectWisePerformance,
                subjectTrend // Return trend data
            }
        });

    } catch (error) {
        console.error("Error in getStudentPerformance:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Filter Options
export const getFilterOptions = async (req, res) => {
    try {
        const departments = await Record.distinct("department");
        const years = await Record.distinct("year");
        const sections = await Record.distinct("section");
        const subjects = await Record.distinct("subject");
        const testTypes = await Record.distinct("testType");

        res.status(200).json({
            success: true,
            data: {
                departments,
                years,
                sections,
                subjects,
                testTypes
            }
        });
    } catch (error) {
        console.error("Error in getFilterOptions:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check Student Result (Public with Captcha)
export const checkStudentResult = async (req, res) => {
    try {
        const { usn, captchaInput, captchaAnswer } = req.body;

        if (!usn || !captchaInput || !captchaAnswer) {
            return res.status(400).json({ success: false, message: "Please provide USN and solve the captcha." });
        }

        if (parseInt(captchaInput) !== parseInt(captchaAnswer)) {
            return res.status(400).json({ success: false, message: "Incorrect Captcha answer. Please try again." });
        }

        // Case-insensitive search for USN
        // We search both 'csvData.usn' (lowercase) which is what we saw in debug,
        // and 'csvData.USN' just in case of different upload formats.
        const studentRecords = await Record.find({
            $or: [
                { "csvData.usn": { $regex: new RegExp(`^${usn}$`, "i") } },
                { "csvData.USN": { $regex: new RegExp(`^${usn}$`, "i") } }
            ]
        }).sort({ createdAt: -1 });

        if (!studentRecords.length) {
            return res.status(404).json({ success: false, message: "No records found for this USN." });
        }

        // Return only necessary data for public view
        const publicRecords = studentRecords.map(record => {
            // Normalize data extraction based on observed keys
            const data = record.csvData || {};
            return {
                testName: data['Test Name'] || data['testName'] || record.subject || 'Assessment',
                testDate: record.aiTestDate,
                subject: record.subject,
                totalMarks: data['Total Marks'] || data['totalMarks'] || 0,
            };
        });

        const firstRecord = studentRecords[0];
        const firstData = firstRecord.csvData || {};

        res.status(200).json({
            success: true,
            data: {
                studentDetails: {
                    name: firstData['Student Name'] || firstData['name'] || "Unknown",
                    usn: firstData['USN'] || firstData['usn'] || usn,
                    department: firstRecord.department,
                    section: firstRecord.section,
                },
                results: publicRecords
            }
        });

    } catch (error) {
        console.error("Error in checkStudentResult:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

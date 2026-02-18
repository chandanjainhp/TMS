import { Student } from "../models/student.model.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";

// Get students with filters
export const selectStudent = async (req, res) => {
    try {
        const { searchTerm, department, year, branch } = req.query;
        let query = {};
        if (searchTerm) query.name = new RegExp(searchTerm, "i");
        if (department) query.department = department;
        if (year) query.year = year;
        if (branch) query.branch = branch;

        const students = await Student.find(query);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export CSV file
export const exportCsv = async (req, res) => {
    try {
        const students = await Student.find();
        if (students.length === 0) {
            return res.status(404).json({ error: "No students found" });
        }

        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(students);

        res.header("Content-Type", "text/csv");
        res.attachment("students.csv");
        res.send(csvData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export PDF file
export const exportPdf = async (req, res) => {
    try {
        const students = await Student.find();
        if (students.length === 0) {
            return res.status(404).json({ error: "No students found" });
        }

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="students.pdf"');

        doc.pipe(res);
        doc.fontSize(16).text("Internal Assessment", { align: "center" });
        doc.moveDown();

        students.forEach((student) => {
            doc.fontSize(12).text(`${student.slNo}. ${student.name} - ${student.usn}`);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

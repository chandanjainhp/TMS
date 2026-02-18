import EditingStudentModel from "../models/editingStudent.model.js";
import csv from 'csv-parser';
import fs from 'fs';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import path from 'path';
import multer from 'multer';

// GET all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await EditingStudentModel.find();
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// UPDATE students
export const updateStudents = async (req, res) => {
  try {
    const updatedStudents = req.body;

    const bulkOps = updatedStudents.map(student => ({
      updateOne: {
        filter: { _id: student._id },
        update: { $set: student }
      }
    }));

    await EditingStudentModel.bulkWrite(bulkOps);

    res.json({ message: 'Students updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// IMPORT students from CSV
export const importCsv = async (req, res) => {
  try {
    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        await EditingStudentModel.insertMany(results);
        res.json({ message: 'CSV imported successfully', data: results });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('CSV Import Error');
  }
};

// SELECT single student by ID
export const selectStudent = async (req, res) => {
  try {
    const student = await EditingStudentModel.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// EXPORT students to CSV
export const exportCsv = async (req, res) => {
  try {
    const students = await EditingStudentModel.find();
    const fields = Object.keys(students[0]._doc);
    const parser = new Parser({ fields });
    const csv = parser.parse(students);

    res.header('Content-Type', 'text/csv');
    res.attachment('students.csv');
    res.send(csv);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('CSV Export Error');
  }
};

// EXPORT students to PDF
export const exportPdf = async (req, res) => {
  try {
    const students = await EditingStudentModel.find();
    const doc = new PDFDocument();

    const filePath = path.join('public', 'students.pdf');
    doc.pipe(fs.createWriteStream(filePath));

    students.forEach(student => {
      doc.text(`Name: ${student.name}`);
      doc.text(`Email: ${student.email}`);
      doc.moveDown();
    });

    doc.end();

    res.download(filePath);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('PDF Export Error');
  }
};

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage: storage });
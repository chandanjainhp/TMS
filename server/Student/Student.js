const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  slNo: Number,
  name: String,
  usn: String,
  activity: String,
  c1: Number,
  c1Date: String,
  assignMarks: Number,
  c2: Number,
  c2Date: String,
  attendance: String,
  recordMarks: Number,
  c2Lab: String,
  totalMarks: String,
  department: String,
  year: String,
  branch: String,
});

module.exports = mongoose.model('Student', studentSchema);
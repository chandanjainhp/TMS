import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  slNo: { type: Number, required: true },
  name: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  activity: { type: String, required: true },
  c1: { type: Number, required: true },
  c1Date: { type: String, required: true },
  assignMarks: { type: Number, required: true },
  c2: { type: Number, required: true },
  c2Date: { type: String, required: true },
  attendance: { type: String, required: true },
  recordMarks: { type: Number, required: true },
  c2Lab: { type: String, required: true },
  totalMarks: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true }
});

const Student = mongoose.model('Student', StudentSchema);
export { Student };  

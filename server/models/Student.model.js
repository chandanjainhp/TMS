import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  // Identity
  usn: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },

  // Scope
  department: { type: String, required: true, index: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true }, // Current semester
  section: { type: String, required: true },
  year: { type: String, required: true }, // e.g., "1", "2", "3", "4"

  // Dynamic Marks Storage
  // Structure: { "A1": 18, "A2": 20, "Activity": 10, ... }
  marks: {
    type: Map,
    of: Number,
    default: {}
  },

  // Status
  lockStatus: {
    type: String,
    enum: ['Draft', 'Final'],
    default: 'Draft'
  },

  // Audit (Optional but good)
  lastUpdatedBy: { type: String }, // Teacher Name
}, { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);
export { Student };

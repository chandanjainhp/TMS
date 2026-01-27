import mongoose from 'mongoose';

// Add debug listeners
mongoose.connection.on('connecting', () => {
  console.debug('MongoDB: Attempting to connect...');
});

mongoose.connection.on('connected', () => {
  console.debug('MongoDB: Connected successfully!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB: Connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB: Disconnected');
});

// Schema definition
const recordSchema = new mongoose.Schema({
  department: String,
  branch: String,
  section: String,
  year: String,
  semester: String,
  subject: String,
  subSubject: String,
  teacherName: String,
  aiTestDate: String,
  aiTestDate: String,
  subjectFile: String, // Path to subject file
  subjectFileName: String,
  csvData: Object,
  uploadBatchId: { type: mongoose.Schema.Types.ObjectId, index: true },
}, { timestamps: true });

// Create model
const Record = mongoose.model('form', recordSchema);

// Debug function to test connection
export async function testConnection() {
  try {
    console.debug('Testing database connection...');
    await mongoose.connection.db.admin().ping();
    console.debug('Database connection is working!');
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}
``
export default Record;
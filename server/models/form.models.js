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
  section: String,
  year: String,
  teacherName: String,
  aiTestDate: String,
  csvData: Object, 
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
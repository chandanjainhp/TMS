import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  isVerified: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const newPassword = 'admin123'; // Change this to your desired password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    const result = await User.updateOne(
      { email: 'roots@gmail.com' },
      { 
        password: hashedPassword,
        role: 'admin',
        isVerified: true 
      }
    );

    if (result.matchedCount > 0) {
      console.log(`✅ Admin password updated successfully!`);
      console.log(`📧 Email: roots@gmail.com`);
      console.log(`🔐 New Password: ${newPassword}`);
    } else {
      console.log('❌ Admin user not found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

resetAdminPassword();

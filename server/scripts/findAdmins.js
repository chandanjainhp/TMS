import mongoose from 'mongoose';
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

async function findAdminUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminUsers = await User.find({ role: 'admin' });
    
    console.log('\n📋 Admin Users Found:');
    console.log('=====================');
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found in database');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Verified: ${user.isVerified}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('   ---');
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

findAdminUsers();

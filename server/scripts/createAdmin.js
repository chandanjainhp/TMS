import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Define the User model schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'teacher'],
      default: 'user',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: true, // Set to true for admin
    },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model('User', userSchema);

// Function to create admin user
async function createAdminUser() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'chandanjaincj93@gmail.com' });

    if (existingUser) {
      console.log('Admin user already exists. Updating password and role...');

      // Hash the password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash('Admin@123', salt);

      // Update the user
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      existingUser.isVerified = true;
      existingUser.name = 'Chandan Jain';

      await existingUser.save();
      console.log('Admin user updated successfully!');
    } else {
      console.log('Creating new admin user...');

      // Hash the password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash('Admin@123', salt);

      // Create the admin user
      const adminUser = new User({
        email: 'chandanjaincj93@gmail.com',
        password: hashedPassword,
        name: 'Chandan Jain',
        role: 'admin',
        isVerified: true
      });

      await adminUser.save();
      console.log('Admin user created successfully!');
    }

    // Verify the admin user was created/updated
    const adminUser = await User.findOne({ email: 'chandanjaincj93@gmail.com' });
    console.log('Admin user details:');
    console.log({
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      isVerified: adminUser.isVerified,
      createdAt: adminUser.createdAt
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createAdminUser();

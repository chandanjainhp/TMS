import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Function to make a user an admin
async function makeAdmin(email) {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the user by email
    console.log(`Looking for user with email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role || 'none'}`);

    // Update the user's role to admin
    user.role = 'admin';
    await user.save();

    console.log(`User ${user.name} (${user.email}) has been made an admin`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error making user an admin:', error);
    process.exit(1);
  }
}

// Get the email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.log('Usage: node makeAdmin.js user@example.com');
  process.exit(1);
}

// Make the user an admin
makeAdmin(email);

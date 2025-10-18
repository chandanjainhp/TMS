import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const BACKUP_ADMIN_EMAIL = 'backupid849@gmail.com';
const BACKUP_ADMIN_PASSWORD = 'BackupAdmin@123'; // Change this to your desired password
const BACKUP_ADMIN_NAME = 'Backup Admin';

async function setupBackupAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if backup admin already exists
        let backupAdmin = await User.findOne({ email: BACKUP_ADMIN_EMAIL });

        if (backupAdmin) {
            console.log('📧 Backup admin already exists:', BACKUP_ADMIN_EMAIL);
            
            // Update to ensure admin role
            if (backupAdmin.role !== 'admin') {
                backupAdmin.role = 'admin';
                await backupAdmin.save();
                console.log('✅ Updated role to admin');
            }

            // Update verification status
            if (!backupAdmin.isVerified) {
                backupAdmin.isVerified = true;
                await backupAdmin.save();
                console.log('✅ Updated verification status to true');
            }

            console.log('\n📋 Backup Admin Details:');
            console.log('Email:', backupAdmin.email);
            console.log('Name:', backupAdmin.name);
            console.log('Role:', backupAdmin.role);
            console.log('Verified:', backupAdmin.isVerified);
        } else {
            console.log('❌ Backup admin does not exist. Creating...');

            // Hash password
            const hashedPassword = await bcryptjs.hash(BACKUP_ADMIN_PASSWORD, 10);

            // Create backup admin
            backupAdmin = new User({
                email: BACKUP_ADMIN_EMAIL,
                password: hashedPassword,
                name: BACKUP_ADMIN_NAME,
                role: 'admin',
                isVerified: true,
                lastLogin: new Date(),
            });

            await backupAdmin.save();

            console.log('\n✅ Backup admin created successfully!');
            console.log('\n📋 Login Credentials:');
            console.log('Email:', BACKUP_ADMIN_EMAIL);
            console.log('Password:', BACKUP_ADMIN_PASSWORD);
            console.log('Role:', backupAdmin.role);
            console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
        }

        // Close connection
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error setting up backup admin:', error);
        process.exit(1);
    }
}

setupBackupAdmin();

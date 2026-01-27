import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function verifyAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all admins to be verified
        const result = await mongoose.connection.db.collection('users').updateMany(
            { role: 'admin' },
            { $set: { isVerified: true } }
        );
        console.log('Updated admin count:', result.modifiedCount);

        // Show all admins
        const admins = await mongoose.connection.db.collection('users')
            .find({ role: 'admin' })
            .project({ email: 1, name: 1, role: 1, isVerified: 1 })
            .toArray();

        console.log('\nAll Admin Users:');
        admins.forEach(admin => {
            console.log(`  - ${admin.name} (${admin.email}) - Verified: ${admin.isVerified}`);
        });

        // Also show teachers
        const teachers = await mongoose.connection.db.collection('users')
            .find({ role: 'teacher', isVerified: true })
            .project({ email: 1, name: 1, role: 1, isVerified: 1 })
            .toArray();

        console.log('\nAll Verified Teachers:');
        teachers.forEach(teacher => {
            console.log(`  - ${teacher.name} (${teacher.email}) - Verified: ${teacher.isVerified}`);
        });

        await mongoose.disconnect();
        console.log('\nDone!');
    } catch (error) {
        console.error('Error:', error);
    }
}

verifyAdmins();

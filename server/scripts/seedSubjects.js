import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from '../models/subject.model.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const SUBJECTS_DATA = {
    'PMCS': {
        1: ['Physics', 'Mathematics', 'Computer Science Basics'],
        2: ['advanced Physics', 'Advanced Mathematics', 'Electronics'],
        3: [
            { name: 'Data Structures', subSubjects: ['Arrays', 'Linked Lists', 'Trees', 'Graphs'] },
            'Java Programming'
        ],
        4: ['Operating Systems', 'DBMS'],
        5: ['Web Technologies', 'Software Engineering'],
        6: ['Project Work', 'Cloud Computing']
    },
    'BCA': {
        1: ['Programming in C', 'Mathematics I', 'Fundamentals of IT'],
        2: ['Data Structures', 'Mathematics II', 'Digital Electronics'],
        3: [
            { name: 'Object Oriented Programming', subSubjects: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Exception Handling'] },
            'Database Management',
            'Operating Systems'
        ],
        4: [
            { name: 'Web Development', subSubjects: ['HTML5', 'CSS3', 'JavaScript', 'React Basics'] },
            'Computer Networks',
            'Software Engineering'
        ],
        5: [
            { name: 'Java Programming', subSubjects: ['Core Java', 'Advanced Java', 'Spring Boot'] },
            'Unix/Linux',
            'Python'
        ],
        6: ['Project', 'AI & ML Basics']
    },
    'PME': {
        1: ['Physics', 'Mathematics', 'Electronics Basics'],
        2: ['Advanced Physics', 'Calculus', 'Digital Electronics'],
    },
    'PCM': {
        1: ['Physics', 'Chemistry', 'Mathematics'],
        2: ['Advanced Physics', 'Organic Chemistry', 'Calculus'],
    }
};

const seed = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log("Connected!");

        let count = 0;
        for (const [branch, semesters] of Object.entries(SUBJECTS_DATA)) {
            for (const [sem, subjects] of Object.entries(semesters)) {
                for (const item of subjects) {
                    const name = typeof item === 'string' ? item : item.name;
                    const subSubjects = typeof item === 'string' ? [] : item.subSubjects;

                    // Update if exists to add subSubjects, or create new
                    const filter = { branch, semester: Number(sem), name };
                    const update = {
                        name,
                        branch,
                        semester: Number(sem),
                        subSubjects
                    };

                    const result = await Subject.findOneAndUpdate(filter, update, { upsert: true, new: true });

                    if (result) {
                        count++;
                        console.log(`Processed: ${branch} Sem ${sem} - ${name}`);
                    }
                }
            }
        }

        console.log(`Seeding complete. Added ${count} new subjects.`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
};

seed();

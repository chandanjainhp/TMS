import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Record from '../models/form.model.js';
import { Student } from '../models/student.model.js'; // Import Student model

export const uploadRecords = async (req, res) => {
  try {
    const { department, branch, section, year, semester, subject, subSubject, teacherName, aiTestDate, testType } = req.body;

    // Handle multiple files
    const files = req.files || {};
    const csvFile = files['csvFile'] ? files['csvFile'][0] : null;
    const subjectFile = files['subjectFile'] ? files['subjectFile'][0] : null;

    // Validation
    if (!department || !branch || !section || !year || !semester || !subject || !subSubject || !teacherName || !aiTestDate || !testType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required including testType',
      });
    }

    if (!csvFile) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is missing',
      });
    }

    const filePath = path.resolve(csvFile.path);
    const results = [];

    // Generate a unique batch ID for this upload
    const uploadBatchId = new mongoose.Types.ObjectId();

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // 1. Create Audit Records (History)
          const recordsToInsert = results.map(row => ({
            department,
            branch,
            section,
            year,
            semester,
            subject,
            subSubject,
            teacherName,
            aiTestDate,
            testType, // Store test type
            subjectFile: subjectFile ? subjectFile.path : null,
            subjectFileName: subjectFile ? subjectFile.originalname : null,
            csvData: row,
            uploadBatchId,
          }));

          const savedRecords = await Record.insertMany(recordsToInsert);

          // 2. Sync with Student Master (Current State)
          // We iterate through results and upsert students
          const bulkOps = results.map(row => {
            // Normalize USN keys
            const usn = row['USN'] || row['usn'] || row['Usn'];
            const name = row['Student Name'] || row['Name'] || row['name'] || "Unknown";

            // Find marks column
            // We look for 'Marks', 'Score', 'Total Marks', or matches to testType
            let marksObtained = 0;
            const markKeys = Object.keys(row).filter(k =>
              ['marks', 'score', 'total marks', testType.toLowerCase()].includes(k.toLowerCase())
            );

            if (markKeys.length > 0) {
              marksObtained = parseFloat(row[markKeys[0]]) || 0;
            }

            if (!usn) return null; // Skip invalid rows

            return {
              updateOne: {
                filter: { usn: new RegExp(`^${usn}$`, "i") }, // Case-insensitive match
                update: {
                  $set: {
                    name,
                    department,
                    branch,
                    section,
                    year,
                    semester,
                    // Use array filters or specific path to update the map
                    [`marks.${testType}`]: marksObtained,
                    lastUpdatedBy: teacherName
                  },
                  $setOnInsert: {
                    lockStatus: 'Draft'
                  }
                },
                upsert: true
              }
            };
          }).filter(op => op !== null);

          if (bulkOps.length > 0) {
            await Student.bulkWrite(bulkOps);
          }

          res.json({
            success: true,
            message: 'Records uploaded and synced successfully',
            data: {
              recordCount: savedRecords.length,
              studentUpdatedCount: bulkOps.length,
              department,
              section,
              year,
              teacherName,
              testType,
              batchId: uploadBatchId
            }
          });

          // Clean up uploaded file
          fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete uploaded file:', err);
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          res.status(500).json({
            success: false,
            message: 'Failed to save records to database',
            error: dbError.message
          });
        }
      });
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing upload',
      error: error.message
    });
  }
};

// Get upload batches (summary view)
export const getUploadBatches = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Aggregate records by uploadBatchId
    const User = (await import('../models/user.model.js')).User;
    const user = await User.findById(req.userId);

    let matchQuery = {};
    if (user) {
      if (user.role === 'instructor' || user.role === 'teacher') {
        matchQuery.teacherName = user.name;
      } else if (user.role === 'admin' && user.department && user.department !== 'Global') {
        matchQuery.department = user.department;
      }
    }

    const batches = await Record.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$uploadBatchId",
          department: { $first: "$department" },
          section: { $first: "$section" },
          subject: { $first: "$subject" },
          teacherName: { $first: "$teacherName" },
          year: { $first: "$year" },
          createdAt: { $first: "$createdAt" }, // Use the creation time of the first record found
          count: { $sum: 1 }
        }
      },
      { $sort: { createdAt: -1 } } // Sort by newest first
    ]);

    // Attempt to handle legacy records that don't have an uploadBatchId
    // We can group them by a time window or just list them as "Legacy Uploads"
    // For now, let's just return what we have. Records without uploadBatchId will have _id: null in grouping.

    res.json({
      success: true,
      data: batches
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch upload batches', error: error.message });
  }
};

// Get records with sorting and filtering (accessible to all authenticated users)
export const getRecords = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user from database
    const User = (await import('../models/user.model.js')).User;
    const user = await User.findById(req.userId);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const { department, section, year, sortField, sortOrder, search, groupByDate, batchId } = req.query;

    // Build query based on filters
    let query = {};
    if (department) query.department = department;
    if (section) query.section = section;
    if (year) query.year = year;
    if (batchId) query.uploadBatchId = batchId; // Add batchId filter

    // Role-based Access Control
    const isPublicView = req.query.publicView === 'true';

    // If basic instructor (instructor/teacher), only see own records
    if ((user.role === 'instructor' || user.role === 'teacher') && !isPublicView) {
      query.teacherName = user.name;
    }
    // If HOD (admin with department), see only department records
    else if (user.role === 'admin' && user.department && user.department !== 'Global') {
      query.department = user.department;
    }
    // If Admin/SuperAdmin (Global), see all.

    // Add search functionality
    if (search) {
      // Create a text search across multiple fields
      query.$or = [
        { department: { $regex: search, $options: 'i' } },
        { section: { $regex: search, $options: 'i' } },
        { year: { $regex: search, $options: 'i' } },
        // For teacher, teacherName is already fixed, so searching it is redundant but harmless
        // For admin, valid to search by teacherName
        { teacherName: { $regex: search, $options: 'i' } },
        // Search in CSV data fields would require more complex query
      ];
    }

    // Build sort options
    let sortOptions = {};

    // Default sort by createdAt if no sort field specified
    if (!sortField) {
      sortOptions.createdAt = -1; // Default to newest first
    } else {
      // Handle sorting for nested fields in csvData
      if (sortField.startsWith('csvData.')) {
        sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
      } else {
        // Handle sorting for top-level fields
        sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
      }
    }

    console.log('Query:', query);
    console.log('Sort options:', sortOptions);

    // Execute query with sorting
    const records = await Record.find(query).sort(sortOptions);

    // Group records by date if requested
    if (groupByDate === 'true') {
      // Group records by date
      const groupedRecords = {};

      records.forEach(record => {
        // Format date as YYYY-MM-DD for grouping
        const dateKey = new Date(record.createdAt).toISOString().split('T')[0];

        if (!groupedRecords[dateKey]) {
          groupedRecords[dateKey] = [];
        }

        groupedRecords[dateKey].push(record);
      });

      // Convert to array format for easier client-side handling
      const groupedArray = Object.keys(groupedRecords).map(date => ({
        date,
        records: groupedRecords[date],
        count: groupedRecords[date].length
      }));

      // Sort groups by date (newest first)
      groupedArray.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.json({
        success: true,
        count: records.length,
        grouped: true,
        data: groupedArray
      });
    } else {
      // Return ungrouped records
      res.json({
        success: true,
        count: records.length,
        grouped: false,
        data: records
      });
    }
  } catch (error) {
    console.error('Error retrieving records:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving records',
      error: error.message
    });
  }
};

// Update a record by ID
export const updateRecord = async (req, res) => {
  try {
    // Check authentication
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Record ID is required'
      });
    }

    // Find the record first to check existence
    const record = await Record.findById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Update fields
    // We handle top-level fields and nested csvData fields
    if (updates.department) record.department = updates.department;
    if (updates.branch) record.branch = updates.branch;
    if (updates.section) record.section = updates.section;
    if (updates.year) record.year = updates.year;
    if (updates.semester) record.semester = updates.semester;
    if (updates.teacherName) record.teacherName = updates.teacherName;
    if (updates.aiTestDate) record.aiTestDate = updates.aiTestDate;

    // Handle csvData updates - merge with existing data
    if (updates.csvData) {
      record.csvData = { ...record.csvData, ...updates.csvData };
    }

    const updatedRecord = await record.save();

    res.json({
      success: true,
      message: 'Record updated successfully',
      data: updatedRecord
    });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating record',
      error: error.message
    });
  }
};

// Delete a record by ID (admin only)
export const deleteRecord = async (req, res) => {
  try {
    // Check if user is authenticated and has admin role
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user from database to check role
    const User = (await import('../models/user.model.js')).User;
    const user = await User.findById(req.userId);

    // Check if user is admin
    // Check if user is admin OR teacher
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Privileged access required.'
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Record ID is required'
      });
    }

    // Find record first
    const record = await Record.findById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // If user is a teacher, apply restrictions:
    // 1. Must be their own record
    // 2. Must be within 36 hours (1 day 12 hours) - "roll back" window
    if (user.role === 'teacher') {
      if (record.teacherName !== user.name) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only delete your own records.'
        });
      }

      const ONE_DAY_12_HOURS = 36 * 60 * 60 * 1000; // 36 hours in ms
      const timeSinceUpload = Date.now() - new Date(record.createdAt).getTime();

      if (timeSinceUpload > ONE_DAY_12_HOURS) {
        return res.status(403).json({
          success: false,
          message: 'Rollback period expired. You can only delete records uploaded within the last 36 hours.'
        });
      }
    }



    await record.deleteOne();

    res.json({
      success: true,
      message: 'Record deleted successfully',
      data: record
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting record',
      error: error.message
    });
  }
};

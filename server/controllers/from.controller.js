import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import Record from '../models/form.models.js';

export const uploadRecords = async (req, res) => {
  try {
    const { department, branch, section, year, semester, subject, teacherName, aiTestDate } = req.body;
    const csvFile = req.file;

    // Validation
    if (!department || !branch || !section || !year || !semester || !subject || !teacherName || !aiTestDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: department, branch, section, year, semester, subject, teacherName, aiTestDate',
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

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Create records with all form fields and CSV data
          const recordsToInsert = results.map(row => ({
            department,
            branch,
            section,
            year,
            semester,
            subject,
            teacherName,
            aiTestDate,
            csvData: row,
          }));

          // Save to database
          const savedRecords = await Record.insertMany(recordsToInsert);

          res.json({
            success: true,
            message: 'Records uploaded and saved to database successfully',
            data: {
              recordCount: savedRecords.length,
              department,
              section,
              year,
              teacherName,
              aiTestDate,
              file: csvFile.originalname
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

    const { department, section, year, sortField, sortOrder, search, groupByDate } = req.query;

    // Build query based on filters
    let query = {};
    if (department) query.department = department;
    if (section) query.section = section;
    if (year) query.year = year;

    // Add search functionality
    if (search) {
      // Create a text search across multiple fields
      query.$or = [
        { department: { $regex: search, $options: 'i' } },
        { section: { $regex: search, $options: 'i' } },
        { year: { $regex: search, $options: 'i' } },
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
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Record ID is required'
      });
    }

    const deletedRecord = await Record.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      message: 'Record deleted successfully',
      data: deletedRecord
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

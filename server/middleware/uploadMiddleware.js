// import multer from 'multer';
// import { extname } from 'path';

// // Validation function for CSV files
// const validateFileType = (file, cb) => {
//   const allowedExtensions = ['.csv'];
//   const fileExtension = extname(file.originalname).toLowerCase();

//   if (!allowedExtensions.includes(fileExtension)) {
//     return cb(new Error('Only CSV files are allowed'));
//   }
//   cb(null, true);
// };

// // Custom storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Ensure the 'uploads/' directory exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   }
// });

// // Multer configuration with limits
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     validateFileType(file, cb);
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//     files: 1 // Only 1 file allowed
//   }
// });

// // Middleware to validate form fields
// const validateFormData = (req, res, next) => {
//   const { department, section, year, teacherName, aiTestDate } = req.body;

//   if (!department || !section || !year || !teacherName || !aiTestDate) {
//     return res.status(400).json({
//       success: false,
//       message: 'All fields are required'
//     });
//   }

//   // Validate year format (e.g., 2023-2024)
//   if (!/^\d{4}-\d{4}$/.test(year)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Year must be in format YYYY-YYYY'
//     });
//   }

//   // Validate date is not in the future
//   const testDate = new Date(aiTestDate);
//   if (testDate > new Date()) {
//     return res.status(400).json({
//       success: false,
//       message: 'Test date cannot be in the future'
//     });
//   }

//   next();
// };

// // Error handling middleware
// const handleUploadErrors = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(413).json({
//         success: false,
//         message: 'File size exceeds 5MB limit'
//       });
//     }
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   } else if (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message || 'Internal server error during file upload'
//     });
//   }
//   next();
// };

// export {
//   upload,
//   validateFormData,
//   handleUploadErrors
// };

import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept CSV files and Subject files (PDF/Doc)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'csvFile') {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/csv',
      'text/x-csv',
      'application/x-csv',
      'text/comma-separated-values',
      'text/x-comma-separated-values',
      'application/vnd.msexcel'
    ];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) || ext === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for Record Data. Only CSV files are allowed.'), false);
    }
  } else if (file.fieldname === 'subjectFile') {
    // Check for Documents/Images for Subject File
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Relaxed check for extensions
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for Subject File. Allowed: PDF, DOC, TXT, Images.'), false);
      }
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB limit
  }
});

// Form data validation middleware
const validateFormData = (req, res, next) => {
  const { department, section, year, teacherName, aiTestDate } = req.body;

  if (!department || !section || !year || !teacherName || !aiTestDate) {
    return res.status(400).json({
      success: false,
      message: 'All form fields are required'
    });
  }

  next();
};

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message
      });
    } else {
      // Other errors
      return res.status(500).json({
        success: false,
        message: 'Server error during file upload',
        error: err.message
      });
    }
  }
  next();
};

// Message upload config
const messageUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export { upload, messageUpload, validateFormData, handleUploadErrors };
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DepartmentUploadForm = () => {
  const [formData, setFormData] = useState({
    department: '',
    branch: '',
    section: '',
    year: '',
    semester: '',
    teacherName: '',
    aiTestDate: '',
    csvFile: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const departments = [
    'Physics',
    'Mathematics',
    'Electronics',
    'Computer Science',
    'Chemistry',
    'Biology',
   
  ];

  const branches = [
    'PMCS',
    'BCA',
    'PME',
    'PCM'
  ];

  // Generate sections A through Z
  const sections = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    setError(null);
    setDebugInfo(null);
  };

  const validateForm = () => {
    // Check if all required fields are filled
    if (!formData.department.trim()) {
      setError('Please select a department');
      return false;
    }

    if (!formData.branch.trim()) {
      setError('Please select a branch');
      return false;
    }

    if (!formData.year.trim()) {
      setError('Please select a year');
      return false;
    }

    if (!formData.semester) {
      setError('Please select a semester');
      return false;
    }

    if (!formData.teacherName.trim()) {
      setError('Please enter teacher name');
      return false;
    }

    // Validate teacher name (only letters and spaces)
    if (!/^[a-zA-Z\s]+$/.test(formData.teacherName.trim())) {
      setError('Teacher name should only contain letters and spaces');
      return false;
    }

    if (!formData.section.trim()) {
      setError('Please select a section');
      return false;
    }

    if (!formData.aiTestDate) {
      setError('Please select AI test conducted date');
      return false;
    }

    // Validate test date is not in the future
    const testDate = new Date(formData.aiTestDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    
    if (testDate > today) {
      setError('Test date cannot be in the future');
      return false;
    }

    // Validate CSV file
    if (!formData.csvFile) {
      setError('Please upload a CSV file');
      return false;
    }

    const fileName = formData.csvFile.name.toLowerCase();
    if (!fileName.endsWith('.csv')) {
      setError('Only CSV files are allowed');
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (formData.csvFile.size > maxSize) {
      setError('File size should not exceed 10MB');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsUploading(true);
    setError(null);
    setDebugInfo(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('department', formData.department);
      formDataToSend.append('branch', formData.branch);
      formDataToSend.append('section', formData.section);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('semester', formData.semester);
      formDataToSend.append('teacherName', formData.teacherName);
      formDataToSend.append('aiTestDate', formData.aiTestDate);
      formDataToSend.append('csvFile', formData.csvFile);

      // Log FormData for debugging
      const formDataLog = {};
      for (let [key, value] of formDataToSend.entries()) {
        formDataLog[key] = value instanceof File ?
          { name: value.name, size: value.size, type: value.type } :
          value;
      }
      console.log('FormData being sent:', formDataLog);

      const response = await axios.post(
        'http://localhost:5000/api/form',
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Add timeout and onUploadProgress if needed
          timeout: 30000,
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setFormData({
        department: '',
        branch: '',
        section: '',
        year: '',
        semester: '',
        teacherName: '',
        aiTestDate: '',
        csvFile: null
      });

    } catch (err) {
      let errorMessage = 'An error occurred during upload';
      let debugData = null;

      if (err.response) {
        // Server responded with error status
        debugData = {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        };

        if (err.response.data?.message) {
          errorMessage = `Server error: ${err.response.data.message}`;
        } else {
          errorMessage = `Server returned status ${err.response.status}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
        debugData = { request: err.request };
      } else {
        // Something happened in setting up the request
        errorMessage = `Request error: ${err.message}`;
      }

      setError(errorMessage);
      setDebugInfo(debugData);
      console.error('Upload error:', err);
      console.error('Debug info:', debugData);

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 text-black flex flex-col items-center justify-center">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white text-black rounded-xl shadow-md overflow-hidden p-6 sm:p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Upload Student Records</h2>
          
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md">
            <div className="font-bold">{error}</div>
            {debugInfo && (
              <details className="mt-2 text-sm opacity-75">
                <summary>Technical details</summary>
                <pre className="whitespace-pre-wrap mt-1">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department Dropdown */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-black mb-1">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Dropdown */}
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-black mb-1">
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Section Dropdown */}

          {/* Year Dropdown */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-black mb-1">
              Year
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          {/* Semester Dropdown */}
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-black mb-1">
              Semester
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Semester</option>
              {[...Array(6)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          {/* Teacher Name */}
          <div>
            <label htmlFor="teacherName" className="block text-sm font-medium text-black mb-1">
              Teacher Name
            </label>
            <input
              type="text"
              id="teacherName"
              name="teacherName"
              placeholder="Enter teacher's name"
              value={formData.teacherName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="section" className="block text-sm font-medium text-black mb-1">
              Section
            </label>
            <select
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a section</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
          {/* AI Test Date */}
          <div>
            <label htmlFor="aiTestDate" className="block text-sm font-medium text-black mb-1">
              AI Test Conducted Date
            </label>
            <input
              type="date"
              id="aiTestDate"
              name="aiTestDate"
              value={formData.aiTestDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* CSV File Upload */}
          <div>
            <label htmlFor="csvFile" className="block text-sm font-medium text-black mb-1">
              Upload Student Data CSV
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="csvFile"
                name="csvFile"
                accept=".csv"
                onChange={handleChange}
                required
                className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300"
              />
            </div>
            {formData.csvFile && (
              <p className="mt-1 text-xs text-gray-500">
                Selected file: {formData.csvFile.name} ({Math.round(formData.csvFile.size / 1024)} KB)
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Upload a CSV file containing student records with columns: ID, Name, Email, Grade
            </p>
          </div>

          {/* Test Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => console.log('A1 Test Selected')}
            >
              A1 Test
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => console.log('A2 Test Selected')}
            >
              A2 Test
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${isUploading ? 'bg-gray-300 text-gray-500' : 'bg-green-600 hover:bg-green-700 text-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : 'Upload Records'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 animate-fade-in-up">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Records uploaded successfully!</span>
        </div>
      )}

      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DepartmentUploadForm;
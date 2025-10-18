import { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

const FormDataViewer = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    section: '',
    year: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const itemsPerPage = 10;

  // Fetch records from the server
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = { ...filters };

        // Remove empty filters
        Object.keys(params).forEach(key =>
          params[key] === '' && delete params[key]
        );

        const response = await axios.get('http://localhost:5000/api/form/records', { params });

        if (response.data.success) {
          setRecords(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch records');
        }
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      department: '',
      section: '',
      year: ''
    });
    setSearchTerm('');
  };

  // Handle record deletion
  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:5000/api/form/records/${id}`);

      if (response.data.success) {
        // Remove the deleted record from the state
        setRecords(prev => prev.filter(record => record._id !== id));
        setError(null);
      } else {
        setError(response.data.message || 'Failed to delete record');
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF export
  const handlePDFExport = () => {
    const doc = new jsPDF('landscape');
    doc.text('Student Assessment Records', 14, 16);

    // Add filters info
    let filterText = 'Filters: ';
    if (filters.department) filterText += `Department: ${filters.department}, `;
    if (filters.section) filterText += `Section: ${filters.section}, `;
    if (filters.year) filterText += `Year: ${filters.year}, `;
    if (filterText === 'Filters: ') filterText += 'None';
    else filterText = filterText.slice(0, -2); // Remove trailing comma

    doc.setFontSize(10);
    doc.text(filterText, 14, 24);

    // Add date
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    // Create table with all columns
    const tableColumn = [
      'Sl No.', 'Name', 'USN', 'Activity', 'C1', 'C1 Date', 'Assign Marks',
      'C2', 'C2 Date', 'Attendance', 'Record Marks', 'C2 Lab', 'Total Marks',
      'Department', 'Year', 'Branch'
    ];

    const tableRows = filteredRecords.map(record => [
      record.slNo,
      record.name,
      record.usn,
      record.activity,
      record.c1,
      record.c1Date,
      record.assignMarks,
      record.c2,
      record.c2Date,
      record.attendance,
      record.recordMarks,
      record.c2Lab,
      record.totalMarks,
      record.department,
      record.year,
      record.branch
    ]);

    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 1 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 10 }, // Sl No.
        1: { cellWidth: 25 }, // Name
        2: { cellWidth: 20 }, // USN
        3: { cellWidth: 15 }, // Activity
        // Let other columns auto-adjust
      }
    });

    doc.save('student_assessment_records.pdf');
  };

  // Extract CSV data into a flattened format for display
  const flattenedRecords = records.map((record, index) => {
    // Extract CSV data fields
    const csvData = record.csvData || {};

    return {
      _id: record._id,
      slNo: index + 1,
      name: csvData.Name || csvData.name || '',
      usn: csvData.USN || csvData.usn || '',
      activity: csvData.Activity || csvData.activity || '',
      c1: csvData.C1 || csvData.c1 || '',
      c1Date: csvData['C1 Date'] || csvData.c1Date || '',
      assignMarks: csvData['Assign Marks'] || csvData.assignMarks || '',
      c2: csvData.C2 || csvData.c2 || '',
      c2Date: csvData['C2 Date'] || csvData.c2Date || '',
      attendance: csvData.Attendance || csvData.attendance || '',
      recordMarks: csvData['Record Marks'] || csvData.recordMarks || '',
      c2Lab: csvData['C2 Lab'] || csvData.c2Lab || '',
      totalMarks: csvData['Total Marks'] || csvData.totalMarks || '',
      department: record.department || csvData.Department || csvData.department || '',
      year: record.year || csvData.Year || csvData.year || '',
      branch: csvData.Branch || csvData.branch || '',
      // Keep original record data for reference
      originalRecord: record
    };
  });

  // Filter records by search term
  const filteredRecords = flattenedRecords.filter(record => {
    const searchFields = [
      record.name,
      record.usn,
      record.department,
      record.branch,
      record.year
    ].filter(Boolean).join(' ').toLowerCase();

    return searchFields.includes(searchTerm.toLowerCase());
  });

  // Get unique values for filter dropdowns
  const uniqueDepartments = [...new Set(records.map(record => record.department))].filter(Boolean);
  const uniqueYears = [...new Set(records.map(record => record.year))].filter(Boolean);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // View record details
  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
    setShowDataModal(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header with Title and Actions */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Student Records
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredRecords.length} record(s) found
              </p>
            </div>
            
            {/* Export Buttons */}
            <div className="flex gap-2">
              <CSVLink
                data={filteredRecords}
                filename="student_records.csv"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm text-sm"
              >
                📊 Export CSV
              </CSVLink>
              <button
                onClick={handlePDFExport}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm text-sm"
              >
                📄 Export PDF
              </button>
            </div>
          </div>

          {/* Search and Filters in One Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name, USN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Department */}
            <div>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading records...</p>
          </div>
        ) : (
          <>
            {/* Records Table/Cards */}
            {filteredRecords.length > 0 ? (
              <>
                {/* Desktop Table - Hidden on Mobile */}
                <div className="hidden lg:block relative overflow-x-auto shadow-xl rounded-lg border border-gray-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Sl No.</th>
                        <th className="px-4 py-3 text-left font-semibold">Name</th>
                        <th className="px-4 py-3 text-left font-semibold">USN</th>
                        <th className="px-4 py-3 text-left font-semibold">Department</th>
                        <th className="px-4 py-3 text-left font-semibold">Year</th>
                        <th className="px-4 py-3 text-left font-semibold">Activity</th>
                        <th className="px-4 py-3 text-left font-semibold">C1</th>
                        <th className="px-4 py-3 text-left font-semibold">C2</th>
                        <th className="px-4 py-3 text-left font-semibold">Total</th>
                        <th className="px-4 py-3 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentRecords.map((record, index) => (
                        <tr key={record._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'} hover:bg-purple-50 transition-colors`}>
                          <td className="px-4 py-3 text-gray-700">{record.slNo}</td>
                          <td className="px-4 py-3 text-gray-900 font-semibold">{record.name}</td>
                          <td className="px-4 py-3 text-gray-700">{record.usn}</td>
                          <td className="px-4 py-3 text-gray-700">{record.department}</td>
                          <td className="px-4 py-3 text-gray-700">{record.year}</td>
                          <td className="px-4 py-3 text-gray-700">{record.activity}</td>
                          <td className="px-4 py-3 text-blue-600 font-medium">{record.c1}</td>
                          <td className="px-4 py-3 text-blue-600 font-medium">{record.c2}</td>
                          <td className="px-4 py-3 text-green-700 font-bold">{record.totalMarks}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => viewRecordDetails(record.originalRecord)}
                                className="px-3 py-1 text-xs bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteRecord(record._id)}
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View - Visible only on Mobile */}
                <div className="lg:hidden space-y-4">
                  {currentRecords.map((record) => (
                    <div key={record._id} className="bg-white rounded-lg shadow-md border border-indigo-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-bold text-lg">{record.name}</h3>
                            <p className="text-indigo-100 text-sm">{record.usn}</p>
                          </div>
                          <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                            #{record.slNo}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Department</p>
                            <p className="text-sm font-semibold text-gray-800">{record.department || 'N/A'}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Year</p>
                            <p className="text-sm font-semibold text-gray-800">{record.year || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-pink-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Branch</p>
                            <p className="text-sm font-semibold text-gray-800">{record.branch || 'N/A'}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Activity</p>
                            <p className="text-sm font-semibold text-gray-800">{record.activity || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <p className="text-xs text-gray-600 mb-2">Assessment Scores</p>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-blue-50 p-2 rounded">
                              <p className="text-xs text-gray-600">C1</p>
                              <p className="text-sm font-bold text-blue-700">{record.c1 || '-'}</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded">
                              <p className="text-xs text-gray-600">C2</p>
                              <p className="text-sm font-bold text-blue-700">{record.c2 || '-'}</p>
                            </div>
                            <div className="bg-green-100 p-2 rounded">
                              <p className="text-xs text-gray-600">Total</p>
                              <p className="text-base font-bold text-green-700">{record.totalMarks || '-'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Attendance: </span>
                            <span className="font-semibold text-gray-800">{record.attendance || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">C2 Lab: </span>
                            <span className="font-semibold text-gray-800">{record.c2Lab || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3">
                          <button
                            onClick={() => viewRecordDetails(record.originalRecord)}
                            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record._id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 sm:mt-6 flex-wrap gap-2 bg-white py-3 sm:py-4 rounded-lg">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-200 transition-colors font-medium text-sm"
                    >
                      <span className="hidden sm:inline">&laquo; First</span>
                      <span className="sm:hidden">&laquo;</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-200 transition-colors font-medium text-sm"
                    >
                      <span className="hidden sm:inline">&lt; Prev</span>
                      <span className="sm:hidden">&lt;</span>
                    </button>
                    <span className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-sm">
                      <span className="hidden sm:inline">Page </span>{currentPage}<span className="hidden sm:inline"> of {totalPages}</span>
                      <span className="sm:hidden">/{totalPages}</span>
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-200 transition-colors font-medium text-sm"
                    >
                      <span className="hidden sm:inline">Next &gt;</span>
                      <span className="sm:hidden">&gt;</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-200 transition-colors font-medium text-sm"
                    >
                      <span className="hidden sm:inline">Last &raquo;</span>
                      <span className="sm:hidden">&raquo;</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border-2 border-dashed border-gray-300 p-12 rounded-xl text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No records found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Record Details Modal */}
      {showDataModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto my-4 sm:my-8">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Record Details</h3>
                <button
                  onClick={() => setShowDataModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg border-l-4 border-indigo-600">
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">Department:</span> {selectedRecord.department}</p>
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">Section:</span> {selectedRecord.section}</p>
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">Year:</span> {selectedRecord.year}</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border-l-4 border-purple-600">
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">Teacher:</span> {selectedRecord.teacherName}</p>
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">Test Date:</span> {selectedRecord.aiTestDate}</p>
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">Upload Date:</span> {formatDate(selectedRecord.createdAt)}</p>
                </div>
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base">Student Record Details</span>
              </h4>
              {selectedRecord.csvData && Object.keys(selectedRecord.csvData).length > 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="space-y-2 sm:space-y-3">
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">Name:</span> {selectedRecord.csvData.Name || selectedRecord.csvData.name || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">USN:</span> {selectedRecord.csvData.USN || selectedRecord.csvData.usn || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">Activity:</span> {selectedRecord.csvData.Activity || selectedRecord.csvData.activity || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">Department:</span> {selectedRecord.department || selectedRecord.csvData.Department || selectedRecord.csvData.department || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">Year:</span> {selectedRecord.year || selectedRecord.csvData.Year || selectedRecord.csvData.year || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-indigo-700">Branch:</span> {selectedRecord.csvData.Branch || selectedRecord.csvData.branch || 'N/A'}</p>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">C1:</span> {selectedRecord.csvData.C1 || selectedRecord.csvData.c1 || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">C1 Date:</span> {selectedRecord.csvData['C1 Date'] || selectedRecord.csvData.c1Date || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">Assign Marks:</span> {selectedRecord.csvData['Assign Marks'] || selectedRecord.csvData.assignMarks || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">C2:</span> {selectedRecord.csvData.C2 || selectedRecord.csvData.c2 || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">C2 Date:</span> {selectedRecord.csvData['C2 Date'] || selectedRecord.csvData.c2Date || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-purple-700">C2 Lab:</span> {selectedRecord.csvData['C2 Lab'] || selectedRecord.csvData.c2Lab || 'N/A'}</p>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-green-700">Attendance:</span> {selectedRecord.csvData.Attendance || selectedRecord.csvData.attendance || 'N/A'}</p>
                      <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold text-green-700">Record Marks:</span> {selectedRecord.csvData['Record Marks'] || selectedRecord.csvData.recordMarks || 'N/A'}</p>
                      <p className="text-base sm:text-lg"><span className="font-bold text-green-700">Total Marks:</span> <span className="text-lg sm:text-xl font-bold text-green-600">{selectedRecord.csvData['Total Marks'] || selectedRecord.csvData.totalMarks || 'N/A'}</span></p>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-4 sm:mt-6">
                    <h5 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">All CSV Data</h5>
                    <div className="overflow-x-auto overflow-y-auto max-h-[250px] sm:max-h-[300px] rounded-lg border border-gray-300">
                      <table className="min-w-full bg-white text-sm sm:text-base">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0">
                          <tr>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold uppercase tracking-wider">Field</th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold uppercase tracking-wider">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(selectedRecord.csvData).map(([key, value], index) => (
                            <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'} hover:bg-purple-50 transition-colors`}>
                              <td className="px-3 sm:px-6 py-2 sm:py-4 font-semibold text-gray-700 border-b border-gray-200 text-xs sm:text-sm">{key}</td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4 text-gray-600 border-b border-gray-200 text-xs sm:text-sm">{value || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 p-6 sm:p-8 rounded-lg text-center">
                  <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">No CSV data available</p>
                </div>
              )}

              <div className="mt-6 sm:mt-8 flex justify-end">
                <button
                  onClick={() => setShowDataModal(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-medium text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDataViewer;

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
  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    order: 'desc'
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
        const params = {
          ...filters,
          sortField: sortConfig.field,
          sortOrder: sortConfig.order
        };

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
  }, [filters, sortConfig]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sorting
  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.order === 'asc' ? '↑' : '↓';
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
  const uniqueSections = [...new Set(records.map(record => record.section))].filter(Boolean);
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
    <div className="bg-[#34495E] p-4 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Student Assessment Records</h2>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Department Filter */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-1">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label htmlFor="section" className="block text-sm font-medium mb-1">
                Section
              </label>
              <select
                id="section"
                name="section"
                value={filters.section}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Sections</option>
                {uniqueSections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">
                Academic Year
              </label>
              <select
                id="year"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
            >
              Reset Filters
            </button>

            <CSVLink
              data={filteredRecords}
              filename="student_assessment_records.csv"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
            >
              Export CSV
            </CSVLink>

            <button
              onClick={handlePDFExport}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Records Count */}
            <div className="mb-4 text-gray-300">
              {filteredRecords.length} record(s) found
            </div>

            {/* Records Table */}
            {filteredRecords.length > 0 ? (
              <>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                  <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3 w-16">
                          <button onClick={() => handleSort('slNo')} className="flex items-center">
                            Sl No. {getSortIndicator('slNo')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3 w-40">
                          <button onClick={() => handleSort('name')} className="flex items-center">
                            Name {getSortIndicator('name')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3 w-32">
                          <button onClick={() => handleSort('usn')} className="flex items-center">
                            USN {getSortIndicator('usn')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('activity')} className="flex items-center">
                            Activity {getSortIndicator('activity')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3 w-16">
                          <button onClick={() => handleSort('c1')} className="flex items-center">
                            C1 {getSortIndicator('c1')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3 w-24">
                          <button onClick={() => handleSort('c1Date')} className="flex items-center">
                            C1 Date {getSortIndicator('c1Date')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('assignMarks')} className="flex items-center">
                            Assign Marks {getSortIndicator('assignMarks')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3 w-16">
                          <button onClick={() => handleSort('c2')} className="flex items-center">
                            C2 {getSortIndicator('c2')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3 w-24">
                          <button onClick={() => handleSort('c2Date')} className="flex items-center">
                            C2 Date {getSortIndicator('c2Date')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('attendance')} className="flex items-center">
                            Attendance {getSortIndicator('attendance')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('recordMarks')} className="flex items-center">
                            Record Marks {getSortIndicator('recordMarks')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('c2Lab')} className="flex items-center">
                            C2 Lab {getSortIndicator('c2Lab')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('totalMarks')} className="flex items-center">
                            Total Marks {getSortIndicator('totalMarks')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('department')} className="flex items-center">
                            Department {getSortIndicator('department')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('year')} className="flex items-center">
                            Year {getSortIndicator('year')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <button onClick={() => handleSort('branch')} className="flex items-center">
                            Branch {getSortIndicator('branch')}
                          </button>
                        </th>
                        <th scope="col" className="px-4 py-3 w-24">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.map((record, index) => (
                        <tr key={record._id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                          <td className="px-4 py-3">{record.slNo}</td>
                          <td className="px-4 py-3">{record.name}</td>
                          <td className="px-4 py-3">{record.usn}</td>
                          <td className="px-4 py-3">{record.activity}</td>
                          <td className="px-4 py-3">{record.c1}</td>
                          <td className="px-4 py-3">{record.c1Date}</td>
                          <td className="px-4 py-3">{record.assignMarks}</td>
                          <td className="px-4 py-3">{record.c2}</td>
                          <td className="px-4 py-3">{record.c2Date}</td>
                          <td className="px-4 py-3">{record.attendance}</td>
                          <td className="px-4 py-3">{record.recordMarks}</td>
                          <td className="px-4 py-3">{record.c2Lab}</td>
                          <td className="px-4 py-3">{record.totalMarks}</td>
                          <td className="px-4 py-3">{record.department}</td>
                          <td className="px-4 py-3">{record.year}</td>
                          <td className="px-4 py-3">{record.branch}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => viewRecordDetails(record.originalRecord)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteRecord(record._id)}
                                className="text-red-400 hover:text-red-300"
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                    >
                      &laquo;
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                    >
                      &lt;
                    </button>
                    <span className="px-3 py-1">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                    >
                      &gt;
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                    >
                      &raquo;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                No records found. Try adjusting your filters.
              </div>
            )}
          </>
        )}
      </div>

      {/* Record Details Modal */}
      {showDataModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Record Details</h3>
                <button
                  onClick={() => setShowDataModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p><span className="font-semibold">Department:</span> {selectedRecord.department}</p>
                  <p><span className="font-semibold">Section:</span> {selectedRecord.section}</p>
                  <p><span className="font-semibold">Year:</span> {selectedRecord.year}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Teacher:</span> {selectedRecord.teacherName}</p>
                  <p><span className="font-semibold">Test Date:</span> {selectedRecord.aiTestDate}</p>
                  <p><span className="font-semibold">Upload Date:</span> {formatDate(selectedRecord.createdAt)}</p>
                </div>
              </div>

              <h4 className="text-lg font-semibold mb-2">Student Record Details</h4>
              {selectedRecord.csvData && Object.keys(selectedRecord.csvData).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p><span className="font-semibold">Name:</span> {selectedRecord.csvData.Name || selectedRecord.csvData.name || 'N/A'}</p>
                    <p><span className="font-semibold">USN:</span> {selectedRecord.csvData.USN || selectedRecord.csvData.usn || 'N/A'}</p>
                    <p><span className="font-semibold">Activity:</span> {selectedRecord.csvData.Activity || selectedRecord.csvData.activity || 'N/A'}</p>
                    <p><span className="font-semibold">Department:</span> {selectedRecord.department || selectedRecord.csvData.Department || selectedRecord.csvData.department || 'N/A'}</p>
                    <p><span className="font-semibold">Year:</span> {selectedRecord.year || selectedRecord.csvData.Year || selectedRecord.csvData.year || 'N/A'}</p>
                    <p><span className="font-semibold">Branch:</span> {selectedRecord.csvData.Branch || selectedRecord.csvData.branch || 'N/A'}</p>
                  </div>

                  <div className="space-y-2">
                    <p><span className="font-semibold">C1:</span> {selectedRecord.csvData.C1 || selectedRecord.csvData.c1 || 'N/A'}</p>
                    <p><span className="font-semibold">C1 Date:</span> {selectedRecord.csvData['C1 Date'] || selectedRecord.csvData.c1Date || 'N/A'}</p>
                    <p><span className="font-semibold">Assign Marks:</span> {selectedRecord.csvData['Assign Marks'] || selectedRecord.csvData.assignMarks || 'N/A'}</p>
                    <p><span className="font-semibold">C2:</span> {selectedRecord.csvData.C2 || selectedRecord.csvData.c2 || 'N/A'}</p>
                    <p><span className="font-semibold">C2 Date:</span> {selectedRecord.csvData['C2 Date'] || selectedRecord.csvData.c2Date || 'N/A'}</p>
                    <p><span className="font-semibold">C2 Lab:</span> {selectedRecord.csvData['C2 Lab'] || selectedRecord.csvData.c2Lab || 'N/A'}</p>
                  </div>

                  <div className="space-y-2">
                    <p><span className="font-semibold">Attendance:</span> {selectedRecord.csvData.Attendance || selectedRecord.csvData.attendance || 'N/A'}</p>
                    <p><span className="font-semibold">Record Marks:</span> {selectedRecord.csvData['Record Marks'] || selectedRecord.csvData.recordMarks || 'N/A'}</p>
                    <p><span className="font-semibold">Total Marks:</span> {selectedRecord.csvData['Total Marks'] || selectedRecord.csvData.totalMarks || 'N/A'}</p>
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-4">
                    <h5 className="text-md font-semibold mb-2">All CSV Data</h5>
                    <div className="overflow-x-auto overflow-y-auto max-h-[300px]">
                      <table className="min-w-full bg-gray-800 border border-gray-700 table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">Field</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(selectedRecord.csvData).map(([key, value], index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-900' : ''}>
                              <td className="px-4 py-2 border-b border-gray-700 font-medium">{key}</td>
                              <td className="px-4 py-2 border-b border-gray-700">{value || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No CSV data available</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDataModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
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

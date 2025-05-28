import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaDownload, FaTrash, FaEye } from 'react-icons/fa';

const AdminUploadedRecords = () => {
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

  // Filter records by search term
  const filteredRecords = records.filter(record => {
    const searchFields = [
      record.department,
      record.section,
      record.year,
      record.teacherName,
      record.aiTestDate
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

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Uploaded Records</h2>
      
      {/* Filters */}
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Department Filter */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium mb-1 text-gray-300">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            <label htmlFor="section" className="block text-sm font-medium mb-1 text-gray-300">
              Section
            </label>
            <select
              id="section"
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            <label htmlFor="year" className="block text-sm font-medium mb-1 text-gray-300">
              Academic Year
            </label>
            <select
              id="year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-300">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-600 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
        >
          Reset Filters
        </button>
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
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-700 border border-gray-600 rounded-lg">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('department')}
                          className="flex items-center focus:outline-none"
                        >
                          Department {getSortIndicator('department')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('section')}
                          className="flex items-center focus:outline-none"
                        >
                          Section {getSortIndicator('section')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('year')}
                          className="flex items-center focus:outline-none"
                        >
                          Year {getSortIndicator('year')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('teacherName')}
                          className="flex items-center focus:outline-none"
                        >
                          Teacher {getSortIndicator('teacherName')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('aiTestDate')}
                          className="flex items-center focus:outline-none"
                        >
                          Test Date {getSortIndicator('aiTestDate')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center focus:outline-none"
                        >
                          Upload Date {getSortIndicator('createdAt')}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {currentRecords.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-600">
                        <td className="px-4 py-3 whitespace-nowrap">{record.department}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{record.section}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{record.year}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{record.teacherName}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{record.aiTestDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDate(record.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewRecordDetails(record)}
                              className="text-blue-400 hover:text-blue-300"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <a
                              href={`http://localhost:5000/api/form/download/${record._id}`}
                              className="text-green-400 hover:text-green-300"
                              title="Download"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaDownload />
                            </a>
                            <button
                              onClick={() => handleDeleteRecord(record._id)}
                              className="text-red-400 hover:text-red-300"
                              title="Delete"
                            >
                              <FaTrash />
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
            <div className="bg-gray-700 p-8 rounded-lg text-center text-white">
              No records found. Try adjusting your filters.
            </div>
          )}
        </>
      )}
      
      {/* Record Details Modal */}
      {showDataModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Record Details</h3>
                <button
                  onClick={() => setShowDataModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-white">
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
              
              <h4 className="text-lg font-semibold mb-2 text-white">CSV Data</h4>
              {selectedRecord.csvData && Object.keys(selectedRecord.csvData).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-700 border border-gray-600">
                    <thead>
                      <tr>
                        {Object.keys(selectedRecord.csvData).map(key => (
                          <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-600">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {Object.values(selectedRecord.csvData).map((value, index) => (
                          <td key={index} className="px-4 py-2 border-b border-gray-600 text-white">
                            {value || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
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

export default AdminUploadedRecords;

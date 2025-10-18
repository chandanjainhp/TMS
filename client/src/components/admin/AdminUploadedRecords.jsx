import { useState, useEffect } from 'react';
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Uploaded Records
      </h2>
      
      {/* Filters */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl mb-6 border border-indigo-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-indigo-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Department Filter */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium mb-2 text-gray-700">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-indigo-200 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
            <label htmlFor="section" className="block text-sm font-medium mb-2 text-gray-700">
              Section
            </label>
            <select
              id="section"
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-indigo-200 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
            <label htmlFor="year" className="block text-sm font-medium mb-2 text-gray-700">
              Academic Year
            </label>
            <select
              id="year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-indigo-200 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
          <label htmlFor="search" className="block text-sm font-medium mb-2 text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-indigo-200 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
        
        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Reset Filters
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}
      
      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Records Count */}
          <div className="mb-4 text-gray-700 font-medium">
            {filteredRecords.length} record(s) found
          </div>
          
          {/* Records Table */}
          {filteredRecords.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('department')}
                          className="flex items-center focus:outline-none hover:text-indigo-100 transition-colors"
                        >
                          Department {getSortIndicator('department')}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('section')}
                          className="flex items-center focus:outline-none hover:text-indigo-100 transition-colors"
                        >
                          Section {getSortIndicator('section')}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('year')}
                          className="flex items-center focus:outline-none hover:text-indigo-100 transition-colors"
                        >
                          Year {getSortIndicator('year')}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('teacherName')}
                          className="flex items-center focus:outline-none hover:text-indigo-100 transition-colors"
                        >
                          Teacher {getSortIndicator('teacherName')}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('aiTestDate')}
                          className="flex items-center focus:outline-none hover:text-indigo-100 transition-colors"
                        >
                          Test Date {getSortIndicator('aiTestDate')}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        <button 
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center focus:outline-none hover:text-indigo-100 transition-colors"
                        >
                          Upload Date {getSortIndicator('createdAt')}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentRecords.map((record, index) => (
                      <tr key={record._id} className={`hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.section}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.teacherName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.aiTestDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {formatDate(record.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => viewRecordDetails(record)}
                              className="text-blue-600 hover:text-blue-800 transition-colors transform hover:scale-110"
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </button>
                            <a
                              href={`http://localhost:5000/api/form/download/${record._id}`}
                              className="text-green-600 hover:text-green-800 transition-colors transform hover:scale-110"
                              title="Download"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaDownload size={18} />
                            </a>
                            <button
                              onClick={() => handleDeleteRecord(record._id)}
                              className="text-red-600 hover:text-red-800 transition-colors transform hover:scale-110"
                              title="Delete"
                            >
                              <FaTrash size={18} />
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
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    &laquo;
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    &lt;
                  </button>
                  <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    &gt;
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    &raquo;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-12 rounded-xl text-center border border-indigo-200">
              <svg className="mx-auto h-12 w-12 text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-700 font-medium">No records found. Try adjusting your filters.</p>
            </div>
          )}
        </>
      )}
      
      {/* Record Details Modal */}
      {showDataModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Record Details
                </h3>
                <button
                  onClick={() => setShowDataModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl leading-none transition-colors"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                  <p className="mb-2"><span className="font-semibold text-indigo-900">Department:</span> <span className="text-gray-700">{selectedRecord.department}</span></p>
                  <p className="mb-2"><span className="font-semibold text-indigo-900">Section:</span> <span className="text-gray-700">{selectedRecord.section}</span></p>
                  <p><span className="font-semibold text-indigo-900">Year:</span> <span className="text-gray-700">{selectedRecord.year}</span></p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <p className="mb-2"><span className="font-semibold text-purple-900">Teacher:</span> <span className="text-gray-700">{selectedRecord.teacherName}</span></p>
                  <p className="mb-2"><span className="font-semibold text-purple-900">Test Date:</span> <span className="text-gray-700">{selectedRecord.aiTestDate}</span></p>
                  <p><span className="font-semibold text-purple-900">Upload Date:</span> <span className="text-gray-700">{formatDate(selectedRecord.createdAt)}</span></p>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold mb-4 text-indigo-900">CSV Data</h4>
              {selectedRecord.csvData && Object.keys(selectedRecord.csvData).length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                        {Object.keys(selectedRecord.csvData).map(key => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-indigo-50/30">
                        {Object.values(selectedRecord.csvData).map((value, index) => (
                          <td key={index} className="px-6 py-4 text-gray-900 border-t border-gray-200">
                            {value || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">No CSV data available</p>
              )}
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowDataModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
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

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Search, Trash2, Eye, X } from 'lucide-react';

const RecordsList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [groupByDate, setGroupByDate] = useState(true);
  const [isGrouped, setIsGrouped] = useState(true);
  const searchTimeoutRef = useRef(null);

  // List of departments for filter dropdown
  const departments = [
    'Physics',
    'Mathematics',
    'Electronics',
    'Computer Science',
    'Chemistry',
    'Biology',
    'Engineering',
    'Other'
  ];

  // Generate sections A through Z for filter dropdown
  const sections = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Fetch records with current filters and sorting
  const fetchRecords = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = {
        ...filters,
        sortField: sortConfig.field,
        sortOrder: sortConfig.order,
        groupByDate: groupByDate.toString()
      };

      // Add search term if present
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      // Remove empty filters
      Object.keys(params).forEach(key =>
        params[key] === '' && delete params[key]
      );

      const response = await axios.get('http://localhost:5000/api/form/records', {
        params,
        withCredentials: true
      });

      if (response.data.success) {
        setRecords(response.data.data);
        setIsGrouped(response.data.grouped);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch records');
      }
    } catch (err) {
      console.error('Error fetching records:', err);

      // Check if unauthorized (401) or forbidden (403)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUnauthorized(true);
        setError('You do not have permission to view records. Only administrators can access this page.');
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch records');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout to delay the search
    searchTimeoutRef.current = setTimeout(() => {
      fetchRecords();
    }, 500); // 500ms delay
  };

  // Delete a record
  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`http://localhost:5000/api/form/records/${id}`, {
        withCredentials: true
      });

      if (response.data.success) {
        // Remove the deleted record from the state
        setRecords(prevRecords => prevRecords.filter(record => record._id !== id));
        setShowDeleteConfirm(false);
        setSelectedRecord(null);
      } else {
        setError(response.data.message || 'Failed to delete record');
      }
    } catch (err) {
      console.error('Error deleting record:', err);

      // Check if unauthorized (401) or forbidden (403)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUnauthorized(true);
        setError('You do not have permission to delete records. Only administrators can perform this action.');
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to delete record');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (record) => {
    setSelectedRecord(record);
    setShowDeleteConfirm(true);
  };

  // Open data view modal
  const openDataModal = (record) => {
    setSelectedRecord(record);
    setShowDataModal(true);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // Fetch when filters, search term, sorting, or grouping changes
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    fetchRecords();
  }, [filters, sortConfig, searchTerm, groupByDate]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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
  };

  // No longer checking if user is admin - all authenticated users can access this page
  useEffect(() => {
    // This effect is kept for potential future use
  }, []);

  return (
    <div className="min-h-screen bg-gray-700 p-4 text-white">
      {/* Unauthorized Message */}
      {unauthorized && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
          <p className="font-bold">Access Denied</p>
          <p>{error}</p>
          <p className="mt-2">Redirecting to home page...</p>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Uploaded Records</h2>

        {/* Search Bar and View Options */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={groupByDate}
                  onChange={() => setGroupByDate(prev => !prev)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                <span className="ms-3 text-sm font-medium text-white">Group by Date</span>
              </label>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {departments.map((dept) => (
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
                {sections.map((sec) => (
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
              <input
                type="text"
                id="year"
                name="year"
                placeholder="e.g. 2023-2024"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
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
              {records.length} record(s) found
            </div>

            {/* Records Display */}
            {records.length > 0 ? (
              isGrouped ? (
                // Grouped Records View
                <div className="space-y-6">
                  {records.map((group) => (
                    <div key={group.date} className="bg-gray-800 rounded-lg overflow-hidden">
                      <div className="bg-gray-900 px-4 py-3 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          {new Date(group.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                          {group.count} record{group.count !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.records.map((record) => (
                            <div key={record._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">{record.department} - Section {record.section}</h4>
                                  <p className="text-sm text-gray-400">{record.year}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openDataModal(record)}
                                    className="text-indigo-400 hover:text-indigo-300"
                                    title="View Data"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => openDeleteConfirm(record)}
                                    className="text-red-400 hover:text-red-300"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="text-sm">
                                <p><span className="text-gray-400">Teacher:</span> {record.teacherName}</p>
                                <p><span className="text-gray-400">Test Date:</span> {record.aiTestDate}</p>
                                <p className="mt-2">
                                  <button
                                    onClick={() => openDataModal(record)}
                                    className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View CSV Data
                                  </button>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Individual Records Table View
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                    <thead>
                      <tr className="bg-gray-900">
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
                          CSV Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {records.map((record) => (
                        <tr key={record._id} className="hover:bg-gray-700">
                          <td className="px-4 py-3 whitespace-nowrap">{record.department}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{record.section}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{record.year}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{record.teacherName}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{record.aiTestDate}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openDataModal(record)}
                              className="text-indigo-400 hover:text-indigo-300 flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Data
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openDeleteConfirm(record)}
                              className="text-red-400 hover:text-red-300 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                No records found. Try adjusting your filters.
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Confirm Delete</h3>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedRecord(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedRecord._id)}
                disabled={deleteLoading}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center ${deleteLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data View Modal */}
      {showDataModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">CSV Data</h3>
              <button
                onClick={() => {
                  setShowDataModal(false);
                  setSelectedRecord(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p><span className="font-semibold">Department:</span> {selectedRecord.department}</p>
              <p><span className="font-semibold">Section:</span> {selectedRecord.section}</p>
              <p><span className="font-semibold">Year:</span> {selectedRecord.year}</p>
              <p><span className="font-semibold">Teacher:</span> {selectedRecord.teacherName}</p>
              <p><span className="font-semibold">Test Date:</span> {selectedRecord.aiTestDate}</p>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">CSV Data</h4>
              {selectedRecord.csvData && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                    <thead>
                      <tr className="bg-gray-900">
                        {Object.keys(selectedRecord.csvData).map(key => (
                          <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {Object.values(selectedRecord.csvData).map((value, index) => (
                          <td key={index} className="px-4 py-2 whitespace-nowrap">
                            {value}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDataModal(false);
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsList;

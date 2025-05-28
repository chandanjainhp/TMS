import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

// DatePicker component with updated colors
const DatePicker = ({ value, onChange }) => (
  <input
    type="date"
    value={value ? format(value, 'yyyy-MM-dd') : ''}
    onChange={(e) => onChange(new Date(e.target.value))}
    className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
  />
);

// No wrapper component needed

const AdminTeacherLog = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = {};
        if (startDate) {
          params.startDate = format(startDate, 'yyyy-MM-dd');
        }
        if (endDate) {
          params.endDate = format(endDate, 'yyyy-MM-dd');
        }

        // Fetch users
        const response = await axios.get('http://localhost:5000/api/users', {
          params,
          withCredentials: true
        });

        if (response.data.success) {
          setUsers(response.data.data);
          setError(null);

          // Fetch user stats
          const statsResponse = await axios.get('http://localhost:5000/api/users/stats', {
            withCredentials: true
          });

          if (statsResponse.data.success) {
            setStats(statsResponse.data.data);
          }
        } else {
          setError(response.data.message || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [startDate, endDate]);

  // Filter users by search term
  const filteredUsers = users.filter((user) => {
    // Search in user name and email
    const userName = user.name || '';
    const userEmail = user.email || '';

    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  // Get verification status badge - updated colors
  const getVerificationBadge = (isVerified) => {
    return isVerified ?
      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 border border-green-200">Verified</span> :
      <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 border border-red-200">Not Verified</span>;
  };

  // Get role badge - updated colors
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-800 border border-indigo-200">Admin</span>;
      case 'teacher':
        return <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 border border-blue-200">Teacher</span>;
      default:
        return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 border border-gray-200">User</span>;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Teacher Activity Log</h2>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800">Total Users</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold text-green-800">Verified Users</h3>
              <p className="text-3xl font-bold text-green-600">{stats.verifiedUsers}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800">New Users (30d)</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats.newUsers}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg shadow-sm border border-amber-100">
              <h3 className="text-lg font-semibold text-amber-800">Active Users (7d)</h3>
              <p className="text-3xl font-bold text-amber-600">{stats.activeUsers}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                className="w-full bg-gray-600 text-white"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    InputProps: {
                      className: 'text-white',
                    }
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                className="w-full bg-gray-600 text-white"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    InputProps: {
                      className: 'text-white',
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 w-full bg-white text-gray-800 border border-gray-300 rounded pl-10 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-800 border border-red-200 p-4 rounded-lg mb-4">
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
            {/* Users Count */}
            <div className="mb-4 text-gray-600">
              {filteredUsers.length} user(s) found
            </div>

            {/* Users Table */}
            {filteredUsers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 text-gray-800 text-sm md:text-base">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 border border-gray-200">#</th>
                        <th className="p-2 border border-gray-200">Name</th>
                        <th className="p-2 border border-gray-200">Email</th>
                        <th className="p-2 border border-gray-200">Role</th>
                        <th className="p-2 border border-gray-200">Status</th>
                        <th className="p-2 border border-gray-200">Last Login</th>
                        <th className="p-2 border border-gray-200">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="p-2 border border-gray-200">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="p-2 border border-gray-200">
                            <div className="font-semibold">{user.name || 'Unknown'}</div>
                          </td>
                          <td className="p-2 border border-gray-200">{user.email || 'Unknown'}</td>
                          <td className="p-2 border border-gray-200">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="p-2 border border-gray-200">
                            {getVerificationBadge(user.isVerified)}
                          </td>
                          <td className="p-2 border border-gray-200">
                            {formatDate(user.lastLogin)}
                          </td>
                          <td className="p-2 border border-gray-200">
                            {formatDate(user.createdAt)}
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
                      className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 text-gray-800 hover:bg-gray-50"
                    >
                      &laquo;
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 text-gray-800 hover:bg-gray-50"
                    >
                      &lt;
                    </button>
                    <span className="px-3 py-1 text-gray-800">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 text-gray-800 hover:bg-gray-50"
                    >
                      &gt;
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50 text-gray-800 hover:bg-gray-50"
                    >
                      &raquo;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-800 border border-gray-200">
                No users found. Try adjusting your search.
              </div>
            )}
          </>
        )}
      </div>
  );
};

export default AdminTeacherLog;

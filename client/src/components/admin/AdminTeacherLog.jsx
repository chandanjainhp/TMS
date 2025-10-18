import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

// DatePicker component with updated colors
const DatePicker = ({ value, onChange }) => (
  <input
    type="date"
    value={value ? format(value, 'yyyy-MM-dd') : ''}
    onChange={(e) => onChange(new Date(e.target.value))}
    className="w-full p-2 bg-white text-gray-800 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Teacher Activity Log
        </h2>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl shadow-md border border-indigo-200 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stats.totalUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-md border border-green-200 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-semibold text-green-900 mb-2">Verified Users</h3>
              <p className="text-3xl font-bold text-green-600">{stats.verifiedUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl shadow-md border border-purple-200 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-semibold text-purple-900 mb-2">New Users (30d)</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.newUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl shadow-md border border-amber-200 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-semibold text-amber-900 mb-2">Active Users (7d)</h3>
              <p className="text-3xl font-bold text-amber-600">{stats.activeUsers}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl mb-6 border border-indigo-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-indigo-900">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Start Date</label>
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
              <label className="block text-sm font-medium mb-2 text-gray-700">End Date</label>
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
              className="p-3 w-full bg-white text-gray-800 border border-indigo-200 rounded-lg pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
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
            {/* Users Count */}
            <div className="mb-4 text-gray-700 font-medium">
              {filteredUsers.length} user(s) found
            </div>

            {/* Users Table */}
            {filteredUsers.length > 0 ? (
              <>
                <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                  <table className="w-full bg-white text-sm md:text-base">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Last Login</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentUsers.map((user, index) => (
                        <tr key={user._id} className={`hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}`}>
                          <td className="px-4 py-3 text-gray-900">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-900">{user.name || 'Unknown'}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{user.email || 'Unknown'}</td>
                          <td className="px-4 py-3">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-4 py-3">
                            {getVerificationBadge(user.isVerified)}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {formatDate(user.lastLogin)}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {formatDate(user.createdAt)}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-gray-700 font-medium">No users found. Try adjusting your search.</p>
              </div>
            )}
          </>
        )}
      </div>
  );
};

export default AdminTeacherLog;

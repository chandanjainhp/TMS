import React, { useState, useEffect } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import { format } from "date-fns";
import { useAuthStore } from "../../store/authStore";

const TeacherStatus = () => {
  const { isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Fetch users
        const response = await axios.get('http://localhost:5000/api/users', {
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

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

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

  // Get verification status badge
  const getVerificationBadge = (isVerified) => {
    return isVerified ?
      <span className="px-2 py-1 rounded text-xs bg-green-600">Verified</span> :
      <span className="px-2 py-1 rounded text-xs bg-red-600">Not Verified</span>;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card className="max-w-6xl mx-auto mt-8 shadow-lg bg-gray-800 text-white p-4 w-full">
        <CardContent className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-center text-white">User Management</h1>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-600 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-green-600 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Verified Users</h3>
                <p className="text-3xl font-bold">{stats.verifiedUsers}</p>
              </div>
              <div className="bg-purple-600 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">New Users (30d)</h3>
                <p className="text-3xl font-bold">{stats.newUsers}</p>
              </div>
              <div className="bg-yellow-600 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Active Users (7d)</h3>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-6 bg-gray-700 p-4 rounded-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 w-full bg-gray-600 text-white border border-gray-500 rounded pl-10"
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
              {/* Users Count */}
              <div className="mb-4 text-gray-300">
                {filteredUsers.length} user(s) found
              </div>

              {/* Users Table */}
              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-600 text-white text-sm md:text-base">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-2 border border-gray-600">#</th>
                        <th className="p-2 border border-gray-600">Name</th>
                        <th className="p-2 border border-gray-600">Email</th>
                        <th className="p-2 border border-gray-600">Status</th>
                        <th className="p-2 border border-gray-600">Last Login</th>
                        <th className="p-2 border border-gray-600">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={user._id} className="bg-gray-900 hover:bg-gray-800">
                          <td className="p-2 border border-gray-600">{index + 1}</td>
                          <td className="p-2 border border-gray-600">
                            <div className="font-semibold">{user.name || 'Unknown'}</div>
                          </td>
                          <td className="p-2 border border-gray-600">{user.email || 'Unknown'}</td>
                          <td className="p-2 border border-gray-600">
                            {getVerificationBadge(user.isVerified)}
                          </td>
                          <td className="p-2 border border-gray-600">
                            {formatDate(user.lastLogin)}
                          </td>
                          <td className="p-2 border border-gray-600">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-700 p-8 rounded-lg text-center">
                  No users found. Try adjusting your search.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default TeacherStatus;


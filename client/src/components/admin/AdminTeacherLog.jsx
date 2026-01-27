import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Search, Plus, Calendar, Filter, Download, UserCheck, UserPlus, Users, Activity } from 'lucide-react';

// DatePicker component
const DatePicker = ({ value, onChange }) => (
  <input
    type="date"
    value={value ? format(value, 'yyyy-MM-dd') : ''}
    onChange={(e) => onChange(new Date(e.target.value))}
    className="w-full p-2 bg-white text-gray-800 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
  />
);

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [addEmailLoading, setAddEmailLoading] = useState(false);
  const [addEmailMessage, setAddEmailMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const params = {};
        if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
        if (endDate) params.endDate = format(endDate, 'yyyy-MM-dd');

        const response = await axios.get('http://localhost:5000/api/users', { params, withCredentials: true });

        if (response.data.success) {
          setUsers(response.data.data);
          setError(null);
          const statsResponse = await axios.get('http://localhost:5000/api/users/stats', { withCredentials: true });
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

  const handleAddEmail = async (e) => {
    e.preventDefault();
    setAddEmailLoading(true);
    setAddEmailMessage(null);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/allowed-emails/add',
        { email: newEmail },
        { withCredentials: true }
      );
      setAddEmailMessage({ type: 'success', text: response.data.message });
      setNewEmail('');
      setTimeout(() => {
        setIsModalOpen(false);
        setAddEmailMessage(null);
      }, 2000);
    } catch (err) {
      setAddEmailMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add email'
      });
    } finally {
      setAddEmailLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const userName = user.name || '';
    const userEmail = user.email || '';
    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      {/* Header & Actions - Super Compact */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Teacher Registry</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold shadow-sm transition-all text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Allowed Teacher
        </button>
      </div>

      {/* Stats Overview - Compact Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total Users</p>
              <p className="text-xl font-bold text-gray-900 leading-tight">{stats.totalUsers}</p>
            </div>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Verified</p>
              <p className="text-xl font-bold text-green-600 leading-tight">{stats.verifiedUsers}</p>
            </div>
            <div className="p-1.5 bg-green-50 text-green-600 rounded">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">New (30d)</p>
              <p className="text-xl font-bold text-purple-600 leading-tight">{stats.newUsers}</p>
            </div>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded">
              <UserPlus className="h-4 w-4" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Active (7d)</p>
              <p className="text-xl font-bold text-amber-600 leading-tight">{stats.activeUsers}</p>
            </div>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
              <Activity className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Filters Bar - Compact */}
        <div className="p-3 border-b border-gray-200 bg-gray-50/50 flex flex-col lg:flex-row gap-2 justify-between items-center">
          <div className="relative flex-1 w-full lg:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            <input
              type="date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs"
            />
            <input
              type="date"
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs"
            />
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 text-xs whitespace-nowrap">
              <Filter className="h-3 w-3" /> Filters
            </button>
          </div>
        </div>

        {/* Table - Dense */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-xs text-gray-500">Loading records...</td></tr>
              ) : currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">{user.name || 'Unknown User'}</p>
                        <p className="text-[10px] text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'teacher' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <UserCheck className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && currentUsers.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-xs">
              No users found matching your search.
            </div>
          )}
        </div>

        {/* Pagination - Compact */}
        <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 rounded text-[10px] font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 rounded text-[10px] font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 text-white">
              <h3 className="text-xl font-bold">Allow Teacher Signup</h3>
              <p className="text-slate-300 text-sm mt-1">Whitelist an email address for new teacher registration.</p>
            </div>

            <form onSubmit={handleAddEmail} className="p-6">
              {addEmailMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${addEmailMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                  {addEmailMessage.text}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teacher Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. teacher@university.edu"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addEmailLoading}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {addEmailLoading ? "Adding..." : "Allow Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherLog;

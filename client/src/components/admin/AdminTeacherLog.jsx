import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Search, Plus, Filter, UserCheck, UserPlus, Users, Activity, X, Loader2 } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';

const AdminTeacherLog = () => {
  const { admin } = useAdminAuthStore();
  const [startDate, setStartDate]         = useState(null);
  const [endDate, setEndDate]             = useState(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const [users, setUsers]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [stats, setStats]                 = useState(null);
  const [currentPage, setCurrentPage]     = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [newEmail, setNewEmail]               = useState('');
  const [selectedBranch, setSelectedBranch]   = useState('');
  const [branches, setBranches]               = useState([]);
  const [addEmailLoading, setAddEmailLoading] = useState(false);
  const [addEmailMessage, setAddEmailMessage] = useState(null);

  const isHOD = admin?.department && admin.department !== 'Global';

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get('/api/branches', { withCredentials: true });
      if (res.data.success) setBranches(res.data.data.map(b => b.name));
    } catch {
      setBranches(['BCA', 'PMCS', 'PME', 'PCM', 'B.Com', 'B.Sc', 'B.A', 'B.B.A', 'MCA', 'M.Sc', 'M.Com']);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const params = {};
        if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
        if (endDate)   params.endDate   = format(endDate, 'yyyy-MM-dd');

        const response = await axios.get('/api/users', { params, withCredentials: true });
        if (response.data.success) {
          setUsers(response.data.data);
          setError(null);
          const statsResponse = await axios.get('/api/users/stats', { withCredentials: true });
          if (statsResponse.data.success) setStats(statsResponse.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [startDate, endDate]);

  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!isHOD && !selectedBranch) {
      setAddEmailMessage({ type: 'error', text: 'Please select a branch' });
      return;
    }
    setAddEmailLoading(true);
    setAddEmailMessage(null);
    try {
      const response = await axios.post(
        '/api/allowed-emails/add',
        { email: newEmail, department: isHOD ? admin.department : selectedBranch },
        { withCredentials: true }
      );
      setAddEmailMessage({ type: 'success', text: response.data.message });
      setNewEmail('');
      setSelectedBranch('');
      setTimeout(() => { setIsModalOpen(false); setAddEmailMessage(null); }, 2000);
    } catch (err) {
      setAddEmailMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add email' });
    } finally {
      setAddEmailLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const name  = user.name  || '';
    const email = user.email || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const totalPages   = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const STAT_CARDS = [
    { label: 'Total Users', value: stats?.totalUsers,    icon: Users,     color: '#0075de', bg: '#f2f9ff'  },
    { label: 'Verified',    value: stats?.verifiedUsers, icon: UserCheck, color: '#1aae39', bg: '#f0fdf4'  },
    { label: 'New (30d)',   value: stats?.newUsers,      icon: UserPlus,  color: '#391c57', bg: '#f5f0ff'  },
    { label: 'Active (7d)', value: stats?.activeUsers,   icon: Activity,  color: '#dd5b00', bg: '#fff7ed'  },
  ];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">
            Teacher Registry
          </h1>
          {isHOD && (
            <span className="notion-badge mt-1">
              {admin.department} Department
            </span>
          )}
        </div>
        <button
          onClick={() => { setIsModalOpen(true); if (isHOD) setSelectedBranch(admin.department); }}
          className="notion-btn-primary gap-1.5 text-[13px]"
        >
          <Plus size={14} />
          Allow Teacher
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">
                  {label}
                </p>
                <p className="mt-1 text-[22px] font-bold leading-none text-[rgba(0,0,0,0.95)]">
                  {value ?? '—'}
                </p>
              </div>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: bg, color }}
              >
                <Icon size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">

        {/* Filters */}
        <div className="flex flex-col gap-2 border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a39e98]" />
            <input
              type="text"
              placeholder="Search users…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded border border-[rgba(0,0,0,0.1)] bg-white py-1.5 pl-8 pr-3 text-xs text-[rgba(0,0,0,0.95)] outline-none placeholder:text-[#a39e98] focus:border-[#097fe8]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            <input
              type="date"
              onChange={e => setStartDate(new Date(e.target.value))}
              className="rounded border border-[rgba(0,0,0,0.1)] bg-white px-2 py-1.5 text-xs text-[rgba(0,0,0,0.95)] outline-none focus:border-[#097fe8]"
            />
            <input
              type="date"
              onChange={e => setEndDate(new Date(e.target.value))}
              className="rounded border border-[rgba(0,0,0,0.1)] bg-white px-2 py-1.5 text-xs text-[rgba(0,0,0,0.95)] outline-none focus:border-[#097fe8]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.08)] bg-[#f6f5f4]">
                {['User', 'Role', 'Dept', 'Status', 'Last Active', 'Joined'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.125px] text-[#615d59]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#097fe8]" />
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-sm text-[#615d59]">
                    No users found.
                  </td>
                </tr>
              ) : (
                currentUsers.map(user => (
                  <tr key={user._id} className="transition-colors hover:bg-[#f6f5f4]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f2f9ff] text-[11px] font-bold text-[#097fe8]">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[rgba(0,0,0,0.95)]">
                            {user.name || 'Unknown'}
                          </p>
                          <p className="truncate text-[10px] text-[#a39e98]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        user.role === 'admin'
                          ? 'bg-[#f5f0ff] text-[#391c57]'
                          : 'bg-[#f2f9ff] text-[#097fe8]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#615d59]">
                      {user.department || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded bg-[#f0fdf4] px-1.5 py-0.5 text-[10px] font-bold text-[#1aae39]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1aae39]" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-[#fff7ed] px-1.5 py-0.5 text-[10px] font-bold text-[#dd5b00]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#dd5b00]" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-[#615d59]">{formatDate(user.lastLogin)}</td>
                    <td className="px-4 py-3 text-[11px] text-[#615d59]">{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.08)] px-4 py-2.5">
          <span className="text-[10px] text-[#a39e98]">
            {filteredUsers.length === 0
              ? 'No results'
              : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, filteredUsers.length)} of ${filteredUsers.length}`}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-[rgba(0,0,0,0.1)] px-2.5 py-1 text-[10px] font-medium text-[rgba(0,0,0,0.95)] transition-colors hover:bg-[#f6f5f4] disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="rounded border border-[rgba(0,0,0,0.1)] px-2.5 py-1 text-[10px] font-medium text-[rgba(0,0,0,0.95)] transition-colors hover:bg-[#f6f5f4] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.05)_0px_23px_52px]">

            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-[rgba(0,0,0,0.95)]">Allow Teacher Signup</h3>
                <p className="mt-0.5 text-xs text-[#615d59]">Whitelist an email for new teacher registration.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded border border-[rgba(0,0,0,0.1)] p-1 text-[#a39e98] transition-colors hover:bg-white hover:text-[rgba(0,0,0,0.95)]"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAddEmail} className="space-y-4 p-6">
              {addEmailMessage && (
                <div className={`rounded-lg p-3 text-xs font-medium ${
                  addEmailMessage.type === 'success'
                    ? 'bg-[#f0fdf4] text-[#1aae39]'
                    : 'bg-[#fff5f0] text-[#dd5b00]'
                }`}>
                  {addEmailMessage.text}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">
                  Teacher Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="teacher@university.edu"
                  className="w-full rounded border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 text-sm text-[rgba(0,0,0,0.95)] outline-none placeholder:text-[#a39e98] focus:border-[#097fe8]"
                />
              </div>

              {!isHOD ? (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">
                    Department / Branch
                  </label>
                  <select
                    required
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                    className="w-full rounded border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 text-sm text-[rgba(0,0,0,0.95)] outline-none focus:border-[#097fe8]"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              ) : (
                <div className="rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-3 text-xs text-[#615d59]">
                  Assigned to: <span className="font-bold text-[rgba(0,0,0,0.95)]">{admin.department}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-[rgba(0,0,0,0.08)] pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="notion-btn-secondary text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addEmailLoading}
                  className="notion-btn-primary min-w-[110px] text-[13px] disabled:opacity-60"
                >
                  {addEmailLoading
                    ? <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    : 'Allow Email'
                  }
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

import AdminLayout from '../components/admin/AdminLayout';
import { useAuthStore } from '../store/authStore';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { Shield, User, Mail, CheckCircle, XCircle, FileText, Users, Plus, Building2, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  // Determine which store to use (legacy support)
  const { user } = useAuthStore();
  const { admin } = useAdminAuthStore();
  const currentUser = admin || user;

  const [instructors, setInstructors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInstructor, setNewInstructor] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await axios.get('/api/teacher/list');
      if (res.data.success) {
        setInstructors(res.data.teachers);
      }
    } catch (error) {
      console.error("Failed to fetch instructors");
    }
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/api/teacher/create', newInstructor);
      if (res.data.success) {
        toast.success("Instructor added successfully");
        setNewInstructor({ name: '', email: '', password: '' });
        setShowAddModal(false);
        fetchInstructors();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add instructor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 w-full p-6">

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Department of {currentUser?.department || 'General'}</h1>
              <p className="text-sm text-gray-500 font-medium">Head of Department: {currentUser?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
              <span className="block text-xs text-indigo-600 font-bold uppercase tracking-wider">Total Faculty</span>
              <span className="text-2xl font-bold text-indigo-900">{instructors.length}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Faculty Management Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Department Faculty
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus className="w-4 h-4" /> Add Instructor
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {instructors.length > 0 ? (
                      instructors.map((teacher) => (
                        <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                              {teacher.name.charAt(0)}
                            </div>
                            {teacher.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{teacher.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                              ACTIVE
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400 text-sm">
                          No instructors found. Add one to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Access Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/admin/records" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 group">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Academic Ledger</p>
                    <p className="text-xs text-gray-500">View Student Marks</p>
                  </div>
                </Link>
                <Link to="/admin/settings" className="group relative overflow-hidden rounded-lg bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="h-8 w-8 rounded bg-slate-600 text-white flex items-center justify-center mb-2 shadow-sm">
                        <Settings className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-slate-600 transition-colors">Settings</h3>
                      <p className="text-gray-500 text-xs leading-snug mb-2 max-w-[200px]">System configuration.</p>
                      <span className="inline-flex items-center font-semibold text-slate-600 text-xs">
                        Open <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="cursor-not-allowed group relative overflow-hidden rounded-lg bg-gray-50 p-4 border border-gray-100 shadow-sm opacity-70">
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-gray-100 transition-colors"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="h-8 w-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Calendar</h3>
                      <p className="text-gray-500 text-xs leading-snug mb-2">Schedule events.</p>
                      <span className="inline-flex items-center font-bold text-indigo-400 text-[10px] uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>

                <Link to="/admin/records" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 group text-left">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Approve Marks</p>
                    <p className="text-xs text-gray-500">View All Records</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Add Instructor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900">Add New Instructor</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddInstructor} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Dr. John Doe"
                    required
                    value={newInstructor.name}
                    onChange={e => setNewInstructor({ ...newInstructor, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@college.edu"
                    required
                    value={newInstructor.email}
                    onChange={e => setNewInstructor({ ...newInstructor, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Default Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                    value={newInstructor.password}
                    onChange={e => setNewInstructor({ ...newInstructor, password: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Adding...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;

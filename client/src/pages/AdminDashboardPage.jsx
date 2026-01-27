import AdminLayout from '../components/admin/AdminLayout';
import { useAuthStore } from '../store/authStore';
import { Shield, User, Mail, CheckCircle, XCircle, FileText, Users, MessageSquare, Calendar as CalendarIcon, BarChart2, Book, Settings } from 'lucide-react';
import Calendar from '../components/common/Calendar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 w-full">
        {/* Header Section - Super Compact */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-xs text-gray-500">Overview</p>
          </div>
        </div>

        <main className="px-4 py-4 w-full">

          {/* View Switcher */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button onClick={() => setActiveView('dashboard')} className={`pb-2 px-1 font-medium text-sm transition-colors ${activeView === 'dashboard' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}>
              Dashboard
            </button>
            <button disabled className="pb-2 px-1 font-medium text-sm text-gray-400 cursor-not-allowed flex items-center gap-1">
              Calendar <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded font-bold">SOON</span>
            </button>
          </div>

          {activeView === 'dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* User Profile Section - Compact */}
              <div className="lg:col-span-1 space-y-4">
                <section>
                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 border-b border-gray-50 pb-2">
                      <User className="h-4 w-4 text-indigo-600" />
                      Profile
                    </h2>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{user?.name}</h3>
                        <p className="text-gray-500 flex items-center gap-1 text-xs">
                          <Mail className="h-3 w-3" />
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Role</span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold border border-indigo-100 uppercase tracking-wide">
                          {user?.role}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Status</span>
                        {user?.isVerified ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-bold border border-green-100">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 rounded text-[10px] font-bold border border-red-100">
                            <XCircle className="h-3 w-3" /> Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Quick Actions / Stats area - Compact Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Link to="/admin/records" className="group relative overflow-hidden rounded-lg bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors"></div>
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <div className="h-8 w-8 rounded bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-sm">
                          <FileText className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Student Records</h3>
                        <p className="text-gray-500 text-xs leading-snug mb-2 max-w-[200px]">Manage assessment records.</p>
                        <span className="inline-flex items-center font-semibold text-indigo-600 text-xs">
                          Open <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>

                  <Link to="/admin/teacher-log" className="group relative overflow-hidden rounded-lg bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-fuchsia-50 group-hover:bg-fuchsia-100 transition-colors"></div>
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <div className="h-8 w-8 rounded bg-fuchsia-600 text-white flex items-center justify-center mb-2 shadow-sm">
                          <Users className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-fuchsia-600 transition-colors">Teacher Management</h3>
                        <p className="text-gray-500 text-xs leading-snug mb-2 max-w-[200px]">View logs & access.</p>
                        <span className="inline-flex items-center font-semibold text-fuchsia-600 text-xs">
                          Open <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>

                  <Link to="/admin/analytics" className="group relative overflow-hidden rounded-lg bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors"></div>
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <div className="h-8 w-8 rounded bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">Analytics</h3>
                        <p className="text-gray-500 text-xs leading-snug mb-2 max-w-[200px]">View reports & stats.</p>
                        <span className="inline-flex items-center font-semibold text-emerald-600 text-xs">
                          Open <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>

                  <Link to="/admin/subjects" className="group relative overflow-hidden rounded-lg bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors"></div>
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <div className="h-8 w-8 rounded bg-blue-600 text-white flex items-center justify-center mb-2 shadow-sm">
                          <Book className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Manage Subjects</h3>
                        <p className="text-gray-500 text-xs leading-snug mb-2 max-w-[200px]">Update curriculum subjects.</p>
                        <span className="inline-flex items-center font-semibold text-blue-600 text-xs">
                          Open <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </div>
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
                        <div className="h-8 w-8 rounded bg-gray-200 text-gray-500 flex items-center justify-center mb-2 shadow-sm">
                          <CalendarIcon className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Calendar</h3>
                        <p className="text-gray-400 text-xs leading-snug mb-2 max-w-[200px]">Manage schedules.</p>
                        <span className="inline-flex items-center font-bold text-gray-400 text-xs bg-gray-200 px-2 py-0.5 rounded">
                          COMING SOON
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Calendar />
          )}
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;

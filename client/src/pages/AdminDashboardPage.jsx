import AdminLayout from '../components/admin/AdminLayout';
import { useAuthStore } from '../store/authStore';

const AdminDashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <AdminLayout>
      <div className="flex flex-col relative z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-y-auto">
        {/* Scrollable content area */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h2>

                {/* User Info */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl mb-8 w-full border border-indigo-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-gray-700">
                        <span className="font-semibold text-indigo-900">Name:</span> 
                        <span className="ml-2">{user?.name || 'N/A'}</span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold text-indigo-900">Email:</span> 
                        <span className="ml-2">{user?.email || 'N/A'}</span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-700">
                        <span className="font-semibold text-indigo-900">Role:</span> 
                        <span className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-medium">
                          {user?.role || 'N/A'}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold text-indigo-900">Verified:</span> 
                        <span className="ml-2">
                          {user?.isVerified ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                              ✓ Yes
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200">
                              ✗ No
                            </span>
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-xl shadow-md border border-indigo-200 hover:shadow-xl transition-all transform hover:scale-105">
                    <div className="flex items-start mb-4">
                      <svg className="w-8 h-8 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">Admin Records</h3>
                        <p className="text-gray-700">View and manage uploaded student assessment records</p>
                      </div>
                    </div>
                    <a 
                      href="/admin/records" 
                      className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      Go to Records
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>

                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-xl shadow-md border border-purple-200 hover:shadow-xl transition-all transform hover:scale-105">
                    <div className="flex items-start mb-4">
                      <svg className="w-8 h-8 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div>
                        <h3 className="text-xl font-bold text-purple-900 mb-2">Teacher Log</h3>
                        <p className="text-gray-700">View teacher activity logs and user statistics</p>
                      </div>
                    </div>
                    <a 
                      href="/admin/teacher-log" 
                      className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      Go to Teacher Log
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;

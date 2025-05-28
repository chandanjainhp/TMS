import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useAuthStore } from '../store/authStore';

const AdminDashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <AdminLayout>
      <div className="h-screen flex flex-col relative z-10 bg-white">
        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8 mt-16 text-gray-800">
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Admin Dashboard</h2>

                {/* User Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 w-full border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">User Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-700"><span className="font-semibold">Name:</span> {user?.name || 'N/A'}</p>
                      <p className="text-gray-700"><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-700"><span className="font-semibold">Role:</span> {user?.role || 'N/A'}</p>
                      <p className="text-gray-700"><span className="font-semibold">Verified:</span> {user?.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="bg-indigo-100 p-4 rounded-lg shadow-md border border-indigo-200">
                    <h3 className="text-lg font-semibold text-indigo-800">Admin Records</h3>
                    <p className="text-gray-700 mt-2">View and manage uploaded records</p>
                    <a href="/admin/records" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Go to Records
                    </a>
                  </div>

                  <div className="bg-indigo-100 p-4 rounded-lg shadow-md border border-indigo-200">
                    <h3 className="text-lg font-semibold text-indigo-800">Teacher Log</h3>
                    <p className="text-gray-700 mt-2">View teacher activity logs</p>
                    <a href="/admin/teacher-log" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Go to Teacher Log
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

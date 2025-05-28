import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminTeacherLog from '../components/admin/AdminTeacherLog';

const AdminTeacherLogPage = () => {
  return (
    <AdminLayout>
      <div className="h-screen flex flex-col relative z-10 bg-white">
        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8 text-gray-800">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
              <AdminTeacherLog />
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminTeacherLogPage;

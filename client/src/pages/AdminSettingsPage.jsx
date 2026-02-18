import AdminLayout from "../components/admin/AdminLayout";
import TeacherProfileDisplay from "../components/settings/TeacherProfileDisplay";
import ChangePassword from "../components/settings/ChangePassword";
import { useAuthStore } from "../store/authStore";
import { useAdminAuthStore } from "../store/adminAuthStore";

const AdminSettingsPage = () => {
  const { user } = useAuthStore();
  const { admin } = useAdminAuthStore();
  const currentUser = admin || user;

  return (
    <AdminLayout>
      <div className="w-full px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Settings
          </h1>
          <p className="text-xs text-gray-500">Manage profile and security.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Profile Section */}
          <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 pb-2 border-b border-gray-50">
              <svg className="w-4 h-4 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <h2 className="text-sm font-bold text-gray-900">Profile Information</h2>
            </div>
            <TeacherProfileDisplay user={currentUser} />
          </section>

          {/* Change Password Section */}
          <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 pb-2 border-b border-gray-50">
              <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <h2 className="text-sm font-bold text-gray-900">Security</h2>
            </div>
            <ChangePassword />
          </section>

          {/* Admin Info Section */}
          <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 pb-2 border-b border-gray-50">
              <svg className="w-4 h-4 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h2 className="text-sm font-bold text-gray-900">Administrator Information</h2>
            </div>
            <div className="bg-amber-50/50 p-3 rounded border border-amber-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs mb-1">
                    {currentUser?.department ? `${currentUser.department} Admin` : 'Super Administrator'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>{currentUser?.department ? 'Department Access' : 'All Records Access'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>View Activity Logs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Manage Students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>System Config</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;

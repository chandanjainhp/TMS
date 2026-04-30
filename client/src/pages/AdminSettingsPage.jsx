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
      <div className="w-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-[rgba(0,0,0,0.95)]">
            Admin Settings
          </h1>
          <p className="text-xs text-[#615d59]">Manage profile and security.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Profile Section */}
          <section className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white p-4">
            <div className="mb-3 flex items-center border-b border-[rgba(0,0,0,0.1)] pb-2">
              <svg className="mr-2 h-4 w-4 text-[#097fe8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <h2 className="text-sm font-bold text-[rgba(0,0,0,0.95)]">Profile Information</h2>
            </div>
            <TeacherProfileDisplay user={currentUser} />
          </section>

          {/* Change Password Section */}
          <section className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white p-4">
            <div className="mb-3 flex items-center border-b border-[rgba(0,0,0,0.1)] pb-2">
              <svg className="mr-2 h-4 w-4 text-[#391c57]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <h2 className="text-sm font-bold text-[rgba(0,0,0,0.95)]">Security</h2>
            </div>
            <ChangePassword />
          </section>

          {/* Admin Info Section */}
          <section className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white p-4">
            <div className="mb-3 flex items-center border-b border-[rgba(0,0,0,0.1)] pb-2">
              <svg className="mr-2 h-4 w-4 text-[#dd5b00]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h2 className="text-sm font-bold text-[rgba(0,0,0,0.95)]">Administrator Information</h2>
            </div>
            <div className="rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-[#dd5b00] text-white shadow-sm">
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

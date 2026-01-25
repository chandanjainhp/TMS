import TeacherProfileDisplay from "../components/settings/TeacherProfileDisplay";
import ChangePassword from "../components/settings/ChangePassword";


const SettingsPage = () => {
  return (
    <div className="flex-1 overflow-hidden relative z-10 bg-white min-h-screen">
      <main className="max-w-7xl mx-auto py-6 px-6 lg:px-8 h-[100vh] overflow-y-auto pt-20">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Settings</h1>
          <p className="text-gray-500">Manage your profile and account settings from one place.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Profile Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            </div>
            <div className="pl-0">
              <TeacherProfileDisplay />
            </div>
          </div>

          {/* Change Password Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Security & Password</h2>
            </div>
            <div className="pl-0">
              <ChangePassword />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

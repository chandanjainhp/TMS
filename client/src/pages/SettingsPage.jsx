import TeacherProfileDisplay from "../components/settings/TeacherProfileDisplay";
import ChangePassword from "../components/settings/ChangePassword";


const SettingsPage = () => {
  return (
    <div className="flex-1 overflow-hidden relative z-10 bg-slate-50 min-h-screen">
      <main className="w-full px-4 py-4">
        {/* Header */}
        <div className="mb-6 border-b border-gray-200 pb-3 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-0.5">Settings</h1>
          <p className="text-gray-500 text-xs">Manage your profile and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Profile Section */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full transition-all hover:shadow-md">
            <div className="flex items-center mb-4 pb-3 border-b border-gray-50">
              <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Profile Information</h2>
                <p className="text-xs text-gray-500">Your personal account details</p>
              </div>
            </div>
            <TeacherProfileDisplay />
          </section>

          {/* Change Password Section */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full transition-all hover:shadow-md">
            <div className="flex items-center mb-4 pb-3 border-b border-gray-50">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Security & Password</h2>
                <p className="text-xs text-gray-500">Update your login credentials</p>
              </div>
            </div>
            <ChangePassword />
          </section>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

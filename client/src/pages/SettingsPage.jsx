import TeacherProfileDisplay from "../components/settings/TeacherProfileDisplay";
import ChangePassword from "../components/settings/ChangePassword";
  

  const SettingsPage = () => {
    return (
      <div className="flex-1 overflow-hidden relative z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        <main className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-4 lg:px-8 h-[100vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Settings</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your profile and account settings</p>
          </div>

          {/* Profile Section */}
          <div className="mb-4 sm:mb-6 bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-indigo-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Profile Information</h2>
            </div>
            <TeacherProfileDisplay />
          </div>
          
          {/* Change Password Section */}
          <div className="mb-4 sm:mb-6 bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-purple-100 hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Security</h2>
            </div>
            <ChangePassword />
          </div>
        </main>
      </div>
    );
  };

export default SettingsPage;



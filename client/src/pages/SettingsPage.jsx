import TeacherProfileDisplay from "../components/settings/TeacherProfileDisplay";
import ChangePassword from "../components/settings/ChangePassword";


const SettingsPage = () => {
  return (
    <div className="relative z-10 flex-1 overflow-hidden min-h-screen bg-[#f6f5f4]">
      <main className="w-full px-4 py-4">
        {/* Header */}
        <div className="mb-6 rounded-lg border border-[rgba(0,0,0,0.1)] bg-white p-4 pb-3 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
          <h1 className="mb-0.5 text-xl font-bold tracking-tight text-[rgba(0,0,0,0.95)]">Settings</h1>
          <p className="text-xs text-[#615d59]">Manage your profile and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Profile Section */}
          <section className="h-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5 transition-all">
            <div className="mb-4 flex items-center border-b border-[rgba(0,0,0,0.1)] pb-3">
              <div className="mr-3 rounded-lg bg-[#f2f9ff] p-2">
                <svg className="h-5 w-5 text-[#097fe8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-[rgba(0,0,0,0.95)]">Profile Information</h2>
                <p className="text-xs text-[#615d59]">Your personal account details</p>
              </div>
            </div>
            <TeacherProfileDisplay />
          </section>

          {/* Change Password Section */}
          <section className="h-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5 transition-all">
            <div className="mb-4 flex items-center border-b border-[rgba(0,0,0,0.1)] pb-3">
              <div className="mr-3 rounded-lg bg-[#f6f5f4] p-2">
                <svg className="h-5 w-5 text-[#391c57]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-[rgba(0,0,0,0.95)]">Security & Password</h2>
                <p className="text-xs text-[#615d59]">Update your login credentials</p>
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

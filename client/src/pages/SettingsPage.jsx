import TeacherProfileDisplay from "../components/settings/TeacherProfileDisplay";
import ChangePassword from "../components/settings/ChangePassword";
import Header from "../components/common/Header";
  

  const SettingsPage = () => {
    return (
      <div className="flex-1 overflow-hidden relative z-10 bg-indigo-50 text-gray-800">
        <Header />
        <main className="max-w-7xl mt-16 mx-auto py-6 px-4 lg:px-8 h-[100vh] overflow-y-auto bg-white rounded-lg shadow-md">
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <TeacherProfileDisplay />
          </div>
          
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <ChangePassword />
          </div>
        </main>
      </div>
    );
  };

export default SettingsPage;



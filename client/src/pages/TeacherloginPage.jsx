import Header from '../components/common/Header';
import Teacherlog from '../components/teacherlog/Teacherlog';
const TeacherloginPage = () => {

return (
  <div className="h-screen flex flex-col relative z-10 bg-indigo-50">
    {/* Fixed header */}
    <Header />
    
    {/* Scrollable content area */}
    <main className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8 mt-16 text-gray-800">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
           <Teacherlog/>
        </div>
      </div>
    </main>
  </div>
);
};
export default TeacherloginPage;

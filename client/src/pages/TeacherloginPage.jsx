import Teacherlog from '../components/teacherlog/Teacherlog';
const TeacherloginPage = () => {

return (
  <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col bg-[#f6f5f4]">
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1200px] px-4 py-6 text-gray-800">
        <div className="flex flex-col items-center rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-6 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
           <Teacherlog/>
        </div>
      </div>
    </main>
  </div>
);
};
export default TeacherloginPage;

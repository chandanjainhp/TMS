import Teachertable from '../components/teacher/Teachertable';
const TeacherListPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#f6f5f4]">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 text-gray-800 bg-white rounded border border-[rgba(0,0,0,0.1)] shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <div
          style={{
            backgroundColor: '#f6f5f4',
            color: '#37352F',
            minHeight: '100vh',
            padding: '24px',
          }}
          className="flex flex-col items-center"
        >



          
          <Teachertable />
        </div>
      </main>
    </div>
  );
};

export default TeacherListPage;

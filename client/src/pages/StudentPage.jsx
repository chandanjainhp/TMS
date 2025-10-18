import StudentData from '../components/student/StudentData';

const StudentPage = () => {
  return (
    <div className="h-screen flex flex-col relative z-10 bg-indigo-50">
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8 text-[#FFFFFF]">
          <div
            style={{
              backgroundColor: '#34495E',
              color: '#FFFFFF',
              minHeight: 'calc(100vh - 96px)', // Adjust for header height
              padding: '24px',
            }}
            className="flex flex-col items-center"
          >
            <StudentData />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPage;
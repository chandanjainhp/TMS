import StudentData from '../components/student/StudentData';

const StudentPage = () => {
  return (
    <div className="h-screen flex flex-col relative z-10 bg-[#f6f5f4]">
      <main className="flex-1 overflow-y-auto bg-white rounded border border-[rgba(0,0,0,0.1)] shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <div
            style={{
              backgroundColor: '#f6f5f4',
              color: '#37352F',
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

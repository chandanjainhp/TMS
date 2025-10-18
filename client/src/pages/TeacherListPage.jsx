import Teachertable from '../components/teacher/Teachertable';
const TeacherListPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-indigo-50">
      {/* Background color: Slate Gray */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 text-gray-800 bg-white rounded-lg shadow-md">
        {/* Text color: White */}
        <div
          style={{
            backgroundColor: '#34495E',
            color: '#FFFFFF',
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

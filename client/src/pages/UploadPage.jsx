import DepartmentUploadForm from '../components/from/DepartmentUploadForm.jsx';

const UploadPage = () => {
  return (
    <div className="h-screen flex flex-col relative z-10 bg-white">
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <div>
            <DepartmentUploadForm/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
import DepartmentUploadForm from '../components/from/DepartmentUploadForm.jsx';

const UploadPage = () => {
  return (
    <div className="relative z-10 flex h-screen flex-col bg-[#f6f5f4]">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
            <DepartmentUploadForm/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;

import Header from '../components/common/Header';
import FormDataViewer from '../components/form/FormDataViewer';

const FormDataPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-indigo-50 h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 mt-16 text-gray-800 h-[calc(100vh-64px)] overflow-auto bg-white rounded-lg shadow-md">
        <FormDataViewer />
      </main>
    </div>
  );
};

export default FormDataPage;

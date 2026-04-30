import FormDataViewer from '../components/form/FormDataViewer';

const FormDataPage = () => {
  return (
    <div className="relative z-10 flex-1 overflow-y-auto bg-[#f6f5f4] p-4">
      <div className="mx-auto max-w-[1200px] rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <FormDataViewer />
      </div>
    </div>
  );
};

export default FormDataPage;

import  EditingStudentData from '../components/editing/EditingStudentData';

const EditingPage = () => {
  return (
    <div className="h-screen flex flex-col relative z-10 bg-[#34495E]">
      {/* Scrollable content area */}
  
            <EditingStudentData/>
     
    </div>
  );
};

export default EditingPage;

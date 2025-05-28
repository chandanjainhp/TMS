import  EditingStudentData from '../components/editing/EditingStudentData';
import Header from '../components/common/Header';

const EditingPage = () => {
  return (
    <div className="h-screen flex flex-col relative z-10 bg-[#34495E]">
      {/* Fixed header */}
      <Header />
      
      {/* Scrollable content area */}
  
            <EditingStudentData/>
     
    </div>
  );
};

export default EditingPage;

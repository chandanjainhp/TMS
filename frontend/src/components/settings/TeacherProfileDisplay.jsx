import React from 'react';

const TeacherProfileDisplay = ({ teacher, onEdit }) => {
  return (
    <div className="p-6 max-w-md mx-auto bg-[#34495E] rounded-lg shadow-lg"> {/* Background color (Slate Gray) */}
      <h2 className="text-2xl font-bold mb-4 text-[#ECF0F1]">Teacher Profile</h2> {/* Text color (Light Gray) */}
      <div className="mb-4">
        <p className="text-lg font-semibold text-[#ECF0F1]">Name: {teacher.name}</p> {/* Text color (Light Gray) */}
        <p className="text-lg text-[#ECF0F1]">Department: {teacher.department}</p> {/* Text color (Light Gray) */}
        <p className="text-lg text-[#ECF0F1]">Email: {teacher.email}</p> {/* Text color (Light Gray) */}
        <p className="text-lg text-[#ECF0F1]">Phone: {teacher.phone}</p> {/* Text color (Light Gray) */}
      </div>
      {/* Button to switch to edit mode */}
      <button
        onClick={onEdit}
        className="mt-4 px-4 py-2 bg-[#2C3E50] text-[#FFFFFF] rounded-md hover:bg-[#E74C3C] focus:ring-[#2C3E50] focus:ring-opacity-50"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default TeacherProfileDisplay;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import for prop types validation

const TeacherProfileEdit = ({ teacher, setTeacher, onSave }) => {
  const [errors, setErrors] = useState({});
  const [originalTeacher, setOriginalTeacher] = useState(teacher);

  useEffect(() => {
    // Update originalTeacher whenever the teacher prop changes
    setOriginalTeacher(teacher);
  }, [teacher]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacher(prevTeacher => ({ ...prevTeacher, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear errors when input changes
  };

  const validateFields = () => {
    const newErrors = {};
    if (!teacher.name.trim()) newErrors.name = 'Name is required.';
    if (!teacher.department.trim()) newErrors.department = 'Department is required.';
    if (!teacher.email.trim() || !/\S+@\S+\.\S+/.test(teacher.email))
      newErrors.email = 'Valid email is required.';
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSave();
    }
  };

  const handleDiscard = () => {
    setTeacher(originalTeacher); // Reset to original teacher data
    setErrors({}); // Optionally reset errors
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-[#34495E] rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-[#ECF0F1]">Edit Teacher Profile</h2>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#ECF0F1]">Name</label>
        <input
          type="text"
          name="name"
          className="w-full p-2 border border-[#2C3E50] rounded-md bg-[#ECF0F1] text-[#2C3E50]"
          value={teacher.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="text-sm text-[#E74C3C]">{errors.name}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#ECF0F1]">Department</label>
        <input
          type="text"
          name="department"
          className="w-full p-2 border border-[#2C3E50] rounded-md bg-[#ECF0F1] text-[#2C3E50]"
          value={teacher.department}
          onChange={handleInputChange}
        />
        {errors.department && <p className="text-sm text-[#E74C3C]">{errors.department}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#ECF0F1]">Email</label>
        <input
          type="email"
          name="email"
          className="w-full p-2 border border-[#2C3E50] rounded-md bg-[#ECF0F1] text-[#2C3E50]"
          value={teacher.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="text-sm text-[#E74C3C]">{errors.email}</p>}
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-[#2C3E50] text-[#FFFFFF] rounded-md hover:bg-lime-500 focus:ring-[#2C3E50] focus:ring-opacity-50"
        >
          Save Changes
        </button>
        <button
          onClick={handleDiscard}
          className="mt-4 px-4 py-2 bg-[#E74C3C] text-[#FFFFFF] rounded-md hover:bg-[#C0392B] focus:ring-[#E74C3C] focus:ring-opacity-50"
        >
          Discard Changes
        </button>
      </div>
    </div>
  );
};

TeacherProfileEdit.propTypes = {
  teacher: PropTypes.shape({
    name: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  setTeacher: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TeacherProfileEdit;

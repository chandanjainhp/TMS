import React, { useState } from 'react';

const TeacherProfileEdit = ({ teacher, setTeacher, onSave }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacher({ ...teacher, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear errors when input changes
  };

  const validateFields = () => {
    const newErrors = {};
    if (!teacher.name.trim()) newErrors.name = 'Name is required.';
    if (!teacher.department.trim()) newErrors.department = 'Department is required.';
    if (!teacher.email.trim() || !/\S+@\S+\.\S+/.test(teacher.email))
      newErrors.email = 'Valid email is required.';
    if (!teacher.phone.trim() || !/^\d{10}$/.test(teacher.phone))
      newErrors.phone = 'Valid 10-digit phone number is required.';
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
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#ECF0F1]">Phone</label>
        <input
          type="text"
          name="phone"
          className="w-full p-2 border border-[#2C3E50] rounded-md bg-[#ECF0F1] text-[#2C3E50]"
          value={teacher.phone}
          onChange={handleInputChange}
        />
        {errors.phone && <p className="text-sm text-[#E74C3C]">{errors.phone}</p>}
      </div>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-[#2C3E50] text-[#FFFFFF] rounded-md hover:bg-[#E74C3C]"
      >
        Save Changes
      </button>
    </div>
  );
};

export default TeacherProfileEdit;

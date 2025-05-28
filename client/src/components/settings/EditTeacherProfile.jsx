import { useState } from "react";

export default function EditTeacherProfile() {
  const [name, setName] = useState("Chandan Jain");
  const [department, setDepartment] = useState("Computer Science");
  const [contact, setContact] = useState("chandanjainhp@gmail.com");
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!department.trim()) newErrors.department = "Department is required";
    if (!contact.trim()) {
      newErrors.contact = "Contact is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      newErrors.contact = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      alert("Profile updated successfully!");
    }
  };

  const handleDiscard = () => {
    setName("Chandan Jain");
    setDepartment("Computer Science");
    setContact("chandanjainhp@gmail.com");
    setErrors({});
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Edit Teacher Profile</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Department:</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.department && <p className="text-red-400 text-sm">{errors.department}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Contact:</label>
        <input
          type="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.contact && <p className="text-red-400 text-sm">{errors.contact}</p>}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Save Changes
        </button>
        <button
          onClick={handleDiscard}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Discard
        </button>
      </div>
    </div>
  );
}

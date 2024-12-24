import React from 'react'; 
import { motion } from 'framer-motion'; 
import { useAuthStore } from '../../store/authStore'; 
import { formatDate } from "../../utils/date";

const TeacherProfileDisplay = ({ onEdit }) => { 
  const { user } = useAuthStore(); // Removed logout from here

  return (
    <div className="p-6 max-w-md mx-auto bg-[#34495E] rounded-lg shadow-lg"> 
      <motion.div
        className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#ECF0F1]">Teacher Profile</h2> 
        <div className="mb-4">
          <p className='text-gray-300'>Name: {user.name}</p>
          <p className='text-gray-300'>Email: {user.email}</p>
          <p className="text-lg text-[#ECF0F1]">Department: {user.department}</p> 
        </div>
        <h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
        <p className='text-gray-300'>
          <span className='font-bold'>Joined: </span>
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className='text-gray-300'>
          <span className='font-bold'>Last Login: </span>
          {formatDate(user.lastLogin)}
        </p>
      </motion.div>

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

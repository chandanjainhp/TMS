import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from "../../utils/date";

const TeacherProfileDisplay = () => { 
  const { user } = useAuthStore(); // Removed logout from here

  return (
    <div className="p-6 max-w-md mx-auto bg-[#34495E] rounded-lg shadow-lg"> 
      <motion.div
        className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#ECF0F1]">Details</h2> 
        <div className="mb-4">
          <p className='text-gray-300'>Name: {user.name}</p>
          <p className='text-gray-300'>Email: {user.email}</p>
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
    </div>
  );
};  

export default TeacherProfileDisplay;

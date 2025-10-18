import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from "../../utils/date";

const TeacherProfileDisplay = () => { 
  const { user } = useAuthStore(); // Removed logout from here

  return (
    <div className="max-w-2xl mx-auto"> 
      <motion.div
        className='p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl border-2 border-indigo-200'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-3 sm:mb-0 sm:mr-4 shadow-lg">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{user.name}</h3>
            <p className="text-sm sm:text-base text-gray-600 break-all">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-indigo-100">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-gray-700 text-sm sm:text-base">Account Created</span>
            </div>
            <p className='text-gray-600 text-sm sm:text-base'>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-gray-700 text-sm sm:text-base">Last Login</span>
            </div>
            <p className='text-gray-600 text-sm sm:text-base'>
              {formatDate(user.lastLogin)}
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-r-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium text-sm sm:text-base">Account Active & Verified</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};  

export default TeacherProfileDisplay;

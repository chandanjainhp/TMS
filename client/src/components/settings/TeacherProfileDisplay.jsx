import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from "../../utils/date";

const TeacherProfileDisplay = () => {
  const { user } = useAuthStore();

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-row items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-500 font-medium">{user.email}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
              Active Account
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Member Since</p>
            <p className="text-gray-900 font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Last Login</p>
            <p className="text-gray-900 font-medium">
              {formatDate(user.lastLogin)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherProfileDisplay;

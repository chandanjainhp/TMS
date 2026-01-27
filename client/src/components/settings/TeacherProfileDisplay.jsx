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
        className="flex flex-col md:flex-row gap-6 items-start"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-indigo-200">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500 font-medium">{user.email}</p>
            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide">
              <div className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></div>
              Active
            </div>
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-2 gap-3">
          <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Joined</p>
            <p className="text-sm text-gray-900 font-semibold">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Last Login</p>
            <p className="text-sm text-gray-900 font-semibold">
              {formatDate(user.lastLogin)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherProfileDisplay;

import { useState, useEffect } from "react";
import {  People, Settings, Menu } from "@mui/icons-material";
import ManIcon from '@mui/icons-material/Man';
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { PenBoxIcon, Database, FileText } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

// User sidebar items - available to all users
const USER_SIDEBAR_ITEMS = [
  {
    name: "Upload",
    icon: PenBoxIcon,
    color: "#4f46e5", // indigo-600 equivalent
    href: "/from",
  },

  {
    name: "Form Data",
    icon: FileText,
    color: "#4f46e5", // indigo-600 equivalent
    href: "/form-data",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "#4f46e5", // indigo-600 equivalent
    href: "/settings",
  },
];

// Admin sidebar items - only available to admin users
const ADMIN_SIDEBAR_ITEMS = [
  {
    name: "Admin Dashboard",
    icon: Settings,
    color: "#4f46e5", // indigo-600 equivalent
    href: "/admin",
  },
  {
    name: "Admin Records",
    icon: Database,
    color: "#4f46e5", // indigo-600 equivalent
    href: "/admin/records",
  },
  {
    name: "Teacher Log",
    icon: People,
    color: "#4f46e5", // indigo-600 equivalent
    href: "/admin/teacher-log",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  console.log('User role:', user?.role, 'isAdmin:', isAdmin);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine which sidebar items to show based on user role
  const sidebarItemsToShow = isAdmin
    ? ADMIN_SIDEBAR_ITEMS // Admin sees only admin items
    : USER_SIDEBAR_ITEMS; // Regular users only see user items

  console.log('Sidebar items for user:', sidebarItemsToShow);
  
  if (isMobile) {
    // In mobile view, limit the number of items to ensure they fit
    const mobileItemsLimit = 4; // Show maximum 4 items in mobile view
    const priorityItems = sidebarItemsToShow.slice(0, mobileItemsLimit);
    
    return (
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="grid h-full mx-auto font-medium grid-cols-4">
          {priorityItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => navigate(item.href)}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-indigo-50 group"
            >
              <item.icon style={{ color: item.color, fontSize: 20 }} className="w-5 h-5 mb-2 text-gray-500 group-hover:text-indigo-600" />
              <span className="text-sm text-gray-500 group-hover:text-indigo-600 truncate text-xs">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-white p-4 flex flex-col border-r border-gray-200 shadow-md">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-indigo-50 transition-colors max-w-fit text-indigo-600"
        >
          <Menu style={{ fontSize: 24 }} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {/* User Items Section */}
          <div className="mb-6">
            {sidebarItemsToShow.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors mb-2 text-gray-700 hover:text-indigo-600">
                  <item.icon style={{ color: item.color, fontSize: 20, minWidth: "20px" }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap text-gray-700"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </div>
          
          
    
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;

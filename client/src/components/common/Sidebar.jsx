import { useState, useEffect } from "react";
import {  People, Settings, Menu } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { PenBoxIcon, Database, FileText } from "lucide-react";
import { FaUserCircle } from 'react-icons/fa';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  console.log('User role:', user?.role, 'isAdmin:', isAdmin);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const handleMenuClick = (action) => {
    if (action === "logout") {
      handleLogout();
    } else if (action === "profile") {
      navigate('/settings');
    } else if (action === "dashboard") {
      navigate(isAdmin ? '/admin' : '/from');
    } else if (action === "admin-login") {
      navigate('/admin-login');
    }
    setUserMenuOpen(false);
  };

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
    const mobileItemsLimit = 4;
    const priorityItems = sidebarItemsToShow.slice(0, mobileItemsLimit);
    
    return (
      <>
        {/* Top user bar for mobile */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-indigo-600">TMS</div>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-50"
              >
                <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                <FaUserCircle className="text-indigo-600" size={24} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-[110]">
                  <button
                    onClick={() => handleMenuClick("profile")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => handleMenuClick("dashboard")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Dashboard
                  </button>
                  {!isAdmin && (
                    <button
                      onClick={() => handleMenuClick("admin-login")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      Admin Login
                    </button>
                  )}
                  <button
                    onClick={() => handleMenuClick("logout")}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom navigation for mobile */}
        <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-white border-t border-gray-200 shadow-lg">
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
      </>
    );
  }

  return (
    <motion.div
      className={`relative z-30 transition-all duration-300 ease-in-out flex-shrink-0 ${
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

        {/* User Menu at Bottom */}
        <div className="border-t border-gray-200 pt-4">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <FaUserCircle className="text-indigo-600" size={20} style={{ minWidth: "20px" }} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    className="ml-3 flex-1 text-left"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {userMenuOpen && isSidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-[110]">
                <button
                  onClick={() => handleMenuClick("dashboard")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Dashboard
                </button>
                {!isAdmin && (
                  <button
                    onClick={() => handleMenuClick("admin-login")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Admin Login
                  </button>
                )}
                <button
                  onClick={() => handleMenuClick("logout")}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

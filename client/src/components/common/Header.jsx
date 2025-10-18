import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdMenu, MdClose, MdUpload, MdList, MdSettings, MdDashboard, MdPeople, MdListAlt } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore";
import { useAdminAuthStore } from "../../store/adminAuthStore";

const USER_MENU_ITEMS = [
  { name: "Upload", icon: MdUpload, path: "/from" },
  { name: "Form Data", icon: MdList, path: "/form-data" },
  { name: "Settings", icon: MdSettings, path: "/settings" },
];

const ADMIN_MENU_ITEMS = [
  { name: "Dashboard", icon: MdDashboard, path: "/admin/dashboard" },
  { name: "Records", icon: MdListAlt, path: "/admin/records" },
  { name: "Teacher Log", icon: MdPeople, path: "/admin/teacher-log" },
  { name: "Settings", icon: MdSettings, path: "/admin/settings" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const { logout: adminLogout, admin, isAuthenticated: isAdminAuthenticated } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current user is admin
  const isAdmin = isAdminAuthenticated && admin && admin.role === 'admin';
  const currentUser = isAdmin ? admin : user;
  
  const menuItems = isAdmin ? ADMIN_MENU_ITEMS : USER_MENU_ITEMS;

  const handleLogout = () => {
    if (isAdmin) {
      adminLogout();
      navigate('/admin-login');
    } else {
      logout();
      navigate('/login');
    }
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="text-2xl font-bold tracking-wide cursor-pointer hover:text-indigo-200 transition-colors"
            onClick={() => navigate('/')}
          >
            TMS
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white shadow-md'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <span className="text-sm font-medium">{currentUser?.name || (isAdmin ? 'Admin' : 'User')}</span>
              <FaUserCircle size={24} />
            </button>

            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{currentUser?.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  {!isAdmin && (
                    <>
                      <button
                        onClick={() => handleNavigation('/settings')}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-2"
                      >
                        <MdSettings size={18} />
                        Settings
                      </button>

                      <button
                        onClick={() => handleNavigation('/admin-login')}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-2"
                      >
                        <MdDashboard size={18} />
                        Admin Login
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white shadow-2xl z-50 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* User Info */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-4">
              <div className="flex items-center gap-3">
                <FaUserCircle size={40} />
                <div>
                  <p className="font-semibold text-sm">{currentUser?.name || (isAdmin ? 'Admin' : 'User')}</p>
                  <p className="text-xs opacity-90">{currentUser?.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                      isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={22} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="border-t border-gray-200 py-2">
              {!isAdmin && (
                <>
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <MdSettings size={22} />
                    <span className="font-medium">Settings</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/admin-login')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <MdDashboard size={22} />
                    <span className="font-medium">Admin Login</span>
                  </button>
                </>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;

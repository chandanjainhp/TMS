import { useState } from 'react';
import {
  Upload,
  ClipboardList,
  Settings,
  LayoutDashboard,
  FileText,
  Users,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore";
import { useAdminAuthStore } from "../../store/adminAuthStore";

const USER_MENU_ITEMS = [
  { name: "Upload", icon: Upload, path: "/from" },
  { name: "Form Data", icon: ClipboardList, path: "/form-data" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const ADMIN_MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Records", icon: FileText, path: "/admin/records" },
  { name: "Teacher Log", icon: Users, path: "/admin/teacher-log" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const { logout: adminLogout, admin, isAuthenticated: isAdminAuthenticated } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="bg-indigo-600 text-white shadow-xl fixed top-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-all">
              <span className="text-xl font-bold tracking-tight">TMS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                      ? 'bg-white/15 text-white shadow-inner'
                      : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-lg border border-transparent transition-all ${userMenuOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="text-right hidden lg:block">
                <div className="text-sm font-semibold leading-none">{currentUser?.name || 'User'}</div>
                <div className="text-xs text-indigo-200 mt-0.5">{isAdmin ? 'Administrator' : 'Instructor'}</div>
              </div>
              <div className="bg-indigo-500 rounded-full p-1.5 border border-indigo-400">
                <User size={20} className="text-white" />
              </div>
              <ChevronDown size={14} className={`text-indigo-200 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    <p className="text-sm font-bold text-gray-900">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{currentUser?.email}</p>
                  </div>

                  <div className="py-2">
                    {!isAdmin && (
                      <>
                        <button
                          onClick={() => handleNavigation('/settings')}
                          className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                        >
                          <Settings size={16} />
                          Account Settings
                        </button>
                        <button
                          onClick={() => handleNavigation('/admin-login')}
                          className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                        >
                          <ShieldCheck size={16} />
                          Admin Access
                        </button>
                      </>
                    )}
                  </div>

                  <div className="border-t border-gray-100 mt-1 pt-2 pb-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-indigo-100 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl z-50 md:hidden overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-5 bg-indigo-600 text-white pb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <LayoutDashboard size={120} />
              </div>
              <div className="relative z-10 flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/30">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentUser?.name || 'Guest'}</h3>
                  <p className="text-indigo-200 text-sm">{currentUser?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Menu</div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-gray-100 mt-4 p-4 space-y-1">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Account</div>
              {!isAdmin && (
                <>
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/admin-login')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <ShieldCheck size={20} />
                    <span>Admin Login</span>
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;

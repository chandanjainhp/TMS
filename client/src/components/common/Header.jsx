import { useState, useEffect } from "react";
import axios from "axios";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  FileText,
  ShieldCheck,
  BarChart2,
  MessageSquare,
  Calendar as CalendarIcon,
  Book,
  Upload,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useAdminAuthStore } from "../../store/adminAuthStore";

const USER_MENU_ITEMS = [
  { name: "Score Entry", icon: Upload, path: "/score-entry" },
  { name: "Academic Ledger", icon: Book, path: "/academic-ledger" },
  { name: "Submission History", icon: ClipboardList, path: "/submission-history" },
  { name: "Messages", icon: MessageSquare, path: "/messages", hasNotification: true },
  { name: "Calendar", icon: CalendarIcon, path: "#", comingSoon: true },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const ADMIN_MENU_ITEMS = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Academic Ledger", path: "/admin/records", icon: FileText },
  { name: "Curriculum", path: "/admin/subjects", icon: Book },
  { name: "Teacher Log", path: "/admin/teacher-log", icon: ShieldCheck },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare, hasNotification: true },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart2 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { logout, user, isAuthenticated: isUserAuthenticated } = useAuthStore();
  const { logout: adminLogout, admin, isAuthenticated: isAdminAuthenticated } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = (isAdminAuthenticated && admin && (admin.role === "admin" || admin.role === "hod" || admin.role === "principal" || admin.role === "superAdmin")) ||
    (isUserAuthenticated && user && (user.role === "admin" || user.role === "hod" || user.role === "principal" || user.role === "superAdmin"));
  const currentUser = (isAdminAuthenticated && admin) ? admin : user;
  const menuItems = isAdmin ? ADMIN_MENU_ITEMS : USER_MENU_ITEMS;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get("/api/messages/inbox", { withCredentials: true });
        if (res.data.success) {
          const unread = res.data.data.filter((msg) => !msg.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      if (isAdminAuthenticated) await adminLogout();
      if (isUserAuthenticated) await logout();
      navigate("/login");
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[rgba(0,0,0,0.1)] bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button className="flex cursor-pointer items-center gap-2" onClick={() => navigate("/landing")}>
            <img src="/logo.png" alt="TMS" className="h-8 w-auto rounded border border-[rgba(0,0,0,0.1)] bg-white px-1" />
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const showBadge = item.hasNotification && unreadCount > 0;
              return (
                <button
                  key={item.path}
                  onClick={() => !item.comingSoon && handleNavigation(item.path)}
                  disabled={item.comingSoon}
                  className={`relative flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-[#f2f9ff] text-[#097fe8]"
                      : item.comingSoon
                      ? "cursor-not-allowed text-[#a39e98]"
                      : "text-[rgba(0,0,0,0.95)] hover:bg-[#f6f5f4] hover:text-[#0075de]"
                  }`}
                >
                  <div className="relative">
                    <Icon size={16} />
                    {showBadge && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#dd5b00] px-1 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="relative hidden md:block">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-2 rounded border px-2 py-1.5 transition-all ${
                userMenuOpen ? "border-[rgba(0,0,0,0.1)] bg-[#f6f5f4]" : "border-transparent hover:border-[rgba(0,0,0,0.1)]"
              }`}
            >
              <div className="hidden text-right lg:block">
                <div className="text-sm font-semibold leading-none text-[rgba(0,0,0,0.95)]">{currentUser?.name || "User"}</div>
                <div className="mt-0.5 text-xs text-[#615d59]">{isAdmin ? "Administrator" : "Instructor"}</div>
              </div>
              <div className="rounded-full border border-[rgba(0,0,0,0.1)] bg-white p-1.5">
                <User size={18} className="text-[#615d59]" />
              </div>
              <ChevronDown size={14} className={`text-[#615d59] transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-[rgba(0,0,0,0.1)] bg-white py-2 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
                  <div className="rounded-t-xl border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-5 py-4">
                    <p className="text-sm font-bold text-[rgba(0,0,0,0.95)]">{currentUser?.name}</p>
                    <p className="mt-0.5 truncate text-xs text-[#615d59]">{currentUser?.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => handleNavigation(isAdmin ? "/admin/settings" : "/settings")}
                      className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-[rgba(0,0,0,0.95)] hover:bg-[#f6f5f4] hover:text-[#0075de]"
                    >
                      <Settings size={16} />
                      {isAdmin ? "Admin Settings" : "Account Settings"}
                    </button>
                  </div>
                  <div className="mt-1 border-t border-[rgba(0,0,0,0.1)] pb-1 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm font-medium text-[#dd5b00] hover:bg-[#fff5f2]"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="rounded border border-[rgba(0,0,0,0.1)] p-2 text-[#615d59] md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[rgba(0,0,0,0.1)] bg-white md:hidden">
          <div className="space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const showBadge = item.hasNotification && unreadCount > 0;
              return (
                <button
                  key={item.path}
                  onClick={() => !item.comingSoon && handleNavigation(item.path)}
                  disabled={item.comingSoon}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2.5 ${
                    active ? "bg-[#f2f9ff] text-[#097fe8]" : "text-[rgba(0,0,0,0.95)] hover:bg-[#f6f5f4]"
                  } ${item.comingSoon ? "cursor-not-allowed text-[#a39e98]" : ""}`}
                >
                  <div className="relative">
                    <Icon size={18} />
                    {showBadge && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#dd5b00] px-0.5 text-[9px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-left text-sm">{item.name}</span>
                </button>
              );
            })}
            <div className="mt-3 border-t border-[rgba(0,0,0,0.1)] pt-3">
              <button
                onClick={() => handleNavigation(isAdmin ? "/admin/settings" : "/settings")}
                className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-[rgba(0,0,0,0.95)] hover:bg-[#f6f5f4]"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button onClick={handleLogout} className="mt-1 flex w-full items-center gap-3 rounded px-3 py-2.5 text-[#dd5b00] hover:bg-[#fff5f2]">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

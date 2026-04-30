import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Book, ShieldCheck, MessageSquare,
  BarChart2, Settings, ChevronLeft, ChevronRight, LogOut,
  User, Menu, X, Bell
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import axios from 'axios';

const NAV_ITEMS = [
  { name: 'Dashboard',       icon: LayoutDashboard, path: '/admin',              exact: true  },
  { name: 'Academic Ledger', icon: FileText,         path: '/admin/records'                   },
  { name: 'Curriculum',      icon: Book,             path: '/admin/subjects'                  },
  { name: 'Teacher Log',     icon: ShieldCheck,      path: '/admin/teacher-log'               },
  { name: 'Messages',        icon: MessageSquare,    path: '/admin/messages',    badge: true  },
  { name: 'Analytics',       icon: BarChart2,        path: '/admin/analytics'                 },
  { name: 'Settings',        icon: Settings,         path: '/admin/settings'                  },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location  = useLocation();
  const navigate  = useNavigate();
  const { logout, user }                       = useAuthStore();
  const { logout: adminLogout, admin }         = useAdminAuthStore();
  const currentUser = admin || user;

  useEffect(() => {
    const fetchUnread = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get('/api/messages/inbox', { withCredentials: true });
        if (res.data.success) {
          setUnreadCount(res.data.data.filter(m => !m.isRead).length);
        }
      } catch {}
    };
    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => clearInterval(id);
  }, [currentUser]);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await adminLogout?.();
      await logout?.();
    } catch {}
    navigate('/admin-login');
  };

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  /* ─── Sidebar content (shared between desktop & mobile) ────────────── */
  const SidebarContent = ({ mobile = false }) => (
    <div className="flex h-full flex-col">
      {/* Logo row */}
      <div
        className={`flex h-14 flex-shrink-0 items-center border-b border-[rgba(0,0,0,0.08)] ${
          collapsed && !mobile ? 'justify-center px-3' : 'justify-between px-4'
        }`}
      >
        {(!collapsed || mobile) && (
          <Link to="/admin" className="flex items-center gap-2 no-underline">
            <img
              src="/logo.png"
              alt="TMS"
              className="h-7 w-auto rounded border border-[rgba(0,0,0,0.1)] bg-white px-1"
            />
            <span className="text-[13px] font-bold tracking-tight text-[rgba(0,0,0,0.95)]">
              TMS Admin
            </span>
          </Link>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex h-6 w-6 items-center justify-center rounded border border-[rgba(0,0,0,0.1)] text-[#a39e98] transition-colors hover:bg-[#f6f5f4] hover:text-[rgba(0,0,0,0.95)]"
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        )}
        {mobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded border border-[rgba(0,0,0,0.1)] p-1.5 text-[#615d59]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {(!collapsed || mobile) && (
          <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">
            Navigation
          </p>
        )}
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon    = item.icon;
            const active  = isActive(item);
            const showBadge = item.badge && unreadCount > 0;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={collapsed && !mobile ? item.name : undefined}
                  className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium no-underline transition-all ${
                    active
                      ? 'bg-[#f2f9ff] text-[#097fe8]'
                      : 'text-[rgba(0,0,0,0.75)] hover:bg-[#f6f5f4] hover:text-[rgba(0,0,0,0.95)]'
                  } ${collapsed && !mobile ? 'justify-center' : ''}`}
                >
                  <div className="relative flex-shrink-0">
                    <Icon size={15} />
                    {showBadge && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#dd5b00] px-0.5 text-[9px] font-bold leading-none text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  {(!collapsed || mobile) && (
                    <span className="flex-1">{item.name}</span>
                  )}
                  {(!collapsed || mobile) && showBadge && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#dd5b00] px-1 text-[9px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-[rgba(0,0,0,0.08)] p-2">
        {(!collapsed || mobile) && (
          <div className="mb-1.5 flex items-center gap-2.5 rounded px-2.5 py-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f2f9ff] text-[10px] font-bold text-[#097fe8]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[rgba(0,0,0,0.95)]">
                {currentUser?.name || 'Admin'}
              </p>
              <p className="truncate text-[10px] text-[#a39e98]">
                {currentUser?.department || 'Administrator'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed && !mobile ? 'Sign Out' : undefined}
          className={`flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium text-[#dd5b00] transition-colors hover:bg-[#fff5f2] ${
            collapsed && !mobile ? 'justify-center' : ''
          }`}
        >
          <LogOut size={14} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f5f4]">

      {/* ── Desktop sidebar ──────────────────────────────────────────── */}
      <aside
        className={`hidden flex-shrink-0 flex-col border-r border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.02)_2px_0px_8px] transition-all duration-300 md:flex ${
          collapsed ? 'w-[58px]' : 'w-[216px]'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ───────────────────────────────────── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.05)_4px_0px_24px] md:hidden">
            <SidebarContent mobile />
          </aside>
        </>
      )}

      {/* ── Main area ────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[rgba(0,0,0,0.1)] bg-white px-4 sm:px-6">
          {/* Left: mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              className="rounded border border-[rgba(0,0,0,0.1)] p-1.5 text-[#615d59] transition-colors hover:bg-[#f6f5f4] md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:block">
              <p className="text-[11px] font-medium text-[#a39e98]">Admin Portal</p>
              <p className="text-sm font-semibold text-[rgba(0,0,0,0.95)]">
                {NAV_ITEMS.find(i => isActive(i))?.name ?? 'Dashboard'}
              </p>
            </div>
          </div>

          {/* Right: user profile */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-2 rounded border border-transparent px-2 py-1.5 transition-all hover:border-[rgba(0,0,0,0.1)] hover:bg-[#f6f5f4]"
            >
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold leading-none text-[rgba(0,0,0,0.95)]">
                  {currentUser?.name || 'Admin'}
                </p>
                <p className="mt-0.5 text-[10px] text-[#615d59]">
                  {currentUser?.department || 'Administrator'}
                </p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(0,0,0,0.1)] bg-[#f2f9ff] text-[11px] font-bold text-[#097fe8]">
                {initials}
              </div>
              <ChevronRight
                size={12}
                className={`text-[#a39e98] transition-transform ${userMenuOpen ? 'rotate-90' : ''}`}
              />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-1 w-56 overflow-hidden rounded-xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.85px]">
                  <div className="border-b border-[rgba(0,0,0,0.08)] bg-[#f6f5f4] px-4 py-3">
                    <p className="text-sm font-bold text-[rgba(0,0,0,0.95)]">{currentUser?.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#615d59]">{currentUser?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/admin/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[rgba(0,0,0,0.95)] no-underline transition-colors hover:bg-[#f6f5f4]"
                    >
                      <Settings size={14} className="text-[#615d59]" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-[rgba(0,0,0,0.08)] py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#dd5b00] transition-colors hover:bg-[#fff5f2]"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

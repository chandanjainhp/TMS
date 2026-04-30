import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, MessageSquare, Settings, LogOut,
  Upload, FileText, ClipboardList, ChevronRight, Menu, X,
  BarChart2, Users, Loader2,
} from "lucide-react";
import axios from "axios";
import MessagingSystem from "../components/common/MessagingSystem";
import TeacherClasses from "../components/teacher/TeacherClasses";
import TeacherAnalytics from "../components/teacher/TeacherAnalytics";
import { useAuthStore } from "../store/authStore";

const NAV = [
  { id: "home",      label: "Home",      icon: LayoutDashboard },
  { id: "classes",   label: "My Classes", icon: BookOpen        },
  { id: "analytics", label: "Analytics",  icon: BarChart2       },
  { id: "messages",  label: "Messages",   icon: MessageSquare   },
];

const QUICK_ACTIONS = [
  { label: "Score Entry",        icon: Upload,      link: "/score-entry",         accent: "#0075de" },
  { label: "Academic Ledger",    icon: BookOpen,    link: "/academic-ledger",      accent: "#097fe8" },
  { label: "View Records",       icon: ClipboardList, link: "/records",           accent: "#2a9d99" },
  { label: "Submission History", icon: FileText,    link: "/submission-history",   accent: "#391c57" },
];

/* ── Sidebar (shared desktop + mobile) ──────────────────────────────── */
function SidebarContent({ activeTab, setActiveTab, user, logout, onNavigate }) {
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "T";

  const handleTab = (id) => {
    setActiveTab(id);
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 flex-shrink-0 items-center gap-2 border-b border-[rgba(0,0,0,0.08)] px-4">
        <img
          src="/logo.png"
          alt="TMS"
          className="h-7 w-auto rounded border border-[rgba(0,0,0,0.1)] bg-white px-1"
        />
        <div>
          <p className="text-[13px] font-bold leading-none text-[rgba(0,0,0,0.95)]">TMS</p>
          <p className="text-[10px] text-[#a39e98]">Teacher Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => handleTab(id)}
                className={`flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-[#f2f9ff] text-[#097fe8]"
                    : "text-[rgba(0,0,0,0.75)] hover:bg-[#f6f5f4] hover:text-[rgba(0,0,0,0.95)]"
                }`}
              >
                <Icon size={15} className="flex-shrink-0" />
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 border-t border-[rgba(0,0,0,0.06)] pt-3">
          <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">
            Tools
          </p>
          {QUICK_ACTIONS.map(({ label, icon: Icon, link, accent }) => (
            <Link
              key={link}
              to={link}
              className="flex items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium text-[rgba(0,0,0,0.75)] no-underline transition-all hover:bg-[#f6f5f4] hover:text-[rgba(0,0,0,0.95)]"
            >
              <Icon size={14} className="flex-shrink-0" style={{ color: accent }} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[rgba(0,0,0,0.08)] p-2">
        <Link
          to="/settings"
          className="flex items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium text-[rgba(0,0,0,0.75)] no-underline transition-colors hover:bg-[#f6f5f4]"
        >
          <Settings size={14} className="flex-shrink-0" />
          Settings
        </Link>

        <div className="mt-1.5 flex items-center gap-2.5 rounded px-2.5 py-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f2f9ff] text-[11px] font-bold text-[#097fe8]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[rgba(0,0,0,0.95)]">{user?.name || "Teacher"}</p>
            <p className="truncate text-[10px] text-[#a39e98]">{user?.department || "Instructor"}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium text-[#dd5b00] transition-colors hover:bg-[#fff5f2]"
        >
          <LogOut size={14} className="flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ── Home tab ───────────────────────────────────────────────────────── */
function HomeTab({ user, setActiveTab }) {
  const [classCount, setClassCount] = useState(null);

  useEffect(() => {
    axios
      .get("/api/teacher/my-classes", { withCredentials: true })
      .then((r) => { if (r.data.success) setClassCount(r.data.classes?.length ?? 0); })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      {/* Welcome card */}
      <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-6 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <span className="notion-badge mb-3">Active session</span>
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.5px] text-[rgba(0,0,0,0.95)]">
          Welcome back, {user?.name?.split(" ")[0] || "Teacher"}
        </h1>
        <p className="mt-1 text-sm text-[#615d59]">
          {user?.department ? `${user.department} Department` : "Instructor"} · What would you like to do today?
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">My Classes</p>
            <p className="mt-1 text-2xl font-bold leading-none text-[rgba(0,0,0,0.95)]">
              {classCount === null ? <Loader2 size={16} className="animate-spin text-[#097fe8]" /> : classCount}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f2f9ff] text-[#097fe8]">
            <BookOpen size={16} />
          </div>
        </div>

        <button
          onClick={() => setActiveTab("classes")}
          className="flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px] transition-all hover:bg-[#f6f5f4]"
        >
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">View Classes</p>
            <p className="mt-1 text-xs font-semibold text-[#0075de]">Open →</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#1aae39]">
            <Users size={16} />
          </div>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className="flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px] transition-all hover:bg-[#f6f5f4]"
        >
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">Analytics</p>
            <p className="mt-1 text-xs font-semibold text-[#0075de]">Open →</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-[#dd5b00]">
            <BarChart2 size={16} />
          </div>
        </button>
      </div>

      {/* Quick actions grid */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map(({ label, icon: Icon, link, accent }) => (
            <Link
              key={link}
              to={link}
              className="group flex flex-col items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5 text-center no-underline shadow-[rgba(0,0,0,0.04)_0px_4px_18px] transition-all hover:bg-[#f6f5f4] hover:shadow-[rgba(0,0,0,0.08)_0px_8px_24px]"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                style={{ background: accent }}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-[rgba(0,0,0,0.95)]">{label}</span>
              <ChevronRight size={12} className="text-[#a39e98]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
const TeacherDashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab]   = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const TAB_LABELS = { home: "Home", classes: "My Classes", analytics: "Analytics", messages: "Messages" };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f5f4]">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-[216px] flex-shrink-0 flex-col border-r border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.02)_2px_0px_8px] md:flex">
        <SidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          logout={logout}
        />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.05)_4px_0px_24px] md:hidden">
            <SidebarContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              user={user}
              logout={logout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}

      {/* ── Main ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[rgba(0,0,0,0.1)] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded border border-[rgba(0,0,0,0.1)] p-1.5 text-[#615d59] transition-colors hover:bg-[#f6f5f4] md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:block">
              <p className="text-[11px] font-medium text-[#a39e98]">Teacher Portal</p>
              <p className="text-sm font-semibold text-[rgba(0,0,0,0.95)]">{TAB_LABELS[activeTab]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold leading-none text-[rgba(0,0,0,0.95)]">{user?.name}</p>
              <p className="mt-0.5 text-[10px] text-[#615d59]">{user?.department || "Instructor"}</p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(0,0,0,0.1)] bg-[#f2f9ff] text-[11px] font-bold text-[#097fe8]">
              {user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "T"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 lg:px-8">
            {activeTab === "home"      && <HomeTab user={user} setActiveTab={setActiveTab} />}
            {activeTab === "classes"   && <TeacherClasses />}
            {activeTab === "analytics" && <TeacherAnalytics />}
            {activeTab === "messages"  && <MessagingSystem />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;

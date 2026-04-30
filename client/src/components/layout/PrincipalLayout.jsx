import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Users2, GraduationCap, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: Building2, path: '/principal' },
    { label: 'Faculty Directory', icon: Users2, path: '/principal/faculty' },
    { label: 'Student Master', icon: GraduationCap, path: '/principal/students' },
    { label: 'System Settings', icon: Settings, path: '/principal/settings' },
];

function SidebarContent({ onNavigate }) {
    const { admin, logout } = useAdminAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin-login');
    };

    return (
        <div className="h-full w-64 border-r border-[rgba(0,0,0,0.1)] bg-white flex flex-col">
            <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.1)] p-6">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-[#0075de]">
                    <Building2 className="text-white w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-sm font-bold leading-tight text-[rgba(0,0,0,0.95)]">EduNexus</h2>
                    <p className="text-xs font-semibold tracking-wide text-[#0075de]">PRINCIPAL OFFICE</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => { navigate(item.path); onNavigate?.(); }}
                            className={`flex w-full items-center rounded px-4 py-3 text-sm font-medium transition-colors ${
                                active
                                    ? 'bg-[#f2f9ff] text-[#097fe8]'
                                    : 'text-[#615d59] hover:bg-[#f6f5f4] hover:text-[rgba(0,0,0,0.95)]'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="border-t border-[rgba(0,0,0,0.1)] p-4">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#f2f9ff]">
                        <span className="text-sm font-bold text-[#097fe8]">
                            {admin?.name?.charAt(0)?.toUpperCase() || 'P'}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[rgba(0,0,0,0.95)]">{admin?.name || 'Principal'}</p>
                        <p className="text-xs capitalize text-[#615d59]">{admin?.role || 'Super Admin'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded px-4 py-2.5 text-sm font-medium text-[#dd5b00] transition-colors hover:bg-[#fff5f2]"
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default function PrincipalLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f6f5f4]">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative z-50 shadow-2xl">
                        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Top Bar */}
                <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[rgba(0,0,0,0.1)] bg-white px-4 py-3 md:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded border border-[rgba(0,0,0,0.1)] p-2 text-[#615d59]"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[#0075de]">
                        <Building2 className="text-white w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-[rgba(0,0,0,0.95)]">{title || 'Principal Office'}</span>
                </header>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

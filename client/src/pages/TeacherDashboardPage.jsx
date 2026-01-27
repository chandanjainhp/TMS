import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, FileText, MessageSquare, Menu, X, LogOut, Settings, ClipboardList } from "lucide-react";
import MessagingSystem from "../components/common/MessagingSystem";
import { useAuthStore } from "../store/authStore";

const TeacherDashboardPage = () => {
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState("home");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const quickActions = [
        { id: "upload", label: "Upload Records", icon: Upload, link: "/from", color: "bg-indigo-600" },
        { id: "records", label: "View Batches", icon: ClipboardList, link: "/records", color: "bg-emerald-600" },
        { id: "messages", label: "Messages", icon: MessageSquare, action: () => setActiveTab("messages"), color: "bg-blue-600" },
        { id: "formdata", label: "Form Data", icon: FileText, link: "/form-data", color: "bg-orange-600" },
    ];

    const sidebarItems = [
        { id: "home", label: "Home" },
        { id: "messages", label: "Messages" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200">
                <div className="p-5 border-b border-gray-200">
                    <img src="/logo.png" alt="TMS" className="h-8 w-auto" />
                    <span className="text-xs text-gray-400 ml-2">Teacher</span>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm transition-all ${activeTab === item.id
                                ? "bg-indigo-50 text-indigo-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}

                    <Link
                        to="/settings"
                        className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Link>
                </nav>

                <div className="p-3 border-t border-gray-200">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg text-sm transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 flex justify-between items-center p-4">
                <img src="/logo.png" alt="TMS" className="h-8 w-auto" />
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <>
                    <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
                    <div className="md:hidden fixed top-0 left-0 w-64 h-full bg-white z-40 p-4">
                        <div className="mb-6">
                            <img src="/logo.png" alt="TMS" className="h-8 w-auto mb-2" />
                        </div>
                        <nav className="space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                    className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm ${activeTab === item.id
                                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                                        : "text-gray-600"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <Link to="/settings" className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm text-gray-600">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </Link>
                        </nav>
                        <button onClick={logout} className="mt-8 flex items-center px-3 py-2.5 text-red-500 text-sm">
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </button>
                    </div>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6 overflow-y-auto">
                {activeTab === "home" ? (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Welcome */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || "Teacher"}</h1>
                            <p className="text-gray-500 text-sm mt-1">What would you like to do today?</p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {quickActions.map((action) => (
                                action.link ? (
                                    <Link
                                        key={action.id}
                                        to={action.link}
                                        className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all text-center group"
                                    >
                                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform`}>
                                            <action.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{action.label}</span>
                                    </Link>
                                ) : (
                                    <button
                                        key={action.id}
                                        onClick={action.action}
                                        className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all text-center group"
                                    >
                                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform`}>
                                            <action.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{action.label}</span>
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Simple Info Card */}
                        <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                            <h3 className="font-semibold text-indigo-900 mb-1">Need Help?</h3>
                            <p className="text-indigo-700 text-sm">Contact your administrator for support or training.</p>
                        </div>
                    </div>
                ) : activeTab === "messages" ? (
                    <div className="max-w-5xl mx-auto">
                        <MessagingSystem />
                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default TeacherDashboardPage;
